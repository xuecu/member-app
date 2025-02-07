import React, { useState } from 'react';
import SendRequest from '../../../utils/auth-service.utils';
import Loading from '../../../components/loading/loading.components';
import FormInput from '../../../components/form-input/form-input.component';
import Button from '../../../components/button/button.component';
import UID from '../../../utils/uid.utils';
import dayjs from 'dayjs';

import styled from 'styled-components';

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 50%;
	padding-left: 30px;
	position: relative;
	padding-top: 20px;
`;
const MessageStyled = styled.span`
	position: absolute;
	top: 0;
	left: 100px;
	color: red;
`;

function SignUp({ loading, setLoading }) {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handleSignUp = async () => {
		if (!email) {
			setMessage('請輸入信箱');
			return;
		}

		setLoading(true);
		setMessage('');

		const data = {
			do: 'signup',
			uid: UID(dayjs()), // 生成唯一 UID
			mail: email,
		};

		try {
			const result = await SendRequest(data);
			setMessage(result.message);
		} catch (error) {
			setMessage('發生錯誤，請稍後再試');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>註冊</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: (e) => setEmail(e.target.value),
						name: 'email',
						value: email,
					}}
				/>
				{message && <MessageStyled>{message}</MessageStyled>}
				<Button
					type="submit"
					onClick={handleSignUp}
					disabled={loading}
				>
					{loading ? <Loading /> : '註冊'}
				</Button>
			</InputGroup>
		</div>
	);
}

export default SignUp;
