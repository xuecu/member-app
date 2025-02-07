import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

function UID(time) {
	// timestamp 13 + 7 = 20
	const alpha = 'abcdefghij';
	const timestampStr = dayjs(time).valueOf().toString();
	const code = timestampStr
		.split('') // ['1', '2', '3', '4', '5', '6', '7', ....]
		.map((v, idx) => (idx % 2 ? v : alpha[Number(v)])) // ['1', 'b', '3', 'd', '5', 'f', '7', ....]
		.join('');
	const id = uuidv4().split('-')[0];

	return `${code}${id.substring(0, id.length - 1)}`;
}

export default UID;
