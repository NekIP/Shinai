<template>
	<label class="s-checkbox">
      	<input 	type="checkbox" 
		  		:checked="value ? 'checked' : ''"
		  		@input="onValueChange" 
				class="invisible">
      	<div class="checkbox">
        	<svg width="20px" height="20px" viewBox="0 0 20 20">
          		<path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
          		<polyline points="4 11 8 15 16 6"></polyline>
        	</svg>
      	</div>
      	<span>
			<slot></slot>
		</span>
    </label>
</template>
<script>
	export default {
		props: {
			value: {
				required: true,
				type: Boolean
			},
			callback: {
				required: false,
				type: Function
			}
		},
		methods: {
			onValueChange: function(){
				this.value = !this.value;
				this.$emit('update:value', this.value);
				if (this.callback) {
					this.callback(this.value);
				}
				this.$forceUpdate();
			}
		}
	}
</script>
<style lang="scss">
	$color: #133f84;
	$width-barrier: 980px;
	$mobile-scale: 2;

	.s-checkbox {
		user-select: none;
		cursor: pointer;
		margin-bottom: 0;
		
		/*@media screen and (max-width: 600px) {
			font-size: 5.4vw;
		}
		@media screen and (max-width: $width-barrier)  {
			font-size: 4.4vw;
		}
		@media screen and (max-width: $width-barrier) and (orientation: landscape) {
			font-size: 2.1vw;
		}*/
		input:checked {
			&+.checkbox {
				border-color: $color;

				svg {
					path {
						fill: $color;
					}

					polyline {
						stroke-dashoffset: 0;
					}
				}
			}
		}

		&:hover {
			.checkbox {
				svg {
					path {
						stroke-dashoffset: 0;
					}
				}
			}
		}

		.checkbox {
			position: relative;
			/*top: 2px;*/
			float: left;
			margin-right: 8px;
			width: 20px;
			height: 20px;
			border: 2px solid rgba(182, 194, 218, 0.671);
			border-radius: 3px;

			/*@media screen and (max-width: $width-barrier) {
				-webkit-transform: scale($mobile-scale);
				-ms-transform: scale($mobile-scale); 
				transform: scale($mobile-scale);
				top: 0.5em;
				left: 0.5em;
				margin-right: 1em;
			}

			@media screen and (max-width: $width-barrier) and (orientation: landscape)  {
				-webkit-transform: scale(1.3);
				-ms-transform: scale(1.3); 
				transform: scale(1.3);
				top: 0.4em;
				left: 0.4em;
				margin-right: 0.8em;
			}*/

			svg {
				position: absolute;
				top: -2px;
				left: -2px;

				path {
					fill: none;
					stroke: $color;
					stroke-width: 2;
					stroke-linecap: round;
					stroke-linejoin: round;
					stroke-dasharray: 71px;
					stroke-dashoffset: 71px;
					transition: all .6s ease;
				}

				polyline {
					fill: none;
					stroke: #FFF;
					stroke-width: 2;
					stroke-linecap: round;
					stroke-linejoin: round;
					stroke-dasharray: 18px;
					stroke-dashoffset: 18px;
					transition: all .3s ease;
				}
			}
		}

		&>span {
			pointer-events: none;
			vertical-align: middle;
		}

		.cntr {
			position: absolute;
			top: 45%;
			left: 0;
			width: 100%;
			text-align: center;
		}

		.invisible {
			position: absolute;
			z-index: -1;
			width: 0;
			height: 0;
			opacity: 0;
		}
	}
</style>
