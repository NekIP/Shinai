import dayjs from 'dayjs';

import 'dayjs/locale/ru';
import 'dayjs/locale/ja';
import 'dayjs/locale/es';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';

function getCleanLanguage(language) {
	let result = language.split('-');
	return result[0];
}

export function formatLocalizedDate(date, language, format) {
	return dayjs(date).locale(getCleanLanguage(language)).format(format);
}

let startOfWeekConvertors = {
	'saturday': x => x.add(-1, 'day'),
	'sunday': x => x,
	'monday': x => x.add(1, 'day'),
	'tuesday': x => x.add(2, 'day'),
	'wednesday': x => x.add(3, 'day'),
	'thursday': x => x.add(4, 'day'),
	'friday': x => x.add(5, 'day')
};

export function getLocalizedStartOfWeek(date, dayStartOfWeek) {
	let result = dayjs(date).clone().locale("en");
	let sunday = result.startOf('week');
	return startOfWeekConvertors[dayStartOfWeek](sunday);
}

export function getLocalizedEndOfWeek(date, dayStartOfWeek) {
	let result = dayjs(date).clone().locale("en");
	let saturday = result.endOf('week');
	return startOfWeekConvertors[dayStartOfWeek](saturday);
}