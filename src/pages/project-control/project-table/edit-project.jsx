import React, { useState, useContext, Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

import { ProjectControlContext } from '@contexts/project-control.context';
import SendRequest from '@utils/auth-service.utils';
import { formatTaiwanTime } from '@utils/day';
import generateNewKey from '@/utils/generate-new-key';
import UID from '@utils/uid.utils';
import { deepEqual } from '@utils/deep-equal.utils';

import {
	TextInput,
	CheckInput,
	NumberInput,
	DateInput,
	TextareaInput,
	SelectInput,
} from '@/components/input/';
import {
	Loading,
	LoadingOverlay,
	LoadingMessage,
	useMessage,
	LoadingPage,
} from '@components/loading';

function EditProject({ data }) {
	const { tab, project, table, setProject } = useContext(ProjectControlContext);
	const [targetData, setTargetData] = useState([]);
	const [backupKey, setBackupKey] = useState(null);
	const [originalProjectCode, setOriginalProjectCode] = useState(null);
	const [loading, setLoading] = useState(false);
	const { messages, handleMessage } = useMessage();

	useEffect(() => {
		resetData();
		setOriginalProjectCode(data.project_code);
		setBackupKey(data.key);
		handleMessage({ type: 'reset' });
	}, [data]);

	const handleChange = (key, value) => {
		setTargetData((prev) =>
			prev.map((d) => {
				if (key === 'project_code' && value === originalProjectCode && d.key === 'key') {
					return { ...d, value: backupKey };
				} else if (
					key === 'project_code' &&
					value !== originalProjectCode &&
					d.key === 'key'
				) {
					return { ...d, value: '' };
				}
				return d.key === key ? { ...d, value } : d;
			})
		);
	};
	const resetData = () => {
		const newData = table.map((item) => {
			const value = data[item.key];
			// if (item.key === 'project_level' && data[item.key].length === 0)
			// 	return { ...item, value: 'A' };
			return { ...item, value: value };
		});
		setTargetData(newData);
		handleMessage({ type: 'reset' });
	};

	const renderField = (key, disabled = false) => {
		const item = table.find((t) => t.key === key);
		if (!item) return null;

		const { type, name } = item;
		const value = getValue(key);
		const commonProps = {
			label: name,
			inputOption: {
				id: key,
				name: key,
				disabled,
			},
		};

		const onChange = (e) => {
			const val = type === 'check' ? e.target.checked : e.target.value;
			handleChange(key, val);
		};

		switch (type) {
			case 'text':
				return (
					<TextInput
						{...commonProps}
						inputOption={{ ...commonProps.inputOption, type: 'text', value, onChange }}
					/>
				);
			case 'number':
				return (
					<NumberInput
						{...commonProps}
						inputOption={{
							...commonProps.inputOption,
							type: 'number',
							value,
							onChange,
						}}
					/>
				);
			case 'check':
				return (
					<CheckInput
						{...commonProps}
						inputOption={{ ...commonProps.inputOption, checked: value, onChange }}
					/>
				);
			case 'textarea':
				return (
					<TextareaInput
						{...commonProps}
						inputOption={{ ...commonProps.inputOption, value, onChange }}
					/>
				);
			case 'date':
				return (
					<DateInput
						{...commonProps}
						inputOption={{
							...commonProps.inputOption,
							value: formatTaiwanTime(value),
							onChange,
						}}
					/>
				);
			case 'select':
				if (key === 'project_code')
					return (
						<SelectInput
							{...commonProps}
							inputOption={{ ...commonProps.inputOption, value, onChange }}
							options={tab.map((t) => ({ label: t.name, value: t.name }))}
						/>
					);
				if (key === 'project_level')
					return (
						<SelectInput
							{...commonProps}
							inputOption={{ ...commonProps.inputOption, value, onChange }}
							options={['A', 'B', 'C'].map((t) => ({ label: t, value: t }))}
						/>
					);
				break;
			default:
				return null;
		}
	};
	const getValue = (key) => {
		const temp = targetData.find((d) => d.key === key);
		return temp.hasOwnProperty('value') ? temp.value : '';
	};
	const getUID = (key) => {
		setTargetData((prev) =>
			prev.map((d) => (d.key === key ? { ...d, value: `PROJECT-${UID()}` } : d))
		);
	};
	const getKey = (key) => {
		const code = getValue('project_code');
		const fieldProjects = project.find((p) => p.name === code).content;
		const keyList = fieldProjects.map((d) => d.key).filter((k) => k !== '');
		const newKey = generateNewKey(keyList);
		setTargetData((prev) => prev.map((d) => (d.key === key ? { ...d, value: newKey } : d)));
	};

	const validateRequired = () => {
		const saleChecked = getValue('sale');
		const preSaleChecked = getValue('pre_sale');

		if (saleChecked || preSaleChecked) {
			const errorsList = targetData.filter(
				(field) => field.required && field.value.length === 0
			);
			if (errorsList.length > 0) {
				handleMessage({
					type: 'error',
					content: ` ${errorsList
						.map((e) => e.name)
						.join(', ')} 為必填欄位（當啟用可售/預售時）`,
				});
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async () => {
		handleMessage({ type: 'reset' });
		const sendData = {};
		targetData.forEach((d) => {
			sendData[d.key] = d.value;
		});

		delete sendData.edited_at;
		delete sendData.edited_by;
		if (sendData.hasOwnProperty('id') && sendData.id.length === 0) {
			handleMessage({ type: 'error', content: '請設定編號' });
			return;
		}
		if (sendData.hasOwnProperty('key') && sendData.key.length === 0) {
			handleMessage({ type: 'error', content: '請設定序列' });
			return;
		}

		if (!validateRequired()) return;

		if (deepEqual(sendData, data)) {
			handleMessage({ type: 'error', content: '沒有資料需要調整' });
			return;
		}

		try {
			handleMessage({ type: 'single' });
			setLoading(true);
			const send = {
				do: 'projectControlPost', // projectControlGet | projectControlPost
				what: 'editProject',
				variables: JSON.stringify(sendData),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const result = await SendRequest(send);

			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setProject(result.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (!targetData.length) return <LoadingPage />;

	return (
		<Fragment>
			{loading && <LoadingOverlay />}
			<FromStyled>
				<FromRow>
					{!getValue('id') ? (
						<Button onClick={() => getUID('id')}>建立編號</Button>
					) : (
						renderField('id', true)
					)}
				</FromRow>
				<FromRow>
					{!getValue('key') ? (
						<Button onClick={() => getKey('key')}>建立序列</Button>
					) : (
						renderField('key', true)
					)}
					{renderField('project_code')}
				</FromRow>
				<FromRow>
					{renderField('project_level')}
					{renderField('old_id')}
				</FromRow>
				<FromRow>
					{renderField('project_name')}
					{renderField('points')}
				</FromRow>
				<FromRow>
					{renderField('un_sale')}
					{renderField('sale')}
					{renderField('pre_sale')}
					{renderField('take_cases')}
				</FromRow>
				<FromRow>{renderField('desscript')}</FromRow>
				<FromRow>{renderField('focus')}</FromRow>
				<FromRow>{renderField('tools')}</FromRow>
				<FromRow>{renderField('condition')}</FromRow>
				<FromRow>{renderField('why')}</FromRow>
				<FromRow>{renderField('example')}</FromRow>
				<FromRow>{renderField('references')}</FromRow>
				<FromRow>
					{renderField('edited_at', true)}
					{renderField('edited_by', true)}
				</FromRow>
				<FromRow>
					{renderField('created_at', true)}
					{renderField('created_by', true)}
				</FromRow>
			</FromStyled>
			<ButtonGroup>
				{messages.length > 0 && <LoadingMessage message={messages} />}
				<FromRow>
					<Button onClick={() => resetData()}>{loading ? <Loading /> : '重置'}</Button>
					<Button
						type="primary"
						onClick={handleSubmit}
					>
						{loading ? <Loading /> : '儲存'}
					</Button>
				</FromRow>
			</ButtonGroup>
		</Fragment>
	);
}

export default EditProject;

const FromStyled = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FromRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 50px;
	& > * {
		flex: 1;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 20px;
	width: 100%;
	padding: 20px 0;
	position: sticky;
	bottom: 0;
	flex-wrap: wrap;
	justify-content: center;
	background-image: linear-gradient(
		0deg,
		rgba(255, 255, 255, 1) 0%,
		rgba(255, 255, 255, 0.75) 83%,
		rgba(255, 255, 255, 0) 100%
	);
`;
