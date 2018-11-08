<template>
	<div class="s-select" v-click-outside="hide">
		<div class="select-box" v-on:click="changeIsExpandedState">
			<select class="select form-control" :class="isExpanded ? 'expanded-select' : ''">
				<option>
					<slot name="header" :selected="getSelected(options)">
						{{title}}
					</slot>
				</option>
			</select>
			<div class="over-select"></div>
		</div>
    	<div class="select-container">
            <transition name="select-body">
                <div class="select-body" v-show="isExpanded">
                    <div class="toolbar">
                        <div class="search">
                            <input v-model="searchString" 
                                class="search-text-box" 
                                type="text" 
                                placeholder="Search">
                        </div>
                        <div class="selector">
                            <s-checkbox 
                                    class="int hint--bottom hint--info"
                                    :data-hint="allSelected ?  'Unselect all' : 'Select All'"
                                    :value.sync="allSelected" 
                                    :callback="setSelectStateForAll">
                            </s-checkbox>
                        </div>
                    </div>
                    <transition-group v-if="allowAnimationForList" class="options" name="flip-list" tag="ul">
                        <template v-for="option in options">
                            <li class="item single" v-if="isSingle(option) && filter(option)" :key="option.value">
                                <s-checkbox
                                    :value.sync="option.selected"
                                    :callback="selectStateChanged">
                                    {{option.text}}
                                </s-checkbox>
                            </li>
                            <template v-if="isGroup(option) && filter(option)">
                                <li class="item group" :key="option.text">
                                    <div class="group-header">
                                        <div class="group-name">
                                            {{option.text}}
                                        </div>
                                        <div class="group-selector">
                                            <s-checkbox 
                                                class="hint hint--bottom hint--info"
                                                :data-hint="option.selected ? 'Unselect Group' : 'Select Group'"
                                                :value.sync="option.selected"
                                                :callback="val => setSelectStateForGroup(val, option)">
                                            </s-checkbox>
                                        </div>
                                    </div>
                                </li>
                                <template v-for="item in option.items">
                                    <li class="item single" v-if="filter(item)" :key="item.value">
                                        <s-checkbox :value.sync="item.selected" :callback="selectStateChanged">
                                            {{item.text}}
                                        </s-checkbox>
                                    </li>
                                </template>
                            </template>
                        </template>
                    </transition-group>
                    <ul v-if="!allowAnimationForList" class="options">
                        <template v-for="option in options">
                            <li class="item single" v-if="isSingle(option) && filter(option)" :key="option.value">
                                <s-checkbox
                                    :value.sync="option.selected"
                                    :callback="selectStateChanged">
                                    {{option.text}}
                                </s-checkbox>
                            </li>
                            <template v-if="isGroup(option) && filter(option)">
                                <li class="item group" :key="option.text">
                                    <div class="group-header">
                                        <div class="group-name">
                                            {{option.text}}
                                        </div>
                                        <div class="group-selector">
                                            <s-checkbox 
                                                class="hint hint--bottom hint--info"
                                                :data-hint="option.selected ? 'Unselect Group' : 'Select Group'"
                                                :value.sync="option.selected"
                                                :callback="val => setSelectStateForGroup(val, option)">
                                            </s-checkbox>
                                        </div>
                                    </div>
                                </li>
                                <template v-for="item in option.items">
                                    <li class="item single" v-if="filter(item)" :key="item.value">
                                        <s-checkbox :value.sync="item.selected" :callback="selectStateChanged">
                                            {{item.text}}
                                        </s-checkbox>
                                    </li>
                                </template>
                            </template>
                        </template>
                    </ul>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import Fuse from 'fuse.js';
    import vClickOutside from 'v-click-outside'

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
            options() {
                let self = this;
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
                return option.text.includes(this.searchString);
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
</script>

<style lang="scss" scoped>
    @import '../../../styles/shared/mixins/border-radius.scss';

    .s-select.material {
        .select-box {
            position: relative;
            cursor: pointer;

            &:hover {
                .select {
                    box-shadow: 0 6px 9px rgba(127, 150, 187, 0.19);
                }
            }

            .select {
                color: rgb(0, 0, 0);
                padding: 0.6em 0.5em 0.6em 1em;
                border-width: 0px;
                border: 1px solid rgb(203, 209, 216);
                @include border-radius(2em);
                background: rgb(255, 255, 255);
                transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
                cursor: pointer;

                &.expanded-select {
                    @include border-radius(1.5em 1.5em 0 0);
                }
            }
        }
    }
</style>

<style lang="scss" scoped>
    @import '../../../styles/shared/mixins/hardware.scss';
    @import '../../../styles/shared/mixins/border-radius.scss';

    .s-select {
        @include hardware();
        width: 100%;
        font-size: 14px;
        margin: 5px;

        .segpay-btn-link {
            padding: 0;

            &:hover {
                text-decoration: underline;
                color: orange;
            }
        }

        .over-select {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }

        .select-box {
            position: relative;
            cursor: pointer;

            &:hover {
                .select {
                    background: linear-gradient(to top, #bebfc0 0%, #a2a3a5 100%);
                    //background: rgb(127, 130, 139);
                    //background: rgb(236, 236, 236);
                    //box-shadow: 0 6px 9px rgba(127, 150, 187, 0.19)/*, 0 6px 6px rgba(115, 145, 179, 0.23)*/;
                }
            }

            .select {
                font-size: 14px;
                width: 100%;
                color: rgb(236, 236, 236);
                padding: 0.4em 0.5em 0.5em 1em;
                border-width: 0px;
                border: 1px solid rgb(203, 209, 216);
                white-space: nowrap;
                display: block;
                font-weight: 500;
                overflow: hidden;
                text-shadow: 1px 1px rgba(0, 0, 0, 0.14);
                max-height: 34px;
                @include border-radius(1em);
                background: linear-gradient(to bottom, #bebfc0 0%, #a2a3a5 100%);
                box-shadow: 0px 3px 2px rgba(117, 137, 173, 0.18)/*, 0 3px 6px rgba(115, 142, 192, 0.23)*/;
                cursor: pointer;

                &.expanded-select {
                    @include border-radius(1.5em 1.5em 0 0);
                }
            }
        }

        .select-container {
            position: relative;
            width: 100%;
            z-index: 100;

            .select-body {
                background-color: #ffffff;
                -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
				box-shadow: 0 6px 12px rgba(0,0,0,.175);
                @include border-radius(0px 0px 1em 1em);
                border: 1px solid rgb(203, 209, 216);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                max-height: 500px;

                .toolbar {
                    width: 100%;
                    display: flex;
                    flex-direction: row;

                    .search {
                        flex-grow: 15;

                        .search-text-box {
                            width: 80%;
                            border-width: 0px;
                            border-bottom: 2px solid rgb(148, 152, 163);
                            //border-radius: 0px 0px 0px 5px;
                            padding-left: 5px;
                            margin-left: 30px;
                            height: 30px;

                            &:focus {
                                outline:0;
                            }
                        }
                    }

                    .selector {
                        flex-grow: 0;
                        padding: 8px 0 0 10px;
                    }

                    .hint--info:before {
                         left: -1px;
                    }

                    .hint--info:after {
                        left: -80%;
                    }
                }

                .options {
                    list-style-type: none;
                    margin: 0;
                    padding: 5px 0 5px 5px;

                    .item {
                        margin: 5px 0px;

                        &.single {
                            padding: 3px 0 3px 0;

                            .s-checkbox {
                                width: 100%;
                            }

                            &:hover {
                                background-color: #F5F5F5;
                                @include border-radius(5px 0 0 5px);
                            }
                        }

                        &.group {
                            margin-top: 10px;
                            font-weight: 600;
                            padding-left: 28px;

                            .group-header {
                                display: flex;
                                flex-direction: row;

                                .group-name {
                                    flex-grow: 15;
                                }

                                .group-selector {
                                    flex-grow: 0;
                                }
                            }

                            .hint--info:before {
                                left: -1px;
                            }

                            .hint--info:after {
                                left: -80%;
                            }
                        }
                    }
                }

                &::-webkit-scrollbar-track {
                    background-color: #F5F5F5;
                    @include border-radius(0 0 1em 0);
                    overflow: hidden;
                }

                &::-webkit-scrollbar {
                    width: 10px;
                    background-color: #F5F5F5;
                    @include border-radius(0 0 1em 0);
                    overflow: hidden;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgb(140, 159, 177);
                }

                .hint--info:before {
                    border-bottom-color: #3349a7;
                    z-index: 1000;
                }

                .hint--info:after {
                    text-transform: none;
                    font-size: 12px;
                    font-weight: 500;
                    text-shadow: 1px 1px rgba(0,0,0,.14);
                    background-color: #3349a7;
                    z-index: 1000;
                }
            }

        /* ANIMATIONS */
            .select-body-enter, .select-body-leave-to{
                max-height: 0px;
                overflow-y: hidden;
            }

            .select-body-leave, .select-body-enter-to{
                max-height: 500px;
                overflow-y: hidden;
            }

            .select-body-enter-active  {
                transition: max-height .2s;
            }

            .select-body-leave-active {
                transition: max-height .2s;
            }

            .item {
                transition: opacity 1s, transform 1s;
            }

            .flip-list-enter, .flip-list-leave-to {
                opacity: 0;
                transform: translateX(300px);
            }

            .flip-list-leave-active {
                position: absolute;
            }
        }
    }
</style>
