import React, { useState, useEffect, useContext, Fragment } from 'react';
import { AuthContext } from '@contexts/auth.context';

import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import SendRequest from '@utils/auth-service.utils';
import { deepEqual } from '@utils/deep-equal.utils';
import {
	LoadingPage,
	Loading,
	useMessage,
	LoadingMessage,
	LoadingOverlay,
} from '@components/loading';
import { TextInput } from '@components/input';
import { LightBox } from '@/components/light-box';
import {} from './styled';

const containerStyles = css`
	display: flex;
	justify-content: center;
	width: 100%;
`;
const ContainerStyled = styled.div`
	${containerStyles}
	flex-direction: column;
	justify-content: start;
	gap: 30px;
	padding: 0;
`;
const FormContainer = styled.div`
	${containerStyles}
	flex-direction: row;
	gap: 30px;
	align-items: center;
	& > * {
		width: 100%;
	}
`;

const ImgBox = styled.div`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	overflow: hidden;
	position: relative;
	border: 1px gray;
	border-style: ${(props) => props.$borderLine || 'solid'};
`;
const ImgStyled = styled.img`
	width: 100%;
	height: 100%;
	object-fit: contain;
`;
const DefaultImgStyled = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	background-color: rgba(0, 0, 0, 0.3);
	justify-content: center;
	align-items: center;
	color: white;
`;
const ImgContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 20px;
`;
const AddImgBtn = styled.div`
	display: flex;
	justify-content: center;
	align-self: center;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	> :first-child {
		opacity: 0.5;
	}
`;

const defaultImageData = {
	comfirmImage: '',
};
const defaultPasswordData = {
	password: '',
	showPassword: false,
	newPassword: '',
	showNewPassword: false,
	confirmPassword: '',
	showConfirmPassword: false,
};

const PasswordBox = ({ data, setData, onchange }) => {
	const [loading, setLoading] = useState(false);
	const { messages, handleMessage } = useMessage();

	const handleSubmit = async () => {
		handleMessage({ type: 'reset' });
		if (data.password.lenght === 0) {
			handleMessage({ type: 'error', content: '請輸入原密碼' });
			return;
		}
		if (data.newPassword.lenght === 0) {
			handleMessage({ type: 'error', content: '請輸入新密碼' });
			return;
		}
		if (data.confirmPassword.lenght === 0) {
			handleMessage({ type: 'error', content: '請輸入再次確認的密碼' });
			return;
		}
		if (data.newPassword !== data.confirmPassword) {
			handleMessage({ type: 'error', content: '密碼核對有誤，請重新確認' });
			return;
		}
		if (loading) return;

		const variable = { ...data };
		try {
			setLoading(true);
			handleMessage({ type: 'single' });
			const data = {
				do: 'memberPost',
				what: 'person-reset-password',
				variables: JSON.stringify(variable),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const result = await SendRequest(data);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(result.message);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setData((prev) => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	const handleToggle = (key) => {
		setData((prev) => ({ ...prev, [key]: !data[key] }));
	};
	return (
		<ContainerStyled>
			{loading && <LoadingOverlay />}
			<TextInput
				label="原密碼"
				showToggle={true}
				showPassword={data.showPassword}
				onToggleClick={() => handleToggle('showPassword')}
				inputOption={{
					type: `${data.showPassword ? 'text' : 'password'}`,
					name: 'password',
					value: data.password,
					onChange: onchange,
				}}
			/>
			<TextInput
				label="新密碼"
				showToggle={true}
				showPassword={data.showNewPassword}
				onToggleClick={() => handleToggle('showNewPassword')}
				inputOption={{
					type: `${data.showNewPassword ? 'text' : 'password'}`,
					name: 'newPassword',
					value: data.newPassword,
					onChange: onchange,
				}}
			/>
			<TextInput
				label="再次確認密碼"
				showToggle={true}
				showPassword={data.showConfirmPassword}
				onToggleClick={() => handleToggle('showConfirmPassword')}
				inputOption={{
					type: `${data.showConfirmPassword ? 'text' : 'password'}`,
					name: 'confirmPassword',
					value: data.confirmPassword,
					onChange: onchange,
				}}
			/>
			{messages && <LoadingMessage message={messages} />}

			<Button onClick={() => handleSubmit()}>送出</Button>
		</ContainerStyled>
	);
};

const RenderPage = () => {
	const [memberData, setMemberData] = useState({});
	const [snapData, setSnapData] = useState({});
	const [loading, setLoading] = useState(false);
	const [resetPassword, setResetPassword] = useState(false);
	const { messages, handleMessage } = useMessage();
	const { member, updateMember } = useContext(AuthContext);

	console.log(snapData);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setSnapData({ ...snapData, [name]: value });
	};
	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) {
			setSnapData((prev) => ({ ...prev, comfirmImage: '' }));
			return;
		}
		// 檢查型別
		if (!(file instanceof Blob || file instanceof File)) {
			console.error('Not a valid file:', file);
			setSnapData((prev) => ({ ...prev, comfirmImage: '' })); // 也清空
			return;
		}
		try {
			const options = { maxWidthOrHeight: 200, useWebWorker: true };
			const compressedFile = await imageCompression(file, options);
			const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
			setSnapData({ ...snapData, comfirmImage: base64 });
		} catch (error) {
			console.error('Image compression error:', error);
			setSnapData((prev) => ({ ...prev, comfirmImage: '' })); // 壓縮錯誤也清空
		}
	};
	const handleReset = () => {
		setSnapData(memberData);
	};
	const handleChangeLightBox = () => {
		setResetPassword(!resetPassword);
		setSnapData((prev) => ({ ...prev, ...defaultPasswordData }));
	};
	const handleSubmit = async () => {
		handleMessage({ type: 'reset' });

		if (deepEqual(memberData, snapData)) {
			handleMessage({ type: 'error', content: '沒有需要修改的內容' });
			return;
		}
		if (loading) return;

		const {
			router,
			showConfirmPassword,
			showNewPassword,
			showPassword,
			password,
			newPassword,
			confirmPassword,
			imageUrl,
			...variable
		} = snapData;

		try {
			setLoading(true);
			handleMessage({ type: 'single' });
			const data = {
				do: 'memberPost',
				what: 'edit-member',
				variables: JSON.stringify(variable),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const result = await SendRequest(data);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(result.message);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			updateMember(JSON.parse(result.data));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		setMemberData({ ...member, ...defaultImageData, ...defaultPasswordData });
		setSnapData({ ...member, ...defaultImageData, ...defaultPasswordData });
	}, [member]);

	return (
		<ContainerStyled>
			<ImgContainer>
				<ImgBox>
					{snapData.imageUrl !== '' ? (
						<ImgStyled src={snapData.imageUrl} />
					) : (
						<DefaultImgStyled>未設置</DefaultImgStyled>
					)}
				</ImgBox>
				<ImgBox
					style={{ position: 'relative' }}
					$borderLine="dashed"
				>
					{snapData.comfirmImage !== '' ? (
						<ImgStyled src={snapData.comfirmImage} />
					) : (
						<DefaultImgStyled />
					)}
					<input
						type="file"
						accept="image/*"
						style={{ display: 'none' }}
						onChange={handleImageChange}
						id="uploadImageInput"
					/>
					<AddImgBtn onClick={() => document.getElementById('uploadImageInput').click()}>
						<PlusOutlined />
					</AddImgBtn>
				</ImgBox>
			</ImgContainer>
			<FormContainer>
				<TextInput
					label="姓名"
					inputOption={{
						type: 'text',
						onChange: handleChange,
						name: 'user_name',
						value: snapData.user_name || '',
					}}
				/>
				<TextInput
					label="電話"
					inputOption={{
						type: 'phone',
						onChange: handleChange,
						name: 'phone',
						value: snapData.phone || '',
					}}
				/>
			</FormContainer>
			<FormContainer>
				<TextInput
					label="信箱"
					inputOption={{
						type: 'text',
						onChange: handleChange,
						name: 'mail',
						value: snapData.mail || '',
					}}
				/>
				<Button onClick={() => handleChangeLightBox()}>重設密碼</Button>
			</FormContainer>
			<FormContainer>
				<div>專案選擇</div>
			</FormContainer>
			{messages && <LoadingMessage message={messages} />}
			<FormContainer>
				<Button onClick={handleReset}>還原</Button>
				<Button
					type="primary"
					onClick={() => handleSubmit()}
				>
					儲存
				</Button>
			</FormContainer>
			{resetPassword && (
				<LightBox onClose={() => handleChangeLightBox()}>
					<PasswordBox
						data={snapData}
						onchange={handleChange}
						setData={setSnapData}
					/>
				</LightBox>
			)}
		</ContainerStyled>
	);
};

function Member() {
	const { member } = useContext(AuthContext);

	const LoadingCheck = () => {
		return (
			<Fragment>
				{member.hasOwnProperty('id') > 0 ? <RenderPage /> : <LoadingPage />}
			</Fragment>
		);
	};

	return (
		<ContainerStyled>
			<h2>會員頁</h2>
			<LoadingCheck />
		</ContainerStyled>
	);
}

export default Member;
