<template>
	<div class="s-datepicker">
		<div class="calendars">
			<div class="calendar">
				<div class="header"> 
					<div class="prev">
						<div role="button" class="arrow-button" @click="decrimentMonth">
							<i class="fa fa-chevron-left" aria-hidden="true"></i>
						</div>
					</div>
					<div class="info">{{formatLocalizedDate(startMonth, 'MMM YYYY')}}</div>
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
							<template v-for="(item, i) in getBlockOfDaysIn(startMonth)">           
								<li :key="i" 
									@mouseenter="hover(item.date)"
									@click="selectDate(item.date)"
									class="item day" 
									:class="{
										'selected': item.selected,
										'start-date': item.typeOfSelected.startDate,
										'end-date': item.typeOfSelected.endDate,
										'in-range': item.typeOfSelected.inRange,
										'start-date-equals-end': item.typeOfSelected.startDateEqualsEnd,
										'in-this-month': item.inThisMonth
									}">
									{{item.date.format("D")}}
								</li>
							</template>
						</ul>
					</div>
				</div>
				<div class="button-container left">
					<s-button class="apply" @click="apply">{{$t('apply')}}</s-button>
				</div>
			</div>
			<div class="calendar">
				<div class="header"> 
					<div class="prev"></div>
					<div class="info">{{formatLocalizedDate(endMonth, 'MMM YYYY')}}</div>
					<div class="next">
						<div role="button" class="arrow-button" @click="incrementMonth">
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
							<template v-for="(item, i) in getBlockOfDaysIn(endMonth)">           
								<li :key="i" 
									@mouseenter="hover(item.date)"
									@click="selectDate(item.date)"
									class="item day" 
									:class="{
										'selected': item.selected,
										'start-date': item.typeOfSelected.startDate,
										'end-date': item.typeOfSelected.endDate,
										'in-range': item.typeOfSelected.inRange,
										'start-date-equals-end': item.typeOfSelected.startDateEqualsEnd,
										'in-this-month': item.inThisMonth
									}">
									{{item.date.format("D")}}
								</li>
							</template>
						</ul>
					</div>
				</div>
				<div class="button-container right">
					<s-button @click="cancel">{{$t('cancel')}}</s-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState } from 'vuex';
	import dayjs from 'dayjs';

	import StringUtils from 'utils/string';
	import DateUtils from 'utils/date';
	import DateLocalizationUtils from 'utils/date-localization';
	import TwoSideBindingUtils from 'utils/vue/two-side-binding';
	
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

		computed: {
			...mapState({
				styleClass: state => state.base.styleClass,
				language: state => state.localization.language
			}),

			startMonth: {
				get() {
					return this.endMonth.clone().add(-1, 'month');
				},
				set(value) {
					this.cache.startDate = value;
				}
			},

			endMonth: {
				get() {
					return this.cache.endMonth || DateUtils.convertDate(this.endDate);
				},
				set(value) {
					this.cache.endMonth = value;
				}
			},

			weekdaysInLocalizedOrder() {
				let firstDayOfWeek = this.getFirstDayOfWeek();
				return DateUtils.getWeekdaysFromFirstDayOfWeek(firstDayOfWeek);
			}
		},

		data() {
			return {
				cache: {
					endMonth: undefined
				},
				isSelecting: false,
				selected: {
					startDate: undefined,
					endDate: undefined,
					hoveredDate: undefined
				}
			}
		},

		watch: {
			startDate() {
				this.selected.startDate = undefined;
				this.selected.endDate = undefined;
			},

			endDate() {
				this.selected.startDate = undefined;
				this.selected.endDate = undefined;
			}
		},
		
		methods: {

/* DAYS IN BLOCK */
			getBlockOfDaysIn(date) {
				let firstDayOfWeek = this.getFirstDayOfWeek();
				date = date.clone();
				let startDateInThisMonth = date.startOf('month');
				let endDateInThisMonth = date.endOf('month');
				let startDateBlock = DateLocalizationUtils.getLocalizedStartOfWeek(date.startOf('month'), firstDayOfWeek);
				let endDateBlock = startDateBlock.add(41, 'day').add(1, 'ms');
				let result = [];
				for (let iterationDate = startDateBlock.clone(); 
						 iterationDate.isBefore(endDateBlock); 
						 iterationDate = iterationDate.clone().add(1, 'day')) {
					let inThisMonth = DateUtils.dateInBorder(iterationDate, startDateInThisMonth, endDateInThisMonth);
					let typeOfSelectedDate = this.getTypeOfSelected(iterationDate);
					let isSelected = typeOfSelectedDate && inThisMonth;
					result.push({
						date: iterationDate.clone(),
						selected: isSelected,
						typeOfSelected: {
							startDate: isSelected && typeOfSelectedDate.startDate,
							endDate: isSelected && typeOfSelectedDate.endDate,
							startDateEqualsEnd: isSelected && typeOfSelectedDate.startDateEqualsEnd,
							inRange: isSelected && typeOfSelectedDate.inRange
						},
						inThisMonth: inThisMonth
					});
				}
				return result;
			},

/* DATE SELECTED? */
			getTypeOfSelected(date) {
				let isSelectedStartDate = this.isSelectedStartDate(date);
				let isSelectedEndDate = this.isSelectedEndDate(date);
				let isSelectedStartDateEqualsEnd = this.isSelectedStartDateEqualsEnd(
					isSelectedStartDate, 
					isSelectedEndDate
				);
				if (isSelectedStartDateEqualsEnd) {
					[isSelectedStartDate, isSelectedEndDate] = [false, false];
				}
				let isInSelectedRange = this.isInSelectedRange(date,
					isSelectedStartDateEqualsEnd, 
					isSelectedStartDate, 
					isSelectedEndDate
				);
				if (isSelectedStartDate || isSelectedEndDate 
					|| isSelectedStartDateEqualsEnd || isInSelectedRange) {
					return {
						startDate: isSelectedStartDate,
						endDate: isSelectedEndDate,
						startDateEqualsEnd: isSelectedStartDateEqualsEnd,
						inRange: isInSelectedRange
					}
				}
				return null;
			},

			isSelectedStartDate(date) {
				let selected = this.selected;
				let startDate = this.startDate;
				return selected.startDate 
					? DateUtils.dateEquals(date, selected.startDate)
					: this.isSelecting
						? false 
						: DateUtils.dateEquals(date, startDate);
			},

			isSelectedEndDate(date) {
				let selected = this.selected;
				let endDate = this.endDate;
				return selected.endDate 
					? DateUtils.dateEquals(date, selected.endDate)
					: this.isSelecting
						? false 
						: DateUtils.dateEquals(date, endDate);
			},

			isSelectedStartDateEqualsEnd(isSelectedStartDate, isSelectedEndDate) {
				if (!isSelectedStartDate && !isSelectedEndDate) {
					return false;
				}
				let selected = this.selected;
				let [startDate, endDate] = [null, null];
				if (isSelectedStartDate) {
					startDate = selected.startDate || this.startDate;
					endDate = selected.hoveredDate || selected.endDate || this.endDate;
				}
				else if (isSelectedEndDate) {
					startDate = selected.endDate || this.endDate;
					endDate = selected.hoveredDate || selected.startDate || this.startDate;
				}
				return DateUtils.dateEquals(startDate, endDate);
			},

			isInSelectedRange(date, isSelectedStartDateEqualsEnd, isSelectedStartDate, isSelectedEndDate) {
				if (isSelectedStartDateEqualsEnd || isSelectedStartDate || isSelectedEndDate) {
					return false;
				}
				return this.dateInSelectedRange(date);
			},

			dateInSelectedRange(date) {
				let selected = this.selected;
				if (this.isSelecting) {
					if (selected.hoveredDate) {
						if (selected.startDate) {
							return DateUtils.dateInBorder(date, selected.startDate, selected.hoveredDate);
						}
						if (this.selected.endDate) {
							return DateUtils.dateInBorder(date, selected.hoveredDate, selected.endDate);
						}
					}
					return false;
				}
				return selected.startDate && selected.endDate
					? DateUtils.dateInBorder(date, 
						selected.startDate, 
						selected.endDate)
					: DateUtils.dateInBorder(date, 
						this.startDate, 
						this.endDate)
			},

/* SELECT DATE */
			selectDate(date) {
				let selected = this.selected;
				if ((selected.startDate && selected.endDate)
					|| (!selected.startDate && !selected.endDate)) {
					this.isSelecting = true;
					selected.startDate = date.clone();
					selected.endDate = undefined;
					selected.hoveredDate = date.clone();
					return;
				}

				if (selected.startDate) {
					selected.endDate = date.clone();
					this.isSelecting = false;
					selected.hoveredDate = undefined;
					return;
				}

				if (selected.endDate) {
					selected.startDate = date.clone();
					this.isSelecting = false;
					selected.hoveredDate = undefined;
					return;
				}
			},

			swapSelectedDate() {
				let selected = this.selected;
				let date = selected.endDate ? selected.endDate.clone() : undefined;
				selected.endDate = selected.startDate ? selected.startDate.clone() : undefined;
				selected.startDate = date;
			},

			hover(date) {
				let selected = this.selected;
				if (this.isSelecting) {
					selected.hoveredDate = date.clone();
					if ((selected.startDate && selected.startDate.isAfter(date))
						|| (selected.endDate && selected.endDate.isBefore(date))) {
						this.swapSelectedDate();
					}
				}
				else {
					selected.hoveredDate = undefined;
				}
			},

/* APPLY SELECTED FIELDS TO PARENT */
			applySelected() {
				let selected = this.selected;
				if (!selected.enabled && selected.startDate && selected.endDate) {
					if (this.isSelectedRangeInOneDay()) {
						this.setSelectedFromStartToEndDay();
					}
					this.setSelectedDateToParents();
					this.updateParentDates();
				}
			},

			isSelectedRangeInOneDay() {
				return DateUtils.dateEquals(this.selected.startDate, this.selected.endDate);
			},

			setSelectedFromStartToEndDay() {
				this.selected.startDate = this.selected.startDate.startOf('day');
				this.selected.endDate = this.selected.endDate.endOf('day');
			},

			setSelectedDateToParents() {
				this.startDate = this.selected.startDate;
				this.endDate = this.selected.endDate;
				this.selected.startDate = undefined;
				this.selected.endDate = undefined;
			},

			updateParentDates() {
				TwoSideBindingUtils.updateParentField(this, this.startDate, 'startDate');
				TwoSideBindingUtils.updateParentField(this, this.endDate, 'endDate');
			},

/* MONTH DATE */
			incrementMonth() {
				this.endMonth = this.endMonth.add(1, 'month');
			},

			decrimentMonth() {
				this.endMonth = this.endMonth.add(-1, 'month');
			},

/* EVENTS */
			apply() {
				this.applySelected();
				this.$emit('apply');
			},

			cancel() {
				this.$emit('cancel');
			},

/* OTHERS */
			getFirstDayOfWeek() {
				return this.$t("firstDayOfWeek");
			},

			formatLocalizedDate(date, format) {
				let localizedFormatedDate = DateLocalizationUtils
					.formatLocalizedDate(date, this.language, format);
				return StringUtils.capitalizeFirstLetter(localizedFormatedDate);
			}
		}
	};
</script>
<style lang="scss" scoped>
	$dayWidth: 14%;

	.s-datepicker {
		.calendars {
			width: 100%;
			height: auto;
			margin: 5px;
			display: flex;
			flex-direction: row;

			.calendar {
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
							user-select: none;
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
							user-select: none;

							.item {
								list-style-type: none;
								color: rgb(153, 153, 153);
								cursor: pointer;
								border-radius: 1em;
								padding-top: 5px;
								padding-bottom: 5px;

								&.in-this-month {
									color: rgb(0, 0, 0);
								}

								&.day {
									//min-width: $dayWidth;
									flex-basis: $dayWidth;
									text-align: center;
								}

								&.selected {
									transition: border-radius 0.3s ease;

									&.start-date {
										background: #3a539b;
										color: white;
										font-weight: 500;
										border-radius: 1em 0 0 1em;
									}

									&.end-date {
										background: #3a539b;
										color: white;
										font-weight: 500;
										border-radius: 0em 1em 1em 0em;
									}

									&.in-range {
										background: rgb(240, 240, 240);
										border-radius: 0em;
									}

									&.start-date-equals-end {
										background: #3a539b;
										color: white;
										font-weight: 500;
										border-radius: 1em;
									}
								}

								&:not(.selected):hover {
									background: rgb(240, 240, 240);
								}
							}
						}
					}
				}

				.button-container {
					//border-top: 1px solid #c3c3c3;
					//margin-top: 5px;

					&.left {
						padding: 1px 3% 5px 40%;
					}

					&.right {
						padding: 1px 40% 5px 3%;
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
			"firstDayOfWeek": "sunday",
			"apply": "Apply",
			"cancel": "Cancel"
		},
		"en-GB": {
			"sunday": "Su",
			"monday": "Mo",
			"tuesday": "Tu",
			"wednesday": "We",
			"thursday": "Th",
			"friday": "Fr",
			"saturday": "Sa",
			"firstDayOfWeek": "monday",
			"apply": "Apply",
			"cancel": "Cancel"
		},
		"en-US": {
			"sunday": "Su",
			"monday": "Mo",
			"tuesday": "Tu",
			"wednesday": "We",
			"thursday": "Th",
			"friday": "Fr",
			"saturday": "Sa",
			"firstDayOfWeek": "sunday",
			"apply": "Apply",
			"cancel": "Cancel"
		},
		"ja-JA": {
			"sunday": "日曜日",
			"monday": "月曜日",
			"tuesday": "火曜日",
			"wednesday": "水曜日",
			"thursday": "木曜日",
			"friday": "金曜日",
			"saturday": "土曜日",
			"firstDayOfWeek": "sunday",
			"apply": "アプライ",
			"cancel": "キャンセル"
		},
		"ru-RU": {
			"monday": "Пн",
			"tuesday": "Вт",
			"wednesday": "Ср",
			"thursday": "Чт",
			"friday": "Пт",
			"saturday": "Сб",
			"sunday": "Вс",
			"firstDayOfWeek": "monday",
			"apply": "Применить",
			"cancel": "Отменить"
		},
		"es-ES": {
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Mi",
			"thursday": "Ju",
			"friday": "Vi",
			"saturday": "Sá",
			"sunday": "Do",
			"firstDayOfWeek": "monday",
			"apply": "Aplicar",
			"cancel": "Cancelar"
		},
		"es-MX": {
			"sunday": "Do",
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Mi",
			"thursday": "Ju",
			"friday": "Vi",
			"saturday": "Sá",
			"firstDayOfWeek": "sunday",
			"apply": "Aplicar",
			"cancel": "Cancelar"
		},
		"fr-FR": {
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Me",
			"thursday": "Je",
			"friday": "Ve",
			"saturday": "Sa",
			"sunday": "Di",
			"firstDayOfWeek": "monday",
			"apply": "Appliquer",
			"cancel": "Annuler"
		},
		"it-IT": {
			"monday": "Lu",
			"tuesday": "Ma",
			"wednesday": "Me",
			"thursday": "Gi",
			"friday": "Ve",
			"saturday": "Sa",
			"sunday": "Do",
			"firstDayOfWeek": "monday",
			"apply": "Applicare",
			"cancel": "Annulla"
		},
		"de-DE": {
			"monday": "Mo",
			"tuesday": "Di",
			"wednesday": "Mi",
			"thursday": "Do",
			"friday": "Fr",
			"saturday": "Sa",
			"sunday": "So",
			"firstDayOfWeek": "monday",
			"apply": "Sich bewerben",
			"cancel": "Stornieren"
		}
	}
</i18n>

