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