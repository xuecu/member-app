import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';
import Table from '../table';
import styled from 'styled-components';

const LeaveContainer = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function Leave() {
	const { memberData = {} } = useContext(MemberChangeMenuContext);
	return (
		<LeaveContainer>
			<Table
				type="leave"
				data={memberData || {}}
			/>
		</LeaveContainer>
	);
}

export default Leave;
