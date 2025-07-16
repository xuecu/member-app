import React, { useState, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';
import Timer from './timer';
import TabControl from './tab-control';
import RenderTable from './render-table';

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

function InvitGuide() {
	const { memberData } = useContext(InvitGuideContext);

	return (
		<ContainerStyled>
			<h2>預約導覽</h2>
			<Timer />

			{memberData && memberData.length > 0 && (
				<Fragment>
					<TabControl />
					<RenderTable />
				</Fragment>
			)}
		</ContainerStyled>
	);
}

export default InvitGuide;
