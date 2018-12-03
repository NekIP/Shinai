import dayjs from 'dayjs';

import 'dayjs/locale/ru';
import 'dayjs/locale/ja';
import 'dayjs/locale/es';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';

export default class DateLocalizationUtils {
	static startOfWeekConvertors = {
		'saturday': x => x.add(-1, 'day'),
		'sunday': x => x,
		'monday': x => x.add(1, 'day'),
		'tuesday': x => x.add(2, 'day'),
		'wednesday': x => x.add(3, 'day'),
		'thursday': x => x.add(4, 'day'),
		'friday': x => x.add(5, 'day')
	};

	static getCleanLanguage(language) {
		let result = language.split('-');
		return result[0];
	}

	static formatLocalizedDate(date, language, format) {
		return dayjs(date).locale(this.getCleanLanguage(language)).format(format);
	}

	static getLocalizedStartOfWeek(date, dayStartOfWeek) {
		let result = dayjs(date).clone().locale("en");
		let sunday = result.startOf('week');
		return this.startOfWeekConvertors[dayStartOfWeek](sunday);
	}

	static getLocalizedEndOfWeek(date, dayStartOfWeek) {
		let result = dayjs(date).clone().locale("en");
		let saturday = result.endOf('week');
		return this.startOfWeekConvertors[dayStartOfWeek](saturday);
	}
}