import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

export const CustomScroll = ({ children }) => {
	const containerRef = useRef(null);
	const contentRef = useRef(null);
	const [isScrollable, setIsScrollable] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		const checkScroll = () => {
			const isScroll = content.scrollHeight > container.clientHeight;
			setIsScrollable(isScroll);
		};

		// 初始檢查
		checkScroll();

		// 觀察內容變化
		const resizeObserver = new ResizeObserver(() => {
			checkScroll();
		});
		resizeObserver.observe(content);

		// 清除觀察器
		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	const onWheel = (e) => {
		if (!isScrollable) return;
		containerRef.current.scrollTop += e.deltaY;
	};

	return (
		<ScrollArea
			ref={containerRef}
			onWheel={onWheel}
			$scroll={isScrollable}
		>
			<Content ref={contentRef}>{children}</Content>
		</ScrollArea>
	);
};
const ScrollArea = styled.div`
	width: 100%;
	max-height: inherit;
	overflow-y: ${({ $scroll }) => ($scroll ? 'auto' : 'hidden')};
	position: relative;
	/* Webkit 瀏覽器 (Chrome, Edge, Safari) */
	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-track {
		background: #fff;
	}
	&::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 4px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`;
const Content = styled.div`
	padding-right: 10px;
`;
