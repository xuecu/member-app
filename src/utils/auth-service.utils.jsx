const apiUrl = 'https://gas-proxy-server.zeabur.app/api';

// **通用 API 請求函式**
async function SendRequest(data) {
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (response.status === 500)
			throw new Error(`HTTP error! Status: ${response.status}, 連接GAS失敗`);

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('錯誤:', error);
		return { success: false, message: error.message };
	}
}

export default SendRequest;
