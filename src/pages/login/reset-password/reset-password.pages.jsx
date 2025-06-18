import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SendRequest from '@utils/auth-service.utils';
import { Loading, useMessage } from '@components/loading';
import { FormInput } from '@/components/input';
import Button from '@components/button';

import { ContainerStyled, InputGroup, MessageStyled } from './styled';

const defaultResetPassword = {
	password: '',
	showPassword: false,
	confirmPassword: '',
	showConfirmPassword: false,
};

function ResetPassword() {
	const { id } = useParams(); // 接收會員 ID 或 token
	const { messages, handleMessage } = useMessage();
	const [restePasswordForm, setRestePasswordForm] = useState(defaultResetPassword);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChanage = (event) => {
		const { value, name } = event.target;
		setRestePasswordForm({ ...restePasswordForm, [name]: value });
	};
	const handleClickChange = (key) => {
		setRestePasswordForm({ ...restePasswordForm, [key]: !restePasswordForm[key] });
	};

	const handleSubmit = async () => {
		handleMessage({ type: 'reset' });

		if (restePasswordForm.password === '') {
			handleMessage({ type: 'error', content: '請輸入密碼' });
			return;
		}
		if (restePasswordForm.confirmPassword === '') {
			handleMessage({ type: 'error', content: '請輸入再次確認的密碼' });
			return;
		}
		if (restePasswordForm.password !== restePasswordForm.confirmPassword) {
			handleMessage({ type: 'error', content: '密碼核對有誤，請重新確認' });
			return;
		}

		if (loading) return;

		try {
			setLoading(true);
			handleMessage({ type: 'single' });
			const data = {
				do: 'reset-password',
				token: id,
				password: restePasswordForm.password,
			};
			const result = await SendRequest(data);

			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(result.message);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			navigate('/login');
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<ContainerStyled>
			<h2>重設密碼</h2>
			<InputGroup>
				<FormInput
					label="Password"
					inputOption={{
						type: restePasswordForm.showPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'password',
						value: restePasswordForm.password,
					}}
					showToggle={true}
					showPassword={restePasswordForm.showPassword}
					onToggleClick={() => handleClickChange('showPassword')}
				/>
				<FormInput
					label="Confirm Password"
					inputOption={{
						type: restePasswordForm.showConfirmPassword ? 'text' : 'password',
						required: true,
						onChange: handleChanage,
						name: 'confirmPassword',
						value: restePasswordForm.confirmPassword,
					}}
					showToggle={true}
					showPassword={restePasswordForm.showConfirmPassword}
					onToggleClick={() => handleClickChange('showConfirmPassword')}
				/>
				{messages && <MessageStyled>{messages}</MessageStyled>}
				<Button
					type="submit"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? <Loading /> : '送出'}
				</Button>
			</InputGroup>
		</ContainerStyled>
	);
}

export default ResetPassword;
