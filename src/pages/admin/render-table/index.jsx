import { useContext, useState, useEffect } from 'react';
import { AdminContext } from '@contexts/admin.context';
import { DeleteOutlined } from '@ant-design/icons';

import styled, { css } from 'styled-components';
import { LightBox } from '@components/light-box';
import EditModel from './edit-model';
import DelModel from './del-model';

const RenderTable = () => {
	const { permissions, signUp, pages, setPermissions, setPages, setSignUp } =
		useContext(AdminContext);
	const [search, setSearch] = useState([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editModalMail, setEditModalMail] = useState('');
	const [snapEditModal, setSnapEditModal] = useState({});
	const [isDelModalOpen, setIsDelModalOpen] = useState(false);
	const [delModalMail, setDelModalMail] = useState('');
	const [snapDelModal, setSnapDelModal] = useState({});

	const handleEditModalClose = () => {
		setIsEditModalOpen(false);
		if (Object.keys(snapEditModal).length > 0) {
			setPermissions(snapEditModal.promissions);
			setPages(snapEditModal.pages);
			setSignUp(snapEditModal.sign_up);
		}
	};
	const handleEditModalOpen = (mail = '') => {
		setIsEditModalOpen(true);
		setEditModalMail(mail);
	};
	const handleDelModalClose = () => {
		setIsDelModalOpen(false);
		if (Object.keys(snapDelModal).length > 0) {
			setPermissions(snapDelModal.promissions);
			setPages(snapDelModal.pages);
			setSignUp(snapDelModal.sign_up);
		}
	};
	const handleDelModalOpen = (mail = '') => {
		setIsDelModalOpen(true);
		setDelModalMail(mail);
	};

	const onChangeHandler = (event) => {
		const { value } = event.target;
		const searchString = value.toLowerCase();
		const newFilter = permissions.filter(({ legitimate }) =>
			legitimate.toLowerCase().includes(searchString)
		);
		setSearch(newFilter);
	};
	const filterAuth = (data) => {
		const personAuth = Object.keys(data).filter((item) => data[item] === true);
		if (personAuth.length === pages.length) return '管理員';
		const name = personAuth
			.map((item) => {
				return pages.find((page) => page.key === item).name;
			})
			.join('、');
		return name;
	};
	useEffect(() => {
		setSearch(permissions);
	}, [permissions]);
	return (
		<ContainerStyled>
			{isEditModalOpen && (
				<LightBox onClose={handleEditModalClose}>
					<EditModel
						mail={editModalMail}
						setSnapEditModal={setSnapEditModal}
					/>
				</LightBox>
			)}
			{isDelModalOpen && (
				<LightBox onClose={handleDelModalClose}>
					<DelModel
						mail={delModalMail}
						setSnapDelModal={setSnapDelModal}
					/>
				</LightBox>
			)}
			<InputStyled
				type="search"
				placeholder="搜尋mail"
				onChange={onChangeHandler}
			/>
			<RowStyled
				style={{ justifyContent: 'center' }}
				onClick={handleEditModalOpen}
			>
				+
			</RowStyled>
			{search &&
				search.map((data, key) => (
					<RowStyled
						key={key}
						onClick={() => handleEditModalOpen(data.legitimate)}
					>
						<div>
							<div>{data.admin_name ?? '未設定'}</div>
							<div>{data.legitimate}</div>
						</div>
						<div>{filterAuth(data)}</div>
						<div
							onClick={(e) => {
								e.stopPropagation();
								handleDelModalOpen(data.legitimate);
							}}
						>
							<DeleteOutlined />
						</div>
					</RowStyled>
				))}
		</ContainerStyled>
	);
};

// styled
const ContainerStyled = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 0;
`;
const RowStyled = styled.div`
	cursor: pointer;
	width: 100%;
	display: flex;
	padding: 20px;
	flex-direction: row;
	border: 1px solid transparent;
	border-radius: 20px;
	transition: border-radius, 0.3s;
	justify-content: space-between;
	align-items: center;
	&:hover {
		border: 1px solid #007bff;
		box-shadow: 0 0 10px #007bff3b;
	}
`;
const InputStyled = styled.input`
	border-radius: 20px;
	padding: 20px;
	border-color: #007bff;
	border-width: 1px;
`;

// #ff337a
export default RenderTable;
