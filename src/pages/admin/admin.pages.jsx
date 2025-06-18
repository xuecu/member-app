import React, { useState, useContext } from 'react';
import { AuthContext } from '@contexts/auth.context';
import { LoadingPage } from '@components/loading';

import { ContainerStyled } from './styled';

function Admin() {
	const { auth } = useContext(AuthContext);
	if (auth.hasOwnProperty('router')) if (!auth.router.includes('admin')) return <div>無權限</div>;

	return (
		<ContainerStyled>
			{/* 會員頁 */}
			<div>權限管理</div>
			<LoadingPage />
		</ContainerStyled>
	);
}

export default Admin;
