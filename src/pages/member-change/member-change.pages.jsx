import React, { useEffect, useState, useContext } from 'react';
import SendRequest from '../../utils/auth-service.utils';
import {
	GET_MEMBER_ID_BY_EMAIL,
	GET_MEMBER_ORDER_LOGS_BY_EMAIL,
} from '../../utils/graphql/queries';
import FormInput from '../../components/form-input/form-input.component';
import FormSelect from '../../components/form-select/form-select.componenets';
import Button from '../../components/button/button.component';
import Loading from '../../components/loading/loading.components';
import Leave from './leave/leave.pages';
import Extension from './extension/extension.pages';
import AdjustOrder from './adjust-order/adjust-order.pages';
import SafeFetch from '../../utils/safe-fetch.utils';
import { MemberChangeMenuContext } from '../../contexts/member-change-menu.contexts';
import { MemberChangeStyled, FormGroupStyled, FromItemStyled } from './member-change.styled';

function MemberChange() {
	const { formFields, handleChange, handleReset, memberData, setMemberData } =
		useContext(MemberChangeMenuContext);
	const { email, brand, category } = formFields;
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [tab, setTab] = useState('');
	const brands = [
		{ value: 'xuemi', label: '學米' },
		{ value: 'sixdigital', label: '無限' },
		{ value: 'kkschool', label: '職能' },
		{ value: 'nschool', label: '財經' },
	];
	const categories = [
		{ value: 'leave', label: '請假', page: Leave },
		{ value: 'extension', label: '展延', page: Extension },
		{ value: 'adjust-order', label: '異動訂單', page: AdjustOrder },
	];

	const handleSubmit = async () => {
		if (!brand || !category || !email) {
			alert('歐歐~有欄位沒填');
			return;
		}
		setLoading(true);
		setMessage('');
		setTab('');
		setMemberData({});

		try {
			const MemberInfo = {};
			// 抓取 memberid
			const getMemberId = {
				do: 'member-change',
				brand: brand,
				variables: { email: email },
				query: GET_MEMBER_ID_BY_EMAIL,
			};
			const resultGetMemberId = await SafeFetch(
				() => SendRequest(getMemberId),
				'Member ID not found'
			);
			console.log(resultGetMemberId);
			MemberInfo.member = resultGetMemberId.data;

			// // 抓取 member contract
			// const getMemberContract = {
			// 	do: 'member-change',
			// 	brand: brand,
			// 	variables: { memberId: MemberInfo.member.id },
			// 	query: GET_MEMBER_ORDER_LOGS_BY_EMAIL,
			// };
			// const resultGetMemberContract = await SafeFetch(
			// 	() => SendRequest(getMemberContract),
			// 	'Member Contracts not found'
			// );
			// MemberInfo.contracts = resultGetMemberContract.data;

			setTab(category);
			setMemberData(MemberInfo);
		} catch (error) {
			setMessage(error.message);
		} finally {
			setLoading(false);
		}
	};
	const handleClear = async () => {
		handleReset();
		setTab('');
		setMemberData({});
	};

	const SelectedComponent = categories.find((e) => e.value === tab)?.page;

	return (
		<MemberChangeStyled>
			<h2>會員異動</h2>
			<MemberChangeStyled>
				<FormGroupStyled>
					<FromItemStyled>
						<FormSelect
							label="選擇品牌"
							selectOptions={brands}
							value={brand}
							name="brand"
							onChange={handleChange}
						/>
					</FromItemStyled>
					<FromItemStyled>
						<FormSelect
							label="異動項目"
							selectOptions={categories}
							value={category}
							name="category"
							onChange={handleChange}
						/>
					</FromItemStyled>
					<FromItemStyled>
						<FormInput
							label="學員信箱"
							inputOption={{
								type: 'email',
								required: true,
								onChange: handleChange,
								name: 'email',
								value: email,
							}}
						/>
					</FromItemStyled>
				</FormGroupStyled>
				<FormGroupStyled>
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={loading}
					>
						{loading ? <Loading /> : '送出'}
					</Button>
					<Button
						type="submit"
						onClick={handleClear}
						disabled={loading}
					>
						{loading ? <Loading /> : '清除'}
					</Button>
					{message && <div>{message}</div>}
				</FormGroupStyled>
			</MemberChangeStyled>
			{SelectedComponent && <SelectedComponent data={memberData} />}
			<div>資料</div>
		</MemberChangeStyled>
	);
}

export default MemberChange;
