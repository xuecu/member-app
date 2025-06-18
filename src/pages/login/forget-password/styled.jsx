import styled from 'styled-components';

export const ContainerStyled = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 50px;
	padding: 30px 0;
`;

export const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 50%;
	padding-left: 30px;
	position: relative;
	padding-top: 20px;
`;
export const MessageStyled = styled.span`
	position: absolute;
	top: 0;
	left: 100px;
	color: red;
`;
