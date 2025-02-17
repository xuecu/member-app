import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '../../../contexts/member-change-menu.contexts';
import Table from './table';
import styled from 'styled-components';

const AdjustOrderContainer = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function AdjustOrder() {
	const { formFields, memberData = {}, setMemberData } = useContext(MemberChangeMenuContext);
	return (
		<AdjustOrderContainer>
			<Table
				formField={formFields}
				title="訂單"
				type="contract"
				data={memberData || {}}
				setData={setMemberData}
			/>
		</AdjustOrderContainer>
	);
}

export default AdjustOrder;
