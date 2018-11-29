<template>
	<div class="simple-daterangepicker">
		<div class="row">
			<div class="col col-md-6">
				<div class="date-input">
					<div class="input-with-icon-wrapper">
						<i class="fa fa-calendar" aria-hidden="true"></i>
						<input 
							type="date"
							class="form-control"
							:value="value.startDate | dateToString"
							@input="tryToSetSelectedStartDate($event.target.valueAsDate)" />
					</div>
				</div>
				<div class="header"> 
					<div class="prev">
						<div class="arrow-button" @click="startPrevMonth">
							<i class="fa fa-chevron-left" aria-hidden="true"></i>
						</div>
					</div>
					<div class="info">{{ startHeader }}</div>
					<div class="next" v-if="unlinkPanels" :disabled="!canSwitchMonthInUnlinkedPanel">
						<div class="arrow-button" @click="startNextMonth">
							<i class="fa fa-chevron-right" aria-hidden="true"></i>
						</div>
					</div>
				</div>
				<calendar-sheet 
					:initializer-pivot-date="startCalendarInitializerPivotDate"
					:bus="bus"
					@mouse-over-day="handleMouseOver"
					@mouse-click-day="handleMouseClick"
					@mouse-out="handleMouseOut">
				</calendar-sheet>
			</div>
			<div class="col col-md-6">
				<div class="date-input">
					<div class="input-with-icon-wrapper">
						<i class="fa fa-calendar" aria-hidden="true"></i>
						<input 
							type="date"
							class="form-control"
							:value="value.endDate | dateToString"
							@input="tryToSetSelectedEndDate($event.target.valueAsDate)" />
					</div>
				</div>   
				 <div class="header"> 
					<div class="prev" v-if="unlinkPanels" :disabled="!canSwitchMonthInUnlinkedPanel">
						<div class="arrow-button" @click="endPrevMonth">
							<i class="fa fa-chevron-left" aria-hidden="true"></i>
						</div>
					</div>
					<div class="info">{{ endHeader }}</div>
					<div class="next">
						<div class="arrow-button" @click="endNextMonth">
							<i class="fa fa-chevron-right" aria-hidden="true"></i>
						</div>
					</div>
				</div>
				<calendar-sheet 
					:initializer-pivot-date="endCalendarInitializerPivotDate"
					:bus="bus"
					@mouse-over-day="handleMouseOver"
					@mouse-click-day="handleMouseClick"
					@mouse-out="handleMouseOut">
				</calendar-sheet>
			</div>
		</div>
		
		
	</div>

</template>

<script src="./s-daterange-picker.js"></script>
<style lang="scss" src="./shared-styles.scss" scoped></style>