import React, { createContext, useState, useEffect } from 'react';
import SendRequest from '@utils/auth-service.utils';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

export const InvitGuideContext = createContext({});

const defaultTab = [
	{
		id: 'booking',
		name: '每日可預約',
		isOpen: true,
	},
	{ id: 'memberSetting', name: '登記預約表', isOpen: false },
	{ id: 'calendar', name: '行事曆', isOpen: false },
];

export const InvitGuideProvider = ({ children }) => {
	const [startTime, setStartTime] = useState(dayjs().add(1, 'd'));
	const [memberData, setMemberData] = useState([]);
	const [booking, setBooking] = useState([]);
	const [tabList, setTabList] = useState(defaultTab);
	const [memberTabList, setMemberTabList] = useState([]);
	const [targetMember, setTargetMember] = useState({});
	const [loadError, setLoadError] = useState(false);

	const defaultWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	const defaultBrands = ['學米', '無限', '職能', '財經'];

	const weekCode = (date) => {
		let weekCodeMap = ['日', '一', '二', '三', '四', '五', '六'];

		return `${date} (${weekCodeMap[dayjs(date).day()]})`;
	};

	const onchangeTab = (id) => {
		const newTab = tabList.map(({ id, name }) => ({
			id: id,
			name: name,
			isOpen: false,
		}));
		setTabList(
			newTab.map((tab) => {
				if (tab.id === id) return { ...tab, isOpen: true };
				return { ...tab };
			})
		);
	};

	const memberTabHandler = () => {
		const newTab = memberData.map(({ excel_id, name }) => ({
			id: excel_id,
			name: name,
			isOpen: false,
		}));

		if (memberTabList.length === 0) {
			setMemberTabList(
				newTab.map((tab, key) => {
					if (key === 0) return { ...tab, isOpen: true };
					return { ...tab };
				})
			);
			return;
		}
		const findOpenTab = memberTabList.find((item) => item.isOpen);
		if (findOpenTab) {
			setMemberTabList(
				newTab.map((tab) => {
					if (tab.id === findOpenTab.id) return { ...tab, isOpen: true };
					return { ...tab };
				})
			);
		}
	};
	const onchangeMemberTab = (id) => {
		const newTab = memberData.map(({ excel_id, name }) => ({
			id: excel_id,
			name: name,
			isOpen: false,
		}));
		setMemberTabList(
			newTab.map((tab) => {
				if (tab.id === id) return { ...tab, isOpen: true };
				return { ...tab };
			})
		);
	};

	useEffect(() => {
		memberTabHandler();
	}, [memberData]);
	const findTargetMember = () => {
		const findOpen = memberTabList.find(({ isOpen }) => isOpen);
		const findMemberData = memberData.find(({ excel_id }) => findOpen.id === excel_id);
		setTargetMember(findMemberData);
	};
	useEffect(() => {
		findTargetMember();
	}, [memberTabList]);

	useEffect(() => {
		const fetchData = async () => {
			const variables = {
				time: new Date(startTime),
			};
			try {
				const send = {
					do: 'invitGuideGet', // invitGuideGet | invitGuidePost
					what: 'search',
					variables: JSON.stringify(variables),
					staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				};
				const result = await SendRequest(send);

				if (!result.success) {
					setLoadError(true);
				} else {
					setMemberData(result.data.invitMember);
					setBooking(result.data.booking);
				}
			} catch (error) {
				console.error('資料讀取錯誤：', error);
				setLoadError(true);
			}
		};
		fetchData();
	}, []);

	const value = {
		startTime,
		setStartTime,
		memberData,
		setMemberData,
		booking,
		setBooking,
		tabList,
		onchangeTab,
		memberTabList,
		onchangeMemberTab,
		targetMember,
		defaultWeek,
		defaultBrands,
		weekCode,
	};

	return <InvitGuideContext.Provider value={value}>{children}</InvitGuideContext.Provider>;
};
