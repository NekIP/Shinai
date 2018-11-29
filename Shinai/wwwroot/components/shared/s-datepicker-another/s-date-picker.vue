<template>
	<div class="simple-datepicker">
		<div class="date-input">
			<div class="input-with-icon-wrapper">
					<i class="fa fa-calendar" aria-hidden="true"></i>
					<input 
						type="date"
						class="form-control"
						:class="{
							'error': selectedDateIsInvalid
						}"
						:value="value | dateToString"
						@input="tryToSetSelectedDate($event.target.valueAsDate)" />
				</div>
		</div>
		<div class="header"> 
			<div class="prev">
				<div class="arrow-button" @click="prevMonth">
					<i class="fa fa-chevron-left" aria-hidden="true"></i>
				</div>
			</div>
			<div class="info">{{ header }}</div>
			<div class="next">
				<div class="arrow-button" @click="nextMonth">
					<i class="fa fa-chevron-right" aria-hidden="true"></i>
				</div>
			</div>
		</div>
		<calendar-sheet 
			:initializer-pivot-date="initializerPivotDate"
			:bus="bus"
			@mouse-over-day="handleMouseOver"
			@mouse-click-day="handleMouseClick"
			@mouse-out="handleMouseOut">
		</calendar-sheet>
	</div>

</template>

<script src="./s-date-picker.js"></script>
<style lang="scss" src="./shared-styles.scss" scoped></style>