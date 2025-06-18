import React, { useState } from 'react';
import styled from 'styled-components';

import SendRequest from '@utils/auth-service.utils';
import { Loading, useMessage } from '@components/loading';
import { FormInput } from '@/components/input';
import Button from '@components/button';

const SignupContainer = styled.div`
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

const defaultSingUp = {
	email: '',
	password: '',
	showPassword: false,
	confirmPassword: '',
	showConfirmPassword: false,
};

function SignUp({ loading, setLoading }) {
	const { messages, handleMessage } = useMessage();
	const [singUpForm, setSingUpForm] = useState(defaultSingUp);

	const handleSignUp = async () => {
		handleMessage({ type: 'reset' });

		if (singUpForm.email === '') {
			handleMessage({ type: 'error', content: '請輸入信箱' });
			return;
		}
		if (singUpForm.password === '') {
			handleMessage({ type: 'error', content: '請輸入密碼' });
			return;
		}
		if (singUpForm.confirmPassword === '') {
			handleMessage({ type: 'error', content: '請輸入再次確認的密碼' });
			return;
		}

		if (singUpForm.password !== singUpForm.confirmPassword) {
			handleMessage({ type: 'error', content: '密碼核對有誤，請重新確認' });
			return;
		}
		if (loading) return;

		try {
			setLoading(true);
			handleMessage({ type: 'single' });

			const data = {
				do: 'signup',
				mail: singUpForm.email,
				password: singUpForm.password,
			};
			const result = await SendRequest(data);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(result.message);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	const handleChanage = (event) => {
		const { name, value } = event.target;
		setSingUpForm({ ...singUpForm, [name]: value });
	};
	const handleClickChange = (key) => {
		setSingUpForm({ ...singUpForm, [key]: !singUpForm[key] });
	};

	return (
		<SignupContainer>
			<h2>註冊</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: handleChanage,
						name: 'email',
						value: singUpForm.email,
					}}
				/>
				<FormInput
					label="Password"
					inputOption={{
						type: singUpForm.showPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'password',
						value: singUpForm.password,
					}}
					showToggle={true}
					showPassword={singUpForm.showPassword}
					onToggleClick={() => handleClickChange('showPassword')}
				/>
				<FormInput
					label="Confirm Password"
					inputOption={{
						type: singUpForm.showConfirmPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'confirmPassword',
						value: singUpForm.confirmPassword,
					}}
					showToggle={true}
					showPassword={singUpForm.showConfirmPassword}
					onToggleClick={() => handleClickChange('showConfirmPassword')}
				/>
				{messages && <MessageStyled>{messages}</MessageStyled>}
				<Button
					type="submit"
					onClick={handleSignUp}
					disabled={loading}
				>
					{loading ? <Loading /> : '註冊'}
				</Button>
			</InputGroup>
		</SignupContainer>
	);
}

export default SignUp;
