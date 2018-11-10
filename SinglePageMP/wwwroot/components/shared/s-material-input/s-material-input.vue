<template>
	<div class="s-material-input" :class="styleClass">
		<div class="input-container">
			<input class="input" type="text" v-model="value" @input="onValueChange" required>
			<span class="bar"></span>
			<label class="label">
				<slot></slot>
			</label>
		</div>
	</div>
</template>
<script src="./s-material-input.js"></script>
<style lang="scss" src="./s-material-input.scss" scoped></style>
<style lang="scss" src="./s-material-input.material.scss" scoped></style>
