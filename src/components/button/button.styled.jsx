import styled from 'styled-components';

export const BaseButton = styled.button`
	min-width: 165px;
	width: auto;
	height: 50px;
	letter-spacing: 0.5px;
	line-height: 50px;
	padding: 0 35px 0 35px;
	font-size: 15px;
	background-color: white;
	color: black;
	text-transform: uppercase;
	font-family: 'Open Sans Condensed';
	font-weight: bolder;
	border: 1px solid black;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	white-space: nowrap;
	&:hover {
		background-color: white;
		color: #4285f4;
		border: 1px solid #4285f4;
	}
`;

export const GoogleSignInButton = styled(BaseButton)`
	background-color: #4285f4;
	color: white;
	&:hover {
		background-color: #357ae8;
		border: none;
	}
`;

export const InvertedButton = styled(BaseButton)`
	background-color: white;
	color: black;
	border: 1px solid black;
	&:hover {
		background-color: black;
		color: white;
		border: none;
	}
`;
