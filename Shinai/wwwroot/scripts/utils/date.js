import dayjs from 'dayjs';

export default class DateUtils {
	static weekdays = [
		'saturday',
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday'
	]

	static convertDate(date) {
		if (date == undefined) {
			return dayjs();
		}
		if (dayjs.isDayjs(date)) {
			return date;
		}
		if (date instanceof Date || date instanceof String) {
			return dayjs(date);
		}
		throw new Error("Unrecognized format of date!");
	}

	static getWeekdaysFromFirstDayOfWeek(firstDayOfWeek) {
		let result = [];
		let indexOfFirstDayOfWeek = -1;
		for (let i = 0; i < this.weekdays.length; i++) {
			let weekday = this.weekdays[i];
			if (weekday == firstDayOfWeek) {
				indexOfFirstDayOfWeek = i;
			}
			if (indexOfFirstDayOfWeek != -1) {
				result.push(weekday);
			}
		}
		if (indexOfFirstDayOfWeek != -1) {
			for (let i = 0; i < indexOfFirstDayOfWeek; i++) {
				let weekday = this.weekdays[i];
				result.push(weekday);
			}
		}
		return result;
	}

	static dateEquals(date1, date2) {
		if (date1 && date2) {
			return date1.format('DD/MM/YYYY') == date2.format('DD/MM/YYYY');
		}
		return false;
	}

	static dateInBorder(date, start, end) {
		return date.isBefore(end.clone().add(1, 'ms'))
			&& date.isAfter(start.clone().add(-1, 'ms'));
	}
}