import React, { useState, useContext } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import { Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

import SendRequest from '@utils/auth-service.utils';
import { Loading, LoadingMessage, useMessage } from '@components/loading';

export const FlexContainer = styled.div`
	display: flex;
	gap: 20px;
	align-items: center;
`;
export const TitleName = styled.span`
	white-space: nowrap;
`;

const Timer = () => {
	const { startTime, setStartTime, setMemberData, setBooking } = useContext(InvitGuideContext);
	const { messages, handleMessage } = useMessage();
	const [load, setLoad] = useState(false);

	// 限制只能選擇明天之後的日期
	const disabledDate = (current) => {
		return current && current < dayjs().endOf('day'); // 禁用今天及過去的日期
	};
	const onChange = (value) => {
		if (!value) return setStartTime(null);
		setStartTime(dayjs(value));
	};
	const submit = async () => {
		const variables = {
			time: new Date(startTime),
		};
		const send = {
			do: 'invitGuideGet', // invitGuideGet | invitGuidePost
			what: 'search',
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
			setBooking(result.data.booking);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};
	return (
		<FlexContainer>
			<TitleName>選擇日期：</TitleName>
			<DatePicker
				defaultValue={startTime ? startTime : ''}
				onChange={onChange}
				disabledDate={disabledDate} // 加入日期禁用條件
			/>
			<Button onClick={() => submit()}>{load ? <Loading /> : '重新查詢'}</Button>
			<LoadingMessage message={messages} />
		</FlexContainer>
	);
};

export default Timer;
