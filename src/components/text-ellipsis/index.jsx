import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';

const ColChildStyled = styled.div`
	${({ $minWidth }) => $minWidth && `min-width: ${$minWidth};`}
	${({ $maxWidth }) => $maxWidth && `max-width: ${$maxWidth};`}
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: ${({ $lineClamp }) => $lineClamp || 2};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	word-break: break-word;
`;

const TextEllipsis = ({ text = '', maxWidth, minWidth, lineClamp = 2, title }) => {
	const [showTooltip, setShowTooltip] = useState(false);
	const contentRef = useRef(null);

	useEffect(() => {
		const node = contentRef.current;
		if (node) {
			const isOverflowing =
				node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth;
			setShowTooltip(isOverflowing);
		}
	}, [text]);

	const content = (
		<ColChildStyled
			ref={contentRef}
			$lineClamp={lineClamp}
			$maxWidth={maxWidth}
			$minWidth={minWidth}
		>
			{text}
		</ColChildStyled>
	);

	return showTooltip ? <Tooltip title={title ?? text}>{content}</Tooltip> : content;
};

export default TextEllipsis;
