import { mapState } from 'vuex';

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
	computed: {
		...mapState({
			styleClass: state => state.base.styleClass
		})
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