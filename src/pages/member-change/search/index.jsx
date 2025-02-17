import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '../../../contexts/member-change-menu.contexts';
import Table from './table';
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
				title="合約"
				type="contract"
				data={memberData.contracts || []}
			/>
			<Table
				title="訂單"
				type="order_log"
				data={memberData.order_log || []}
			/>
		</SearchContainer>
	);
}

export default Search;
