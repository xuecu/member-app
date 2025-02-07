import { Navigate } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';

// 檢查使用者是否已登入
const isAuthenticated = () => {
	const now = dayjs();
	const staffData = JSON.parse(localStorage.getItem('memberApp'));
	if (!staffData || !staffData.login_at) return false;

	const lastLogin = dayjs(staffData.login_at);
	const diffInDays = now.diff(lastLogin, 'day');

	if (diffInDays >= 7) {
		localStorage.removeItem('memberApp');
		return false;
	}
	return true;
};

// 受保護的路由：未登入則導向 /login
function ProtectedRoute({ children }) {
	const [showMessage, setShowMessage] = useState(false);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (!isAuthenticated()) {
			setShowMessage(true);

			// 3 秒後自動跳轉到 /login
			const timer = setTimeout(() => {
				setRedirect(true);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, []);

	if (redirect) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return (
		<Fragment>
			{showMessage && (
				<div style={{ color: 'red', textAlign: 'center', margin: '20px' }}>
					您的登入已過期，請重新登入！
				</div>
			)}
			{isAuthenticated() ? children : null}
		</Fragment>
	);
}

export default ProtectedRoute;
