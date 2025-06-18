import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';
import Table from '../table';
import styled from 'styled-components';

const SearchContainer = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function Search() {
	const { memberData = {} } = useContext(MemberChangeMenuContext);

	return (
		<SearchContainer>
			<Table
				type="contract"
				data={memberData.contracts || []}
			/>
			<Table
				type="order-log"
				data={memberData.order_logs || []}
			/>
		</SearchContainer>
	);
}

export default Search;
