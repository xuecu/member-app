import { createContext, useEffect, useState } from 'react';
import { useRouterUpdater } from '@hook/useRouterUpdater';
import SendRequest from '@utils/auth-service.utils';

export const AuthContext = createContext({
	auth: {},
	setAuth: () => {},
	member: {},
	setMember: () => {},
	route: [],
	login: () => {},
	logout: () => {},
	updateMember: () => {},
});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState(() => {
		try {
			const stored = JSON.parse(localStorage.getItem('memberApp'));
			return stored || {};
		} catch (e) {
			return {};
		}
	});
	const [member, setMember] = useState({});
	const [route, setRoute] = useState([]);

	const login = (userData) => {
		const { member, route } = userData;
		const setLocalStorage = {
			id: member.id,
			mail: member.mail,
			router: member.router,
			login_at: member.login_at,
		};
		localStorage.setItem('memberApp', JSON.stringify(setLocalStorage));
		setAuth(setLocalStorage);
		setMember(member);
		setRoute(route);
	};
	const logout = () => {
		localStorage.removeItem('memberApp');
		setAuth({});
	};
	const updateMember = (userData) => {
		const setLocalStorage = {
			id: userData.id,
			mail: userData.mail,
			router: userData.router,
			login_at: userData.login_at,
		};
		localStorage.setItem('memberApp', JSON.stringify(setLocalStorage));
		setAuth(setLocalStorage);
		setMember(userData);
	};
	useRouterUpdater(auth, setAuth);

	useEffect(() => {
		if (!auth.hasOwnProperty('id')) return;
		const fetchUpdate = async () => {
			try {
				const data = { do: 'memberGet', what: 'catch-member', id: auth.id };
				const result = await SendRequest(data);
				if (!result.success) throw new Error('無法取得 router 權限');
				const parsed = JSON.parse(result.data);
				setMember(parsed.member);
				setRoute(parsed.route);
			} catch (e) {
				console.error(e);
			}
		};
		fetchUpdate();
	}, []);

	const value = { auth, setAuth, member, setMember, route, login, logout, updateMember };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
