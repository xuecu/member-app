import { useContext, useState } from 'react';
import { AuthContext } from '@contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/loading';

import { NavigatorStyled, LinkStyled, LogoutButton, GroupStyled, MemberStyled } from './styled';

function Navigator({ collapsed }) {
	const { auth, route, member, logout } = useContext(AuthContext);
	const { router } = auth;
	const { user_name, mail, login_at } = member;
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// 登出功能
	const handleLogout = () => {
		logout();
		navigate('/login'); // 導向登入頁面
	};

	if (!auth.hasOwnProperty('id'))
		return (
			<NavigatorStyled $collapsed={collapsed}>
				<GroupStyled>
					<LinkStyled to="/login">登入/註冊</LinkStyled>
				</GroupStyled>
			</NavigatorStyled>
		);

	return (
		<NavigatorStyled $collapsed={collapsed}>
			<GroupStyled>
				{member.hasOwnProperty('user_name') ? (
					<MemberStyled>{user_name !== '' ? user_name : '尚未設定'}</MemberStyled>
				) : (
					<Loading />
				)}
				<LogoutButton onClick={handleLogout}>登出</LogoutButton>
			</GroupStyled>
			<GroupStyled>
				{router &&
					route &&
					router.map((id, index) => {
						const targetroute = route.find((r) => r.key === id);
						if (!targetroute) return;
						return (
							<LinkStyled
								to={targetroute.route}
								key={index}
								$order={targetroute.order}
							>
								{targetroute.name}
							</LinkStyled>
						);
					})}
			</GroupStyled>
		</NavigatorStyled>
	);
}

export default Navigator;
