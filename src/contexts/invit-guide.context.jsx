import React, { createContext, useState } from 'react';
import dayjs from 'dayjs';

export const InvitGuideContext = createContext({});

const defaultTab = [
	{
		id: 'booking',
		name: '每日可預約',
		isOpen: true,
	},
	{ id: 'calendar', name: '登記預約表', isOpen: false },
];

export const InvitGuideProvider = ({ children }) => {
	const [startTime, setStartTime] = useState(dayjs().add(1, 'd'));
	const [memberData, setMemberData] = useState([]);
	const [booking, setBooking] = useState([]);
	const [tabList, setTabList] = useState(defaultTab);

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

	const value = {
		startTime,
		setStartTime,
		memberData,
		setMemberData,
		booking,
		setBooking,
		tabList,
		onchangeTab,
	};

	return <InvitGuideContext.Provider value={value}>{children}</InvitGuideContext.Provider>;
};
