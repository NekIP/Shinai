<template>
	<div class="s-datepicker-range" v-click-outside="hide">
		<div class="header">
			<button class="button" @click="expanded = !expanded">
				<i aria-hidden="true" class="fa fa-calendar"></i>
				<span class="values">
					<slot name="header">
						{{startDate.format('MMMM D, YYYY')}} - {{endDate.format('MMMM D, YYYY')}}
					</slot>
				</span>
				<i aria-hidden="true" class="fa fa-caret-down"></i>
			</button>
		</div>
		<div class="body-container">
			<div class="body" v-if="expanded">
				<div class="options">
					<ul class="items-container">
						<li 	class="item" 
								v-for="availableDateRange in availableDateRanges"
								:class="{ 'selected': isSelected(availableDateRange.value) }"
								@click="selectDateRange(availableDateRange.value)"
								:key="availableDateRange.label">
							{{$t(availableDateRange.label)}}
						</li>
					</ul>
					<div class="buttons">
						<button class="button apply">{{$t("apply")}}</button>
						<button class="button cancel">{{$t("cancel")}}</button>
					</div>
				</div>
				<div class="calendars">
					
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import vClickOutside from 'v-click-outside'
	import dayjs from 'dayjs';

	class DateRangeViewModel {
		constructor(value, label) {
			this.value = value;
			this.label = label;
		}
	}

	class DateRange {
		constructor(start, end) {
			this.startDate = start;
			this.endDate = end;
		}
	}

	export default {
		name: 'datepicker-range',
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
				this.$emit('update:startDate', this.startDate);
				this.$emit('update:endDate', this.endDate);
			}
		}
	}
</script>
<style lang="scss">
	.s-datepicker-range {
		&.material {

		}
	}
</style>
<style lang="scss">
	%arrow-box-before-after-shared {
        bottom: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

	%selected-item {
		background-color: #08c;
		border: 1px solid #08c;
		color: #fff;
	}

	.s-datepicker-range {
		font-size: 13px;

		.header {
			.button {
				background: white;
				color: black;
    			border: 1px solid rgb(204, 204, 204);
				cursor: pointer;
				outline: inherit;
				padding: 5px 6px;
    			width: auto;
				border-radius: 3px;
    			line-height: 23px;
				display: flex;
				flex-direction: row;

				&:hover {
					border: 1px solid #56b4ef;
    				box-shadow: 0 1px 3px rgba(0,0,0,.05) inset, 
						0 0 8px rgba(82,168,236,.6);
				}

				.fa-calendar {
					flex-grow: 1;
					margin-right: 10px;
					margin-top: 0.3em;
					font-size: 1.2em;
				}

				.values {
					flex-grow: 16;
				}

				.fa-caret-down {
					flex-grow: 0;
					margin-top: 0.3em;
					margin-left: 0.5em;
					font-size: 1.1em;
				}
			}
		}

		.body-container {
			position: relative;
			display: inline-block;
			z-index: 1;

			.body {
				position: absolute;
				background: white;
            	border: 1px solid #ccc;
            	border-radius: 0.5em;
				padding: 4px;
    			margin-top: 1px;

				.options {
					min-width: 160px;
					margin: 4px;

					.items-container {
						list-style: none;
						margin: 0 auto;
						padding: 0;

						.item {
							list-style-type: none;
							background-color: #f5f5f5;
							border: 1px solid #f5f5f5;
							border-radius: 4px;
							color: #08c;
							padding: 3px 12px;
							margin-bottom: 8px;
							cursor: pointer;

							&:hover {
								@extend %selected-item;
							}

							&.selected {
								@extend %selected-item;
							}
						}
					}

					.buttons {
						display: flex;
						flex-direction: row;

						.button {
							display: inline-block;
							margin-bottom: 0;
							margin: 0px 2px 0px 2px;
							font-size: 14px;
							font-weight: 400;
							line-height: 1.42857143;
							text-align: center;
							white-space: nowrap;
							vertical-align: middle;
							cursor: pointer;
							user-select: none;
							background-image: none;
							border: 1px solid transparent;
							border-radius: 4px;
							padding: 5px 10px;
							font-size: 0.96em;
							border-radius: 3px;
							width: 50%;
							flex-grow: 1;

							&.apply {
								color: #fff;
    							background-color: #5cb85c;
								border-color: #4cae4c;
								
								&:hover {
									color: #fff;
									background-color: #398439;
									border-color: #255625;
								}
							}

							&.cancel {
								color: #333;
								background-color: #fff;
								border-color: #ccc;

								&:hover {
									color: #333;
									background-color: #d4d4d4;
									border-color: #8c8c8c;
								}
							}
						}
					}
				}

				&:before {
					@extend %arrow-box-before-after-shared;
					border-color: rgba(113, 158, 206, 0);
					border-bottom-color: #ccc;
					border-width: 9px;
					left: 19px;
					margin-left: -9px;
				}

				&:after {
					@extend %arrow-box-before-after-shared;
					border-color: rgba(255, 255, 255, 0);
					border-bottom-color: #ffffff;
					border-width: 8px;
					left: 19px;
					margin-left: -8px;
				}
			}
		}
	}
</style>
<i18n>
	{
		"en": {
			"today": "Today",
			"yesterday": "Yesterday",
			"thisWeek": "This Week",
			"lastWeek": "Last Week",
			"last7Days": "Last 7 Days",
			"thisMonth": "This Month",
			"lastMonth": "Last Month",
			"last30days": "Last 30 Days",
			"customDateRange": "Custom Date Range",

			"apply": "Apply",
			"cancel": "Cancel"
		},
		"ja": {
			"today": "今日",
			"yesterday": "昨日",
			"thisWeek": "今週",
			"lastWeek": "先週",
			"last7Days": "過去7日間",
			"thisMonth": "今月",
			"lastMonth": "先月",
			"last30days": "過去30日間",
			"customDateRange": "カスタム期間",

			"apply": "アプライ",
			"cancel": "キャンセル"
		},
		"ru": {
			"today": "Сегодня",
			"yesterday": "Вчера",
			"thisWeek": "Эта неделя",
			"lastWeek": "Последняя неделя",
			"last7Days": "Последние 7 дней",
			"thisMonth": "Этот месяц",
			"lastMonth": "Последний месяц",
			"last30days": "Последние 30 дней",
			"customDateRange": "Пользовательский период",

			"apply": "Применить",
			"cancel": "Отменить"
		}
	}
</i18n>
