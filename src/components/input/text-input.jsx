import styled from 'styled-components';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export const TextInput = ({
	label,
	showToggle = false,
	showPassword = false,
	onToggleClick = () => {},
	inputOption,
}) => {
	return (
		<Group>
			{label && <LabelStyle htmlFor={inputOption.id}>{label}：</LabelStyle>}
			<Input {...inputOption} />
			{showToggle && (
				<ToggleButton
					type="button"
					onClick={onToggleClick}
				>
					{showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
				</ToggleButton>
			)}
		</Group>
	);
};

const subColor = 'grey';
const mainColor = 'black';
const Group = styled.div`
	display: flex;
	margin: 0;
	align-items: center;
	position: relative;
`;
const LabelStyle = styled.label`
	font-size: 16px;
	white-space: nowrap;
`;

const Input = styled.input`
	background: none;
	background-color: white;
	color: ${subColor};
	font-size: 18px;
	padding: 10px 10px 10px 5px;
	display: block;
	width: 100%;
	border: none;
	border-radius: 0;
	border-bottom: 1px solid ${subColor};
	margin: 0;
	&:focus {
		outline: none;
	}
`;

const ToggleButton = styled.button`
	position: absolute;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
	background: transparent;
	border: none;
	cursor: pointer;
	font-size: 16px;
	color: ${subColor};

	&:hover {
		color: ${mainColor};
	}
`;
