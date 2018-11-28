<template>
	<div class="s-datepicker">
		<div class="calendar">
			<div class="header"> 
				<div class="prev">
					<div role="button" class="arrow-button" @click="decrimentDates">
						<i class="fa fa-chevron-left" aria-hidden="true"></i>
					</div>
				</div>
				<div class="info">{{formatLocalizedDate(localStartDate, 'MMM YYYY')}}</div>
				<div class="next"></div>
			</div>
			<div class="calendar-container">
				<div class="calendar">
					<ul class="weekdays">
						<li 	v-for="item in weekdaysInLocalizedOrder" 
								:key="item"
								class="weekday">
							{{$t(item)}}
						</li>
					</ul>
					<ul class="items">
						<template v-for="(item, i) in getBlockOfDaysIn(localStartDate)">           
							<li :key="i" class="item day" 
								:class="{
									'selected': item.selected,
									'focused': item.inThisMonth
								}">
								{{item.date.format("D")}}
							</li>
						</template>
					</ul>
				</div>
			</div>
		</div>
		<div class="calendar">
			<div class="header"> 
				<div class="prev"></div>
				<div class="info">{{formatLocalizedDate(localEndDate, 'MMM YYYY')}}</div>
				<div class="next">
					<div role="button" class="arrow-button" @click="incrementDates">
						<i class="fa fa-chevron-right" aria-hidden="true"></i>
					</div>
				</div>
			</div>
			<div class="calendar-container">
				<div class="calendar">
					<ul class="weekdays">
						<li 	v-for="item in weekdaysInLocalizedOrder" 
								:key="item"
								class="weekday">
							{{$t(item)}}
						</li>
					</ul>
					<ul class="items">
						<template v-for="(item, i) in getBlockOfDaysIn(localEndDate)">           
							<li :key="i" class="item day" 
								:class="{
									'selected': item.selected,
									'focused': item.inThisMonth,
									'ff': true
								}">
								{{item.date.format("D")}}
							</li>
						</template>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState } from 'vuex';
	import dayjs from 'dayjs';
	import 'dayjs/locale/ru';
	import { formatLocalizedDate, getLocalizedStartOfWeek, getLocalizedEndOfWeek } from 'assistants/date-localization';
	import { capitalizeFirstLetter } from 'assistants/string';
	
	function convertDate(date) {
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

	function setDate(setter, date) {
		setter(convertDate(date));
	}

	function getWeekdaysInLocalizedOrder(weekdays, firstDayOfWeek) {
		let result = [];
		let indexOfFirstDayOfWeek = -1;
		for (let i = 0; i < weekdays.length; i++) {
			let weekday = weekdays[i];
			if (weekday == firstDayOfWeek) {
				indexOfFirstDayOfWeek = i;
			}
			if (indexOfFirstDayOfWeek != -1) {
				result.push(weekday);
			}
		}
		if (indexOfFirstDayOfWeek != -1) {
			for (let i = 0; i < indexOfFirstDayOfWeek; i++) {
				let weekday = weekdays[i];
				result.push(weekday);
			}
		}
		return result;
	}

	function dateEquals(date1, date2) {
		return date1.format('DD/MM/YYYY') == date2.format('DD/MM/YYYY');
	}

	function dateInBorder(date, start, end) {
		return date.isBefore(end.clone().add(1, 'ms'))
			&& date.isAfter(start.clone().add(-1, 'ms'));
	}

	function getBlockOfDaysIn(date, firstDayOfWeek, startDate, endDate) {
		let startDateFocused = date.startOf('month');
		let endDateFocused = date.endOf('month');
		let startDateBlock = getLocalizedStartOfWeek(
			date.startOf('month'), 
			firstDayOfWeek);
		let endDateBlock = getLocalizedEndOfWeek(
			date.endOf('month').add(7, 'day'), 
			firstDayOfWeek);
		let result = [];
		for (let i = startDateBlock; 
				i.isBefore(endDateBlock.add(1, 'ms'));
				i = i.clone().add(1, 'day')) {
			let value = i.clone();
			result.push({
				date: i.clone(),
				selected: dateInBorder(i, startDateFocused, endDateFocused) && 
					(dateEquals(i, startDate) || dateEquals(i, endDate)),
				
				inThisMonth: dateInBorder(i, startDateFocused, endDateFocused) 
			});
		}
		return result;
	}
	
	export default {
		name: "datepicker",

		props: {
			startDate: {
				type: Date | Object | undefined,
				required: true
			},

			endDate: {
				type: Date | Object | undefined,
				required: true
			}
		},

		data() {
			return {
				weekdays: [
					'saturday',
					'sunday',
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday'
				],
				cache: {
					localEndDate: undefined,
					selectedStartDate: undefined,
					selectedEndDate: undefined
				},
				selecting: false,
				hoveredDate: undefined
			}
		},

		computed: {
			...mapState({
				styleClass: state => state.base.styleClass,
				language: state => state.localization.language
			}),

			localStartDate: {
				get() {
					return this.localEndDate.clone().add(-1, 'month');
				},
				set(value) {
					this.cache.startDate = value;
				}
			},

			localEndDate: {
				get() {
					return this.cache.localEndDate || convertDate(this.endDate);
				},
				set(value) {
					this.cache.localEndDate = value;
				}
			},

			selectedStartDate: {
				get() {
					return this.cache.selectedStartDate || convertDate(this.startDate);
				},
				set(value) {
					this.cache.selectedStartDate = value;
				}
			},

			selectedEndDate: {
				get() {
					return this.cache.selectedEndDate || convertDate(this.endDate);
				},
				set(value) {
					this.cache.selectedEndDate = value;
				}
			},

			weekdaysInLocalizedOrder() {
				let firstDayOfWeek = this.$t("firstDayOfWeek");
				return getWeekdaysInLocalizedOrder(this.weekdays, firstDayOfWeek);
			}
		},

		created() {
			
		},
		
		methods: {
			apply() {
				setDate(x => this.startDate = x, this.localStartDate);
				this.$emit('update:startDate', this.startDate);
				setDate(x => this.endDate = x, this.localEndDate);
				this.$emit('update:endDate', this.endDate);
			},

			incrementDates() {
				this.localEndDate = this.localEndDate.add(1, 'month');
			},

			decrimentDates() {
				this.localEndDate = this.localEndDate.add(-1, 'month');
			},

			getBlockOfDaysIn(date) {
				return getBlockOfDaysIn(
					date.clone(), 
					this.$t("firstDayOfWeek"),
					this.startDate,
					this.endDate);
			},

			selectDate(date) {
				if ((this.selectedStartDate && this.selectedEndDate)
					|| (!this.selectedStartDate && !this.selectedEndDate)) {
					this.selecting = true;
					this.selectedStartDate = date.clone();
					return;
				}
				if (this.selectedStartDate) {
					if (date.isBefore(this.selectedStartDate)) {
						this.selectedEndDate = this.selectedStartDate.clone();
						this.selectedStartDate = date.clone();
					}
					else {
						this.selectedEndDate = date.clone();
					}
					this.selecting = false;
					return;
				}
				if (this.selectedEndDate) {
					if (date.isAfter(this.selectedEndDate)) {
						this.selectedStartDate = this.selectedEndDate.clone();
						this.selectedEndDate = date.clone();
					}
					else {
						this.selectedStartDate = date.clone();
					}
					this.selecting = false;
					return;
				}
			},

			swapSelectedDate() {
				let date = this.selectedEndDate ? this.selectedEndDate.clone() : undefined;
				this.selectedEndDate = this.selectedStartDate ? this.selectedStartDate.clone() : undefined;
				this.selectedStartDate = date;
			},

			hover(date) {
				if (this.selecting) {
					this.hoveredDate = date.clone();
					if ((this.selectedStartDate && this.selectedStartDate.isAfter(date))
						|| (this.selectedEndDate && this.selectedEndDate.isBefore(date))) {
						this.swapSelectedDate();
					}
				}
				else {
					this.hoveredDate = undefined;
				}
			},

			formatLocalizedDate(date, format) {
				let localizedFormatedDate = formatLocalizedDate(date, this.language, format);
				return capitalizeFirstLetter(localizedFormatedDate);
			}
		}
	};
</script>
<style lang="scss" scoped>
	$dayWidth: 14%;

	.s-datepicker {
		width: 100%;
		height: auto;
		margin: 5px;
		display: flex;
		flex-direction: row;

		.calendar {
			min-width: 80%;

			.header {
				display: flex;
				flex-direction: row;
				margin-bottom: 5px;

				.prev {
					flex-basis: 20%;
					text-align: center;
				}

				.next {
					flex-basis: 20%;
					text-align: center;
				}

				.info {
					flex-basis: 60%;
					font-weight: 600;
					text-align: center;
				}

				.arrow-button {
					padding: 6px 10px;
					border-radius: 1em;
					cursor: pointer;

					&:hover {
						background: rgb(240, 240, 240);
					}
				}
			}

			.calendar-container {
				.calendar {
					.weekdays {
						padding: 5px;
						margin-bottom: 1px;
						display: flex;
						flex-direction: row;
						
						.weekday {
							font-weight: 600;
							flex-basis: $dayWidth;
							list-style-type: none;
							text-align: center;
							//min-width: $dayWidth;
						}
					}

					.items {
						padding: 5px;
						margin-bottom: 1px;
						display: flex;
						flex-direction: row;
						width: 100%;
						flex-wrap: wrap;

						.item {
							list-style-type: none;
							color: rgb(153, 153, 153);
							cursor: pointer;
							border-radius: 1em;
							padding-top: 5px;
							padding-bottom: 5px;

							&.focused {
								color: rgb(0, 0, 0);
							}

							&.day {
								//min-width: $dayWidth;
								flex-basis: $dayWidth;
								text-align: center;
							}

							&.selected {
								background: #3a539b;
								color: white;
								font-weight: 500;
							}

							&:not(.selected):hover {
								background: rgb(240, 240, 240);
							}
						}
					}
				}
			}
		}
	}
</style>
<i18n>
	{
		"en-EN": {
			"sunday": "Su",
			"monday": "Mo",
			"tuesday": "Tu",
			"wednesday": "We",
			"thursday": "Th",
			"friday": "Fr",
			"saturday": "Sa",
			"firstDayOfWeek": "sunday"
		},
		"en-GB": {
			"sunday": "Su",
			"monday": "Mo",
			"tuesday": "Tu",
			"wednesday": "We",
			"thursday": "Th",
			"friday": "Fr",
			"saturday": "Sa",
			"firstDayOfWeek": "monday"
		},
		"en-US": {
			"sunday": "Su",
			"monday": "Mo",
			"tuesday": "Tu",
			"wednesday": "We",
			"thursday": "Th",
			"friday": "Fr",
			"saturday": "Sa",
			"firstDayOfWeek": "sunday"
		},
		"ja-JA": {
			"sunday": "日曜日",
			"monday": "月曜日",
			"tuesday": "火曜日",
			"wednesday": "水曜日",
			"thursday": "木曜日",
			"friday": "金曜日",
			"saturday": "土曜日",
			"firstDayOfWeek": "sunday"
		},
		"ru-RU": {
			"monday": "Пн",
			"tuesday": "Вт",
			"wednesday": "Ср",
			"thursday": "Чт",
			"friday": "Пт",
			"saturday": "Сб",
			"sunday": "Вс",
			"firstDayOfWeek": "monday"
		},
		"es-ES": {
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Mi",
			"thursday": "Ju",
			"friday": "Vi",
			"saturday": "Sá",
			"sunday": "Do",
			"firstDayOfWeek": "monday"
		},
		"es-MX": {
			"sunday": "Do",
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Mi",
			"thursday": "Ju",
			"friday": "Vi",
			"saturday": "Sá",
			"firstDayOfWeek": "sunday"
		},
		"fr-FR": {
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Me",
			"thursday": "Je",
			"friday": "Ve",
			"saturday": "Sa",
			"sunday": "Di",
			"firstDayOfWeek": "monday"
		},
		"it-IT": {
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Me",
			"thursday": "Gi",
			"friday": "Ve",
			"saturday": "Sa",
			"sunday": "Do",
			"firstDayOfWeek": "monday"
		},
		"de-DE": {
			"monday": "Mo",
			"tuesday": "Di",
			"wednesday": "Mi",
			"thursday": "Do",
			"friday": "Fr",
			"saturday": "Sa",
			"sunday": "So",
			"firstDayOfWeek": "monday"
		}
	}
</i18n>

