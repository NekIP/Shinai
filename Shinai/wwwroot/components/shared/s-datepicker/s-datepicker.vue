<template>
	<div class="s-datepicker">
		<div class="header"> 
			<ul>
				<li class="prev">
					<i class="fa fa-chevron-left" aria-hidden="true"></i>
				</li>
				<li>{{1}}</li>
			</ul>
		</div>
		<div class="calendar">
			<div class="calendar-day" v-if="currentLevelIsDay">
				<ul class="weekdays">
					<li>Su</li>
					<li>Mo</li>
					<li>Tu</li>
					<li>We</li>
					<li>Th</li>
					<li>Fr</li>
					<li>Sa</li>
				</ul>
				<ul class="days">
                    <template v-for="(item, i) in getItemsInCurrentDate()">           
                        <li>
                            {{item.text}} - {{item.value.format("YYYY/MM/DD")}} - {{item.selected}} - {{item.focused}} 
                        </li>
                    </template>
                </ul>
			</div>
		</div>
	</div>
</template>
<script>
	import dayjs from 'dayjs';

	export default {
		name: "datepicker",
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
				default: {
					previous: true,
					next: true
				}
			},
			dateBorder: {
				type: Object,
				required: false,
				default: {
					start: undefined,
					end: undefined
				}
			},
			supportedLevels: {
				type: Array,
				required: false,
				default: ['DECAD', 'YEAR', 'MONTH', 'DAY']
			}
		},
		data() {
			return {
				currentLevel: 'DAY'
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
				console.log(date);
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
			}
		}
	}
</script>
<style lang="scss" scoped>
	.s-datepicker {
		
	}
</style>

