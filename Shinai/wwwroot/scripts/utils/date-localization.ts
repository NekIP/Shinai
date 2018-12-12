import { Dayjs } from 'dayjs';
import { dayjs, DayOfWeek } from './date.ts';

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

	static getCleanLanguage(language: string): string {
		let result = language.split('-');
		return result[0];
	}

	static formatLocalizedDate(date: Date | Dayjs | string, language: string, format: string) {
		return dayjs(date).locale(this.getCleanLanguage(language)).format(format);
	}

	static getLocalizedStartOfWeek(date: Date | Dayjs | string, dayStartOfWeek: DayOfWeek) {
		let result = dayjs(date).clone().locale("en");
		let sunday = result.startOf('week');
		return this.startOfWeekConvertors[dayStartOfWeek.toString()](sunday);
	}

	static getLocalizedEndOfWeek(date: Date | Dayjs | string, dayStartOfWeek: DayOfWeek) {
		let result = dayjs(date).clone().locale("en");
		let saturday = result.endOf('week');
		return this.startOfWeekConvertors[dayStartOfWeek.toString()](saturday);
	}
}