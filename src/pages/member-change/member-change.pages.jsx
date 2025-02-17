import React, { useContext } from 'react';
import Menu from './menu';
import Leave from './leave';
import Search from './search';
import Extension from './extension';
import AdjustOrder from './adjust-order';
import AdjustCoupon from './adjust-coupon';
import AdjustCoin from './adjust-coin';
import { MemberChangeMenuContext } from '../../contexts/member-change-menu.contexts';
import { MemberChangeStyled } from './styled';

function MemberChange() {
	const { formFields } = useContext(MemberChangeMenuContext);
	const { tab } = formFields;

	const categories = [
		{ value: 'search', page: Search },
		{ value: 'leave', page: Leave },
		{ value: 'extension', page: Extension },
		{ value: 'adjust-order', page: AdjustOrder },
		{ value: 'adjust-coupon', page: AdjustCoupon },
		{ value: 'adjust-coin', page: AdjustCoin },
	];

	const SelectedComponent = categories.find((e) => e.value === tab)?.page;

	return (
		<MemberChangeStyled>
			<Menu />
			{SelectedComponent && <SelectedComponent />}
		</MemberChangeStyled>
	);
}

export default MemberChange;
