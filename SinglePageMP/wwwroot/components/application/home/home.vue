<template>
	<div>
		hello from vue home
	</div>
</template>
<script>
	export default {
		name: 'home',
		created() {
			this.state.base.setTitle('Home');
		}	
	}
</script>
<style>
	
</style>