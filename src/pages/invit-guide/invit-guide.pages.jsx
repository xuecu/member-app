import React, { useState, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import { AuthContext } from '@contexts/auth.context';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';
import Timer from './timer';
import TabControl from './tab-control';
import RenderTable from './render-table';
import { LoadingPage } from '@components/loading';

const containerStyles = css`
	display: flex;
	justify-content: center;
	width: 100%;
`;
const ContainerStyled = styled.div`
	${containerStyles}
	flex-direction: column;
	justify-content: start;
	gap: 30px;
	padding: 0;
`;
const RenderPage = () => {
	return (
		<Fragment>
			<Timer />
			<TabControl />
			<RenderTable />
		</Fragment>
	);
};

function InvitGuide() {
	const { memberData } = useContext(InvitGuideContext);
	const { auth } = useContext(AuthContext);
	if (auth.hasOwnProperty('router'))
		if (!auth.router.includes('invit-guide')) return <div>無權限</div>;

	const LoadingCheck = () => {
		return (
			<Fragment>
				{memberData && memberData.length > 0 ? <RenderPage /> : <LoadingPage />}
			</Fragment>
		);
	};
	return (
		<ContainerStyled>
			<h2>預約導覽</h2>
			<LoadingCheck />
		</ContainerStyled>
	);
}

export default InvitGuide;
