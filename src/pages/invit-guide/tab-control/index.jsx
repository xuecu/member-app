import React, { useContext } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import styled from 'styled-components';

import { Tab } from '@/components/tab';

const GroupStyled = styled.div`
	display: flex;
	gap: 10px;
`;

function TabControl() {
	const { tabList, onchangeTab } = useContext(InvitGuideContext);

	return (
		<GroupStyled>
			{tabList.map((item, key) => {
				return (
					<Tab
						key={item.id}
						$focus={item.isOpen}
						onClick={() => onchangeTab(item.id)}
					>
						{item.name}
					</Tab>
				);
			})}
		</GroupStyled>
	);
}

export default TabControl;
