import { useState, useEffect, useContext } from 'react';
import { ProjectControlContext } from '@contexts/project-control.context';
import SendRequest from '@utils/auth-service.utils';

import { Button } from 'antd';
import styled from 'styled-components';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';
import { TextInput } from '@/components/input';
import DropList from '@components/drop-list';

const GroupStyled = styled.div`
	margin-top: 20px;
	display: flex;
	gap: 10px;
	width: 100%;
	justify-content: end;
`;

function EditField() {
	const [list, setList] = useState([]);
	const [load, setLoad] = useState(false);
	const { messages, handleMessage } = useMessage();
	const { project, fieldMap, setProject } = useContext(ProjectControlContext);

	useEffect(() => {
		reset();
	}, [project]);

	const handleSorted = (updatedList) => {
		setList(updatedList);
	};

	const handleChange = (id, value) => {
		const updated = list.map((item) => (item.id === id ? { ...item, name: value } : item));
		setList(updated);
	};

	const handleClick = async () => {
		if (load) return;
		const filterList = list.filter(
			({ id, order, name }) => order !== fieldMap[id].order || name !== fieldMap[id].name
		);
		if (filterList.length === 0) {
			handleMessage({ type: 'error', content: '❌ 無內容需要更新' });
			return;
		}
		handleMessage({ type: 'reset' });
		try {
			handleMessage({ type: 'single' });
			setLoad(true);
			const send = {
				do: 'projectControlPost', // projectControlGet | projectControlPost
				what: 'editField',
				variables: JSON.stringify(filterList),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error' });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setProject(result.data);
		} catch (error) {
			console.error(JSON.stringify(error));
		} finally {
			setLoad(false);
		}
	};
	const reset = () => {
		const transformed = project.map(({ id, name, order }) => ({
			id,
			name,
			order,
		}));
		setList(transformed);
	};

	return (
		<div>
			{load && <LoadingOverlay />}
			<DropList
				data={list}
				onSort={handleSorted}
				renderItem={(item) => (
					<TextInput
						label="領域代號"
						inputOption={{
							id: item.id,
							type: 'text',
							required: true,
							onChange: (e) => handleChange(item.id, e.target.value),
							name: 'name',
							value: item.name,
						}}
					/>
				)}
			/>
			<GroupStyled>
				<Button onClick={reset}>{load ? <Loading /> : '還原'}</Button>
				<Button onClick={handleClick}>{load ? <Loading /> : '儲存'}</Button>
			</GroupStyled>
			<LoadingMessage message={messages} />
		</div>
	);
}

export default EditField;
