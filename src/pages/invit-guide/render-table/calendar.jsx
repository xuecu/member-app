import React, { useState, useEffect, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import { Calendar, Badge, Alert, Button } from 'antd';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';

import { Tab } from '@/components/tab';
import SendRequest from '@utils/auth-service.utils';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';
import Booking from './booking';

function CalendarSetting() {
	const { memberData, booking } = useContext(InvitGuideContext);

	const [value, setValue] = useState(() => dayjs());
	const [selectedDate, setSelectedDate] = useState(() => dayjs());

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

	const selectedData = getListData(selectedDate);

	console.log('memberData : ', memberData);
	console.log('booking : ', booking);
	return (
		<ContainerStyled>
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

			<div style={{ marginTop: 16 }}>
				<h3>{selectedDate.format('YYYY-MM-DD')} 的任務</h3>
				{selectedData.length > 0 ? (
					<FromStyled>
						{selectedData.map((item) => {
							console.log(item);
							return (
								<FromRow key={item.id}>{`${item.start_at} ${item.title}`}</FromRow>
							);
						})}
					</FromStyled>
				) : (
					<p>無事件</p>
				)}
			</div>
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
const DateCell = styled(Badge)`
	display: flex;
	white-space: nowrap;
	align-items: center;
`;

export default CalendarSetting;
