<template>
	<div class="custom-header-dropdown" @mouseover="show" @mouseout="hide">
		<div class="header">
			<slot name="header-name" :headerName="data.name">
				{{data.name}}
			</slot>
		</div>
		<div class="dropdown-container">
			<div class="dropdown" v-show="data.show">
				<div class="item" v-for="item in data.children" :key="item.name">
					<div v-if="item.type == 'single'" class="single">
						<a :href="item.url">{{item.name}}</a>	
					</div>
					<template v-if="item.type == 'group'">
						<div class="group">
							{{item.name}}
						</div>
						<div v-for="child in item.children" class="group-child">
							<a :href="child.url">{{child.name}}</a>	
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'custom-header-dropdown',
		props: {
			'data': {
				type: Object,
				required: true
			}
		},
		methods: {
			show() {
				this.data.show = true;
				this.$forceUpdate();
			},

			hide() {
				this.data.show = false;
				this.$forceUpdate();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.custom-header-dropdown {
		.header {
			color: #718cb5;
			cursor: pointer;
			display: block;
			font-size: 12px;
			line-height: 57px;
			padding: 0 15px 0 15px;
			text-transform: uppercase;
			width: auto;

			&:hover {
				background: #255297;
				color: #fff;
			}
		}

		.dropdown-container {
			position: relative;

			.dropdown {
				position: absolute;
				min-width: 300px;
				z-index: 1000;
				float: left;
				padding: 5px 0 20px 0;
				text-align: left;
				list-style: none;
				background-color: #fff;
				-webkit-background-clip: padding-box;
				background-clip: padding-box;
				border-radius: 0 0 4px 4px;
				-webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
				box-shadow: 0 6px 12px rgba(0,0,0,.175);
				font-size: 14px;

				.item {
					color: #255297;

					.single {
						font-size: 1.2em;
						font-weight: normal;
						text-transform: uppercase;
						padding: 15px 25px 0 25px;
						font-weight: 600;
					}

					.group {
						font-size: 1.2em;
						font-weight: normal;
						text-transform: uppercase;
						padding: 15px 25px 0 25px;
						font-weight: 600;
					}

					.group-child {
						padding: 0 25px 0 25px;
					}

					a {
						text-decoration: none;
						color: #255297;

						&:hover {
							color: rgb(255, 166, 1);
						}
					}
				}
			}
		}
	}
</style>