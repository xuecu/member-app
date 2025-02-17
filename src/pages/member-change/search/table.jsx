import React, { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';
import {
	TableContainer,
	TableTitle,
	OrderCard,
	OrderHeader,
	OrderBody,
	TableHead,
	TableRow,
	Col,
	ChevronIcon,
	EmptyMessage,
} from './table.styled';

const formatTime = (time) => (time ? dayjs(time).format('YYYY-MM-DD') : 'N/A');

const sortProducts = (products) => {
	if (!Array.isArray(products)) return [];

	const projectPlans = products.filter(
		(p) => p.product_id && p.product_id.startsWith('ProjectPlan')
	);
	const programPackages = products.filter(
		(p) => p.product_id && p.product_id.startsWith('ProgramPackagePlan')
	);
	const others = products.filter(
		(p) =>
			p.product_id &&
			!p.product_id.startsWith('ProjectPlan') &&
			!p.product_id.startsWith('ProgramPackagePlan')
	);

	// 按 `started_at` 進行時間排序
	const sortByTime = (a, b) => {
		const timeA = a.started_at ? new Date(a.started_at).getTime() : 0;
		const timeB = b.started_at ? new Date(b.started_at).getTime() : 0;
		return timeA - timeB;
	};

	return [
		...projectPlans.sort(sortByTime),
		...programPackages.sort(sortByTime),
		...others.sort(sortByTime),
	];
};

const sortDataBycreatAt = (data) => {
	return data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};

const RenderTable = ({ type, data, collapsedItems, toggleCollapse }) => {
	return (
		<Fragment>
			{data.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(data).map((item) => {
					const key = item.id;
					const createdAt = item.created_at;
					let orderProducts;
					if ('values' in item && item.values && 'orderProducts' in item.values)
						orderProducts = item.values.orderProducts;
					else if ('order_products' in item) orderProducts = item.order_products;
					else orderProducts = [];

					return (
						<OrderCard key={key}>
							<OrderHeader onClick={() => toggleCollapse(key)}>
								<span>訂單編號：{key}</span>
								<span>時間：{formatTime(createdAt)}</span>
								<ChevronIcon $collapse={collapsedItems[key]}>▼</ChevronIcon>
							</OrderHeader>
							<OrderBody $collapse={collapsedItems[key]}>
								<TableHead>
									<Col>產品名稱</Col>
									<Col>開始時間</Col>
									<Col>結束時間</Col>
								</TableHead>
								{sortProducts(orderProducts).map((product, index) => (
									<TableRow
										key={product.id}
										$index={index}
									>
										<Col>{product.name}</Col>
										<Col>{formatTime(product.started_at)}</Col>
										<Col>{formatTime(product.ended_at)}</Col>
									</TableRow>
								))}
							</OrderBody>
						</OrderCard>
					);
				})
			)}
		</Fragment>
	);
};

function Table({ title, type, data }) {
	const [collapsedItems, setCollapsedItems] = useState({});

	useEffect(() => {
		if (data && Array.isArray(data)) {
			const initialCollapsedState = {};
			data.forEach((item) => {
				const key = item.id;
				initialCollapsedState[key] = true; // 預設為收起
			});
			setCollapsedItems(initialCollapsedState);
		}
	}, [data]);

	const toggleCollapse = (key) => {
		setCollapsedItems((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<TableContainer>
			<TableTitle>{title}面板</TableTitle>
			<RenderTable
				type={type}
				data={data}
				collapsedItems={collapsedItems}
				toggleCollapse={toggleCollapse}
			/>
		</TableContainer>
	);
}

export default Table;
