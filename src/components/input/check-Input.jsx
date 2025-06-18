import styled from 'styled-components';

export const CheckInput = ({ label, inputOption }) => {
	return (
		<Group>
			{label && <LabelStyle htmlFor={inputOption.id}>{label}</LabelStyle>}
			<InputCheckbox
				type="checkbox"
				{...inputOption}
			/>
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

const InputCheckbox = styled.input`
	width: 16px;
	height: 16px;
	margin-right: 8px;
	cursor: pointer;
`;
