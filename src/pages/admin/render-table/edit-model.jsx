import { useContext, useState, useEffect, Fragment } from 'react';
import { AdminContext } from '@contexts/admin.context';
import { DateInput, SelectInput, TextareaInput, TextInput } from '@/components/input';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';
import { Button, Checkbox } from 'antd';
import SendRequest from '@utils/auth-service.utils';
import styled from 'styled-components';
const CheckboxGroup = Checkbox.Group;

const defaultFlieds = {
	adminName: '',
	mail: '',
};

const EditModel = ({ mail = '', setSnapEditModal }) => {
	const { permissions, signUp, pages, defaultPages } = useContext(AdminContext);
	console.log();
	const [formFields, setFormFlieds] = useState(defaultFlieds);
	const [checkedList, setCheckedList] = useState([]);
	const { messages, handleMessage } = useMessage();

	const [load, setLoad] = useState(false);

	const checkAll = defaultPages.length === checkedList.length;
	const indeterminate = checkedList.length > 0 && checkedList.length < defaultPages.length;
	const onCheckAllChange = (e) => {
		setCheckedList(e.target.checked ? defaultPages : []);
	};
	const resetFormFields = () => {
		if (mail.length > 0) {
			const findMember = permissions.find((item) => item.legitimate === mail);
			const auth = Object.keys(findMember).filter((item) => findMember[item] === true);
			console.log(findMember);
			setFormFlieds({
				adminName: findMember.admin_name,
				mail: findMember.legitimate,
			});
			if (auth.length === 0) setCheckedList([]);
			else {
				const authList = [];
				auth.forEach((item) => {
					const findPage = pages.find((page) => page.key === item);
					if (findPage) authList.push(findPage.name);
				});
				setCheckedList(authList);
			}
		} else {
			setFormFlieds(defaultFlieds);
			setCheckedList([]);
		}
	};
	const handleChangeFormFields = (event) => {
		const { name, value } = event.target;
		setFormFlieds((prevp) => ({ ...prevp, [name]: value }));
	};
	const handleChangeChecked = (list) => {
		setCheckedList(list);
	};
	const submit = async () => {
		handleMessage({ type: 'reset' });
		if (formFields.adminName === '')
			return handleMessage({ type: 'error', content: `未填寫暱稱` });
		if (formFields.mail === '') return handleMessage({ type: 'error', content: `未填寫信箱` });

		const authList = [];
		checkedList.forEach((item) => {
			const findPage = pages.find((page) => page.name === item);
			if (findPage) authList.push(findPage.key);
		});

		const variables = {
			adminName: formFields.adminName.trim(),
			mail: formFields.mail.trim(),
			auth: [...authList],
		};
		const send = {
			do: 'adminPost',
			what: 'editAdmin',
			variables: JSON.stringify(variables),
			staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
		};
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
			setSnapEditModal(result.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		resetFormFields();
	}, [mail]);

	return (
		<FromStyled>
			<TextInput
				label="暱稱"
				inputOption={{
					type: 'text',
					required: true,
					name: 'adminName',
					value: formFields.adminName,
					onChange: handleChangeFormFields,
				}}
			/>
			<TextInput
				label="Email"
				inputOption={{
					type: 'mail',
					required: true,
					name: 'mail',
					value: formFields.mail,
					onChange: handleChangeFormFields,
				}}
			/>
			<FromRow
				$row
				style={{ flexWrap: 'wrap' }}
			>
				<Checkbox
					indeterminate={indeterminate}
					onChange={onCheckAllChange}
					checked={checkAll}
				>
					全選
				</Checkbox>
				<CheckboxGroup
					style={{ display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
					options={defaultPages}
					value={checkedList}
					onChange={handleChangeChecked}
				/>
			</FromRow>
			<LoadingMessage message={messages} />
			<FromRow $row>
				<Button onClick={resetFormFields}>{load ? <Loading /> : '重置'}</Button>
				<Button onClick={submit}>{load ? <Loading /> : mail ? '編輯' : '新增'}</Button>
			</FromRow>
		</FromStyled>
	);
};
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
	gap: 20px;
	& > * {
		flex: 1;
	}
`;

export default EditModel;
