<template>
	<div class="experiment col-sm-12">
			<vue-select 
				default-title="Merchants" 
				multiple-selected-title-chunk="Accounts"
				:allow-multiple="true"
				:all-option-groups="allOptionGroups" 
				@selection-changed="console.log($event)">
				<span slot="header" slot-scope="{ selectedIds }"> 
					{{ (selectedIds.length == 1) ? selectedIds[0] : `count: ${selectedIds.length}`}}
				</span>
			</vue-select>
			<custom-checkbox :value="true">
				Hello world
			</custom-checkbox>
			<div v-if="showChart">
				<vue-chart :data="getDataForChart()" :typeXAxis="'time'"></vue-chart>
			</div>
			<!--<button @click="showChart = true">test data draw</button>-->
			<vue-table
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
			</vue-table>
			<div class="col-sm-12" style="height: 300px"></div>
		</div>
</template>
<script>
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
				showChart: false
			}
		},
		created: function() {
			this.addRandomData(100); // cols.reduce((a, b) => a + b, 0)
		},
		methods: {
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
<style>
	
</style>


