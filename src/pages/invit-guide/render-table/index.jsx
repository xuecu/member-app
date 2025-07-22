import React, { useState, useEffect, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import Booking from './booking';
import CalendarSetting from './calendar';
import MemberSetting from './member-setting';

function RenderTable() {
	const { tabList } = useContext(InvitGuideContext);
	const [targetTab, SetTargetTab] = useState();
	const renderTable = () => {
		const findTable = tabList.find((item) => item.isOpen);
		SetTargetTab(findTable.id);
	};

	useEffect(() => {
		renderTable();
	}, [tabList]);

	if (targetTab === 'booking') return <Booking />;
	if (targetTab === 'memberSetting') return <MemberSetting />;
	if (targetTab === 'calendar') return <CalendarSetting />;

	return <div>載入資料中</div>;
}

export default RenderTable;
