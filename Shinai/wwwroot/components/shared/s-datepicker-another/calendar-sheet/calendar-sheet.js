import dayjs from 'dayjs';
import { Utilities } from '../../../../scripts/datepicker/definitions.js';


class CalendarSheetItem 
{
	constructor(date, isInMonth) {
		this.id = Utilities.generateIdForDate(date);
		this.date = date;
		this.isInMonth = isInMonth;
	}
}


export default {
	props: {
		bus: Vue,
		initializerPivotDate: Date,
		firstDayOfWeek: {
			// 0 for Sunday, 6 for Saturday.
			default: 0,
			validator: function (value) {
				return (value >= 0 && value <= 6)
			}
		},
		disabledDatesValidator: Function
	},
	created() {
		this.bus.$on('state-change', (stateChangeEventArgs) => {
			this.handleBusEvent(stateChangeEventArgs);
		});
	},
	mounted() {
		this.items = this.populateCalendarSheet();
	},
	data() {
		return {
			month: this.initializerPivotDate.getMonth(),
			items: [],
			isBusy: false,
			queuedTasks: [],
			selectedIds: [],
			hoveredId: "",
			datesSelector: (date) => false
		}
	},
	watch: { 
		initializerPivotDate: function() {
			this.month = this.initializerPivotDate.getMonth();
			
			this.populateCalendarSheet();
		},
		selectedIds: function() {
		}
	},
	methods: {
		isSelected(id) {
			return this.selectedIds.findIndex(selectedId => selectedId === id) != -1;
		},
		isHovered(id) {
			return id === this.hoveredId;
		},
		isInRange(id) {
			return this.datesSelector(
				Utilities.getDateFromId(id));
		},
		deleteProperties(objectToClean) {
			for (var x in objectToClean) {
				this.$delete(objectToClean, x);
			} 
		},
		handleBusEvent(stateChangeEventArgs) {
			this.selectedIds = [];
			this.hoveredId = "";
			this.datesSelector = (date) => false;
			
			if (stateChangeEventArgs.selectedDateIds) {
				this.selectedIds = stateChangeEventArgs.selectedDateIds;
			}

			if (stateChangeEventArgs.hoveredId) {
				this.hoveredId = stateChangeEventArgs.hoveredId;
			}

			if (stateChangeEventArgs.datesSelector) {
				this.datesSelector = stateChangeEventArgs.datesSelector;
			}
		},
		populateCalendarSheet() {
			this.isBusy = true;

			return new Promise((resolve) => {
				var items = [];

				var calendarSheetFirstDay = null;
				
				var firstDayOfMonth = dayjs(this.initializerPivotDate)
					.startOf('month');
	
				var firstDayOfMonthWeekDay = firstDayOfMonth.day();
	
				var calendarSheetFirstDay = firstDayOfMonth;
			
				if (firstDayOfMonthWeekDay != this.firstDayOfWeek) {
					while (calendarSheetFirstDay.day() !== this.firstDayOfWeek) {
						calendarSheetFirstDay = calendarSheetFirstDay.subtract(1, "day");
					}
				}
	
				var calendarSheetLastDay = calendarSheetFirstDay
					.add(5, "week")
					.add(6, "day");
	
				var date = calendarSheetFirstDay;
				
				while (date <= calendarSheetLastDay) {
					var dateMonth = date.month();
	
					var newItem = new CalendarSheetItem(
						date.toDate(),
						this.month === dateMonth
					);
					items.push(newItem);
					date = date.add(1, "day");
				}
				
				setTimeout(() => resolve(items), 100);
			}).then((items) => {
				this.isBusy = false;
				this.items = items;
				
				this.doAllQueuedTasks();
			});
			
		},
		doAllQueuedTasks: function() {
			if (this.queuedTasks) {
				this.queuedTasks.forEach((task) => {
					if (task.funcName === this.handleBusEvent.name) {
						this.handleBusEvent(task.context);
					}
				});
			}	
		},
		notifyAboutMouseOver: function(sheetItem) {
			this.$emit('mouse-over-day', sheetItem);
		},
		notifyAboutMouseClick: function(sheetItem) {
			this.$emit('mouse-click-day', sheetItem);
		},
		notifyAboutMouseOut: function(sheetItem) {
			this.$emit('mouse-out', sheetItem);
		},
	}
}
