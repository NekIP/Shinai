var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import vClickOutside from 'v-click-outside';
import { mapState } from 'vuex';
var settingsFuse = {
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
    data: function () {
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
        };
    },
    computed: __assign({}, mapState({
        styleClass: function (state) { return state.base.styleClass; }
    }), { options: function () {
            var self = this;
            return this.mapInputOptions(this.allOptionGroups);
        },
        allowAnimationForList: function () {
            console.log(this.$data);
            console.log(this.$props);
            return this.options.length < 300;
        } }),
    methods: {
        /* MAPPERS */
        mapInputOptions: function (options) {
            var result = [];
            for (var i in options) {
                var option = options[i];
                switch (typeof (option)) {
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
        getSelected: function (options) {
            var result = [];
            for (var i in options) {
                var option = options[i];
                if (option.type == 'single') {
                    if (option.selected) {
                        result.push(option);
                    }
                }
                else if (option.type == 'group') {
                    if (option.items) {
                        result.push.apply(result, this.getSelected(option.items));
                    }
                }
            }
            return result;
        },
        /* SELECT STATE */
        setSelectStateForAll: function (newState) {
            this.options.forEach(function (x) {
                x.selected = newState;
                if (x.type == 'group') {
                    x.items.forEach(function (y) { return y.selected = newState; });
                }
            });
            this.updateTitle();
            this.$forceUpdate();
        },
        setSelectStateForGroup: function (newState, group) {
            group.selected = newState;
            group.items.forEach(function (x) { return x.selected = newState; });
            this.allSelected = this.options.every(function (x) { return x.selected; });
            this.updateTitle();
            this.$forceUpdate();
        },
        selectStateChanged: function () {
            var allSelected = true;
            this.options.forEach(function (x) {
                if (x.type == 'group') {
                    x.selected = (x.items || []).every(function (y) { return y.selected; });
                }
                allSelected = allSelected && x.selected;
            });
            this.allSelected = allSelected;
            this.updateTitle();
            this.$forceUpdate();
        },
        /* FILTER */
        filter: function (option) {
            if (!this.searchString || option.selected) {
                return true;
            }
            if (this.isGroup(option)) {
                if (!option.items) {
                    return false;
                }
                var self_1 = this;
                return option.items.some(function (x) { return self_1.match(x); });
            }
            else if (this.isSingle(option)) {
                return this.match(option);
            }
        },
        match: function (option) {
            return option.text.includes(this.searchString);
            /*let fuse = new Fuse([option], settingsFuse);
            let result = fuse.search(this.searchString);
            return result.length > 0;*/
        },
        /* CHECKERS */
        isSingle: function (option) { return option.type == 'single'; },
        isGroup: function (option) { return option.type == 'group'; },
        /* OTHER */
        changeIsExpandedState: function () {
            this.isExpanded = !this.isExpanded;
        },
        updateTitle: function () {
            var selected = this.getSelected(this.options);
            console.log(selected);
            if (selected.length == 0 || !selected) {
                this.title = this.defaultTitle;
            }
            if (selected.length == 1) {
                this.title = "" + selected[0].text;
            }
            else {
                this.title = selected.length + " " + this.multipleSelectedTitleChunk;
            }
        },
        hide: function (event, element) {
            if (event.target.className == "overSelect") {
                return;
            }
            if (this.isExpanded) {
                this.isExpanded = false;
            }
        }
    }
};
