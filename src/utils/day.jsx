import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const formatTaiwanTime = (time) => (time ? dayjs(time).format('YYYY-MM-DD') : 'N/A');

export const formatDayjs = (time) => {
	return dayjs
		.utc(time) // 轉成 UTC
		.add(1, 'day') // 加 1 天
		.subtract(1, 'second') // 減少 1 秒
		.format('YYYY-MM-DDTHH:mm:ss+00:00'); // 格式化為 UTC 標準時間
};
