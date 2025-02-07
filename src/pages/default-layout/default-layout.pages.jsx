import React, { useState } from 'react';
import Navigator from './navigator.pages';
import Resize from '../../utils/resize.utils';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { DefaultStyled, HeaderStyled, ContentStyled } from './default-layout.styled';

// import styled from 'styled-components';

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
