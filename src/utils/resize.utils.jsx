import { useState, useEffect } from 'react';

const getWindowSize = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	return {
		width,
		height,
	};
};

function Resize() {
	const [windowsSize, setWindowsSize] = useState(getWindowSize());
	useEffect(() => {
		function handleResize() {
			setWindowsSize(getWindowSize());
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowsSize;
}

export default Resize;
