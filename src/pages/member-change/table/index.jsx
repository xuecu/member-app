import React, { useState, useEffect, Fragment, useContext } from 'react';
import { MemberChangeMenuContext } from '@contexts/member-change-menu.contexts';

import { DatePicker, Input, Button } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import SafeFetch from '@utils/safe-fetch.utils';
import SendRequest from '@utils/auth-service.utils';
import UID from '@utils/uid.utils';
import { Loading } from '@components/loading';
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
	LoadingMessage,
} from './styled';
dayjs.extend(utc);
const formatTime = (time) => (time ? dayjs(time).format('YYYY-MM-DD') : 'N/A');
const formatDayjs = (time) => {
	return dayjs
		.utc(time) // 轉成 UTC
		.add(1, 'day') // 加 1 天
		.subtract(1, 'second') // 減少 1 秒
		.format('YYYY-MM-DDTHH:mm:ss+00:00'); // 格式化為 UTC 標準時間
};
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
const getContractInfo = (contract) => {
	if (!contract || !contract.contract)
		return { contractName: '未知', serverStartAt: 'N/A', serverEndAt: 'N/A' };

	let orderProducts;
	if ('values' in contract && contract.values && 'orderProducts' in contract.values)
		orderProducts = contract.values.orderProducts;
	else orderProducts = [];

	if (orderProducts.length === 0) return [];

	const filterProjectPlans = orderProducts.filter((p) => p.product_id.startsWith('ProjectPlan'));
	if (filterProjectPlans.length === 0)
		return {
			contractName: contract.contract.name,
			contractStartAt: contract.started_at,
			contractAgreedAt: contract.agreed_at,
			serverEndAt: 'N/A',
		};
	// 按 `ended_at` 進行時間排序
	const sortedPlans = filterProjectPlans.sort(
		(a, b) => new Date(a.ended_at) - new Date(b.ended_at)
	);
	return {
		contractName: contract.contract.name,
		contractStartAt: contract.started_at,
		serverEndAt: sortedPlans[0].ended_at,
		contractAgreedAt: contract.agreed_at,
	};
};
const getOrderInfo = (order) => {
	if (!order) return { orderCreateAt: 'N/A', orderState: 'N/A', orderProducts: [] };

	let orderProducts = order.order_products;

	return {
		orderProducts: orderProducts.length === 0 ? [] : orderProducts,
		orderCreateAt: order.created_at,
		orderState: order.status,
	};
};

const comfirmStatus = (data) => {
	if (data.hasOwnProperty('revoked_at') && data.revoked_at !== null) {
		return false;
	}
	if (data.hasOwnProperty('status') && data.status !== 'SUCCESS') {
		return false;
	}
	return true;
};

const RenderTable = ({ data, collapsedItems, toggleCollapse }) => {
	return (
		<Fragment>
			{data.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(data).map((item) => {
					const key = item.id;
					const createdAt = item.created_at;
					let orderProducts;
					if (
						item.hasOwnProperty('values') &&
						item.values.hasOwnProperty('orderProducts')
					)
						orderProducts = item.values.orderProducts;
					else if (item.hasOwnProperty('order_products'))
						orderProducts = item.order_products;
					else orderProducts = [];

					return (
						<OrderCard key={key}>
							<OrderHeader
								onClick={() => toggleCollapse(key)}
								$background={comfirmStatus(item)}
							>
								<span>訂單編號：{key}</span>
								<span>時間：{formatTime(createdAt)}</span>
								<ChevronIcon $collapse={collapsedItems[key]}>▼</ChevronIcon>
							</OrderHeader>
							<OrderBody $collapse={collapsedItems[key]}>
								<TableHead $background={comfirmStatus(item)}>
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

const LeaveInfo = ({
	type,
	contractKey,
	origionData,
	data = {},
	brand,
	isNew,
	setData,
	loading,
	setLoading,
	setMessage,
}) => {
	const [value, setValue] = useState({
		startedAt: dayjs(data.started_at) || dayjs(),
		endedAt: dayjs(data.ended_at) || dayjs(),
		reason: data.reason || '',
	});

	const handleChange = (name, newValue) => {
		setValue((prev) => ({
			...prev,
			[name]: newValue,
		}));
	};

	const sendLeave = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');

		if (!value.startedAt || !value.endedAt || !value.reason.trim()) return;
		setLoading(true);
		setMessage({ reset: true });
		const contract = origionData.contracts.find((contract) => contract.id === contractKey);
		const sendLeaveData = {
			id: isNew ? `${UID()}` : data.id,
			member_id: isNew ? contract.member.id : data.member_id,
			name: isNew ? contract.member.name : data.name,
			contract_id: contractKey,
			category: type,
			started_at: dayjs(value.startedAt).format('YYYY-MM-DD'),
			ended_at: dayjs(value.endedAt).format('YYYY-MM-DD'),
			reason: value.reason,
			record_at: new Date().toISOString(),
			create_by: isNew ? JSON.parse(localStorage.getItem('memberApp')).mail : data.create_by,
			days: null,
			state: isNew ? null : data.state,
		};
		try {
			// 紀錄請假
			setMessage();
			let leaveQuest = {
				do: 'memberChangePost',
				what: 'setLeave',
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const setLeaveResult = await SafeFetch(() => SendRequest(leaveQuest), 'Leave failed');
			if (setLeaveResult.success) setMessage({ content: setLeaveResult.message });
			// 更動 CRM
			let changeCRMQuest = {
				do: 'memberChangePost',
				what: 'updateCRM',
				brand: brand,
				contract_id: contract.id,
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const updateCRMResult = await SafeFetch(
				() => SendRequest(changeCRMQuest),
				'Leave failed'
			);
			if (updateCRMResult.success) setMessage({ content: updateCRMResult.message });
			// 紀錄 CRM
			let RecordCRMQuest = {
				do: 'memberChangePost',
				what: 'recordCRM',
				brand: brand,
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				isNew: isNew,
			};
			const RecordCRMResult = await SafeFetch(
				() => SendRequest(RecordCRMQuest),
				'Leave failed'
			);
			if (RecordCRMResult.success) setMessage({ content: RecordCRMResult.message });

			// 重讀資料
			const getData = {
				do: 'memberChangePost',
				what: 'resetData',
				category: type,
				mail: contract.member.email,
				brand: brand,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};

			const getDataResult = await SafeFetch(() => SendRequest(getData), 'search not found');

			if (getDataResult.success) {
				setMessage({ content: getDataResult.message });
				setData(getDataResult.data);
			}
			setMessage({ success: true });
		} catch (error) {
			console.error('請假變更失敗:', error);
		} finally {
			setLoading(false);
		}
	};

	const changeLeaveState = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');
		const contract = origionData.contracts.find((contract) => contract.id === contractKey);
		const checkState = (state) => {
			if (state === 'SUCCESS') return 'DELETED';
			if (state === 'DELETED') return 'SUCCESS';
		};
		setLoading(true);
		const targetLeave = data;
		const sendLeaveData = { ...targetLeave, state: checkState(targetLeave.state) };

		setMessage({ reset: true });

		try {
			// 紀錄請假
			setMessage();
			let leaveQuest = {
				do: 'memberChangePost',
				what: 'changeState',
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const setLeaveResult = await SafeFetch(() => SendRequest(leaveQuest), 'Leave failed');
			if (setLeaveResult.success) setMessage({ content: setLeaveResult.message });
			// 更動 CRM
			let changeCRMQuest = {
				do: 'memberChangePost',
				what: 'updateCRM',
				brand: brand,
				contract_id: contract.id,
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const updateCRMResult = await SafeFetch(
				() => SendRequest(changeCRMQuest),
				'Leave failed'
			);
			if (updateCRMResult.success) setMessage({ content: updateCRMResult.message });
			// 紀錄 CRM
			let RecordCRMQuest = {
				do: 'memberChangePost',
				what: 'recordCRM',
				brand: brand,
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				isNew: isNew,
			};
			const RecordCRMResult = await SafeFetch(
				() => SendRequest(RecordCRMQuest),
				'Leave failed'
			);
			if (RecordCRMResult.success) setMessage({ content: RecordCRMResult.message });

			// 重讀資料
			const getData = {
				do: 'memberChangePost',
				what: 'resetData',
				category: type,
				mail: contract.member.email,
				brand: brand,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};

			const getDataResult = await SafeFetch(() => SendRequest(getData), 'search not found');

			if (getDataResult.success) {
				setMessage({ content: getDataResult.message });
				setData(getDataResult.data);
			}
			setMessage({ success: true });
		} catch (error) {
			console.error('請假變更失敗:', error);
		} finally {
			setLoading(false);
		}
	};

	const HelpLoading = ({ loading, text }) => {
		return loading ? <Loading /> : text;
	};

	const HandlerDiable = (data) => {
		if (!data.state) return false;
		if (data.state === 'DELETED') return true;
		if (data.state === 'SUCCESS') return false;
	};
	const diffDays = value.endedAt.diff(value.startedAt, 'day');
	return (
		<TableRow>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '起始日期'}
				<DatePicker
					allowClear={false}
					value={value.startedAt}
					onChange={(date) => handleChange('startedAt', date)}
					format="YYYY-MM-DD"
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '結束日期'}

				<DatePicker
					allowClear={false}
					value={value.endedAt}
					onChange={(date) => handleChange('endedAt', date)}
					format="YYYY-MM-DD"
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '事由'}
				<Input
					name="reason"
					value={value.reason}
					onChange={(e) => handleChange('reason', e.target.value)}
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={
					isNew
						? {
								alignItems: 'end',
								display: 'flex',
								gap: '5px',
								justifyContent: 'center',
								flex: '0.5',
						  }
						: {
								alignItems: 'center',
								display: 'flex',
								gap: '5px',
								justifyContent: 'center',
								flex: '0.5',
						  }
				}
			>
				<span>{diffDays + 1}</span>天
			</Col>
			<Col
				style={{ alignSelf: 'end', display: 'flex', gap: '5px', justifyContent: 'center' }}
			>
				<Button
					type="primary"
					onClick={sendLeave}
					disabled={HandlerDiable(data)}
				>
					{isNew ? (
						<HelpLoading
							loading={loading}
							text="送出"
						/>
					) : (
						<HelpLoading
							loading={loading}
							text="修改"
						/>
					)}
				</Button>
				{!isNew && (
					<Button onClick={changeLeaveState}>
						{HandlerDiable(data) ? (
							<HelpLoading
								loading={loading}
								text="恢復"
							/>
						) : (
							<HelpLoading
								loading={loading}
								text="刪除"
							/>
						)}
					</Button>
				)}
			</Col>
		</TableRow>
	);
};

const ExtensionInfo = ({
	type,
	contractKey,
	origionData,
	data = {},
	brand,
	isNew,
	setData,
	loading,
	setLoading,
	setMessage,
}) => {
	const [value, setValue] = useState({
		num: data.days || 1,
		reason: data.reason || '',
	});

	const handleChange = (name, newValue) => {
		setValue((prev) => ({
			...prev,
			[name]: newValue,
		}));
	};

	const sendLeave = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');

		if (!value.num || !value.reason.trim()) return;
		setLoading(true);
		setMessage({ reset: true });
		const contract = origionData.contracts.find((contract) => contract.id === contractKey);
		const sendLeaveData = {
			id: isNew ? `${UID()}` : data.id,
			member_id: isNew ? contract.member.id : data.member_id,
			name: isNew ? contract.member.name : data.name,
			contract_id: contractKey,
			category: type,
			reason: value.reason,
			record_at: new Date().toISOString(),
			create_by: isNew ? JSON.parse(localStorage.getItem('memberApp')).mail : data.create_by,
			days: value.num,
			state: isNew ? null : data.state,
		};
		console.log('sendLeaveData', sendLeaveData);
		try {
			// 紀錄請假
			setMessage();
			let leaveQuest = {
				do: 'memberChangePost',
				what: 'setLeave',
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const setLeaveResult = await SafeFetch(
				() => SendRequest(leaveQuest),
				'Extension failed'
			);
			if (setLeaveResult.success) setMessage({ content: setLeaveResult.message });
			// 更動 CRM
			let changeCRMQuest = {
				do: 'memberChangePost',
				what: 'updateCRM',
				brand: brand,
				contract_id: contract.id,
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const updateCRMResult = await SafeFetch(
				() => SendRequest(changeCRMQuest),
				'Extension failed'
			);
			if (updateCRMResult.success) setMessage({ content: updateCRMResult.message });
			// 紀錄 CRM
			let RecordCRMQuest = {
				do: 'memberChangePost',
				what: 'recordCRM',
				brand: brand,
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				isNew: isNew,
			};
			const RecordCRMResult = await SafeFetch(
				() => SendRequest(RecordCRMQuest),
				'Extension failed'
			);
			if (RecordCRMResult.success) setMessage({ content: RecordCRMResult.message });

			// 重讀資料
			const getData = {
				do: 'memberChangePost',
				what: 'resetData',
				category: type,
				mail: contract.member.email,
				brand: brand,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};

			const getDataResult = await SafeFetch(() => SendRequest(getData), 'search not found');

			if (getDataResult.success) {
				setMessage({ content: getDataResult.message });
				setData(getDataResult.data);
			}
			setMessage({ success: true });
		} catch (error) {
			console.error('展延變更失敗:', error);
		} finally {
			setLoading(false);
		}
	};

	const changeLeaveState = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');
		const contract = origionData.contracts.find((contract) => contract.id === contractKey);
		const checkState = (state) => {
			if (state === 'SUCCESS') return 'DELETED';
			if (state === 'DELETED') return 'SUCCESS';
		};
		setLoading(true);
		const targetLeave = data;
		const sendLeaveData = { ...targetLeave, state: checkState(targetLeave.state) };

		setMessage({ reset: true });

		try {
			// 紀錄請假
			setMessage();
			let leaveQuest = {
				do: 'memberChangePost',
				what: 'changeState',
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const setLeaveResult = await SafeFetch(() => SendRequest(leaveQuest), 'Leave failed');
			if (setLeaveResult.success) setMessage({ content: setLeaveResult.message });
			// 更動 CRM
			let changeCRMQuest = {
				do: 'memberChangePost',
				what: 'updateCRM',
				brand: brand,
				contract_id: contract.id,
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const updateCRMResult = await SafeFetch(
				() => SendRequest(changeCRMQuest),
				'Leave failed'
			);
			if (updateCRMResult.success) setMessage({ content: updateCRMResult.message });
			// 紀錄 CRM
			let RecordCRMQuest = {
				do: 'memberChangePost',
				what: 'recordCRM',
				brand: brand,
				variables: JSON.stringify(sendLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				isNew: isNew,
			};
			const RecordCRMResult = await SafeFetch(
				() => SendRequest(RecordCRMQuest),
				'Leave failed'
			);
			if (RecordCRMResult.success) setMessage({ content: RecordCRMResult.message });

			// 重讀資料
			const getData = {
				do: 'memberChangePost',
				what: 'resetData',
				category: type,
				mail: contract.member.email,
				brand: brand,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};

			const getDataResult = await SafeFetch(() => SendRequest(getData), 'search not found');

			if (getDataResult.success) {
				setMessage({ content: getDataResult.message });
				setData(getDataResult.data);
			}
			setMessage({ success: true });
		} catch (error) {
			console.error('請假變更失敗:', error);
		} finally {
			setLoading(false);
		}
	};

	const HelpLoading = ({ loading, text }) => {
		return loading ? <Loading /> : text;
	};

	const HandlerDiable = (data) => {
		if (!data.state) return false;
		if (data.state === 'DELETED') return true;
		if (data.state === 'SUCCESS') return false;
	};

	return (
		<TableRow>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '展延天數'}
				<Input
					name="reason"
					type="number"
					value={value.num}
					min={1}
					onChange={(e) => handleChange('num', e.target.value)}
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '事由'}

				<Input
					name="reason"
					value={value.reason}
					onChange={(e) => handleChange('reason', e.target.value)}
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={{ alignSelf: 'end', display: 'flex', gap: '5px', justifyContent: 'center' }}
			>
				<Button
					type="primary"
					onClick={sendLeave}
					disabled={HandlerDiable(data)}
				>
					{isNew ? (
						<HelpLoading
							loading={loading}
							text="送出"
						/>
					) : (
						<HelpLoading
							loading={loading}
							text="修改"
						/>
					)}
				</Button>
				{!isNew && (
					<Button onClick={changeLeaveState}>
						{HandlerDiable(data) ? (
							<HelpLoading
								loading={loading}
								text="恢復"
							/>
						) : (
							<HelpLoading
								loading={loading}
								text="刪除"
							/>
						)}
					</Button>
				)}
			</Col>
		</TableRow>
	);
};

const LeaveRenderTable = ({ type, brand, data, setData, collapsedItems, toggleCollapse }) => {
	const { contracts = [] } = data;
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState([]);

	const helpMessage = (params = {}) => {
		const { reset = false, content = '', success = false } = params;
		if (reset) {
			setMessage([]);
			return;
		}
		if (success) {
			setMessage((prev) => {
				// 移除最後的 'ing處理中'（如果有）
				const filtered = prev.filter((msg) => msg !== 'ing處理中');
				return [...filtered, '✅ 執行完成'];
			});
			return;
		}
		if (content.trim() === '') {
			// 僅當 "處理中" 不存在時才加
			setMessage((prev) => {
				if (prev.includes('ing處理中')) return prev;
				return [...prev, 'ing處理中'];
			});
		} else {
			setMessage((prev) => {
				// 移除最後的 'ing處理中'（如果有）
				const filtered = prev.filter((msg) => msg !== 'ing處理中');
				return [...filtered, content, 'ing處理中'];
			});
		}
	};
	useEffect(() => {
		helpMessage({ reset: true });
	}, [data]);
	return (
		<TableContainer>
			{contracts.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(contracts).map((contract) => {
					const contractKey = contract.id;
					const {
						contractName = '未知',
						contractStartAt = 'N/A',
						contractAgreedAt = 'N/A',
						serverEndAt = 'N/A',
					} = getContractInfo(contract);
					const agreed_at = formatTime(contractAgreedAt);
					const itemData = (contract.leave_log || []).filter(
						(item) => item.category === type
					);
					const panel = [
						{ value: 'leave', page: LeaveInfo },
						{ value: 'extension', page: ExtensionInfo },
					];

					const SelectedPanel = panel.find((e) => e.value === type).page;

					return (
						<OrderCard key={contractKey}>
							<OrderHeader
								onClick={() => toggleCollapse(contractKey)}
								$background={comfirmStatus(contract)}
							>
								<span>合約編號：{contractKey}</span>
								<span>建立時間：{agreed_at}</span>
								<ChevronIcon $collapse={collapsedItems[contractKey]}>▼</ChevronIcon>
							</OrderHeader>
							<OrderBody $collapse={collapsedItems[contractKey]}>
								{itemData.length === 0 ? (
									<EmptyMessage>沒有相關數據</EmptyMessage>
								) : (
									itemData.map((item) => (
										<SelectedPanel
											key={item.id}
											data={item}
											type={type}
											contractKey={contractKey}
											origionData={data}
											brand={brand}
											isNew={false}
											setData={setData}
											loading={loading}
											setLoading={setLoading}
											setMessage={helpMessage}
										/>
									))
								)}
								<hr />
								{comfirmStatus(contract) && (
									<Fragment>
										<SelectedPanel
											type={type}
											contractKey={contractKey}
											origionData={data}
											isNew={true}
											brand={brand}
											setData={setData}
											loading={loading}
											setLoading={setLoading}
											setMessage={helpMessage}
										/>
										<hr />
									</Fragment>
								)}

								<TableRow>
									<Col>{contractName}</Col>
									<Col>{formatTime(contractStartAt)}</Col>
									<Col>{formatTime(serverEndAt)}</Col>
								</TableRow>
								{message.length > 0 && (
									<LoadingMessage>
										{message.map((msg, i) => (
											<LoadingMessage key={i}>{msg}</LoadingMessage>
										))}
									</LoadingMessage>
								)}
							</OrderBody>
						</OrderCard>
					);
				})
			)}
		</TableContainer>
	);
};

const OrderProductInfo = ({ collapsedItems, orderProducts, data, formFields }) => {
	const [productStartAt, setProductStartAt] = useState({});
	const [unifiedStartedAt, setUnifiedStartedAt] = useState(dayjs());
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState([]);

	useEffect(() => {
		if (orderProducts && Array.isArray(orderProducts)) {
			const initialProductStartAt = {};
			orderProducts.forEach((item) => {
				const key = item.id;
				initialProductStartAt[key] = dayjs(item.ended_at);
			});
			setProductStartAt(initialProductStartAt);
		}
		helpMessage({ reset: true });
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
		helpMessage({ reset: true });
		if (loading) return;
		setLoading(true);
		const filterOrderProducts = orderProducts.filter(
			(product) => !dayjs(product.ended_at).isSame(dayjs(productStartAt[product.id]), 'day')
		);
		console.log('filterOrderProducts : ', filterOrderProducts);
		if (filterOrderProducts.length === 0) {
			setLoading(false);
			helpMessage({ error: true, content: '無訂單需要處理，若已修改過請重整畫面' });
			return;
		}
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

		try {
			const sendBatch = async (batch) => {
				const newFeed = {
					do: 'memberChangePost',
					what: 'changeOrder',
					brand: formFields.brand,
					mail: formFields.email,
					variables: JSON.stringify(batch),
					staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				};
				const result = await SafeFetch(
					() => SendRequest(newFeed),
					'adjust-order-change failed'
				);
				if (!result.success) throw new Error(`${result.message}`);
				return result;
			};
			const sendAllBatches = async () => {
				for (let i = 0; i < batches.length; i++) {
					helpMessage({ content: `正在 ${i + 1} / ${batches.length} 批處理` });
					const batch = batches[i];
					const result = await sendBatch(batch);
					if (result.success) {
						helpMessage({ content: `✅ 已完成第 ${i + 1} / ${batches.length} 批處理` });
					}
				}
			};
			await sendAllBatches();
		} catch (error) {
			console.log(error);
			helpMessage({ error: true, content: `${JSON.stringify(error)}` });
			console.error('訂單變更失敗:', error);
		} finally {
			helpMessage({ success: true });
			setLoading(false);
		}
	};
	const helpMessage = (params = {}) => {
		const { reset = false, content = '', success = false, error = false } = params;
		if (reset) {
			setMessage([]);
			return;
		}
		if (success) {
			setMessage((prev) => {
				// 移除最後的 'ing處理中'（如果有）
				const filtered = prev.filter((msg) => msg !== 'ing處理中');
				return [...filtered, '✅ 執行完成'];
			});
			return;
		}
		if (error) {
			setMessage(() => {
				return [content];
			});
			return;
		}
		setMessage(() => {
			return [content, 'ing處理中'];
		});
	};
	return (
		<Fragment>
			{sortDataBycreatAt(orderProducts).map((product, index) => (
				<TableRow
					key={product.id}
					$index={index}
				>
					<Col>{product.name}</Col>
					<Col>{formatTime(product.started_at)}</Col>
					<Col>
						<DatePicker
							allowClear={false}
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
					allowClear={false}
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
			{message.length > 0 && (
				<LoadingMessage>
					{message.map((msg, i) => (
						<LoadingMessage key={i}>{msg}</LoadingMessage>
					))}
				</LoadingMessage>
			)}
		</Fragment>
	);
};

const AdjustOrderRenderTable = ({ formFields, data, setData, collapsedItems, toggleCollapse }) => {
	return (
		<TableContainer>
			{data.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(data).map((item) => {
					const key = item.id;
					const { orderCreateAt, orderProducts } = getOrderInfo(item);
					const createAt = formatTime(orderCreateAt);
					return (
						<OrderCard key={key}>
							<OrderHeader
								onClick={() => toggleCollapse(key)}
								$background={comfirmStatus(item)}
							>
								<span>訂單編號：{key}</span>
								<span>建立時間：{createAt}</span>
								<ChevronIcon $collapse={collapsedItems[key]}>▼</ChevronIcon>
							</OrderHeader>
							{orderProducts.length === 0 ? (
								<OrderBody $collapse={collapsedItems[key]}>無訂單資料</OrderBody>
							) : (
								<OrderBody $collapse={collapsedItems[key]}>
									<TableHead $background={comfirmStatus(item)}>
										<Col>產品名稱</Col>
										<Col>開始時間</Col>
										<Col>結束時間</Col>
									</TableHead>
									<OrderProductInfo
										collapsedItems={collapsedItems}
										orderProducts={orderProducts}
										data={data}
										formFields={formFields}
									/>
								</OrderBody>
							)}
						</OrderCard>
					);
				})
			)}
		</TableContainer>
	);
};

const AdjustCouponInfo = ({ collapsedItems, item, data, setData, formFields }) => {
	const [productTimeAt, setProductTimeAt] = useState({});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState([]);

	useEffect(() => {
		if (item && item.hasOwnProperty('started_at') && item.hasOwnProperty('ended_at')) {
			const initialProductTimeAt = {};
			initialProductTimeAt['started_at'] = dayjs(item.started_at);
			initialProductTimeAt['ended_at'] = dayjs(item.ended_at);
			setProductTimeAt(initialProductTimeAt);
		}
		helpMessage({ reset: true });
	}, [data, item]);
	const changeHandler = (name, value) => {
		setProductTimeAt({ ...productTimeAt, [name]: dayjs(value) });
	};
	const handleReset = () => {
		const initialProductTimeAt = {};
		initialProductTimeAt['started_at'] = dayjs(item.started_at);
		initialProductTimeAt['ended_at'] = dayjs(item.ended_at);
		setProductTimeAt(initialProductTimeAt);
	};
	const helpMessage = (params = {}) => {
		const { reset = false, content = '', success = false, error = false } = params;
		if (reset) {
			setMessage([]);
			return;
		}
		if (success) {
			setMessage((prev) => {
				// 移除最後的 'ing處理中'（如果有）
				const filtered = prev.filter((msg) => msg !== 'ing處理中');
				return [...filtered, '✅ 執行完成'];
			});
			return;
		}
		if (error) {
			setMessage(() => {
				return [`❌ 執行失敗 ${content}`];
			});
			return;
		}
		setMessage(() => {
			return [content, 'ing處理中'];
		});
	};
	const sendCoupon = async () => {
		helpMessage({ reset: true });
		if (loading) return;
		setLoading(true);
		const filterItem = Object.keys(productTimeAt).filter(
			(key) => !dayjs(item[key]).isSame(dayjs(productTimeAt[key]))
		);
		if (filterItem.length === 0) {
			setLoading(false);
			helpMessage({ error: true, content: '無訂單需要處理，若已修改過請重整畫面' });
			return;
		}
		const sendData = {
			...item,
			ended_at: dayjs(productTimeAt.ended_at).toISOString(),
		};
		try {
			helpMessage();
			let couponQuest = {
				do: 'memberChangePost',
				what: 'updateCoupon',
				brand: formFields.brand,
				variables: JSON.stringify(sendData),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const updateCouponResult = await SafeFetch(
				() => SendRequest(couponQuest),
				'Coupon failed'
			);
			if (!updateCouponResult.success) {
				helpMessage({ error: true, content: updateCouponResult.message });
				throw new Error(`${updateCouponResult.message}`);
			}

			helpMessage({ content: updateCouponResult.message });
			helpMessage({ success: true });
		} catch (error) {
			console.error('諮詢卷變更失敗:', error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Fragment>
			<TableRow key={item.id}>
				<Col>{item.title}</Col>
				<Col>
					<DatePicker
						allowClear={false}
						name="started_at"
						value={dayjs(productTimeAt.started_at)}
						onChange={(value) => changeHandler('started_at', value)}
						format="YYYY-MM-DD"
						disabled
					/>
				</Col>
				<Col>
					<DatePicker
						allowClear={false}
						name="ended_at"
						value={dayjs(productTimeAt.ended_at)}
						onChange={(value) => changeHandler('ended_at', value)}
						format="YYYY-MM-DD"
					/>
				</Col>
			</TableRow>
			<TableRow style={{ justifyContent: 'end', gap: '10px', backgroundColor: '#d8d8d8' }}>
				<Button onClick={handleReset}>{loading ? <Loading /> : '還原日期'}</Button>
				<Button
					type="primary"
					onClick={sendCoupon}
				>
					{loading ? <Loading /> : '送出'}
				</Button>
			</TableRow>
			{message.length > 0 && (
				<LoadingMessage>
					{message.map((msg, i) => (
						<LoadingMessage key={i}>{msg}</LoadingMessage>
					))}
				</LoadingMessage>
			)}
		</Fragment>
	);
};
const AdjustCouponRenderTable = ({ formFields, data, setData, collapsedItems, toggleCollapse }) => {
	return (
		<TableContainer>
			{data.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(data).map((item) => {
					const key = item.id;
					const { contractStartAt = 'N/A' } = getContractInfo(item);
					return (
						<OrderCard key={key}>
							<OrderHeader
								onClick={() => toggleCollapse(key)}
								$background={comfirmStatus(item)}
							>
								<span>訂單編號：{key}</span>
								<span>建立時間：{formatTime(contractStartAt)}</span>
								<ChevronIcon $collapse={collapsedItems[key]}>▼</ChevronIcon>
							</OrderHeader>
							{!item.hasOwnProperty('coupon_plan') ? (
								<OrderBody $collapse={collapsedItems[key]}>無諮詢卷資料</OrderBody>
							) : (
								<OrderBody $collapse={collapsedItems[key]}>
									<TableHead $background={comfirmStatus(item)}>
										<Col>產品名稱</Col>
										<Col>開始時間</Col>
										<Col>結束時間</Col>
									</TableHead>
									<AdjustCouponInfo
										collapsedItems={collapsedItems}
										item={item.coupon_plan}
										data={data}
										setData={setData}
										formFields={formFields}
									/>
								</OrderBody>
							)}
						</OrderCard>
					);
				})
			)}
		</TableContainer>
	);
};
const AdjustCoinInfo = ({ collapsedItems, item, data, setData, formFields }) => {
	const [productTimeAt, setProductTimeAt] = useState({});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState([]);

	useEffect(() => {
		if (item && Array.isArray(item)) {
			const initialProductTimeAt = [];
			item.forEach(({ id, ended_at }) => {
				initialProductTimeAt[id] = dayjs(ended_at);
			});
			setProductTimeAt(initialProductTimeAt);
		}
		helpMessage({ reset: true });
	}, [data, item]);
	const changeHandler = (key, value) => {
		setProductTimeAt({ ...productTimeAt, [key]: dayjs(value) });
	};
	const handleReset = () => {
		const initialProductTimeAt = {};
		item.forEach(({ id, ended_at }) => {
			initialProductTimeAt[id] = dayjs(ended_at);
		});
		setProductTimeAt(initialProductTimeAt);
	};
	const helpMessage = (params = {}) => {
		const { reset = false, content = '', success = false, error = false } = params;
		if (reset) {
			setMessage([]);
			return;
		}
		if (success) {
			setMessage((prev) => {
				// 移除最後的 'ing處理中'（如果有）
				const filtered = prev.filter((msg) => msg !== 'ing處理中');
				return [...filtered, '✅ 執行完成'];
			});
			return;
		}
		if (error) {
			setMessage(() => {
				return [`❌ 執行失敗 ${content}`];
			});
			return;
		}
		setMessage(() => {
			return [content, 'ing處理中'];
		});
	};
	const sendCoin = async () => {
		helpMessage({ reset: true });
		if (loading) return;
		setLoading(true);
		const filterItem = item
			.filter(({ id, ended_at }) => !dayjs(ended_at).isSame(dayjs(productTimeAt[id])))
			.map((coin) => ({ ...coin, ended_at: dayjs(productTimeAt[coin.id]).toISOString() }));
		if (filterItem.length === 0) {
			setLoading(false);
			helpMessage({ error: true, content: '無訂單需要處理，若已修改過請重整畫面' });
			return;
		}
		const sendData = filterItem;
		console.log('sendData : ', sendData);
		try {
			helpMessage();
			let coinQuest = {
				do: 'memberChangePost',
				what: 'updateCoin',
				brand: formFields.brand,
				variables: JSON.stringify(sendData),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const updateCoinResult = await SafeFetch(() => SendRequest(coinQuest), 'Coupon failed');
			if (!updateCoinResult.success) {
				helpMessage({ error: true, content: updateCoinResult.message });
				throw new Error(`${updateCoinResult.message}`);
			}

			helpMessage({ content: updateCoinResult.message });
			helpMessage({ success: true });
		} catch (error) {
			console.error('點數變更失敗:', error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Fragment>
			{item.length > 0 &&
				item.map(({ title, id, amount, started_at }) => {
					return (
						<TableRow key={id}>
							<Col>{title}</Col>
							<Col>
								<Input
									type="number"
									name="amount"
									value={amount}
									disabled
								/>
							</Col>
							<Col>
								<DatePicker
									allowClear={false}
									name="started_at"
									value={dayjs(started_at)}
									format="YYYY-MM-DD"
									disabled
								/>
							</Col>
							<Col>
								<DatePicker
									allowClear={false}
									name="ended_at"
									value={dayjs(productTimeAt[id])}
									onChange={(value) => changeHandler(id, value)}
									format="YYYY-MM-DD"
								/>
							</Col>
						</TableRow>
					);
				})}

			<TableRow style={{ justifyContent: 'end', gap: '10px', backgroundColor: '#d8d8d8' }}>
				<Button onClick={handleReset}>{loading ? <Loading /> : '還原日期'}</Button>
				<Button
					type="primary"
					onClick={sendCoin}
				>
					{loading ? <Loading /> : '送出'}
				</Button>
			</TableRow>
			{message.length > 0 && (
				<LoadingMessage>
					{message.map((msg, i) => (
						<LoadingMessage key={i}>{msg}</LoadingMessage>
					))}
				</LoadingMessage>
			)}
		</Fragment>
	);
};
const AdjustCoinRenderTable = ({ formFields, data, setData, collapsedItems, toggleCollapse }) => {
	console.log('data : ', data);
	return (
		<TableContainer>
			{data.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(data).map((item) => {
					const key = item.id;
					const { contractStartAt = 'N/A' } = getContractInfo(item);
					return (
						<OrderCard key={key}>
							<OrderHeader
								onClick={() => toggleCollapse(key)}
								$background={comfirmStatus(item)}
							>
								<span>訂單編號：{key}</span>
								<span>建立時間：{formatTime(contractStartAt)}</span>
								<ChevronIcon $collapse={collapsedItems[key]}>▼</ChevronIcon>
							</OrderHeader>
							{!item.hasOwnProperty('coin_logs') ? (
								<OrderBody $collapse={collapsedItems[key]}>無點數資料</OrderBody>
							) : (
								<OrderBody $collapse={collapsedItems[key]}>
									<TableHead $background={comfirmStatus(item)}>
										<Col>產品名稱</Col>
										<Col>點數</Col>
										<Col>開始時間</Col>
										<Col>結束時間</Col>
									</TableHead>
									<AdjustCoinInfo
										collapsedItems={collapsedItems}
										item={item.coin_logs}
										data={data}
										setData={setData}
										formFields={formFields}
									/>
								</OrderBody>
							)}
						</OrderCard>
					);
				})
			)}
		</TableContainer>
	);
};

function Table({ type, data }) {
	const { formFields, setMemberData } = useContext(MemberChangeMenuContext);
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
	if (type === 'contract') {
		return (
			<TableContainer>
				<TableTitle>合約面板</TableTitle>
				<RenderTable
					data={data}
					type={type}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
	if (type === 'order-log') {
		return (
			<TableContainer>
				<TableTitle>訂單面板</TableTitle>
				<RenderTable
					data={data}
					type={type}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
	if (type === 'leave') {
		return (
			<TableContainer>
				<TableTitle>請假面板</TableTitle>
				<LeaveRenderTable
					brand={formFields.brand}
					type={type}
					data={data}
					setData={setMemberData}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
	if (type === 'extension') {
		return (
			<TableContainer>
				<TableTitle>展延面板</TableTitle>
				<LeaveRenderTable
					brand={formFields.brand}
					type={type}
					data={data}
					setData={setMemberData}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
	if (type === 'adjust-order') {
		return (
			<TableContainer>
				<TableTitle>訂單面板</TableTitle>
				<AdjustOrderRenderTable
					formFields={formFields}
					type={type}
					setData={setMemberData}
					data={data}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
	if (type === 'adjust-coupon') {
		return (
			<TableContainer>
				<TableTitle>諮詢卷面板</TableTitle>
				<AdjustCouponRenderTable
					formFields={formFields}
					type={type}
					setData={setMemberData}
					data={data}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
	if (type === 'adjust-coin') {
		return (
			<TableContainer>
				<TableTitle>點數面板</TableTitle>
				<AdjustCoinRenderTable
					formFields={formFields}
					type={type}
					setData={setMemberData}
					data={data}
					collapsedItems={collapsedItems}
					toggleCollapse={toggleCollapse}
				/>
			</TableContainer>
		);
	}
}

export default Table;
