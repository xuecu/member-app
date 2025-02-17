import React, { useContext } from 'react';
import { MemberChangeMenuContext } from '../../../contexts/member-change-menu.contexts';
import Table from './table';
import styled from 'styled-components';

const ExtensionContainer = styled.div`
	width: 100%;
	overflow: hidden;
	padding-bottom: 30px;
`;

function Extension() {
	const { formFields, memberData = {}, setMemberData } = useContext(MemberChangeMenuContext);
	return (
		<ExtensionContainer>
			<Table
				formField={formFields}
				title="合約"
				type="contract"
				data={memberData || {}}
				setData={setMemberData}
			/>
		</ExtensionContainer>
	);
}

export default Extension;
