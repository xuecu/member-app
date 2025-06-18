import React, { useState, useContext } from 'react';
import { AuthContext } from '@contexts/auth.context';

import dayjs from 'dayjs';
import styled from 'styled-components';

import SendRequest from '@utils/auth-service.utils';
import { Loading, useMessage } from '@components/loading';
import { FormInput } from '@/components/input';
import Button from '@components/button';

const SigninContainer = styled.div`
	display: flex;
	width: 40%;
	min-width: 250px;
	flex-direction: column;
`;
const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
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
const SpanStyled = styled.span`
	display: flex;
	width: 100%;
	justify-content: end;
	color: gray;
	padding-bottom: 5px;
`;
const defaultSingIn = {
	email: '',
	password: '',
	showPassword: false,
};

function SignIn({ loading, setLoading, navigate }) {
	const { login } = useContext(AuthContext);
	const { handleMessage, messages } = useMessage();
	const [singInForm, setSingInForm] = useState(defaultSingIn);

	const handleSignIn = async () => {
		handleMessage({ type: 'reset' });

		if (singInForm.email === '') {
			handleMessage({ type: 'error', content: '請輸入信箱' });
			return;
		}
		if (singInForm.password === '') {
			handleMessage({ type: 'error', content: '請輸入密碼' });
			return;
		}
		if (loading) return;

		try {
			setLoading(true);
			handleMessage({ type: 'single' });
			const data = {
				do: 'signin',
				mail: singInForm.email,
				password: singInForm.password,
				timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			};
			const result = await SendRequest(data);

			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(result.message);
			}
			login(JSON.parse(result.data));
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			navigate('/dashboard');
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleChanage = (event) => {
		const { name, value } = event.target;
		setSingInForm({ ...singInForm, [name]: value });
	};
	const handleClickChange = (key) => {
		setSingInForm({ ...singInForm, [key]: !singInForm[key] });
	};
	const handleForgetPassword = () => navigate('/login/forget-password');

	return (
		<SigninContainer>
			<h2>登入</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: handleChanage,
						name: 'email',
						value: singInForm.email,
					}}
				/>
				<FormInput
					label="Password"
					inputOption={{
						type: singInForm.showPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'password',
						value: singInForm.password,
					}}
					showToggle={true}
					showPassword={singInForm.showPassword}
					onToggleClick={() => handleClickChange('showPassword')}
				/>
				{messages && <MessageStyled>{messages}</MessageStyled>}
				<SpanStyled onClick={handleForgetPassword}>忘記密碼？</SpanStyled>
				<Button
					type="submit"
					onClick={handleSignIn}
					disabled={loading}
				>
					{loading ? <Loading /> : '登入'}
				</Button>
			</InputGroup>
		</SigninContainer>
	);
}

export default SignIn;
