<template>
	<div class="custom-header-dropdown" @mouseover="show" @mouseout="hide">
		<div class="header">
			<slot name="header-name" :headerName="data.name">
				{{data.name}}
			</slot>
		</div>
		<div class="dropdown-container">
			<transition name="dropdown">
				<div class="dropdown" v-show="data.show">
					<div class="item" v-for="item in items" :key="item.name">
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
			</transition>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			'data': {
				type: Object,
				required: true
			}
		},
		computed: {
			items() {
				return this.data.children.map(x => {
					if (!x.type) {
						x.type = 'single';
					}
					return x;
				});
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
				/*min-width: 300px;*/
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
				overflow-x: hidden;
				overflow-y: hidden;

				.item {
					color: #255297;

					.single {
						font-size: 1.3em;
						font-weight: normal;
						text-transform: uppercase;
						padding: 5px 25px 0 25px;
						font-weight: 400;
					}

					.group {
						font-size: 1.3em;
						font-weight: normal;
						text-transform: uppercase;
						padding: 5px 25px 0 25px;
						font-weight: 400;
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

	/* ANIMATIONS */
		.dropdown-enter, .dropdown-leave-to{
			max-height: 0px;
			max-width: 190px;
			z-index: 800;
		}

		.dropdown-leave, .dropdown-enter-to{
			max-height: 500px;
			max-width: 300px;
			z-index: 700;
		}

		.dropdown-enter-active  {
			transition: max-height .3s, max-width .3s;
		}

		.dropdown-leave-active {
			transition: max-height .0s, max-width .0s;
		}
	}
</style>