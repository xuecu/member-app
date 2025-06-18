import { useState, Fragment } from 'react';
import { Button, Checkbox } from 'antd';
import { BorderlessTableOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const OverlayStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: transparent;
	z-index: 9;
`;
export const ColumnsBox = styled.div`
	position: absolute;
	background: #fff;
	border: 1px solid #d9d9d9;
	top: 0;
	left: -12px;
	font-weight: bold;
	padding: 20px;
	width: 300px;
	max-height: 80vh;
	border-radius: 8px;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.1);
	transform: translate(-100%, -5px);

	z-index: 99;
	&::before {
		position: absolute;
		top: 10px;
		right: -10px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 0px 10px 10px;
		border-color: transparent transparent transparent #d9d9d9;
		display: inline-block;
		content: '';
		/* transform: translateY(-50%); */
	}
	&::after {
		position: absolute;
		top: 10px;
		right: -8.5px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 0px 10px 10px;
		border-color: transparent transparent transparent #fff;
		content: '';
		/* transform: translateY(-50%); */
	}
`;

export const Container = styled.div`
	display: flex;
	justify-content: space-between;
`;
export const ButtonGroup = styled.div`
	display: inline-block;
	position: relative;
`;

function TableControl({ columns = [], selectColumn, resetColumn, addNew }) {
	const [showColumn, setShowColumn] = useState(false);

	const helpShowColumn = () => {
		setShowColumn(!showColumn);
	};
	if (typeof selectColumn !== 'function' && typeof addNew !== 'function') return;
	return (
		<Container>
			{typeof addNew === 'function' ? (
				<Button onClick={() => addNew()}>
					<PlusOutlined />
				</Button>
			) : (
				<div></div>
			)}
			<div>
				{typeof selectColumn === 'function' && (
					<ButtonGroup>
						<Button onClick={helpShowColumn}>
							<BorderlessTableOutlined />
						</Button>
						{showColumn && (
							<Fragment>
								<ColumnsBox onClick={(e) => e.stopPropagation()}>
									<Checkbox.Group
										value={columns
											.filter((col) => !col.hidden)
											.map((col) => col.key)}
										options={columns.map(({ key, title }) => ({
											label: title,
											value: key,
										}))}
										onChange={(value) => selectColumn(value)}
									/>
									<Button onClick={() => resetColumn()}>還原</Button>
								</ColumnsBox>
							</Fragment>
						)}
					</ButtonGroup>
				)}
			</div>
			{showColumn && <OverlayStyled onClick={helpShowColumn} />}
		</Container>
	);
}

export default TableControl;
