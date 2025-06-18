import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';
import Table from '../table';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function AdjustCoin() {
	const { formFields, memberData = {} } = useContext(MemberChangeMenuContext);

	if (formFields.brand !== 'xuemi') {
		return <Container>此品牌無點數可以調整</Container>;
	}
	if (!memberData.hasOwnProperty('contracts')) {
		return;
	}
	return (
		<Container>
			<Table
				type="adjust-coin"
				data={memberData.contracts || {}}
			/>
		</Container>
	);
}

export default AdjustCoin;
