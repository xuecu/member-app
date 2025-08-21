import { useState } from 'react';
import { Loading, LoadingMessage, useMessage } from '@components/loading';
import { Button } from 'antd';
import SendRequest from '@utils/auth-service.utils';
import styled from 'styled-components';

const DelModel = ({ mail = '', setSnapDelModal }) => {
	const { messages, handleMessage } = useMessage();
	const [load, setLoad] = useState(false);
	const submit = async () => {
		handleMessage({ type: 'reset' });
		const variables = {
			mail: mail.trim(),
		};
		const send = {
			do: 'adminPost',
			what: 'delAdmin',
			variables: JSON.stringify(variables),
			staffMail: JSON.parse(localStorage.getItem('memberApp')).mail,
		};
		try {
			setLoad(true);
			handleMessage({ type: 'single' });
			const result = await SendRequest(send);
			if (!result.success) {
				handleMessage({ type: 'error', content: `${result.message}` });
				throw new Error(`${result.message}`);
			}
			handleMessage({ type: 'single', content: `${result.message}` });
			handleMessage({ type: 'success' });
			setSnapDelModal(result.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoad(false);
		}
	};

	return (
		<FromStyled>
			<div>是否刪除</div>
			<div>{mail}</div>
			<LoadingMessage message={messages} />
			<FromRow $row>
				<Button onClick={submit}>{load ? <Loading /> : '刪除'}</Button>
			</FromRow>
		</FromStyled>
	);
};
const FromStyled = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;
const FromRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	text-align: center;
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	gap: 20px;
	& > * {
		flex: 1;
	}
`;

export default DelModel;
