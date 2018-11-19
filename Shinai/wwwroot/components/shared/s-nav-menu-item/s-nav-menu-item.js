import { mapState } from 'vuex';

export default {
	props: {
		'data': {
			type: Object,
			required: true
		}
	},
	computed: {
		...mapState({
			styleClass: state => state.base.styleClass
		}),
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