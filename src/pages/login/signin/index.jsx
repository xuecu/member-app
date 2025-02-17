import React, { useState } from 'react';
import SendRequest from '../../../utils/auth-service.utils';
import Loading from '../../../components/loading';
import FormInput from '../../../components/form-input';
import Button from '../../../components/button';
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

function SignIn({ loading, setLoading, navigate }) {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handleSignIn = async () => {
		if (!email) {
			setMessage('請輸入信箱');
			return;
		}
		if (loading) return alert('Please be patient. wait a few minutes.');

		setLoading(true);
		setMessage('');

		const data = {
			do: 'signin',
			mail: email,
			timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		};

		try {
			const result = await SendRequest(data);
			if (result.success) {
				localStorage.setItem(
					'memberApp',
					JSON.stringify({
						email,
						login_at: data.timestamp,
					})
				);
				navigate('/dashboard');
			} else {
				setMessage('登入失敗，信箱不存在');
			}
		} catch (error) {
			setMessage('發生錯誤，請稍後再試');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>登入</h2>
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
					onClick={handleSignIn}
					disabled={loading}
				>
					{loading ? <Loading /> : '登入'}
				</Button>
			</InputGroup>
		</div>
	);
}

export default SignIn;
