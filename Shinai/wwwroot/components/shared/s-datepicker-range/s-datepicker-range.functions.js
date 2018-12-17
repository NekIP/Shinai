import dayjs from 'dayjs';
import DateLocalizationUtils from 'utils/date-localization';

export class DateRangeViewModel {
	constructor(value, label) {
		this.value = value;
		this.label = label;
	}
}

export class DateRange {
	constructor(start, end) {
		this.startDate = start;
		this.endDate = end;
	}
}

export function getDateRanges(firstDayOfWeek) {
	return {
		"TODAY": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day'), 
				dayjs().endOf('day')), 
			'today'),
		"YESTERDAY": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day').add(-1, 'd'), 
				dayjs().endOf('day').add(-1, 'd')),
			'yesterday'), 
		"THIS_WEEK": new DateRangeViewModel(
			new DateRange(
				DateLocalizationUtils.getLocalizedStartOfWeek(dayjs().startOf('day'), firstDayOfWeek), 
				DateLocalizationUtils.getLocalizedEndOfWeek(dayjs().endOf('day'), firstDayOfWeek)),
			'thisWeek'),        
		"LAST_WEEK": new DateRangeViewModel(
			new DateRange(
				DateLocalizationUtils.getLocalizedStartOfWeek(dayjs().startOf('day').add(-1, 'w'), firstDayOfWeek), 
				DateLocalizationUtils.getLocalizedEndOfWeek(dayjs().endOf('day').add(-1, 'w'), firstDayOfWeek)), 
			'lastWeek'),   
		"LAST_7_DAYS": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day').add(-6, 'd'), 
				dayjs().endOf('day')), 
			'last7Days'),
		"THIS_MONTH": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day').startOf('M'), 
				dayjs().endOf('day').endOf('M')),
			'thisMonth'),  
		"LAST_MONTH": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day').add(-1, 'M').startOf('M'), 
				dayjs().endOf('day').add(-1, 'M').endOf('M')), 
			'lastMonth'),
		"LAST_30_DAYS": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day').add(-29, 'd'), 
				dayjs().endOf('day')), 
			'last30days'),
		"CUSTOM_DATE_RANGE": new DateRangeViewModel(
			new DateRange(
				dayjs().startOf('day'), 
				dayjs().endOf('day')), 
			'customDateRange')
	}
}