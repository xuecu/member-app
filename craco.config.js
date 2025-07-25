const path = require('path');

module.exports = {
	webpack: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@hook': path.resolve(__dirname, 'src/hook'),
			'@pages': path.resolve(__dirname, 'src/pages'),
			'@contexts': path.resolve(__dirname, 'src/contexts'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@assets': path.resolve(__dirname, 'src/assets'),
		},
	},
};
