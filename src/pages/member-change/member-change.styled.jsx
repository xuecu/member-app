import styled from 'styled-components';

export const MemberChangeStyled = styled.div`
	width: 100%;
`;

export const FormGroupStyled = styled(MemberChangeStyled)`
	max-width: 1300px;
	display: flex;
	flex-direction: row;
	gap: 30px;
	justify-content: right;
	margin: 0 auto;
	@media screen and (max-width: 768px) {
		gap: 5px;
		flex-wrap: wrap;
	}
`;
export const FromItemStyled = styled(MemberChangeStyled)`
	flex-grow: 1;
`;
