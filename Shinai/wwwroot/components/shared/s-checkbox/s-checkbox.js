import { mapState } from 'vuex';

export default {
	props: {
		value: {
			required: true,
			type: Boolean
		}
	},
	computed: {
		...mapState({
			styleClass: state => state.base.styleClass
		})
	},
	methods: {
		onValueChange() {
			this.value = !this.value;
			console.log("hello");
			this.$emit('update:value', this.value);
			this.$emit('changed', this.value)
			this.$forceUpdate();
		}
	}
}