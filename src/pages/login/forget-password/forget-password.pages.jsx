import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendRequest from '@utils/auth-service.utils';
import { Loading, useMessage } from '@components/loading';
import { FormInput } from '@/components/input';
import Button from '@components/button';

import { ContainerStyled, InputGroup, MessageStyled } from './styled';

const defaultForgetPassword = {
	email: '',
};

function ForgetPassword() {
	const { messages, handleMessage } = useMessage();
	const [forgetPasswordForm, setForgetPassword] = useState(defaultForgetPassword);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleChanage = (event) => {
		const { value, name } = event.target;
		setForgetPassword({ ...forgetPasswordForm, [name]: value });
	};

	const handleSubmit = async () => {
		handleMessage({ type: 'reset' });

		if (forgetPasswordForm.email === '') {
			handleMessage({ type: 'error', content: '請輸入信箱' });
			return;
		}
		if (loading) return;

		try {
			setLoading(true);
			const data = {
				do: 'forget-password',
				mail: forgetPasswordForm.email,
			};

			const result = await SendRequest(data);

			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(result.message);
			}
			alert('已成功寄出重設密碼信，請檢查信箱收取『驗證信』。');
			navigate('/login');
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<ContainerStyled>
			<h2>忘記密碼</h2>
			<InputGroup>
				<FormInput
					label="Email"
					inputOption={{
						type: 'email',
						required: true,
						onChange: handleChanage,
						name: 'email',
						value: forgetPasswordForm.email,
					}}
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

export default ForgetPassword;
