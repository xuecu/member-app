import React, { useState, useEffect, useContext } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import { Button, Alert } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import styled, { css } from 'styled-components';
import { SelectInput, TextareaInput, TextInput } from '@/components/input';
import { Loading, LoadingMessage, useMessage } from '@components/loading';
import SendRequest from '@/utils/auth-service.utils';
import { Link } from 'react-router-dom';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const defaultForm = {
	student: '',
	choiceBrand: '',
	date: '',
	start: '',
	end: '',
	choiceMember: '',
};

function BookingModal({ data, setTempBookingData }) {
	const { weekCode } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();

	const [form, setForm] = useState({ ...defaultForm });
	const [alert, setAlert] = useState('');
	const [load, setLoad] = useState(false);
	const [studentMessage, setStudentMessage] = useState('');
	const [studentLineLink, setStudentLineLink] = useState('');
	const [memberMessage, setMemberMessage] = useState('');
	const [memberLineLink, setMemberLineLink] = useState('');

	const memberList = Array.isArray(data.mail) ? data.mail : [];

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectBrands = (event) => {
		setForm((prev) => ({ ...prev, choiceBrand: event.target.value }));
	};

	const handleStudentTextarea = (event) => {
		const { value } = event.target;
		setStudentMessage(value);
	};
	const handleMemberTextarea = (event) => {
		const { value } = event.target;
		setMemberMessage(value);
	};

	const handleSelectMember = (event) => {
		setForm((prev) => ({ ...prev, choiceMember: event.target.value }));
	};

	const resetData = () => {
		setForm({
			...defaultForm,
			date: data.date,
			start: data.start,
			end: data.end,
		});
	};

	const AlertMessage = () => {
		if (form.choiceBrand === '' || form.choiceBrand === '請選擇') {
			setAlert('請選擇品牌');
			return;
		}
		if (form.choiceMember === '請選擇') {
			setAlert('請選擇人員');
			return;
		}
		if (form.choiceMember) {
			const targetMember = memberList.find((item) => item.mail === form.choiceMember);
			if (!targetMember) {
				setAlert('找不到該指派人員資訊');
				return;
			}
			if (!targetMember.brands.includes(form.choiceBrand)) {
				setAlert(`⚠️ 該人員僅服務：${targetMember.brands}`);
				return;
			}
		}
		setAlert('');
	};

	const submit = async () => {
		const variables = { ...form };
		const send = {
			do: 'invitGuidePost', // invitGuideGet | invitGuidePost
			what: 'booking',
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
			console.log(result.data);
			setStudentMessage(result.data.to_student.studentBookingMessage);
			setStudentLineLink(result.data.to_student.line_link);
			setMemberMessage(result.data.to_member.memberBookingMessage);
			setMemberLineLink(result.data.to_member.line_link);
			setTempBookingData(result.data.booking_Data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		resetData();
	}, []);

	useEffect(() => {
		AlertMessage();
	}, [form]);

	const brandOptions = [
		'請選擇',
		...new Set(
			data.mail
				.map(({ brands }) => brands)
				.join('、')
				.split('、')
		),
	].map((t) => ({ label: t, value: t }));

	const memberOptions = [
		{ label: '請選擇', value: '請選擇' },
		...memberList.map(({ mail }) => ({ label: mail, value: mail })),
	];

	return (
		<ContainerStyled>
			{`${weekCode(data.date)} ${data.start}:00 - ${data.end}:00`}
			<FromStyled>
				<FromRow $row>
					<TextInput
						label="學員信箱"
						inputOption={{
							type: 'text',
							required: true,
							name: 'student',
							value: form.student,
							onChange: handleChange,
						}}
					/>
					<SelectInput
						label="品牌"
						inputOption={{
							name: 'brands',
							value: form.choiceBrand,
							onChange: handleSelectBrands,
						}}
						options={brandOptions}
					/>
				</FromRow>

				<FromRow>
					<SelectInput
						label="指派人員"
						inputOption={{
							name: 'mail',
							value: form.choiceMember,
							onChange: handleSelectMember,
						}}
						options={memberOptions}
					/>
					{alert && (
						<Alert
							type="warning"
							message={alert}
							showIcon
							style={{ marginTop: '10px' }}
						/>
					)}
				</FromRow>
			</FromStyled>
			<ContainerStyled
				$row
				$justifyContent="center"
				$alignItems="center"
				style={{ marginTop: '20px' }}
			>
				<Button onClick={() => resetData()}> {load ? <Loading /> : '重置'}</Button>
				<Button
					type="primary"
					disabled={!!alert}
					onClick={() => submit()}
				>
					{load ? <Loading /> : '送出'}
				</Button>
			</ContainerStyled>
			<LoadingMessage message={messages} />
			<ContainerStyled>
				{studentMessage && (
					<ContainerStyled>
						<div>
							給學員的訊息
							<Link
								to={studentLineLink}
								target="_blank"
							>
								LINE
							</Link>
						</div>
						<TextareaInput
							label="給學員的訊息"
							inputOption={{
								type: 'text',
								disable: true,
								name: 'studentMessage',
								value: studentMessage,
								onChange: handleStudentTextarea,
							}}
						/>
					</ContainerStyled>
				)}
				{memberMessage && (
					<ContainerStyled>
						<div>
							給人員的訊息
							<Link
								to={memberLineLink}
								target="_blank"
							>
								LINE
							</Link>
						</div>
						<TextareaInput
							label="給人員的訊息"
							inputOption={{
								type: 'text',
								disable: true,
								name: 'memberMessage',
								value: memberMessage,
								onChange: handleMemberTextarea,
							}}
						/>
					</ContainerStyled>
				)}
			</ContainerStyled>
		</ContainerStyled>
	);
}

export default BookingModal;

// Styled Components
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
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	gap: 50px;
	& > * {
		flex: 1;
	}
`;
