import React, { useState, useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import SafeFetch from '../../../utils/safe-fetch.utils';
import SendRequest from '../../../utils/auth-service.utils';
import Loading from '../../../components/loading';
import {
	TableContainer,
	TableTitle,
	OrderCard,
	OrderHeader,
	OrderBody,
	TableRow,
	TableHead,
	Col,
	ChevronIcon,
	EmptyMessage,
} from './table.styled';
dayjs.extend(utc);
const formatTime = (time) => (time ? dayjs(time).format('YYYY-MM-DD') : 'N/A');
const formatDayjs = (time) => {
	return dayjs
		.utc(time) // 轉成 UTC
		.add(1, 'day') // 加 1 天
		.subtract(1, 'second') // 減少 1 秒
		.format('YYYY-MM-DDTHH:mm:ss+00:00'); // 格式化為 UTC 標準時間
};

const getOrderInfo = (order) => {
	if (!order) return { orderCreateAt: 'N/A', orderState: 'N/A', orderProducts: [] };

	let orderProducts = order.order_products;

	if (orderProducts.length === 0) return [];
	return {
		orderProducts: orderProducts,
		orderCreateAt: order.created_at,
		orderState: order.status,
	};
};
const sortDataBycreatAt = (data) => {
	return data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};

const OrderProductInfo = ({ collapsedItems, orderProducts, orderKey, data, formField }) => {
	const [productStartAt, setProductStartAt] = useState({});
	const [unifiedStartedAt, setUnifiedStartedAt] = useState(dayjs());
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (orderProducts && Array.isArray(orderProducts)) {
			const initialProductStartAt = {};
			orderProducts.forEach((item) => {
				const key = item.id;
				initialProductStartAt[key] = dayjs(item.ended_at);
			});
			setProductStartAt(initialProductStartAt);
		}
	}, [data, orderProducts]);

	const handlerStartAt = (date, productId) => {
		setProductStartAt((prev) => ({
			...prev,
			[productId]: date
				? dayjs(date)
				: orderProducts.find((product) => product.id === productId).ended_at,
		}));
	};
	const handlerUnifiedStartedAt = (date) => {
		setUnifiedStartedAt(date ? dayjs(date) : dayjs());
	};
	const handleReset = () => {
		const initialProductStartAt = {};
		orderProducts.forEach((item) => {
			const key = item.id;
			initialProductStartAt[key] = dayjs(item.ended_at); // 預設為收起
		});
		setProductStartAt(initialProductStartAt);
	};
	const handlerUnified = () => {
		const initialProductStartAt = {};
		orderProducts.forEach((item) => {
			const key = item.id;
			initialProductStartAt[key] = dayjs(unifiedStartedAt); // 預設為收起
		});
		setProductStartAt(initialProductStartAt);
	};
	const sendAdjustOrder = async () => {
		setLoading(true);
		const filterOrderProducts = orderProducts.filter(
			(product) => !dayjs(product.ended_at).isSame(dayjs(productStartAt[product.id]))
		);
		const NewOrderProducts = filterOrderProducts.map((product) => ({
			...product,
			ended_at: `${formatDayjs(productStartAt[product.id])}`,
		}));
		const batches = [];
		const BATCH_SIZE = 10; // 每批次 10 筆

		if (NewOrderProducts.length > 10) {
			for (let i = 0; i < NewOrderProducts.length; i += BATCH_SIZE) {
				batches.push(NewOrderProducts.slice(i, i + BATCH_SIZE));
			}
		} else {
			batches.push(NewOrderProducts);
		}

		const sendAllBatches = async () => {
			setLoading(true);
			for (const batch of batches) {
				await sendBatch(batch); // 等待每批完成後再發送下一批
			}
			setLoading(false);
		};
		const sendBatch = async (batch) => {
			const newFeed = {
				do: 'adjust-order-change',
				brand: formField.brand,
				mail: formField.email,
				variables: JSON.stringify(batch),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
			};

			try {
				const result = await SafeFetch(
					() => SendRequest(newFeed),
					'adjust-order-change failed'
				);
				if (!result.success) throw new Error('變更失敗');
			} catch (error) {
				console.error('訂單變更失敗:', error);
			}
		};

		await sendAllBatches();
		setLoading(false);
	};

	return (
		<OrderBody $collapse={collapsedItems[orderKey]}>
			<TableHead>
				<Col>產品名稱</Col>
				<Col>開始時間</Col>
				<Col>結束時間</Col>
			</TableHead>
			{sortDataBycreatAt(orderProducts).map((product, index) => (
				<TableRow
					key={product.id}
					$index={index}
				>
					<Col>{product.name}</Col>
					<Col>{formatTime(product.started_at)}</Col>
					<Col>
						<DatePicker
							value={dayjs(productStartAt[product.id])}
							onChange={(date) => handlerStartAt(date, product.id)}
							format="YYYY-MM-DD"
						/>
					</Col>
				</TableRow>
			))}
			<TableRow style={{ justifyContent: 'end', gap: '10px', backgroundColor: '#d8d8d8' }}>
				<Button onClick={handleReset}>{loading ? <Loading /> : '還原日期'}</Button>
				<DatePicker
					value={unifiedStartedAt}
					onChange={(date) => handlerUnifiedStartedAt(date)}
					format="YYYY-MM-DD"
				/>
				<Button onClick={handlerUnified}>{loading ? <Loading /> : '同步日期'}</Button>
				<Button
					type="primary"
					onClick={sendAdjustOrder}
				>
					{loading ? <Loading /> : '送出'}
				</Button>
			</TableRow>
		</OrderBody>
	);
};

const RenderTable = ({ formField, data, collapsedItems, toggleCollapse }) => {
	const { order_log = [] } = data;

	return (
		<TableContainer>
			{order_log.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(order_log).map((order) => {
					const orderKey = order.id;
					const { orderCreateAt, orderState, orderProducts } = getOrderInfo(order);
					const createAt = formatTime(orderCreateAt);
					return (
						<OrderCard key={orderKey}>
							<OrderHeader onClick={() => toggleCollapse(orderKey)}>
								<span>訂單編號：{orderKey}</span>
								<span>建立時間：{createAt}</span>
								<span>訂單狀態：{orderState}</span>
								<ChevronIcon $collapse={collapsedItems[orderKey]}>▼</ChevronIcon>
							</OrderHeader>
							<OrderProductInfo
								collapsedItems={collapsedItems}
								orderProducts={orderProducts}
								orderKey={orderKey}
								data={data}
								formField={formField}
							/>
						</OrderCard>
					);
				})
			)}
		</TableContainer>
	);
};

function Table({ formField, title, type, data, setData }) {
	const [collapsedItems, setCollapsedItems] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			const initialCollapsedState = {};
			data.forEach((item) => {
				const key = item.id;
				initialCollapsedState[key] = false; // 預設為收起
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
	const handleRestData = async () => {
		setLoading(true);
		try {
			const result = await SafeFetch(
				() =>
					SendRequest({
						do: 'search',
						category: 'adjust-order',
						mail: formField.email,
						brand: formField.brand,
						staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
					}),
				'Leave failed'
			);
			if (!result.success) throw new Error('查詢失敗');
			setData(result.data);
			setLoading(false);
		} catch (error) {
			console.error('請假變更失敗:', error);
		}
	};
	return (
		<TableContainer>
			<TableTitle>
				{title}面板{' '}
				<Button onClick={handleRestData}>{loading ? <Loading /> : '重新整理'}</Button>
			</TableTitle>
			<RenderTable
				formField={formField}
				data={data}
				collapsedItems={collapsedItems}
				toggleCollapse={toggleCollapse}
			/>
		</TableContainer>
	);
}

export default Table;
