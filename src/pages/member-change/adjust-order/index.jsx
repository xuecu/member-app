import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';
import Table from '../table';
import styled from 'styled-components';

const AdjustOrderContainer = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function AdjustOrder() {
	const { memberData = {} } = useContext(MemberChangeMenuContext);
	return (
		<AdjustOrderContainer>
			<Table
				type="adjust-order"
				data={memberData.order_logs || []}
			/>
		</AdjustOrderContainer>
	);
}

export default AdjustOrder;
