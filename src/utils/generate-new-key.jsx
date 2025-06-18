export default function generateNewKey(existingKeys) {
	if (!existingKeys || existingKeys.length === 0) {
		return '001';
	}
	// 先轉成數字陣列
	const keyNumbers = existingKeys.map((k) => parseInt(k, 10)).sort((a, b) => a - b);

	// 從 1 開始找空缺
	for (let i = 1; i <= keyNumbers[keyNumbers.length - 1]; i++) {
		if (!keyNumbers.includes(i)) {
			return String(i).padStart(3, '0');
		}
	}

	// 沒有空缺就補下一個
	const next = keyNumbers[keyNumbers.length - 1] + 1;
	return String(next).padStart(3, '0');
}
