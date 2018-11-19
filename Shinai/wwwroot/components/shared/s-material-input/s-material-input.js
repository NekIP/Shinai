import { mapState } from 'vuex';

export default {
	props: {
		value: {
			type: String,
			required: true
		},
		callback: {
			type: Function,
			required: false
		}
	},
	computed: {
		...mapState({
			styleClass: state => state.base.styleClass
		})
	},
	methods: {
		onValueChange: function(){
			this.$emit('update:value', this.value);
			if (this.callback) {
				this.callback(this.value);
			}
			this.$forceUpdate();
		}
	}
}