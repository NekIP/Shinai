import { mapState } from 'vuex';
import dayjs from 'dayjs';
import vClickOutside from 'v-click-outside'

import { DateRange, getDateRanges } from './s-datepicker-range.functions';

import StringUtils from 'utils/string';
import DateLocalizationUtils from 'utils/date-localization';
import TwoSideBindingUtils from 'utils/vue/two-side-binding';

export default {
	name: 'datepicker-range',
	computed: {
		...mapState({
			language: state => state.localization.language
		}),

		allDateRanges() {
			let firstDayOfWeek = this.getFirstDayOfWeek();
			return getDateRanges(firstDayOfWeek);
		},

		availableDateRanges() {
			let result = [];
			for (let i in this.dateRangeKeys) {
				let key = this.dateRangeKeys[i];
				let dateRange = this.allDateRanges[key];
				if (dateRange) {
					dateRange.value.key = key;
					result.push(dateRange);
				}
			}
			return result;
		}
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
				'LAST_30_DAYS'/*, 
				'CUSTOM_DATE_RANGE'*/
			]
		},
		initialRangeKey: {
			type: String,
			required: false,
			default: 'TODAY'
		},
		enabledChangeDateWhenHovered: {
			type: Boolean,
			required: false,
			default: true
		},
		enabledDateRange: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	data() {
		return {
			expanded: false,
			selectedDateRange: undefined
		}
	},
	created() {
		if (!this.startDate) {
			this.selectedDateRange = (this.allDateRanges[this.initialRangeKey] || this.allDateRanges['TODAY']).value;
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
				this.apply();
			}
		},

		hoverDateRange(dateRange) {
			if (this.enabledChangeDateWhenHovered && dateRange.key != 'CUSTOM_DATE_RANGE') {
				this.startDate = dateRange.startDate.clone();
				this.endDate = dateRange.endDate.clone();
			}
		},

		apply() {
			this.updateParentDate();
			this.hide();
		},

		updateParentDate() {
			TwoSideBindingUtils.updateParentField(this, this.startDate, 'startDate');
			TwoSideBindingUtils.updateParentField(this, this.endDate, 'endDate');
		},

		formatLocalizedDate(date, format) {
			let localizedFormatedDate = DateLocalizationUtils
				.formatLocalizedDate(date, this.language, format);
			return StringUtils.capitalizeFirstLetter(localizedFormatedDate);
		},

		getFirstDayOfWeek() {
			return this.$t("firstDayOfWeek");
		}
	}
}