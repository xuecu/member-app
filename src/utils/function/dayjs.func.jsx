import dayjs from 'dayjs';

export const dateToLastTimeISOString = (date) => {
	const specifiedDate = dayjs(date).hour(23).minute(59).second(59).millisecond(999);
	return specifiedDate.toISOString();
};

export const dateTofirstTimeISOString = (date) => {
	const specifiedDate = dayjs(date).hour(0).minute(0).second(0).millisecond(0);
	return specifiedDate.toISOString();
};
export const dateToISOString = (date) => {
	const specifiedDate = dayjs(date);
	return specifiedDate.toISOString();
};

export const dateToYMD = (date) => {
	return dayjs(date).format('YYYY-MM-DD');
};

export const diffDays = (startDate, endDate) => {
	const diffDay = dayjs(endDate).diff(dayjs(startDate), 'day');
	return diffDay;
};

export const dateAddYear = (date) => {
	return dayjs(date).add(1, 'year');
};
