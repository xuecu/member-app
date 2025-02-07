import { FormSelectLabel, Group, Select } from './form-select.styled';

const FormSelect = ({ label, selectOptions, ...otherProps }) => {
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
			{label && <FormSelectLabel shrink={otherProps.value.length}>{label}</FormSelectLabel>}
		</Group>
	);
};

export default FormSelect;
