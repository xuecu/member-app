import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import Resize from '@utils/resize.utils';
import Navigator from './navigator';
import { DefaultStyled, HeaderStyled, ContentStyled } from './styled';

function DefaultLayout() {
	const { width } = Resize();
	const [collapsed, setCollapsed] = useState(width > 768 ? true : false);

	return (
		<DefaultStyled>
			<Navigator collapsed={collapsed} />
			<DefaultStyled $column="true">
				<HeaderStyled>
					<div onClick={() => setCollapsed(!collapsed)}>
						{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					</div>
				</HeaderStyled>
				<ContentStyled>
					<Outlet />
				</ContentStyled>
			</DefaultStyled>
		</DefaultStyled>
	);
}

export default DefaultLayout;
