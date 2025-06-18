import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const ListWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	position: relative;
`;

const Item = styled.div`
	display: flex;
	align-items: center;
	padding: 10px 15px;
	gap: 5px;
	cursor: grab;
	&:active {
		border: 1px solid #ccc;
		border-radius: 6px;
		background: #f5f5f5;
	}
`;

const Order = styled.div`
	padding: 5px;
`;

const DragIndicator = styled.div`
	height: 8px;
	background: #007bff55;
	margin: -4px 0;
	border-radius: 4px;
`;

function DragList({ data = [], onSort = () => {}, renderItem }) {
	const [items, setItems] = useState([]);
	const [draggingId, setDraggingId] = useState(null);
	const [hoverIndex, setHoverIndex] = useState(null);

	useEffect(() => {
		setItems([...data].sort((a, b) => a.order - b.order));
	}, [data]);

	const handleDragStart = (id) => {
		setDraggingId(id);
	};

	const handleDragOver = (e, overId) => {
		e.preventDefault();
		const overIndex = items.findIndex((i) => i.id === overId);
		setHoverIndex(overIndex);
	};

	const handleDrop = (e) => {
		if (draggingId == null || hoverIndex == null) return;

		const currentIndex = items.findIndex((i) => i.id === draggingId);
		const reordered = [...items];
		const [moved] = reordered.splice(currentIndex, 1);
		reordered.splice(hoverIndex, 0, moved);

		const updated = reordered.map((item, index) => ({
			...item,
			order: index + 1,
		}));

		setItems(updated);
		setDraggingId(null);
		setHoverIndex(null);
		onSort(updated);
	};

	return (
		<ListWrapper
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
		>
			{items.map((item, index) => (
				<React.Fragment key={item.id}>
					{hoverIndex === index && <DragIndicator />}
					<Item
						draggable
						onDragStart={() => handleDragStart(item.id)}
						onDragOver={(e) => handleDragOver(e, item.id)}
					>
						<Order>{item.order}</Order>
						{renderItem(item)}
					</Item>
				</React.Fragment>
			))}
			{/* 拖到最後一個下方的提示線 */}
			{hoverIndex === items.length && <DragIndicator />}
		</ListWrapper>
	);
}

export default DragList;
