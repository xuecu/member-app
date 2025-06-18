import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';
import Table from '../table';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function AdjustCoupon() {
	const { formFields, memberData = {} } = useContext(MemberChangeMenuContext);

	if (formFields.brand === 'sixdigital' || formFields.brand === 'kkschool') {
		return <Container>此品牌無諮詢卷可以調整</Container>;
	}
	if (!memberData.contracts) {
		return;
	}
	return (
		<Container>
			<Table
				type="adjust-coupon"
				data={memberData.contracts || []}
			/>
		</Container>
	);
}

export default AdjustCoupon;
