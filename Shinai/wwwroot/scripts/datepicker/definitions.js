import dayjs from 'dayjs';


export class Utilities
{
	static generateIdForDate(date) {
		return dayjs(date).format("YYYY-MM-DD");
	}

	static getDateFromId(id) {
		var parts = id.split('-');
		var year = parseInt(parts[0]);
		var month = parseInt(parts[1]);
		var date = parseInt(parts[2]);

		return new Date(year, month - 1, date);
	}

	static getFirstDayOfDateMonth(date) {
		var temp = new Date(date);
		temp.setDate(1);
		return temp;
	}
}


export class StateChangeEventArgs
{
	/**
	 * @constructor
	 * @param {Array<string>} selectedDateIds array of strings (selected ids).
	 * @param {string} hoveredId id of hovered item.
	 * @param {Function} datesSelector selector predicate.
	 */
	constructor(selectedDateIds, hoveredId, datesSelector)
	{
		this.selectedDateIds = selectedDateIds;
		this.hoveredId = hoveredId;
		this.datesSelector = datesSelector;
	}
}


export class DateRange
{
	constructor(startDate, endDate)
	{
		this.startDate = startDate;
		this.endDate = endDate;
	}
}