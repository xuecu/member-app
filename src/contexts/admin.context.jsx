import { createContext, useState, useEffect } from 'react';
import SendRequest from '@/utils/auth-service.utils';

export const AdminContext = createContext({
	permissions: [],
	pages: [],
	signUp: [],
	setPermissions: () => {},
	setPages: () => {},
	setSignUp: () => {},
});

export const AdminProvider = ({ children }) => {
	const [permissions, setPermissions] = useState([]);
	const [pages, setPages] = useState([]);
	const [signUp, setSignUp] = useState([]);
	const [defaultPages, setDefaultPages] = useState([]);

	const fetchData = async () => {
		try {
			const send = {
				do: 'adminGet', // adminGet | adminPost
				what: 'search',
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const result = await SendRequest(send);
			if (!result.success) {
				throw new Error(`${result.message}`);
			}
			setPermissions(result.data.promissions);
			setPages(result.data.pages);
			setSignUp(result.data.sign_up);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		if (pages.length > 0) setDefaultPages(pages.map(({ name }) => name));
	}, [pages]);

	const value = { permissions, pages, signUp, setPermissions, setPages, setSignUp, defaultPages };
	return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
