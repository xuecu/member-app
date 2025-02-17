import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavigatorStyled = styled.div`
	${(props) =>
		props.$collapsed ? `width: 10%; max-width: 200px; min-width: 80px;` : `width: 0px;`}
	height: 100vh;
	display: flex;
	padding: 30px 0;
	gap: 100px;
	flex-direction: column;
	overflow: hidden;
	transition: width 0.3s;
	border-right: 1px solid black;

	@media screen and (max-width: 768px) {
		width: ${(props) => (props.$collapsed ? '200px' : '0px')};
	}
`;
export const LinkStyled = styled(Link)`
	text-align: center;
	white-space: nowrap;
	text-decoration: none;
	color: black;
	border-bottom: 1px transparent solid;
	&:hover {
		border-bottom: 1px black solid;
	}
`;
export const LogoutButton = styled.div`
	text-align: center;
	white-space: nowrap;
	cursor: pointer;
	color: black;
	border-bottom: 1px transparent solid;
	&:hover {
		border-bottom: 1px black solid;
	}
`;
export const GroupStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
`;
export const MemberStyled = styled.div`
	width: 100%;
	display: inline-block;
	word-break: break-all;
	text-align: center;
	padding: 10px;
	font-weight: bold;
`;
