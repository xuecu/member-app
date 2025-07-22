import React, { useState, useEffect, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import { Calendar, Badge, Button } from 'antd';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { Tab } from '@/components/tab';
import { LightBox } from '@/components/light-box';
import SendRequest from '@utils/auth-service.utils';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';

function Modal({ setGetBookingList, modalId }) {
	const { memberData, booking } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();
	const [load, setLoad] = useState(false);
	const [clipboardMessage, setClipboardMessage] = useState('');
	const [lineUrl, setLineUrl] = useState('');
	const targetBooking = booking.find(({ id }) => id === modalId);
	const memberMail = targetBooking.inviter
		.split(', ')
		.filter((item) => item !== 'learnwell@teachcake.com')[0];
	const targetMember = memberData.find(({ mail }) => mail === memberMail);

	const deletedFunc = async () => {
		const variables = { eventId: modalId };
		setClipboardMessage('');
		if (modalId) variables.id = modalId;
		const send = {
			do: 'invitGuidePost', // invitGuideGet | invitGuidePost
			what: 'deleteInvite',
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
			setGetBookingList(result.data.booking);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};
	const deletedMessage = async () => {
		setLineUrl(targetMember.line_url);
		setClipboardMessage(
			`【取消預約】\n預約時間：${dayjs(targetBooking.date).format('YYYY-MM-DD')} ${
				targetBooking.start_at
			}\n\n＊請記得重整行事曆`
		);
	};
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(clipboardMessage);
			alert('複製成功');
		} catch (err) {
			console.error('❌ 無法複製文字', err);
		}
	};

	return (
		<ContainerStyled>
			<h3>
				{targetBooking.date} {targetBooking.start_at} - {targetBooking.end_at}
			</h3>
			<span>{targetBooking.title}</span>
			<span>
				指派人員：
				{targetBooking.inviter
					.split(', ')
					.filter((item) => item !== 'learnwell@teachcake.com')
					.join('、')}
			</span>
			{targetBooking.status === 'confirmed' && (
				<Fragment>
					<span>
						日曆連結：
						<Link
							to={targetBooking.url}
							target="_blank"
						>
							LINE
						</Link>
					</span>

					{/* <FromRow $row>
						預約完成後：
						<Button>{load ? <Loading /> : '通知學員'}</Button>
						<Button>{load ? <Loading /> : '通知導覽人員'}</Button>
					</FromRow>
					<FromRow $row>
						當日通知：
						<Button>{load ? <Loading /> : '通知學員'}</Button>
					</FromRow> */}
					<FromRow $row>
						<Button
							color="danger"
							variant="solid"
							onClick={() => deletedFunc()}
						>
							{load ? <Loading /> : '刪除'}
						</Button>
					</FromRow>
				</Fragment>
			)}
			{targetBooking.status === 'cancelled' && (
				<Fragment>
					<FromRow $row>
						刪除後：
						<Button onClick={() => deletedMessage()}>
							{load ? <Loading /> : '通知導覽人員'}
						</Button>
					</FromRow>
				</Fragment>
			)}
			<LoadingMessage message={messages} />
			{clipboardMessage.length > 0 && (
				<Fragment>
					<FromRow $row>
						Line：
						<Link
							to={lineUrl}
							target="_blank"
						>
							點擊
						</Link>
					</FromRow>
					<FromRow $row>
						公版文字：
						<Button onClick={() => handleCopy()}>{load ? <Loading /> : '複製'}</Button>
					</FromRow>
				</Fragment>
			)}
		</ContainerStyled>
	);
}

function CalendarSetting() {
	const { memberData, booking, setBooking } = useContext(InvitGuideContext);
	const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Lightbox 開關
	const [getBookingList, setGetBookingList] = useState([]);
	const [modalId, setModalId] = useState(null);

	const [value, setValue] = useState(() => dayjs());
	const [selectedDate, setSelectedDate] = useState(() => dayjs());

	const handleModalClose = () => {
		if (getBookingList.length > 0) setBooking(getBookingList);
		setIsModalOpen(false);
		setGetBookingList([]);
		setModalId(null);
	};
	const handleModalOpen = (id) => {
		setGetBookingList([]);
		setModalId(id);
		setIsModalOpen(true);
	};

	const onSelect = (newValue) => {
		setValue(newValue);
		setSelectedDate(newValue);
	};

	const goToToday = () => {
		const today = dayjs();
		setValue(today);
		setSelectedDate(today);
	};

	const getListData = (date) => {
		const formatDate = date.format('YYYY/MM/DD');
		return booking
			.filter((item) => item.date === formatDate)
			.map((item) => ({
				...item,
				type: item.status === 'cancelled' ? 'error' : 'success',
			}));
	};

	const dateCellRender = (date) => {
		const listData = getListData(date);
		return (
			<FromStyled
				className="events"
				style={{ gap: '5px' }}
			>
				{listData.map((item) => (
					<FromRow
						$row
						style={{ overflow: 'hidden' }}
						key={item.id}
					>
						<DateCell
							status={item.type}
							text={`${item.start_at} ${item.title}`}
						/>
					</FromRow>
				))}
			</FromStyled>
		);
	};
	const selectedData = (selectedDate) => {
		const getData = getListData(selectedDate);
		const sortData = getData.sort(
			(a, b) => Number(a.start_at.split(':')[0]) - Number(b.start_at.split(':')[0])
		);
		const filterSuccess = sortData.filter(({ type }) => type === 'success');
		const filterError = sortData.filter(({ type }) => type === 'error');

		return { filterSuccess, filterError };
	};
	const { filterSuccess, filterError } = selectedData(selectedDate);

	return (
		<ContainerStyled>
			{isModalOpen && (
				<LightBox onClose={() => handleModalClose()}>
					<Modal
						setGetMemberList={setGetBookingList}
						modalId={modalId}
					/>
				</LightBox>
			)}
			<div
				style={{
					position: 'relative',
				}}
			>
				<Button
					onClick={goToToday}
					type="primary"
					style={{
						position: 'absolute',
						top: '10px',
					}}
				>
					今天
				</Button>
				<Calendar
					value={value}
					onSelect={onSelect}
					cellRender={dateCellRender}
				/>
			</div>

			<ContainerStyled>
				<h3>{selectedDate.format('YYYY-MM-DD')} 的任務</h3>
				{filterSuccess.length > 0 ? (
					<FromStyled>
						{filterSuccess.map((item) => {
							return (
								<FromRowList
									key={item.id}
									onClick={() => handleModalOpen(item.id)}
								>
									<span>{`${item.start_at} ${item.title}`}</span>
								</FromRowList>
							);
						})}
					</FromStyled>
				) : (
					<p>無事件</p>
				)}
				<h3>已刪除的任務</h3>
				{filterError.length > 0 ? (
					<FromStyled>
						{filterError.map((item) => {
							return (
								<FromRowList
									$fail
									key={item.id}
									onClick={() => handleModalOpen(item.id)}
								>
									<span>{`${item.start_at} ${item.title}`}</span>
								</FromRowList>
							);
						})}
					</FromStyled>
				) : (
					<p>無</p>
				)}
			</ContainerStyled>
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
	text-align: start;
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	gap: 50px;
	& > * {
		flex: 1;
	}
`;
const FromRowList = styled.div`
	width: 100%;
	border-radius: 10px;
	cursor: pointer;
	padding: 15px;
	display: flex;
	align-items: center;
	text-align: start;
	flex-direction: row;
	gap: 20px;
	& > * {
		flex: 1;
	}
	&::before {
		display: block;
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 100px;
		background-color: ${({ $fail }) => ($fail ? '#ff337a' : '#52c41a')};
	}
	&:hover {
		background-color: aliceblue;
	}
`;
const DateCell = styled(Badge)`
	display: flex;
	white-space: nowrap;
	align-items: center;
`;

export default CalendarSetting;
