import styled, { css } from 'styled-components';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export const FormInput = ({
	label,
	inputOption,
	showToggle = false,
	showPassword = false,
	onToggleClick = () => {},
}) => {
	return (
		<Group>
			<Input {...inputOption} />
			{label && <FormInputLabel $shrink={inputOption.value.length}>{label}</FormInputLabel>}
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
const shrinkLabelStyles = css`
	top: -14px;
	font-size: 12px;
	color: ${mainColor};
`;

const FormInputLabel = styled.label`
	color: ${subColor};
	font-size: 16px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 5px;
	top: 10px;
	transition: 300ms ease all;

	${({ $shrink }) => $shrink && shrinkLabelStyles}
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
	margin: 25px 0;
	&:focus {
		outline: none;
	}
	&:focus ~ ${FormInputLabel} {
		${shrinkLabelStyles}
	}
`;

const Group = styled.div`
	position: relative;
	margin: 0;

	input[type='password'] {
		letter-spacing: 0.3em;
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
