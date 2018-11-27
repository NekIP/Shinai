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
<script src="./s-datepicker-range.js"></script>
<style 	src="./s-datepicker-range.scss" lang="scss"></style>
<style 	src="./s-datepicker-range.material.scss" lang="scss"></style>
<i18n 	src="./s-datepicker-range.localization.json"></i18n>
