import styled, { css } from 'styled-components';

export const FormSelect = ({ label, selectOptions, ...otherProps }) => {
	return (
		<Group>
			<Select {...otherProps}>
				<option
					value=""
					disabled
					hidden
				>
					請選擇
				</option>
				{selectOptions.map((option) => (
					<option
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</Select>
			{label && <FormSelectLabel $shrink={otherProps.value.length}>{label}</FormSelectLabel>}
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

const FormSelectLabel = styled.label`
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

const Select = styled.select`
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
	cursor: pointer;
	appearance: none;

	&:focus {
		outline: none;
	}

	&:focus ~ ${FormSelectLabel} {
		${shrinkLabelStyles}
	}
`;

const Group = styled.div`
	position: relative;
	margin: 0;
`;
