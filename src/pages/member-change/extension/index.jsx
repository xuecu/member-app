import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';
import Table from '../table';
import styled from 'styled-components';

const ExtensionContainer = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function Extension() {
	const { memberData = {} } = useContext(MemberChangeMenuContext);
	return (
		<ExtensionContainer>
			<Table
				type="extension"
				data={memberData || {}}
			/>
		</ExtensionContainer>
	);
}

export default Extension;
