import React from 'react';

/**
 * @param {React.Component[]} providers - 一組 Context Provider 陣列
 * @param {React.ReactNode} children - 要被包住的內容
 */
const CombinedProvider = ({ providers = [], children }) => {
	return providers.reduceRight((acc, Provider) => {
		return <Provider>{acc}</Provider>;
	}, children);
};

export default CombinedProvider;
