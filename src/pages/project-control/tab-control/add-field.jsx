import { useState, useContext } from 'react';
import { ProjectControlContext } from '@contexts/project-control.context';
import SendRequest from '@utils/auth-service.utils';

import { Button } from 'antd';
import { FormInput } from '@/components/input';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';

function AddField() {
	const [name, setName] = useState('');
	const [load, setLoad] = useState(false);
	const { messages, handleMessage } = useMessage();
	const { project, setProject } = useContext(ProjectControlContext);

	const handleChange = (event) => {
		const { value } = event.target;
		setName(value);
	};
	const handleClick = async () => {
		if (name.length === 0 || load) return;
		const filterName = project.filter((pro) => pro.name === name);
		if (filterName.length > 0) {
			handleMessage({ type: 'error', content: '❌ 領域代號重複' });
			return;
		}
		handleMessage({ type: 'reset' });
		try {
			handleMessage({ type: 'single' });
			setLoad(true);
			const sendData = {
				name: name,
			};
			const send = {
				do: 'projectControlPost', // projectControlGet | projectControlPost
				what: 'addField',
				variables: JSON.stringify(sendData),
				staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
			};
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setProject(result.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};

	return (
		<div>
			{load && <LoadingOverlay />}
			<FormInput
				label="領域代號"
				inputOption={{
					type: 'text',
					required: true,
					onChange: handleChange,
					name: 'name',
					value: name,
				}}
			/>
			<Button onClick={handleClick}>{load ? <Loading /> : '送出'}</Button>
			<LoadingMessage message={messages} />
		</div>
	);
}

export default AddField;
