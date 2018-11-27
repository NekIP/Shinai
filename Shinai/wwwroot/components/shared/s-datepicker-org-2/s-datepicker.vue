<template>
	<div class="s-datepicker">
		<div class="header"> 
			<div class="prev">
				<div v-if="allowArrow.previous" href="" role="button" class="arrow-button" @click="decrimentCurrentDate">
					<i class="fa fa-chevron-left" aria-hidden="true"></i>
				</div>
			</div>
			<div class="info">{{date.format('MMM YYYY')}}</div>
			<div class="next">
				<div v-if="allowArrow.previous" class="arrow-button" @click="incrementCurrentDate">
					<i class="fa fa-chevron-right" aria-hidden="true"></i>
				</div>
			</div>
		</div>
		<div class="calendar-container">
			<div class="calendar">
				<ul class="weekdays">
					<li class="weekday">{{$t('sunday')}}</li>
					<li class="weekday">{{$t('monday')}}</li>
					<li class="weekday">{{$t('tuesday')}}</li>
					<li class="weekday">{{$t('wednesday')}}</li>
					<li class="weekday">{{$t('thursday')}}</li>
					<li class="weekday">{{$t('friday')}}</li>
					<li class="weekday">{{$t('saturday')}}</li>
				</ul>
				<ul class="items">
					<template v-for="(item, i) in getItemsInCurrentDate()">           
                        <li :key="i" class="item" 
							:class="{
								'day': currentLevelIsDay(),
								'month': currentLevelIsMonth(),
								'year': currentLevelIsYear(),
								'decad': currentLevelIsDecad(),
								'selected': item.selected,
								'focused': item.focused
							}">
                            {{item.value.format("D")}}
                        </li>
                    </template>
                </ul>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState } from 'vuex';
	import dayjs from 'dayjs';

	export default {
		name: "datepicker",
		computed: {
			...mapState({
				styleClass: state => state.base.styleClass
			})
		},
		props: {
			date: {
				type: Date,
				required: true
			},
			additionalDate: {
				type: Date,
				required: false
			},
			allowRange: {
				type: Boolean,
				required: false,
				default: false
			},
			showNow: {
				type: Boolean,
				required: false,
				default: true
			},
			allowArrow: {
				type: Object,
				required: false,
				default: () => [{
					previous: true,
					next: true
				}][0]
			},
			dateBorder: {
				type: Object,
				required: false,
				default: () => [{
					start: undefined,
					end: undefined
				}][0]
			},
			supportedLevels: {
				type: Array,
				required: false,
				default: () => [
					'DECAD', 
					'YEAR',
					'MONTH', 
					'DAY'
				]
			}
		},
		data() {
			return {
				currentLevel: 'DAY',
				state: {
					date: undefined,
					additionalDate: undefined
				}
			}
		},
		watch: {
			date(val) {
				if (!dayjs.isDayjs(val)) {
					this.date = dayjs(val);
				}
				else {
					this.date = val;
				}
			}
		},
		created() {
			if (!this.date) {
				this.date = dayjs();
			}
			else {
				this.date = dayjs(this.date);
			}
			if (this.allowRange && !this.additionalDate) {
				this.additionalDate = this.date.clone();
			}
			this.additionalDate = dayjs(this.additionalDate);
		},
		methods: {
			formatDateOnCurrentLevel() {
				let date = dayjs(this.date).clone();
				switch (this.currentLevel) {
					case 'DAY': 
						return date.clone().format('MMM, YYYY');
					case 'MONTH':
						return date.clone().format('YYYY');
					case 'YEAR':
						let decade = this.getDecade(date);
						return `${decade.start.format('YYYY')} - ${decade.end.format('YYYY')}`;
					case 'DECAD':
						let century = this.getCentury(date);
						return `${century.start.format('YYYY')} - ${century.end.format('YYYY')}`;
				}
			},

			getDecade(date) {
				let year = date.clone().format('YYYY');
				year[3] = '0';
				let startDecade = dayjs().year(+year).startOf('y').startOf('M').startOf('w').startOf('d');
				return {
					start: startDecade,
					end: startDecade.add(9, 'y')
				}
			},

			getCentury(date) {
				let year = date.clone().format('YYYY');
				[year[3], year[2]] = ['0', '0'];
				let startCentury = dayjs().year(+year).startOf('y').startOf('M').startOf('w').startOf('d');
				return {
					start: startCentury,
					end: startCentury.add(99, 'y')
				}
			},

			getBordersInCurrentDate() {
				let date = this.date.clone();
				switch (this.currentLevel) {
					case 'DAY': 
						return {
							startDateFocused: date.clone().startOf('month'),
							endDateFocused: date.clone().endOf('month'),
							startDateBlock: date.clone().startOf('month').set('day', 0),
							endDateBlock: date.clone().endOf('month').add(7, 'day').set('day', 6),
							iterator: {
								key: 'day',
								value: 1
							}
						};
					case 'MONTH':
						return {
							startDateFocused: date.clone().startOf('year'),
							endDateFocused: date.clone().endOf('year'),
							startDateBlock: date.clone().startOf('year'),
							endDateBlock: date.clone().endOf('year'),
							iterator: {
								key: 'month',
								value: 1
							}
						};
					case 'YEAR':
						let decade = this.getDecade(date);
						return {
							startDateFocused: decade.start,
							endDateFocused: decade.end,
							startDateBlock: decade.start.clone().add(-1, 'year'),
							endDateBlock: decade.end.clone().add(1, 'year'),
							iterator: {
								key: 'year',
								value: 1
							}
						};
					case 'DECAD':
						let century = this.getCentury(date);
						return {
							startDateFocused: century.start,
							endDateFocused: century.end,
							startDateBlock: century.start.clone().add(-10, 'year'),
							endDateBlock: century.end.clone().add(10, 'year'),
							iterator: {
								key: 'year',
								value: 10
							}
						};
				}
			},

			getItemsInCurrentDate() {
				let result = [];
				let date = this.date.clone();
				let borders = this.getBordersInCurrentDate();
				for (let currentDate = borders.startDateBlock; 
						currentDate.isBefore(borders.endDateBlock.add(1, 'ms'));
						currentDate = currentDate.clone().add(borders.iterator.value, borders.iterator.key)) {
					let dateFormat = this.getDateFormat();
					let text = "";
					if (this.currentLevel == 'DECAD') {
						text = `${currentDate.format(dateFormat)} - ${currentDate.clone().add(9, 'year').format(dateFormat)}`;
					}
					else {
						text = currentDate.format(dateFormat);
					}
					let value = currentDate.clone();
					result.push({
						type: this.currentLevel,
						text: text,
						value: value,
						selected: this.isSelected(currentDate),
						focused: currentDate.isBefore(borders.endDateFocused.add(1, 'ms'))
							&& currentDate.isAfter(borders.startDateFocused.add(-1, 'ms'))
					});
				}
				return result;
			},

			getDateFormat() {
				switch (this.currentLevel) {
					case 'DAY': return 'DD';
					case 'MONTH': return 'MM';
					case 'YEAR':
					case 'DECAD': return 'YYYY';
				}
			},

			isSelected(date) {
				switch (this.currentLevel) {
					case 'DAY': return date.format("YYYY, MM, DD") == this.date.clone().format("YYYY, MM, DD");
					case 'MONTH': return date.format("YYYY, MM") == this.date.clone().format("YYYY, MM");
					case 'YEAR':
					case 'DECAD': return date.format("YYYY") == this.date.clone().format("YYYY");
				}
			},

			currentLevelIsDay() {
				return this.currentLevel == 'DAY';
			},

			currentLevelIsMonth() {
				return this.currentLevel == 'MONTH';
			},

			currentLevelIsYear() {
				return this.currentLevel == 'YEAR';
			},

			currentLevelIsDecad() {
				return this.currentLevel == 'DECAD';
			},

			incrementCurrentDate() {
				switch (this.currentLevel) {
					case 'DAY': this.date.add(1, 'month');
					case 'MONTH': this.date.add(1, 'year');
					case 'YEAR': this.date.add(10, 'year');
					case 'DECAD': this.date.add(100, 'year');
				}
				this.$forceUpdate();
			},

			decrimentCurrentDate() {
				switch (this.currentLevel) {
					case 'DAY': this.date.add(-1, 'month');
					case 'MONTH': this.date.add(-1, 'year');
					case 'YEAR': this.date.add(-10, 'year');
					case 'DECAD': this.date.add(-100, 'year');
				}
				this.$forceUpdate();
			}
		}
	}
</script>
<style lang="scss" scoped>
	$dayWidth: 14%;

	.s-datepicker {
		width: 100%;
		height: auto;
		margin: 5px;

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
</style>
<i18n>
	{
		"en": {
			"sunday": "Su",
			"monday": "Mo",
			"tuesday": "Tu",
			"wednesday": "We",
			"thursday": "Th",
			"friday": "Fr",
			"saturday": "Sa"
		},
		"ja": {
			"monday": "月曜日",
			"tuesday": "火曜日",
			"wednesday": "水曜日",
			"thursday": "木曜日",
			"friday": "金曜日",
			"saturday": "土曜日",
			"sunday": "日曜日"
		},
		"ru": {
			"monday": "Пн",
			"tuesday": "Вт",
			"wednesday": "Ср",
			"thursday": "Чт",
			"friday": "Пт",
			"saturday": "Сб",
			"sunday": "Вс"
		}
	}
</i18n>

