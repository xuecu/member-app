import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from './signin/signin.pages';
import SignUp from './signup/signup.pages';
import { ContainerStyled } from './login.styled';

function Login() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	return (
		<ContainerStyled>
			{/* 登入 */}
			<SignIn
				loading={loading}
				setLoading={setLoading}
				navigate={navigate}
			/>

			{/* 註冊 */}
			<SignUp
				loading={loading}
				setLoading={setLoading}
			/>
		</ContainerStyled>
	);
}

export default Login;
