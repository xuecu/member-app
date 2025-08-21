import React, { useState, useEffect, useContext, Fragment, useRef } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker } from 'antd';

import styled, { css } from 'styled-components';
import { TabButton } from '@/components/tab-button';
import { LightBox } from '@/components/light-box';
import SendRequest from '@utils/auth-service.utils';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';
import { DateInput, SelectInput, TextareaInput, TextInput } from '@/components/input';
const CheckboxGroup = Checkbox.Group;

function NewMemberModal({ setGetMemberList, modalId = null }) {
	const { memberData, defaultBrands } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();
	const [checkedList, setCheckedList] = useState([]);
	const [form, setForm] = useState({ name: '', mail: '', line_url: '' });
	const [load, setLoad] = useState(false);
	const checkAll = defaultBrands.length === checkedList.length;
	const indeterminate = checkedList.length > 0 && checkedList.length < defaultBrands.length;

	const handleChange = (event) => {
		const { value, name } = event.target;
		setForm((prevp) => {
			return { ...prevp, [name]: value };
		});
	};
	const onChange = (list) => {
		setCheckedList(list);
	};
	const onCheckAllChange = (e) => {
		setCheckedList(e.target.checked ? defaultBrands : []);
	};
	const resetFrom = () => {
		if (!modalId) return;
		const findMember = memberData.find((item) => item.excel_id === modalId);
		setForm({ name: findMember.name, mail: findMember.mail, line_url: findMember.line_url });
		setCheckedList(findMember.brands.split('、'));
	};
	useEffect(() => {
		resetFrom();
	}, [modalId]);

	const submit = async () => {
		if (form.name.length === 0 || form.mail.length === 0 || checkedList.length === 0) {
			handleMessage({ type: 'reset' });
			handleMessage({ type: 'error', content: `請輸入完整資料` });
			return;
		}
		const variables = { ...form, mail: form.mail.trim(), brands: [...checkedList] };
		if (modalId) variables.id = modalId;
		const send = {
			do: 'invitGuidePost', // invitGuideGet | invitGuidePost
			what: 'editGuideMember',
			variables: JSON.stringify(variables),
			staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
		};
		handleMessage({ type: 'reset' });
		try {
			setLoad(true);
			handleMessage({ type: 'single' });
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setGetMemberList(result.data.invitMember);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};
	return (
		<FromStyled>
			<TextInput
				label="姓名"
				inputOption={{
					type: 'text',
					required: true,
					name: 'name',
					value: form.name,
					onChange: handleChange,
				}}
			/>
			<TextInput
				label="信箱"
				inputOption={{
					type: 'mail',
					required: true,
					name: 'mail',
					value: form.mail,
					onChange: handleChange,
				}}
			/>
			<TextInput
				label="Line 網址"
				inputOption={{
					type: 'text',
					required: true,
					name: 'line_url',
					value: form.line_url,
					onChange: handleChange,
				}}
			/>
			<FromRow $row>
				<Checkbox
					indeterminate={indeterminate}
					onChange={onCheckAllChange}
					checked={checkAll}
				>
					全選
				</Checkbox>
				<CheckboxGroup
					style={{ display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
					options={defaultBrands}
					value={checkedList}
					onChange={onChange}
				/>
			</FromRow>
			<LoadingMessage message={messages} />
			<Button onClick={() => submit()}>
				{load ? <Loading /> : modalId ? '編輯' : '新增'}
			</Button>
		</FromStyled>
	);
}

function RenderTab() {
	const { memberTabList, onchangeMemberTab, setMemberData } = useContext(InvitGuideContext);
	const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Lightbox 開關
	const [getMemberList, setGetMemberList] = useState([]);
	const [modalId, setModalId] = useState(null);
	const clickTimeout = useRef(null);
	const lastClickTime = useRef(0);

	const handleModalClose = () => {
		if (getMemberList.length > 0) setMemberData(getMemberList);
		setIsModalOpen(false);
		setGetMemberList([]);
		setModalId(null);
	};

	const handleClick = (id) => {
		const now = Date.now();
		const diff = now - lastClickTime.current;
		// 延遲觸發單擊
		if (diff < 200) {
			clearTimeout(clickTimeout.current);
			handleDoubleClick(id);
		} else {
			clickTimeout.current = setTimeout(() => {
				onchangeMemberTab(id); // 單擊事件
			}, 200);
		}
		lastClickTime.current = now;
	};

	const handleDoubleClick = (id) => {
		// 雙擊時清除單擊事件
		clearTimeout(clickTimeout.current);
		setModalId(id);
		setIsModalOpen(true);
	};

	return (
		<ContainerStyled
			$row
			style={{
				overflowY: 'auto',
				whiteSpace: 'nowrap',
			}}
		>
			{isModalOpen && (
				<LightBox onClose={() => handleModalClose()}>
					<NewMemberModal
						setGetMemberList={setGetMemberList}
						modalId={modalId}
					/>
				</LightBox>
			)}
			{memberTabList.map((item) => {
				return (
					<TabButton
						key={item.id}
						$focus={item.isOpen}
						onClick={() => handleClick(item.id)}
						onDoubleClick={() => handleDoubleClick(item.id)}
					>
						{item.name}
					</TabButton>
				);
			})}
			<TabButton onClick={() => setIsModalOpen(true)}>
				<PlusOutlined />
			</TabButton>
		</ContainerStyled>
	);
}

function CalendarSetting() {
	const { targetMember, defaultWeek, setMemberData } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();
	const [load, setLoad] = useState(false);

	const [tempTargetMember, setTempTargetMember] = useState({ ...targetMember });

	const handleChangeOpen = (weekend, time) => {
		const newTargetMember = {
			...tempTargetMember,
			available: {
				...tempTargetMember.available,
				[weekend]: tempTargetMember.available[weekend].map((item) => {
					if (item.time === time) return { time: item.time, isValid: !item.isValid };
					return item;
				}),
			},
		};
		setTempTargetMember(newTargetMember);
	};
	const reset = () => {
		setTempTargetMember(targetMember);
	};
	const submit = async () => {
		const variables = { ...tempTargetMember };
		const send = {
			do: 'invitGuidePost', // invitGuideGet | invitGuidePost
			what: 'editAvailableTime',
			variables: JSON.stringify(variables),
			staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
		};
		handleMessage({ type: 'reset' });
		try {
			setLoad(true);
			handleMessage({ type: 'single' });
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setMemberData(result.data.invitMember);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};
	useEffect(() => {
		reset();
	}, [targetMember]);

	return (
		<FromStyled>
			<FromRow $row>
				<CellStyled></CellStyled>
				{tempTargetMember.available &&
					tempTargetMember.available['mon'].map((item) => {
						return <CellStyled>{item.time}:00</CellStyled>;
					})}
			</FromRow>
			{defaultWeek.map((weekend) => {
				return (
					<FromRow $row>
						<CellStyled>{weekend}</CellStyled>
						{tempTargetMember.available &&
							tempTargetMember.available[weekend].map(({ time, isValid }, key) => {
								return (
									<CellStyled
										key={key}
										$point
										onClick={() => handleChangeOpen(weekend, time)}
									>
										{isValid ? '開放' : '-'}
									</CellStyled>
								);
							})}
					</FromRow>
				);
			})}
			<LoadingMessage message={messages} />
			<FromRow $row>
				<Button onClick={() => reset()}> {load ? <Loading /> : '重置'}</Button>
				<Button
					type="primary"
					onClick={() => submit()}
				>
					{load ? <Loading /> : '儲存'}
				</Button>
			</FromRow>
		</FromStyled>
	);
}

function EditSingleModal({ setGetMemberList, modalId = null }) {
	const { targetMember } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();

	const [checkedList, setCheckedList] = useState([]);
	const [load, setLoad] = useState(false);
	const [date, setDate] = useState(null);
	const defaultTime = ['13', '14', '15', '16', '17', '18', '19', '20'];
	const checkAll = defaultTime.length === checkedList.length;
	const indeterminate = checkedList.length > 0 && checkedList.length < defaultTime.length;

	const disabledDate = (current) => {
		return current && current < dayjs().subtract(1, 'd').endOf('day'); // 禁用今天及過去的日期
	};
	const handleDate = (value) => {
		if (!value) return setDate(null);
		setDate(dayjs(value));
	};
	const onChange = (list) => {
		setCheckedList(list);
	};
	const onCheckAllChange = (e) => {
		setCheckedList(e.target.checked ? defaultTime : []);
	};

	const reset = () => {
		handleMessage({ type: 'reset' });
		setDate(null);
		if (!modalId) return;
		setDate(dayjs(modalId));
		setCheckedList(
			targetMember.other[modalId].filter(({ isValid }) => isValid).map(({ time }) => time)
		);
	};

	const submit = async () => {
		if (!date) {
			handleMessage({ type: 'reset' });
			handleMessage({ type: 'error', content: `請輸入日期` });
			return;
		}
		let dateString = '';
		if (modalId) dateString = modalId;
		else dateString = dayjs(date).format('YYYY-MM-DD');
		handleMessage({ type: 'reset' });
		const variables = {
			isNew: modalId ? false : true,
			excel_id: targetMember.excel_id,
			dateString: dateString,
			open: defaultTime.map((time) => ({
				time: time,
				isValid: checkedList.some((item) => item === time),
			})),
		};

		const send = {
			do: 'invitGuidePost', // invitGuideGet | invitGuidePost
			what: 'editSingleTime',
			variables: JSON.stringify(variables),
			staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
		};
		handleMessage({ type: 'reset' });
		try {
			setLoad(true);
			handleMessage({ type: 'single' });
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setGetMemberList(result.data.invitMember);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		reset();
	}, [modalId]);

	return (
		<FromStyled>
			<FromRow $row>
				<label style={{ flex: '0', whiteSpace: 'nowrap' }}>日期</label>
				<DatePicker
					value={date ? date : ''}
					onChange={handleDate}
					disabledDate={disabledDate} // 加入日期禁用條件
					disabled={modalId ? true : false}
				/>
			</FromRow>
			<FromRow $row>
				<Checkbox
					indeterminate={indeterminate}
					onChange={onCheckAllChange}
					checked={checkAll}
				>
					全選
				</Checkbox>
				<CheckboxGroup
					style={{ display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
					options={defaultTime}
					value={checkedList}
					onChange={onChange}
				/>
			</FromRow>
			<LoadingMessage message={messages} />
			<FromRow $row>
				<Button onClick={() => reset()}>{load ? <Loading /> : '重整'}</Button>
				<Button
					type="primary"
					onClick={() => submit()}
				>
					{load ? <Loading /> : modalId ? '編輯' : '新增'}
				</Button>
			</FromRow>
		</FromStyled>
	);
}

function DelSingleModal({ setGetMemberList, modalId }) {
	const { targetMember } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();
	const [load, setLoad] = useState(false);

	const submit = async () => {
		const variables = {
			excel_id: targetMember.excel_id,
			dateString: modalId,
		};

		const send = {
			do: 'invitGuidePost', // invitGuideGet | invitGuidePost
			what: 'delSingleTime',
			variables: JSON.stringify(variables),
			staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
		};
		handleMessage({ type: 'reset' });
		try {
			setLoad(true);
			handleMessage({ type: 'single' });
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setGetMemberList(result.data.invitMember);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};

	return (
		<FromStyled>
			<FromRow>{modalId}</FromRow>
			<FromRow>請確認是否刪除，刪除後不可以還原</FromRow>
			<LoadingMessage message={messages} />
			<FromRow $row>
				<Button
					color="danger"
					variant="solid"
					onClick={() => submit()}
				>
					{load ? <Loading /> : '刪除'}
				</Button>
			</FromRow>
		</FromStyled>
	);
}

function OtherSetting() {
	const { targetMember, setMemberData } = useContext(InvitGuideContext);
	const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Lightbox 開關
	const [delModalOpen, setDelModalOpen] = useState(false); // 控制 Lightbox 開關
	const [getMemberList, setGetMemberList] = useState([]);
	const [modalId, setModalId] = useState(null);
	const filterKeysByDate = (obj) => {
		const today = dayjs(new Date());
		const filterKeys = Object.keys(obj)
			.filter((key) => dayjs(key).diff(today, 'day') > -1)
			.sort((a, b) => new Date(a) - new Date(b));
		return filterKeys;
	};
	const keyByTime = (key) => {
		const value = targetMember.other[key];
		if (!value.some(({ isValid }) => isValid)) return '不開放';
		return `開放：${value
			.filter(({ isValid }) => isValid)
			.map(({ time }) => time)
			.join('、')}`;
	};
	const handleModalClose = () => {
		if (getMemberList.length > 0) setMemberData(getMemberList);
		setIsModalOpen(false);
		setGetMemberList([]);
		setModalId(null);
	};
	const handleModalOpen = (id) => {
		setModalId(id);
		setIsModalOpen(true);
	};
	const handleDelModalClose = () => {
		if (getMemberList.length > 0) setMemberData(getMemberList);
		setDelModalOpen(false);
		setGetMemberList([]);
		setModalId(null);
	};
	const handleDelModalOpen = (id) => {
		setModalId(id);
		setDelModalOpen(true);
	};
	return (
		<Fragment>
			{isModalOpen && (
				<LightBox onClose={() => handleModalClose()}>
					<EditSingleModal
						setGetMemberList={setGetMemberList}
						modalId={modalId}
					/>
				</LightBox>
			)}
			{delModalOpen && (
				<LightBox onClose={() => handleDelModalClose()}>
					<DelSingleModal
						setGetMemberList={setGetMemberList}
						modalId={modalId}
					/>
				</LightBox>
			)}
			<h3>其他時段設定</h3>
			<FromStyled style={{ marginBottom: '30px' }}>
				<Button onClick={() => setIsModalOpen(true)}>
					<PlusOutlined />
				</Button>
				{targetMember.other &&
					filterKeysByDate(targetMember.other).length > 0 &&
					filterKeysByDate(targetMember.other).map((key) => {
						return (
							<FromRow
								key={key}
								style={{ gap: '20px' }}
								$row
							>
								<div style={{ flex: '0', whiteSpace: 'nowrap' }}>{key}</div>
								<div>{keyByTime(key)}</div>
								<Button
									style={{ flex: '0' }}
									onClick={() => handleModalOpen(key)}
								>
									<EditOutlined />
								</Button>
								<Button
									style={{ flex: '0' }}
									onClick={() => handleDelModalOpen(key)}
								>
									<DeleteOutlined style={{ color: '#ff337a' }} />
								</Button>
							</FromRow>
						);
					})}
			</FromStyled>
		</Fragment>
	);
}

function MemberSetting() {
	return (
		<ContainerStyled>
			<RenderTab />
			<CalendarSetting />
			<OtherSetting />
		</ContainerStyled>
	);
}

// styled
const containerStyles = css`
	display: flex;
	justify-content: center;
	width: 100%;
`;
const ContainerStyled = styled.div`
	${containerStyles}
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	justify-content: ${({ $justifyContent }) => $justifyContent || 'start'};
	align-items: ${({ $alignItems }) => $alignItems || 'start'};
	gap: 10px;
	padding: 0;
`;
const FromStyled = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;
const FromRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	text-align: center;
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	gap: 50px;
	& > * {
		flex: 1;
	}
`;

const CellStyled = styled.div`
	${({ $point }) => $point && 'cursor: pointer;'}
`;

export default MemberSetting;
