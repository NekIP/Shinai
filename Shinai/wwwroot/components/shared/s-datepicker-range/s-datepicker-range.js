import { mapState } from 'vuex';
import dayjs from 'dayjs';
import vClickOutside from 'v-click-outside'

import { DateRangeViewModel, DateRange } from './s-datepicker-range.functions';

import { capitalizeFirstLetter } from 'assistants/string';
import { formatLocalizedDate } from 'assistants/date-localization';
import { updateParentField } from 'assistants/vue/two-side-binding';


export default {
	name: 'datepicker-range',
	computed: {
		...mapState({
			language: state => state.localization.language
		})
	},
	directives: {
		clickOutside: vClickOutside.directive
	},
	props: {
		startDate: {
			type: Date | Object | undefined | null,
			required: true
		},
		endDate: {
			type: Date | Object | undefined | null,
			required: true
		},
		dateRangeKeys: {
			type: Array,
			required: false,
			default: () => [
				'TODAY', 
				'YESTERDAY', 
				'THIS_WEEK',
				'LAST_WEEK',
				'LAST_7_DAYS',
				'THIS_MONTH',  
				'LAST_MONTH', 
				'LAST_30_DAYS', 
				'CUSTOM_DATE_RANGE'
			]
		},
		initialRangeKey: {
			type: String,
			required: false,
			default: 'TODAY'
		}
	},
	data() {
		return {
			expanded: false,
			availableDateRanges: [],
			selectedDateRange: undefined,
			allDateRanges: {
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
		}
	},
	created() {
		if (!this.startDate) {
			this.selectedDateRange = (this.allDateRanges[this.initialRangeKey]
									|| this.allDateRanges['TODAY']).value;
			this.startDate = this.selectedDateRange.startDate; 
			this.endDate = this.selectedDateRange.endDate;
		}
		else {
			if (!dayjs.isDayjs(this.startDate)) {
				this.startDate = dayjs(this.startDate);
			}
			if (!this.endDate) {
				this.endDate = this.startDate.clone().endOf('d');
			}
			else if (!dayjs.isDayjs(this.endDate)) {
				this.endDate = dayjs(this.endDate);
			}
			this.selectedDateRange = new DateRange(
				this.startDate, 
				this.endDate)
		}
		this.updateParentDate();
		for (let i in this.dateRangeKeys) {
			let key = this.dateRangeKeys[i];
			let dateRange = this.allDateRanges[key];
			if (dateRange) {
				dateRange.value.key = key;
				this.availableDateRanges.push(dateRange);
			}
		}
	},
	methods: {
		hide() { 
			this.expanded = false 
		},

		isSelected(dateRange) { 
			return this.selectedDateRange == dateRange 
		},

		selectDateRange(dateRange) {
			this.selectedDateRange = dateRange;
			
			if (dateRange.key != 'CUSTOM_DATE_RANGE') {
				this.startDate = dateRange.startDate.clone();
				this.endDate = dateRange.endDate.clone();
				this.updateParentDate();
				this.hide();
			}
		},

		updateParentDate() {
			updateParentField(this, this.startDate, 'startDate');
			updateParentField(this, this.endDate, 'endDate');
		},

		formatLocalizedDate(date, format) {
			let localizedFormatedDate = formatLocalizedDate(date, this.language, format);
			return capitalizeFirstLetter(
				
			);
		}
	}
}