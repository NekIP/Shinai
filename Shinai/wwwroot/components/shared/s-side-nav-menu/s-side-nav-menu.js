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