<template>
	<div class="s-datepicker">
		<div class="header"> 
			<div class="prev">
				<div role="button" class="arrow-button" @click="decrimentCurrentDate">
					<i class="fa fa-chevron-left" aria-hidden="true"></i>
				</div>
			</div>
			<div class="info">{{date.format('MMM YYYY')}}</div>
			<div class="next">
				<div role="button" class="arrow-button" @click="incrementCurrentDate">
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

	export default {
		name: "datepicker",

		computed: {
			...mapState({
				styleClass: state => state.base.styleClass
			})
		},

		props: {
			startDate: {
				type: Date | Object | undefined,
				required: true
			},

			endDate: {
				type: Date | Object | undefined,
				required: false
			}
		},

		data() {

		},

		computed: {
			localStartDate() {
				return convertDate(this.startDate);
			},

			localEndDate() {
				return convertDate(this.endDate);
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

