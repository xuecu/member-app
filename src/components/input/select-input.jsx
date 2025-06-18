import styled from 'styled-components';

export const SelectInput = ({ label, inputOption, options = [] }) => {
	return (
		<Group>
			{label && <LabelStyle htmlFor={inputOption.id}>{label}：</LabelStyle>}
			<Select {...inputOption}>
				{options.map((option, i) => (
					<option
						key={i}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</Select>
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

const Select = styled.select`
	background-color: white;
	color: ${subColor};
	font-size: 18px;
	padding: 10px;
	width: 100%;
	border: none;
	border-bottom: 1px solid ${subColor};

	&:focus {
		outline: none;
		border-color: ${mainColor};
	}
`;
