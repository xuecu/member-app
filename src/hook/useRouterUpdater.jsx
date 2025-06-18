import { useEffect, useRef } from 'react';
import SendRequest from '@utils/auth-service.utils';

export const useRouterUpdater = (auth = {}, setAuth) => {
	const intervalRef = useRef(null);
	const timeoutRef = useRef(null);

	const fetchRouterUpdate = async (id) => {
		const data = { do: 'checkAuth', id: id };
		const result = await SendRequest(data);
		if (!result.success) throw new Error('無法取得 router 權限');
		return result.data;
	};

	const startInterval = () => {
		if (intervalRef.current || !auth.hasOwnProperty('id')) return;

		intervalRef.current = setInterval(async () => {
			try {
				const latestData = await fetchRouterUpdate(auth.id);
				const updatedUser = {
					...auth,
					router: JSON.parse(latestData).router,
				};
				localStorage.setItem('memberApp', JSON.stringify(updatedUser));
				setAuth(updatedUser);
			} catch (err) {
				console.error('🔴 router 權限更新失敗', err);
			}
		}, 5 * 60 * 1000);
	};

	const stopInterval = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const resetInactivityTimer = () => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			console.log('🔕 無操作 10 分鐘，停止 router 權限更新');
			stopInterval();
		}, 10 * 60 * 1000);

		startInterval(); // 確保重啟
	};

	useEffect(() => {
		if (!auth.hasOwnProperty('id')) return;

		startInterval();
		resetInactivityTimer();

		const handleActivity = () => {
			resetInactivityTimer();
		};

		window.addEventListener('mousemove', handleActivity);
		window.addEventListener('keydown', handleActivity);
		window.addEventListener('click', handleActivity);
		window.addEventListener('scroll', handleActivity);

		return () => {
			stopInterval();
			clearTimeout(timeoutRef.current);
			window.removeEventListener('mousemove', handleActivity);
			window.removeEventListener('keydown', handleActivity);
			window.removeEventListener('click', handleActivity);
			window.removeEventListener('scroll', handleActivity);
		};
	}, [auth.hasOwnProperty('id')]);
};
