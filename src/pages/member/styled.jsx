import styled from 'styled-components';

export const ContainerStyled = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 50px;
	padding: 0px 0 30px;
`;

export const FormContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	gap: 30px;
	& > div {
		width: 100%;
	}
`;
