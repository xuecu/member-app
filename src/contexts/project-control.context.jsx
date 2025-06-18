import React, { createContext, useEffect, useState } from 'react';
import SendRequest from '@utils/auth-service.utils';
export const ProjectControlContext = createContext({
	table: {},
	project: [],
	setProject: () => {},
	fieldMap: {},
	tab: [],
	onchangeTab: () => {},
	loadError: false,
});

export const ProjectControlProvider = ({ children }) => {
	const [project, setProject] = useState([]);
	const [fieldMap, setFieldMap] = useState({});
	const [table, setTable] = useState({});
	const [loadError, setLoadError] = useState(false);
	const [tab, setTab] = useState([]);

	const tabHandler = () => {
		const newTab = project.map(({ id, name, order }) => ({
			id: id,
			name: name,
			order: Number(order),
			isOpen: false,
		}));

		if (tab.length === 0) {
			setTab(
				newTab.map((tab) => {
					if (tab.order === 1) return { ...tab, isOpen: true };
					return { ...tab };
				})
			);
			return;
		}
		const findOpenTab = tab.find((item) => item.isOpen);
		if (findOpenTab) {
			setTab(
				newTab.map((tab) => {
					if (tab.id === findOpenTab.id) return { ...tab, isOpen: true };
					return { ...tab };
				})
			);
		}
	};
	const onchangeTab = (id) => {
		const newTab = project.map(({ id, name, order }) => ({
			id: id,
			name: name,
			order: Number(order),
			isOpen: false,
		}));
		setTab(
			newTab.map((tab) => {
				if (tab.id === id) return { ...tab, isOpen: true };
				return { ...tab };
			})
		);
	};
	const helpFieldMap = () => {
		const fieldIdMap = new Map();
		project.forEach((item) => {
			fieldIdMap[item.id] = { ...item };
		});
		setFieldMap(fieldIdMap);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const send = {
					do: 'projectControlGet', // projectControlGet | projectControlPost
					what: 'all', // All | One
					staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
				};
				const result = await SendRequest(send);

				if (!result.success) {
					setLoadError(true);
				} else {
					setTable(result.data.table || {});
					setProject(result.data.page || []);
				}
			} catch (error) {
				console.error('資料讀取錯誤：', error);
				setLoadError(true);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (project.length !== 0) {
			tabHandler();
			helpFieldMap();
		}
	}, [project]);

	const value = { table, project, setProject, fieldMap, tab, onchangeTab, loadError };
	return (
		<ProjectControlContext.Provider value={value}>{children}</ProjectControlContext.Provider>
	);
};
