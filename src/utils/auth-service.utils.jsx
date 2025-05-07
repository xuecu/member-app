import ObjectToQueryString from './object-to-query-string.utils';

const apiUrl =
	'https://script.google.com/macros/s/AKfycby6am72zJaa74cP-PB-KRhiQ_W_D00O6A_k9pthrpaMaEtPGct-sH4b5EwbvQdzAKiN/exec';

// **通用 API 請求函式**
async function SendRequest(data) {
	try {
		const queryString = ObjectToQueryString(data);
		const apiUrlWithParams = `${apiUrl}?${queryString}`;
		const response = await fetch(apiUrlWithParams, { method: 'GET', mode: 'cors' });

		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, 連接GAS失敗`);

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('錯誤:', error);
		return { success: false, message: error.message };
	}
}

export default SendRequest;
