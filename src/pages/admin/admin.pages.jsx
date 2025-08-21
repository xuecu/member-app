import React, { useState, useContext, Fragment } from 'react';
import { AdminContext } from '@contexts/admin.context';
import { LoadingPage } from '@components/loading';

import RenderTable from './render-table';
import { ContainerStyled } from './styled';
const RenderPage = () => {
	return (
		<Fragment>
			<RenderTable />
		</Fragment>
	);
};

function Admin() {
	const { permissions } = useContext(AdminContext);
	const LoadingCheck = () => {
		return (
			<Fragment>
				{permissions && permissions.length > 0 ? <RenderPage /> : <LoadingPage />}
			</Fragment>
		);
	};
	return (
		<ContainerStyled>
			{/* 會員頁 */}
			<div>權限管理</div>
			<LoadingCheck />
		</ContainerStyled>
	);
}

export default Admin;
