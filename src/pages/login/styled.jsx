import styled from 'styled-components';

export const ContainerStyled = styled.div`
	display: flex;
	width: 100%;
	gap: 20px;
	padding: 30px 0;
	flex-direction: row;
	justify-content: space-around;
	@media screen and (max-width: 768px) {
		gap: 50px;
		flex-direction: column;
	}
`;
