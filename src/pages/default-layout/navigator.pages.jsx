// import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	NavigatorStyled,
	LinkStyled,
	LogoutButton,
	GroupStyled,
	MemberStyled,
} from './navigator.styled';

// import styled from 'styled-components';

function Navigator({ collapsed }) {
	const navigate = useNavigate();
	const staffData = JSON.parse(localStorage.getItem('memberApp'));

	// 登出功能
	const handleLogout = () => {
		localStorage.removeItem('memberApp');
		navigate('/login'); // 導向登入頁面
	};

	return (
		<NavigatorStyled $collapsed={collapsed}>
			{staffData ? (
				<GroupStyled>
					<MemberStyled>{staffData.email}</MemberStyled>
					<LogoutButton onClick={handleLogout}>登出</LogoutButton>
				</GroupStyled>
			) : (
				<GroupStyled>
					<LinkStyled to="/login">登入/註冊</LinkStyled>
				</GroupStyled>
			)}
			<GroupStyled>
				<LinkStyled to="/dashboard/member-change">會員異動</LinkStyled>
				<LinkStyled to="/dashboard/member-change">會員異動</LinkStyled>
				<LinkStyled to="/dashboard/member-change">會員異動</LinkStyled>
			</GroupStyled>
		</NavigatorStyled>
	);
}

export default Navigator;
