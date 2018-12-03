<template>
	<div class="s-datepicker-range" v-click-outside="hide">
		<div class="header">
			<button class="button" @click="expanded = !expanded">
				<i aria-hidden="true" class="fa fa-calendar"></i>
				<span class="values">
					<slot name="header">
						{{formatLocalizedDate(startDate, 'MMMM D, YYYY')}} - {{formatLocalizedDate(endDate, 'MMMM D, YYYY')}}
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
								@mouseenter="hoverDateRange(availableDateRange.value)"
								:key="availableDateRange.label">
							{{$t(availableDateRange.label)}}
						</li>
					</ul>
				</div>
				<div class="calendars" v-if="enabledDateRange">
					<s-datepicker-range-calendars 
							:start-date.sync="startDate" 
							:end-date.sync="endDate"
							@apply="apply"
							@cancel="hide">
					</s-datepicker-range-calendars>
				</div>
			</div>
		</div>
	</div>
</template>
<script src="./s-datepicker-range.js"></script>
<style 	src="./s-datepicker-range.scss" lang="scss" scoped></style>
<style 	src="./s-datepicker-range.material.scss" lang="scss" scoped></style>
<i18n>
{
	"en-EN": {
		"today": "Today",
		"yesterday": "Yesterday",
		"thisWeek": "This Week",
		"lastWeek": "Last Week",
		"last7Days": "Last 7 Days",
		"thisMonth": "This Month",
		"lastMonth": "Last Month",
		"last30days": "Last 30 Days",
		"customDateRange": "Custom Date Range",
		"firstDayOfWeek": "sunday"
	},
	"en-GB": {
		"today": "Today",
		"yesterday": "Yesterday",
		"thisWeek": "This Week",
		"lastWeek": "Last Week",
		"last7Days": "Last 7 Days",
		"thisMonth": "This Month",
		"lastMonth": "Last Month",
		"last30days": "Last 30 Days",
		"customDateRange": "Custom Date Range",
		"firstDayOfWeek": "monday"
	},
	"en-US": {
		"today": "Today",
		"yesterday": "Yesterday",
		"thisWeek": "This Week",
		"lastWeek": "Last Week",
		"last7Days": "Last 7 Days",
		"thisMonth": "This Month",
		"lastMonth": "Last Month",
		"last30days": "Last 30 Days",
		"customDateRange": "Custom Date Range",
		"firstDayOfWeek": "sunday"
	},
	"ja-JA": {
		"today": "今日",
		"yesterday": "昨日",
		"thisWeek": "今週",
		"lastWeek": "先週",
		"last7Days": "過去7日間",
		"thisMonth": "今月",
		"lastMonth": "先月",
		"last30days": "過去30日間",
		"customDateRange": "カスタム期間",
		"firstDayOfWeek": "sunday"
	},
	"ru-RU": {
		"today": "Сегодня",
		"yesterday": "Вчера",
		"thisWeek": "Эта неделя",
		"lastWeek": "Последняя неделя",
		"last7Days": "Последние 7 дней",
		"thisMonth": "Этот месяц",
		"lastMonth": "Последний месяц",
		"last30days": "Последние 30 дней",
		"customDateRange": "Пользовательский период",
		"firstDayOfWeek": "monday"
	},
	"es-ES": {
		"today": "Hoy",
		"yesterday": "Ayer",
		"thisWeek": "Esta semana",
		"lastWeek": "La semana pasada",
		"last7Days": "Los últimos 7 días",
		"thisMonth": "Este mes",
		"lastMonth": "El mes pasado",
		"last30days": "Últimos 30 días",
		"customDateRange": "Rango de fecha personalizado",
		"firstDayOfWeek": "monday"
	},
	"es-MX": {
		"today": "Hoy",
		"yesterday": "Ayer",
		"thisWeek": "Esta semana",
		"lastWeek": "La semana pasada",
		"last7Days": "Los últimos 7 días",
		"thisMonth": "Este mes",
		"lastMonth": "El mes pasado",
		"last30days": "Últimos 30 días",
		"customDateRange": "Rango de fecha personalizado",
		"firstDayOfWeek": "sunday"
	},
	"fr-FR": {
		"today": "Aujourd'hui",
		"yesterday": "Hier",
		"thisWeek": "Cette semaine",
		"lastWeek": "La semaine dernière",
		"last7Days": "Les 7 derniers jours",
		"thisMonth": "Ce mois-ci",
		"lastMonth": "Le mois dernier",
		"last30days": "Les 30 derniers jours",
		"customDateRange": "Plage de dates personnalisée",
		"firstDayOfWeek": "monday"
	},
	"it-IT": {
		"today": "Oggi",
		"yesterday": "Ieri",
		"thisWeek": "Questa settimana",
		"lastWeek": "La settimana scorsa",
		"last7Days": "Ultimi 7 giorni",
		"thisMonth": "Questo mese",
		"lastMonth": "Lo scorso mese",
		"last30days": "Ultimi 30 giorni",
		"customDateRange": "Intervallo di date personalizzato",
		"firstDayOfWeek": "monday"
	},
	"de-DE": {
		"today": "Heute",
		"yesterday": "Gestern",
		"thisWeek": "Diese Woche",
		"lastWeek": "Letzte Woche",
		"last7Days": "Letzten 7 Tage",
		"thisMonth": "Diesen Monat",
		"lastMonth": "Im vergangenen Monat",
		"last30days": "Letzte 30 Tage",
		"customDateRange": "Benutzerdefinierter Datumsbereich",
		"firstDayOfWeek": "monday"
	}
}
</i18n>
