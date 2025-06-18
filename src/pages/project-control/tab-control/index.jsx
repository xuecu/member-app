import React, { useState, useContext, Fragment } from 'react';
import { ProjectControlContext } from '@contexts/project-control.context';
import { Button } from 'antd';
import { PlusOutlined, SettingFilled } from '@ant-design/icons';
import { Tab } from '@components/tab';
import { LightBox } from '@components/light-box';

import AddField from './add-field';
import EditField from './edit-field';
import styled from 'styled-components';

const ContainerStyled = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;
const GroupStyled = styled.div`
	display: flex;
	gap: 10px;
`;

function TabControl() {
	const { tab, onchangeTab } = useContext(ProjectControlContext);
	const [popUp, setPopUp] = useState({
		add: false,
		setting: false,
	});

	const handlePopup = (key) => {
		setPopUp({ ...popUp, [key]: !popUp[key] });
	};

	return (
		<Fragment>
			<ContainerStyled>
				<GroupStyled>
					<GroupStyled>
						{tab.map(({ id, isOpen, name, order }) => (
							<Tab
								$focus={isOpen}
								key={id}
								order={order}
								onClick={() => onchangeTab(id)}
							>
								{name}
							</Tab>
						))}
					</GroupStyled>
					<Tab onClick={() => handlePopup('add')}>
						<PlusOutlined />
					</Tab>
				</GroupStyled>
				<GroupStyled>
					<Button onClick={() => handlePopup('setting')}>
						<SettingFilled />
					</Button>
				</GroupStyled>
			</ContainerStyled>
			{popUp.add && (
				<LightBox onClose={() => handlePopup('add')}>
					<AddField />
				</LightBox>
			)}
			{popUp.setting && (
				<LightBox onClose={() => handlePopup('setting')}>
					<EditField />
				</LightBox>
			)}
		</Fragment>
	);
}

export default TabControl;
