<template>
	<button class="s-button" :class="styleClass" @click="click">
		<span class="text">
			<slot></slot>
		</span>
	</button>
</template>
<script>
	import { mapState } from 'vuex';

	export default {
		name: 'button',
		computed: {
			...mapState({
				styleClass: state => state.base.styleClass
			})
		},
		methods: {
			click() {
				this.$emit('click');
			}
		}
	}
</script>
<style src="./s-button.material.scss" lang="scss" scoped></style>
<style src="./s-button.scss" lang="scss" scoped></style>
