import React, { useState, useContext } from 'react';
import { AuthContext } from '@contexts/auth.context';

import { ContainerStyled } from './styled';

function Plugin() {
	const { auth } = useContext(AuthContext);
	if (auth.hasOwnProperty('router'))
		if (!auth.router.includes('plugin')) return <div>無權限</div>;
	return (
		<ContainerStyled>
			{/* 工具頁 */}
			<div>工具使用</div>
		</ContainerStyled>
	);
}

export default Plugin;
