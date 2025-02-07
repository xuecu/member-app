import styled from 'styled-components';

export const DefaultStyled = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: ${(prop) => (prop.$column ? 'column' : 'row')};
`;

export const HeaderStyled = styled.div`
	width: 100%;
	height: 50px;
	display: flex;
	font-size: 24px;
	padding: 0 16px;
	align-items: center;
`;

export const ContentStyled = styled.div`
	width: 100%;
	height: calc(100vh - 50px);
	display: flex;
	padding: 0 16px;
`;
