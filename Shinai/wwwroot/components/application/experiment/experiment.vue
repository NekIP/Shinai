<template>
	<div class="experiment col-sm-12">
			<div class="title col-sm-12">
        		<h1>Transaction Detail for {{dateFrom.format('DD/MM/YYYY')}} - {{dateTo}}</h1>
    		</div>
			<div class="form">
				<div class="row col-lg-12">
					<s-select 
						default-title="Merchant Accounts" 
						multiple-selected-title-chunk="Accounts"
						:allow-multiple="true"
						:all-option-groups="options" 
						@selection-changed="console.log($event)"
						class="col col-lg-3">
					</s-select>
					<!--<s-select 
						default-title="Currency" 
						multiple-selected-title-chunk="Currency"
						:allow-multiple="true"
						:all-option-groups="options" 
						@selection-changed="console.log($event)"
						class="col col-lg-3">
					</s-select>-->
				</div>
				<div class="row col-lg-12">
					<!--<s-select 
						default-title="Cash Programms" 
						multiple-selected-title-chunk="Cash Programm"
						:allow-multiple="true"
						:all-option-groups="options" 
						@selection-changed="console.log($event)"
						class="col col-lg-3">
					</s-select>
					<s-select 
						default-title="Urls" 
						multiple-selected-title-chunk="Url"
						:allow-multiple="true"
						:all-option-groups="options" 
						@selection-changed="console.log($event)"
						class="col col-lg-3">
					</s-select>-->
				</div>
			</div>
			<!--<s-datepicker-org 
				title="Select date range" 
				:range-keys="['TODAY', 'YESTERDAY', 'LAST_7_DAYS', 'LAST_WEEK', 'LAST_30_DAYS', 'LAST_MONTH', 'CUSTOM_DATE_RANGE']" 
				:allow-custom-date-range="true">
				<span slot="triggerContainer"  slot-scope="{ selectedRange }"> 
					<div class="btn btn-default">
						{{ selectedRange.toString() }}
					</div>
				</span>
			</s-datepicker-org>-->
			<s-datepicker-range class="col-sm-3" :start-date.sync="dateFrom" :end-date.sync="dateTo"></s-datepicker-range>
			<s-datepicker class="col-sm-3" :start-date="dateFrom" :end-date="dateTo"></s-datepicker>
			<button @click="test">Change lang {{languages[currentLanguageIndex]}}</button>
			<p>message: {{ $t('hello') }}</p>
			<!--<button @click="testSet">set</button>
			<s-checkbox :value.sync="showChart">
				Hello world
			</s-checkbox>
			<div v-if="showChart">
				<vue-chart :data="getDataForChart()" :typeXAxis="'time'"></vue-chart>
			</div>
			<button @click="showChart = true">test data draw</button>
			<div class="col-sm-12" style="height: 50px"></div>
			<material-design-input :value.sync="text">Test</material-design-input>
			<div class="col-sm-12" style="height: 50px"></div--> 
			<s-table
				:items="data"
				:columns="columns"
				:filtrable="true"
				:sortable="true"
				:groupable="true"
				:resizable="true"
				:hidable="true">
				<span slot="amount-header">
					Value
				</span>
				<span slot="amount-column" slot-scope="{ value }">
					<span :style="{ color: +value > 0 ? 'green' : 'red' }">
						{{value}}
					</span>
				</span>
				<span slot="amount-footer" slot-scope="{ cells }">
					Total: {{2}}
				</span>

				<span slot="currency-group" slot-scope="{ value, cells }">
					Cur: {{value}} / {{cells.length}}
				</span>
			</s-table>
			<div class="col-sm-12" style="height: 300px"></div>
		</div>
</template>
<script>
	/*import moment from 'moment';*/
	import { mapMutations } from 'vuex';
	import dayjs from 'dayjs';

	export default {
		name: 'experiment',
		data() { 
			return {
				data: [
					{
						mid: 20001,
						date: '2018-01-23',
						purchaseId: 1000017923,
						transactionId: 1234435467,
						status: 'auth',
						currency: 'USD',
						amount: 22.56,
						url: 'my-little-pony.com'
					},
					{
						mid: 2002,
						date: '2018-01-23',
						purchaseId: 23534345,
						transactionId: 436534532,
						status: 'not auth',
						currency: 'EUR',
						amount: -7.45,
						url: 'dot.com'
					},
					{
						mid: 12234,
						date: '2018-01-23',
						purchaseId: 3453,
						transactionId: 436455,
						status: 'auth',
						currency: 'EUR',
						amount: 7.56,
						url: 'test.com'
					},
				],
				dateFrom: dayjs(),
				dateTo: dayjs(),
				testDate1: dayjs(),
				testDate2: dayjs(),
				pageSizes: [100, 200, 500],
				columns: [
					{ id: 'mid', name: 'Merchant Id', type: 'number' },
					{ id: 'date', type: 'date' },
					{ id: 'purchaseId', type: 'number' },
					{ id: 'transactionId', type: 'number' },
					'status',
					'currency',
					['amount', 'Value', 'number'],
					'url'
				],
				options: [
					"20006 - DM Network LTD",
					['20006.5 - DM dgdf LTD', 2006.5],
					{
						text: "Merchants first group",
						type: 'group',
						selected: false,
						items: [
							{
								text: '20007 - Quiston Limited',
								value: 20007,
								type: 'single',
								selected: false,
							},
							{
								text: "20008 - SpaZar Productions",
								value: 20008
							},
							{
								text: "20009 - Leadcon Ventures Ltd",
								value: 20009
							},
							{
								text: "20010 - Schoppmann",
								value: 67890
							},
							{
								text: "20011 - Green District Online",
								value: 20011
							}
						]
					},
					{
						text: "Merchants second group",
						type: 'group',
						selected: false,
						items: [
							{
								text: "20012 - Navesink House Ltd",
								value: 20012
							},
							{
								text: "20013 - Hampton Trading (UK) Ltd.",
								value: 20013
							},
							{
								text: "20014 - Geocomscalth",
								value: 20014
							},
							{
								text: "20015 - Alcrodant Ltd",
								value: 20015
							},
							{
								text: "20016 - Carson Investments and Finance",
								value: 20016
							}
						]
					}
				],
				allOptionGroups: [
					{
						groupHeader: "Merchants first group",
						groupItems: [
							{
								text: "20006 - DM Network LTD",
								value: 20006,
								isSelected: false,
							},
							{
								text: "20007 - Quiston Limited",
								value: 20007,
								isSelected: false
							},
							{
								text: "20008 - SpaZar Productions",
								value: 20008,
								isSelected: false
							},
							{
								text: "20009 - Leadcon Ventures Ltd",
								value: 20009,
								isSelected: false
							},
							{
								text: "20010 - Schoppmann",
								value: 67890,
								isSelected: false
							},
							{
								text: "20011 - Green District Online",
								value: 20011,
								isSelected: false
							},
							{
								text: "20012 - Navesink House Ltd",
								value: 20012,
								isSelected: false
							},
							{
								text: "20013 - Hampton Trading (UK) Ltd.",
								value: 20013,
								isSelected: false
							},
							{
								text: "20014 - Geocomscalth",
								value: 20014,
								isSelected: false
							},
							{
								text: "20015 - Alcrodant Ltd",
								value: 20015,
								isSelected: false
							},
							{
								text: "20016 - Carson Investments and Finance",
								value: 20016,
								isSelected: false
							}   
						]
					}             
				],
				showChart: false,
				text: '',
				languages: ['en-EN', 'en-US', 'en-GB', 'en-EN', 'de-DE', 'ja-JA', 'es-ES', 'es-MX', 'ru-RU', 'fr-FR', 'it-IT'],
				currentLanguageIndex: 0			
			}
		},
		created: function() {
			this.addRandomData(100); // cols.reduce((a, b) => a + b, 0)
			this.addRandomDataForSelect(100);
		},
		methods: {
			...mapMutations({
				setLanguage: 'setLanguage'
			}),
			test() {
				//alert(this.text);
				//alert(this.dateFrom.format('MMMM D, YYYY'));
				//alert(this.dateTo.format('MMMM D, YYYY'));
				this.currentLanguageIndex = (this.currentLanguageIndex + 1) % (this.languages.length - 1);
				this.setLanguage(this.languages[this.currentLanguageIndex]);
				/*alert("df");
				console.log(this.$i18n);
				this.$i18n.locale = 'ja';*/
				//this.addRandomDataForSelect(100);
			},
			testSet() {
				this.showChart = !this.showChart
			},
			addRandomData: function (count) {
				for (let i = 0; i < count; i++) {
					this.data.push({
						mid: this.getRandomInt(20000, 25000),
						date: this.randomDate(new Date(2000, 1, 1, 1, 1, 1), new Date(2018, 1, 1, 1, 1, 1)),
						purchaseId: this.getRandomInt(23452, 342355),
						transactionId: this.getRandomInt(23452, 3243242343),
						status: this.randomSecuence(),
						currency: this.randomCurrency(),
						amount: this.getRandomArbitrary(-50, 50),
						url: this.randomUrl()
					});
				}
			},
			addRandomDataForSelect: function (count) {
				for (let i = 0; i < count; i++) {
					this.options.push({
						text: (200019 + i) + " - DM" + this.randomSecuence(),
						value: 200019 + i,
						isSelected: false,
					});
				}
			},
			randomDate(start, end) {
				var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
					month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();
				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;
				return [year, month, day].join('-');
			},

			getRandomArbitrary(min, max) {
				return Math.random() * (max - min) + min;
			},

			getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			},

			randomSecuence() {
				var things = ['rock', 'paper', 'scissor', 'test', 'what', 'best', 'wrost', 'things'];
				var t = this.getRandomInt(3, things.length);
				let result = "";
				for (let i = 0; i < t; i++) {
					result += things[Math.floor(Math.random() * things.length)] + " ";
				}
				return result;
			},

			randomCurrency() {
				var things = ['USD', 'EUR', 'BTC', 'COIN', 'DOGE', 'ETH'];
				return things[Math.floor(Math.random() * things.length)];
			},

			randomUrl() {
				var things = ['my-little-pony', 'dot', 'test', 'best-way', 'PAY'];
				return things[Math.floor(Math.random() * things.length)] + '.com';
			},

			getDataForChart() {
				let result = [];
				for (let i in this.data) {
					result.push({ x: new Date(Date.parse(this.data[i].date)), y: this.data[i].amount});
				}
				result.sort((a, b) => a.x > b.x ? 1 : a.x < b.x ? -1 : 0);
				return result;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.experiment {
		//background: rgb(251, 254, 255);
	}

	.title {
		margin-top: 16px;
	}

	h1 {
		color: #000000;
		font-size: 28px;
		font-weight: 500;
		line-height: 30px;
		margin: 0 0 20px;
	}

	.form {
		padding-bottom: 20px;
		margin-top: 40px;
		margin-bottom: 20px;
		border-bottom: 1px solid rgb(150, 150, 150);
	}
</style>
<i18n>
	{
		"en": {
			"hello": "hello world!"
		},
		"ja": {
			"hello": "こんにちは、世界！"
		},
		"ru": {
			"hello": "Привет мир!"
		}
	}
</i18n>


