<template>
	<label class="s-checkbox" :class="styleClass">
      	<input 	type="checkbox" 
		  		:checked="value ? 'checked' : ''"
		  		@click="onValueChange" 
				class="invisible">
      	<span class="checkbox">
        	<svg width="20px" height="20px" viewBox="0 0 20 20">
          		<path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
          		<polyline points="4 11 8 15 16 6"></polyline>
        	</svg>
      	</span>
      	<span>
			<slot></slot>
		</span>
    </label>
</template>
<script src="./s-checkbox.js"></script>
<style lang="scss" src="./s-checkbox.scss" scoped></style>
<style lang="scss" src="./s-checkbox.material.scss" scoped></style>