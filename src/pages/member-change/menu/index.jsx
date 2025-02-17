import React, { useState, useContext } from 'react';
import SendRequest from '../../../utils/auth-service.utils';
import FormInput from '../../../components/form-input';
import FormSelect from '../../../components/form-select';
import Button from '../../../components/button';
import Loading from '../../../components/loading';
import SafeFetch from '../../../utils/safe-fetch.utils';
import { MemberChangeMenuContext } from '../../../contexts/member-change-menu.contexts';
import FakeData from '../../../fake-data';
import {
	MemberChangeStyled,
	FormGroupStyled,
	FromItemStyled,
	MessageStyled,
	MemberInfoContainer,
	MemberName,
	AdminLink,
} from './styled';

function Menu() {
	const { formFields, handleChange, handleReset, memberData, setMemberData, handleTab } =
		useContext(MemberChangeMenuContext);
	const { email, brand, category } = formFields;
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const brands = [
		{ value: 'xuemi', label: '學米', page: 'https://www.xuemi.co/admin/members/' },
		{ value: 'sixdigital', label: '無限', page: 'https://www.ooschool.cc/admin/members/' },
		{ value: 'kkschool', label: '職能', page: 'https://kkschool.kolable.app/admin/members/' },
		{ value: 'nschool', label: '財經', page: 'https://nschool.tw/admin/members/' },
	];
	const categories = [
		{ value: 'search', label: '查詢' },
		{ value: 'leave', label: '請假' },
		{ value: 'extension', label: '展延' },
		{ value: 'adjust-order', label: '訂單異動' },
		{ value: 'adjust-coupon', label: '諮詢卷異動' },
		{ value: 'adjust-coin', label: '點數異動' },
	];
	const handleClear = async () => {
		handleReset();
		setMemberData({});
	};

	const handleSubmit = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');
		if (!brand || !category || !email) {
			setMessage('請填寫完整資料');
			return;
		}
		setLoading(true);
		setMessage('');
		handleTab('');
		setMemberData({});
		const errors = [];

		try {
			// 抓取 memberid
			const getData = {
				do: 'search',
				category: category,
				mail: email,
				brand: brand,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
			};

			const result = await SafeFetch(() => SendRequest(getData), 'search not found');

			console.log(result);
			if (!result.success) throw new Error(result.message);

			handleTab();
			setMemberData(result.data);
		} catch (error) {
			errors.push(`${error.message}`);
		} finally {
			setLoading(false);
			if (errors.length > 0) setMessage(`查詢失敗:\n${errors}`);
			else setMessage('所有查詢成功');
		}
	};

	return (
		<div>
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
					<Button
						type="submit"
						onClick={() => {
							handleTab();
							setMemberData(FakeData);
						}}
						disabled={loading}
					>
						{loading ? <Loading /> : '測試'}
					</Button>
					{message && <MessageStyled>{message}</MessageStyled>}
				</FormGroupStyled>
			</MemberChangeStyled>
			<MemberInfoContainer>
				{memberData?.member?.name && <MemberName>{memberData.member.name}</MemberName>}

				{memberData?.member && (
					<span>
						<AdminLink
							to={brands.find((e) => e.value === brand)?.page + memberData.member.id}
							target="_blank"
							rel="noopener noreferrer"
						>
							後台
						</AdminLink>
					</span>
				)}
			</MemberInfoContainer>
		</div>
	);
}

export default Menu;
