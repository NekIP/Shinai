<template>
	<div class="calendar-sheet">
		<ul class="weekdays">
			<li class="weekday">{{$t('sunday')}}</li>
			<li class="weekday">{{$t('monday')}}</li>
			<li class="weekday">{{$t('tuesday')}}</li>
			<li class="weekday">{{$t('wednesday')}}</li>
			<li class="weekday">{{$t('thursday')}}</li>
			<li class="weekday">{{$t('friday')}}</li>
			<li class="weekday">{{$t('saturday')}}</li>
		</ul>
		<ul v-if="items" class="items">
			
			<template v-for="(item, i) in items">           
				<li 
					:dataTest="item.id"
					class="item"
					:class="{
						'selected': isSelected(item.id), 
						'artificial-hover': isHovered(item.id), 
						'focused': item.isInMonth,
						'in-range': isInRange(item.id)
					}"
					:key="i"
					@mouseover="notifyAboutMouseOver(item)"
					@mouseout="notifyAboutMouseOut(item)"
					@click="notifyAboutMouseClick(item)">
					<div class="day-container">
						<span>{{item.date.getDate()}}</span>
						
					</div>
					
				</li>
			</template>
		</ul>
	</div>
</template>

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

<script src="./calendar-sheet.js"></script>
<style lang="scss" src="./calendar-sheet.scss" scoped></style>