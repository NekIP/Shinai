<template>
	<div class="app-container">
		<custom-header></custom-header>
		<div class="app-content">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>

</script>
<style lang="scss">
	@font-face {
		font-family: 'Roboto';
		src: local('Roboto'), local('Roboto-Regular'), url('../fonts/roboto/Roboto.woff2') format('woff2'), url('../fonts/roboto/Roboto.woff') format('woff'), url('../fonts/roboto/Roboto.ttf') format('truetype');
		font-weight: 400;
		font-style: normal;
	}

	body {
		padding-left: 0px;
		padding-right: 0px;
		height: 100%;
	}

	.app-container {
		height: 100%;

		.app-content {
			overflow: auto;
			height: 93%;
			height: calc(100% - 57px);
			height: -moz-calc(100% - 57px);
			height: -webkit-calc(100% - 57px);
			font-family: Roboto;
			scroll-behavior: smooth;

			&::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
				background-color: #F5F5F5;
			}

			&::-webkit-scrollbar {
				width: 10px;
				background-color: #F5F5F5;
			}

			&::-webkit-scrollbar-thumb {
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
				background-color: rgb(194, 194, 194);
			}
		}
	}
</style>