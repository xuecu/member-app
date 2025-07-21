import React, { useState, useContext, Fragment } from 'react';
import styled, { css } from 'styled-components';

const targetTab = css`
	&::after {
		content: '';
		display: block;
		width: calc(100% - 5px);
		height: 80%;
		border-radius: 10px;
		border: 1px solid #007bffb9;
		position: absolute;
		bottom: 0;
		left: 50%;
		top: 50%;

		transform: translate(-50%, -50%);
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

export const TabButton = ({ children, ...otherProps }) => {
	return <TabStyled {...otherProps}>{children}</TabStyled>;
};
