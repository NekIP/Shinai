import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/ja';

function getCleanLanguage(language) {
	let result = language.split('-');
	return result[0];
}

export function formatLocalizedDate(date, language, format) {
	return dayjs(date).locale(getCleanLanguage(language)).format(format);
}