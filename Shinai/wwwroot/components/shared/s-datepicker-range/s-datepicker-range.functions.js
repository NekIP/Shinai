import dayjs from 'dayjs';

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

export const allDateRanges = {
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
			dayjs().startOf('day').startOf('w'), 
			dayjs().endOf('day').endOf('w')),
		'thisWeek'),        
	"LAST_WEEK": new DateRangeViewModel(
		new DateRange(
			dayjs().startOf('day').add(-1, 'w').startOf('w'), 
			dayjs().endOf('day').add(-1, 'w').endOf('w')), 
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
		'customDateRange'),
}