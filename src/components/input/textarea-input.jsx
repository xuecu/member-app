import styled from 'styled-components';

export const TextareaInput = ({ label, inputOption }) => {
	return (
		<Group>
			{label && <LabelStyle htmlFor={inputOption.id}>{label}：</LabelStyle>}
			<Textarea {...inputOption} />
		</Group>
	);
};
const subColor = 'grey';
const mainColor = 'black';
const Group = styled.div`
	display: flex;
	margin: 0;
	flex-direction: column;
	position: relative;
`;
const LabelStyle = styled.label`
	font-size: 16px;
	white-space: nowrap;
`;

const Textarea = styled.textarea`
	background: none;
	background-color: white;
	color: ${subColor};
	font-size: 18px;
	padding: 10px;
	display: block;
	width: 100%;
	border: 1px solid ${subColor};
	border-radius: 4px;
	min-height: 100px;
	resize: vertical;
	&:focus {
		outline: none;
		border-color: ${mainColor};
	}
`;
