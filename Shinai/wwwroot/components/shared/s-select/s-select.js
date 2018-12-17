import Fuse from 'fuse.js';
import vClickOutside from 'v-click-outside';
import { mapState } from 'vuex';

const settingsFuse = {
	shouldSort: true,
	includeScore: true,
	threshold: 0.3,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: [
		"text"
	]
};

export default {
	directives: {
		clickOutside: vClickOutside.directive
	},
	model: {},
	props: {
		allOptionGroups: {
			type: Array,
			required: true
		},
		defaultTitle: {
			type: String,
			required: true
		},
		multipleSelectedTitleChunk: {
			type: String,
			required: true
		},
		allowMultiple: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			selectedIds: [],
			optionGroups: this.allOptionGroups,
			title: this.defaultTitle,
			isExpanded: false,
			isAllOptionsSelected: false,
			groupToIsAllOptionsSelectedMap: {},
			totalOptionsCount: 0,
			searchString: "",
			matchedItems: [],
			allSelected: false
		}
	},
	computed: {
		...mapState({
			styleClass: state => state.base.styleClass
		}),
		options() {
			return this.mapInputOptions(this.allOptionGroups);
		},
		allowAnimationForList() {
			return this.options.length < 300;
		}
	},
	methods: {
/* MAPPERS */
		mapInputOptions(options) {
			let result = [];
			for (let i in options) {
				let option = options[i];
				switch (typeof(option)) {
					case 'string':
						result.push({
							text: option,
							value: option,
							selected: false,
							type: 'single'
						});
						break;
					case 'object':
						if (Array.isArray(option)) {
							result.push({
								text: option[0],
								value: option[1] || option[0],
								selected: option[2] || false,
								type: 'single'
							});
						}
						else {
							result.push({
								text: option.text,
								value: option.value || option.text,
								selected: !!option.isSelected,
								type: option.type || 'single',
								items: option.type == 'group' 
									? this.mapInputOptions(option.items) 
									: undefined
							});
						}
						break;
				}
			}
			return result;
		},

		getSelected(options) {
			let result = [];
			for (let i in options) {
				let option = options[i];
				if (option.type == 'single') {
					if (option.selected) {
						result.push(option);
					}
				}
				else if (option.type == 'group') {
					if (option.items) {
						result.push.apply(result, 
							this.getSelected(option.items));
					}
				}
			}
			return result;
		},

/* SELECT STATE */
		setSelectStateForAll(newState) {
			this.options.forEach(x => {
				x.selected = newState;
				if (x.type == 'group') {
					x.items.forEach(y => y.selected = newState);
				}
			});
			this.updateTitle();
			this.$forceUpdate();
		},

		setSelectStateForGroup(newState, group) {
			group.selected = newState;
			group.items.forEach(x => x.selected = newState);
			this.allSelected = this.options.every(x => x.selected);
			this.updateTitle();
			this.$forceUpdate();
		},

		selectStateChanged() {
			let allSelected = true;
			this.options.forEach(x => {
				if (x.type == 'group') {
					x.selected = (x.items || []).every(y => y.selected);
				}
				allSelected = allSelected && x.selected;
			});
			this.allSelected = allSelected;
			this.updateTitle();
			this.$forceUpdate();
		},

/* FILTER */
		filter(option) {
			if (!this.searchString || option.selected) {
				return true;
			}
			if (this.isGroup(option)) {
				if (!option.items) {
					return false;
				}
				let self = this;
				return option.items.some(x => self.match(x));
			}
			else if (this.isSingle(option)) {
				return this.match(option);
			}
		},

		match(option) {
			return option.text.toUpperCase().indexOf(this.searchString.toUpperCase()) > -1;
			/*let fuse = new Fuse([option], settingsFuse);
			let result = fuse.search(this.searchString);
			return result.length > 0;*/
		},

/* CHECKERS */
		isSingle: option => option.type == 'single',
		isGroup: option => option.type == 'group',

/* OTHER */
		changeIsExpandedState() {
			this.isExpanded = !this.isExpanded;
		},
		
		updateTitle() {
			let selected = this.getSelected(this.options);
			console.log(selected);
			if (selected.length == 0 || !selected) {
				this.title = this.defaultTitle;
			}
			if (selected.length == 1) {
				this.title = `${selected[0].text}`;
			} else {
				this.title = `${selected.length} ${this.multipleSelectedTitleChunk}`;
			}
		},

		hide(event, element) {
			if (event.target.className == "overSelect") {
				return;
			}
			if (this.isExpanded) {
				this.isExpanded = false;
			}
		}
	}
}