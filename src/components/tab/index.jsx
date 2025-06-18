import React, { useState, useContext, Fragment } from 'react';
import styled, { css } from 'styled-components';

const targetTab = css`
	&::after {
		content: '';
		display: block;
		width: calc(100% - 5px);
		height: 4px;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		background-color: #007bff;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
`;

const TabStyled = styled.div`
	padding: 8px 15px;
	position: relative;
	display: inline-block;
	cursor: pointer;
	${({ $focus }) => $focus && targetTab}
	${({ order }) => order && `order: ${order};`}
	&:hover {
		color: #007bff;
	}
`;

export const Tab = ({ children, ...otherProps }) => {
	return <TabStyled {...otherProps}>{children}</TabStyled>;
};
