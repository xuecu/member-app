import React, { createContext, useState } from 'react';

export const MemberChangeMenuContext = createContext({
	formFields: [],
	handleChange: () => {},
	handleReset: () => {},
	handleTab: () => {},
	memberData: {},
	setMemberData: () => {},
});

const defaultFormFields = {
	email: '',
	brand: 'xuemi',
	category: 'search',
	tab: '',
};

export const MemberChangeMenuProvider = ({ children }) => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const [memberData, setMemberData] = useState({});

	const handleTab = (name) => {
		setFormFields({ ...formFields, tab: name || formFields.category });
	};
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
		handleTab,
		memberData,
		setMemberData,
	};

	return (
		<MemberChangeMenuContext.Provider value={value}>
			{children}
		</MemberChangeMenuContext.Provider>
	);
};
