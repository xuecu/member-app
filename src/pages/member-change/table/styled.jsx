import styled from 'styled-components';

// **樣式設計**
export const TableContainer = styled.div`
	width: 90%;
	margin: 20px auto;
	font-family: Arial, sans-serif;
`;

export const TableTitle = styled.h2`
	text-align: center;
	color: #333;
	margin-bottom: 20px;
`;

export const OrderCard = styled.div`
	background: #fff;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
	margin-bottom: 15px;
	overflow: hidden;
	transition: all 0.3s ease-in-out;
`;

export const OrderHeader = styled.div`
	background: ${(props) => (props.$background ? '#007bff' : '#ff337a')};
	color: white;
	padding: 15px;
	font-weight: bold;
	font-size: 16px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 10px 10px 0 0;
`;

export const OrderBody = styled.div`
	background: #f9f9f9;
	padding: ${(props) => (props.$collapse ? '0px' : '15px')};
	transition: max-height 0.3s ease-in-out;
	max-height: ${(props) => (props.$collapse ? '0px' : '')};
	overflow: hidden;
`;

export const TableHead = styled.div`
	display: flex;
	background: ${(props) => (props.$background ? '#007bff' : '#ff337a')};
	color: white;
	padding: 10px;
	font-weight: bold;
	border-radius: 5px;
	margin-bottom: 5px;
`;

export const TableRow = styled.div`
	display: flex;
	padding: 10px;
	background: ${(props) => (props.$index % 2 === 0 ? '#fff' : '#f1f1f1')};
	border-radius: 5px;
`;

export const Col = styled.div`
	flex: 1;
	text-align: center;
	padding: 5px;
`;

export const ChevronIcon = styled.span`
	transform: ${(props) => (props.$collapse ? 'rotate(0deg)' : 'rotate(180deg)')};
	transition: transform 0.3s ease-in-out;
	font-size: 18px;
`;

export const EmptyMessage = styled.div`
	text-align: center;
	padding: 20px;
	color: #999;
`;
export const LoadingMessage = styled.div`
	display: flex;
	justify-content: center;
	padding-top: 10px;
	gap: 20px;
`;
