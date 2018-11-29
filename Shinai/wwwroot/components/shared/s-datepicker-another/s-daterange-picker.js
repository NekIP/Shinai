import dayjs from 'dayjs';
import Vue from 'vue';

import calendarSheet from './calendar-sheet/calendar-sheet.vue';
import { 
	Utilities, 
	DateRange, 
	StateChangeEventArgs
} from '../../../scripts/datepicker/definitions.js';

export default {
	data: function() {
		return {
			startCalendarInitializerPivotDate: this.value.startDate 
				? this.value.startDate 
				: new Date(),
			endCalendarInitializerPivotDate: this.value.endDate 
				? this.value.endDate 
				: new Date(),
			bus: new Vue(),
			selectedStartDateId: "",
			selectedEndDateId: "",
			hoveredDateId: "",
			datesSelector: (date) => false
		}
	},
	props: {
		value: DateRange,
		unlinkPanels: {
			type: Boolean,
			default: false
		}
	},
	components: {
		'calendar-sheet': calendarSheet
	},
	computed: {
		startHeader: function() {
			return dayjs(this.startCalendarInitializerPivotDate).format('MMM YYYY');
		},
		endHeader: function() {
			return dayjs(this.endCalendarInitializerPivotDate).format('MMM YYYY');
		},
		canSwitchMonthInUnlinkedPanel() {
			var temp = dayjs(this.startCalendarInitializerPivotDate).isBefore(dayjs(this.endCalendarInitializerPivotDate)) &&
				(Math.abs(dayjs(this.startCalendarInitializerPivotDate).diff(dayjs(this.endCalendarInitializerPivotDate), "month")) >= 2);
	
			return temp;
		},
	},
	watch: {
		value: {
			handler: function() {
				if (this.value.startDate) {
					this.selectedStartDateId = Utilities.generateIdForDate(this.value.startDate);
				} else {
					this.selectedStartDateId = "";
				}
	  
				if (this.value.endDate) {
					this.selectedEndDateId = Utilities.generateIdForDate(this.value.endDate);
				} else {
					this.selectedEndDateId = "";
				}
			},
			deep: true
		},
		selectedStartDateId: function() {
			this.emitStateChange();
		},
		selectedEndDateId: function() {
			this.emitStateChange();
		},
		hoveredDateId: function() {
			this.emitStateChange();
		},
		datesSelector: function() {
			this.emitStateChange();
		}
	},
	created() {
		this.selectedStartDateId = Utilities.generateIdForDate(this.value.startDate);
		this.selectedEndDateId = Utilities.generateIdForDate(this.value.endDate);             
	},
	filters: {
		dateToString(date) {
			if (!date) {
				return "";
			}
			// Specific format for date input.
			return dayjs(date).format("YYYY-MM-DD");
		}  
	},
	methods: {
		tryToSetSelectedStartDate(startDate) {
			if (!startDate) {
				return;
			}

			if (this.value.endDate && 
				dayjs(startDate).isAfter(dayjs(this.value.endDate))) {
				return;       
			}
			
			this.value.startDate = startDate;
		},
		tryToSetSelectedEndDate(endDate) {
			if (!endDate) {
				return;
			}

			if (this.value.startDate && 
				dayjs(startDate).isAfter(dayjs(this.value.endDate))) {
				return;       
			}
			
			this.value.endDate = endDate;
		},
		emitStateChange() {
			var args = new StateChangeEventArgs(
				[ this.selectedStartDateId, this.selectedEndDateId ], 
				this.hoveredDateId, 
				this.datesSelector);

			this.bus.$emit('state-change', args);
		},
		startPrevMonth() {
			var temp = dayjs(this.startCalendarInitializerPivotDate);
			temp = temp.subtract(1, "months");
			this.startCalendarInitializerPivotDate = temp.toDate();

			if (!this.unlinkPanels) {
				this.endPrevMonth();
			}
		},
		startNextMonth() {
			if (this.canSwitchMonthInUnlinkedPanel) { 
				var temp = dayjs(this.startCalendarInitializerPivotDate);
				temp = temp.add(1, "months");
				this.startCalendarInitializerPivotDate = temp.toDate();

				if (!this.unlinkPanels) {
					this.endNextMonth();
				}
			}    
		},
		endPrevMonth() {
			if (this.canSwitchMonthInUnlinkedPanel) {
				var temp = dayjs(this.endCalendarInitializerPivotDate).subtract(1, "months");
				this.endCalendarInitializerPivotDate = temp.toDate();
	
				if (!this.unlinkPanels) {
					this.startPrevMonth();
				}
			}
		},
		endNextMonth() {
			var temp = dayjs(this.endCalendarInitializerPivotDate).add(1, "months");
			this.endCalendarInitializerPivotDate = temp.toDate();

			if (!this.unlinkPanels) {
				this.startNextMonth();
			}
		},
		handleMouseOver(e) {
			this.hoveredDateId = e.id;
			if (this.value.startDate != null && this.value.endDate == null) {
				this.datesSelector = (date) => {
					return dayjs(date).isAfter(dayjs(this.value.startDate)) &&
						dayjs(date).isBefore(dayjs(e.date));
				};
			}
		},
		handleMouseOut(e) {
			this.hoveredDateId = null;
		},
		handleMouseClick(e) {
			if (!this.value.startDate && !this.value.endDate) {
				this.value.startDate = e.date;
				this.datesSelector = (date) => false;
			} else if (this.value.startDate && !this.value.endDate) {
				if (dayjs(e.date).isBefore(dayjs(this.value.startDate))) {
					this.value.startDate = e.date;
				} else {
					this.value.endDate = e.date;
				}
				this.datesSelector = (date) => {
					return dayjs(date).isAfter(dayjs(this.value.startDate)) &&
						dayjs(date).isBefore(dayjs(this.value.endDate));
				};
			} else {
				this.value.startDate = e.date;
				this.value.endDate = null;
				this.datesSelector = (date) => false;
			}
		}
	}
}
