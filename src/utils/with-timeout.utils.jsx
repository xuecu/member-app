async function WithTimeout(promise, timeout = 10000) {
	// 預設10秒
	return Promise.race([
		promise,
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error('請求超時，請稍後再試')), timeout)
		),
	]);
}

export default WithTimeout;
