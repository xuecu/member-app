import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const LightBoxStyled = styled.div`
	position: relative;
	display: inline-block;
	max-width: 80vw;
	max-height: 90vh;
	background-color: white;
	border-radius: 20px;
	border: 1px solid rgba(222, 222, 222, 0.5);
	box-shadow: 0 0 20px rgba(222, 222, 222, 0.3);
	overflow: hidden;
`;
export const ContentStyled = styled.div`
	padding: 30px 50px;
	width: 100%;
	background-color: white;
`;
export const OverlayStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9;
`;
export const ClosedStyled = styled(CloseOutlined)`
	position: absolute;
	right: 15px;
	top: 15px;

	&:hover {
		color: #ff337a;
	}
`;
