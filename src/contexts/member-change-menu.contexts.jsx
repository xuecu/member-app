import React, { createContext, useState } from 'react';

export const MemberChangeMenuContext = createContext({
	formFields: [],
	handleChange: () => {},
	handleReset: () => {},
	memberData: {},
	setMemberData: () => {},
});

const defaultFormFields = {
	email: '',
	brand: 'xuemi',
	category: 'leave',
};

export const MemberChangeMenuProvider = ({ children }) => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const [memberData, setMemberData] = useState({});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormFields({ ...formFields, [name]: value });
	};
	const handleReset = () => {
		setFormFields(defaultFormFields);
	};
	const value = {
		formFields,
		handleChange,
		handleReset,
		memberData,
		setMemberData,
	};

	return (
		<MemberChangeMenuContext.Provider value={value}>
			{children}
		</MemberChangeMenuContext.Provider>
	);
};
