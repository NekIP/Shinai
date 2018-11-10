<template>
	<div class="s-side-nav-menu" :class="styleClass">
		<template v-for="item in navMenuItems">
			<div v-if="item.type == 'single'" 
					:key="item.name" 
					class="menu-item"
					:class="item.current ? 'selected-menu-item' : ''">
				<div class="name">
					<a :href="item.url" v-if="!item.current">{{item.name}}</a>
					<template v-if="item.current">{{item.name}}</template>
				</div>
			</div>
			<div v-if="item.type == 'group'" 
					:key="item.name"
					class="menu-item dropdown"
					:class="item.show ? 'opened' : ''">
				<div class="name" @click="showHide(item)" role="button">
					<div class="text">
						{{item.name}}
					</div>
					<div class="caret">
						<i class="fa fa-caret-down" aria-hidden="true" v-show="item.show"></i>
						<i class="fa fa-caret-right" aria-hidden="true" v-show="!item.show"></i>
					</div>
				</div>
				<transition name="dropdown-content">
					<div class="dropdown-content" v-show="item.show" key="dropdown">
						<div v-for="child in item.children" 
								:key="child.name" 
								class="children"
								:class="child.current ? 'selected-menu-item' : ''">
							<a :href="child.url" v-if="!child.current">{{child.name}}</a>
							<template v-if="child.current">{{child.name}}</template>
						</div>
					</div>
				</transition>
			</div>
		</template>
	</div>
</template>
<script>
	import { mapState } from 'vuex';

	export default {
		props: {
			items: {
				type: Array,
				required: true
			},
			show: {
				type: Boolean,
				required: false,
				default: true
			}
		},
		data() {
			return {

			}
		},
		computed: {
			...mapState({
                styleClass: state => state.base.styleClass
            }),
			navMenuItems() {
				return this.items.map(x => {
					let type = x.type || 'single';
					x.type = type;
					x.show = x.show == undefined && type == 'group' 
							? x.children.filter(x => x.current).length > 0
							: x.show;
					return x;
				})
			}
		},
		methods: {
			showHide(item) {
				item.show = !item.show;
				for (let i in this.navMenuItems) {
					if (this.navMenuItems[i] != item) {
						this.navMenuItems[i].show = false;
					}
				}
				this.$forceUpdate();
			},
		}
	}
</script>
<style lang="scss">
	$headerHeight: 57px;
	$linkAnimationTime: 0.05s;

	.s-side-nav-menu {
		@media screen and (max-width: 1024px) {
			display: none;
		}

		z-index: 100;
		width: 188px;
		height: 93%;
		height: calc(100% - 57px);
		height: -moz-calc(100% - 57px);
		height: -webkit-calc(100% - 57px);
		background: #efefef;
		-ms-user-select: none;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-webkit-box-shadow: inset -9px 11px 18px -6px rgba(0,0,0,0.1);
		-moz-box-shadow: inset -9px 11px 18px -6px rgba(0,0,0,0.1);
		box-shadow: inset -9px 11px 18px -6px rgba(0,0,0,0.1);
		float: left;

		.menu-item {
    		border-bottom: solid 1px #d1d1d1;
			box-shadow: 0 1px 0 0 #fff;
			padding: 14px 28px 14px 16px;
			overflow-y: hidden;
			cursor: pointer;

			.name {
				font-size: 15px;
				text-shadow: 1px 1px rgba(255,255,255,.34);
				text-transform: uppercase;
				color: #039;
				transition: color $linkAnimationTime ease;
				font-weight: 600;

				a {
					color: #133f84;
					text-decoration: none;
					transition: color $linkAnimationTime ease;
				}
			}

			&:hover {
				.name {
					a {
						color: rgb(230, 149, 0);
					}
				}
			}

			&.opened {
				background: #dbdbdc91;
			}

			&.dropdown {
				padding: 14px 0 14px 16px;

				.name {
					width: 100%;
					display: flex;
					flex-direction: row;

					.caret {
						flex-grow: 1;
						text-align: right;
						vertical-align: middle;
						padding-right: 10px;
						padding-top: 5px;
						font-size: 18px;
					}
				}

				&:hover {
					.name {
						color: rgb(230, 149, 0);
					}
				}

				.dropdown-content {
					padding-top: 10px;

					.children {
						font-size: 13px;
						line-height: 21px;
						color: #000000;
						text-decoration: none;

						a {
							font-size: 13px;
							line-height: 21px;
							color: #133f84;
							text-decoration: none;
							transition: color $linkAnimationTime ease;
							
							&:hover {
								color: rgb(230, 149, 0);
							}
						}

						&.selected-menu-item {
							font-weight: 600;

							a {
								color: rgb(0, 0, 0);
							}
						}
					}
				}
			}
		}

		.selected-menu-item {
			cursor: default;

			.name {
				color: rgb(0, 0, 0);
			}

			a {
				color: rgb(0, 0, 0);
			}
		}

	/* ANIMATIONS */
		.dropdown-content-enter, .dropdown-content-leave-to{
			max-height: 0px;
		}

		.dropdown-content-leave, .dropdown-content-enter-to{
			max-height: 100px;
		}

		.dropdown-content-enter-active  {
			transition: max-height .2s;
		}

		.dropdown-content-leave-active {
			transition: max-height .2s;
		}
	}
</style>