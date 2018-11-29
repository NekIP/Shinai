import dayjs from 'dayjs';
import Vue from 'vue';

import calendarSheet from './calendar-sheet/calendar-sheet.vue';
import { Utilities, StateChangeEventArgs } from '../../../scripts/datepicker/definitions.js';

export default {
	data: function() {
		return {
			initializerPivotDate: this.getNewPivotDate(),
			bus: new Vue(),
			selectedDateId: "",
			hoveredDateId: ""
		}
	},
	props: {
		value: Date,
		datesValidator: Function
	},
	components: {
		'calendar-sheet': calendarSheet
	},
	computed: {
		header: function() {
			return dayjs(this.initializerPivotDate).format('MMM YYYY');
		}
	},
	watch: {
		value: function(newVal, oldVal) {
			if (dayjs(newVal).month() != dayjs(oldVal).month() || 
				dayjs(newVal).year() != dayjs(oldVal).year())
			{
				this.initializerPivotDate = this.getNewPivotDate();
			}

			this.selectedDateId = Utilities.generateIdForDate(this.value);
		},
		selectedDateId: function() {
			this.emitStateChange();
		}
	},
	created() {
		this.selectedDateId = dayjs(this.value).format("YYYY-MM-DD");             
	},
	filters: {
		dateToString(date) {
			if (!date) {
				return "";
			}

			return dayjs(date).format("YYYY-MM-DD");
		}  
	},
	methods: {
		emitStateChange() {
			var args = new StateChangeEventArgs(
				[ this.selectedDateId ], 
				this.hoveredDateId, 
				null); 

			this.bus.$emit('state-change', args);
		},
		tryToSetSelectedDate(date) {
			if (date) {
				this.value = date;
			}
		},
		getNewPivotDate() {
			if (this.value) {
				return Utilities.getFirstDayOfDateMonth(this.value);
			}

			return Utilities.getFirstDayOfDateMonth(new Date());
		},
		nextMonth() {
			var temp = dayjs(this.initializerPivotDate);
			temp = temp.add(1, "months");
			this.initializerPivotDate = temp.toDate();
		},
		prevMonth() {
			var temp = dayjs(this.initializerPivotDate).toDate();
			temp.setDate(0);
			temp.setDate(1);
			this.initializerPivotDate = temp;
		},
		handleMouseOver(e) {
			this.hoveredDateId = e.id;
		},
		handleMouseOut(e) {
			this.hoveredDateId = null;
		},
		handleMouseClick(e) {
			this.value = e.date;
		}
	}
}
