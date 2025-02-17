import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
	position: relative;
	@media screen and (max-width: 768px) {
		gap: 5px;
		flex-wrap: wrap;
	}
`;
export const FromItemStyled = styled(MemberChangeStyled)`
	flex-grow: 1;
`;

export const MessageStyled = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
`;

export const MemberInfoContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
	padding: 15px;
	margin-top: 20px;
	width: 80%;
	max-width: 500px;
`;

export const MemberName = styled.span`
	font-size: 18px;
	font-weight: bold;
	color: #333;
`;

export const AdminLink = styled(Link)`
	font-size: 16px;
	color: #007bff;
	text-decoration: none;
	font-weight: bold;
	transition: color 0.3s ease-in-out;

	&:hover {
		color: #0056b3;
	}
`;
