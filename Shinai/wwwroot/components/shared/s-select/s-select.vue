<template>
	<div class="s-select" :class="styleClass" v-click-outside="hide">
		<div class="select-box" v-on:click="changeIsExpandedState">
			<button class="select" :class="isExpanded ? 'expanded-select' : ''">
                <span class="title">
                    <slot name="header" :selected="getSelected(options)">
                        {{title}}
                    </slot>
                </span>
                <span class="caret">
                    <i v-if="!isExpanded" aria-hidden="true" class="fa fa-caret-down"></i>
				    <i v-if="isExpanded" aria-hidden="true" class="fa fa-caret-up"></i>
                </span>
			</button>
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
                                    @changed="setSelectStateForAll">
                            </s-checkbox>
                        </div>
                    </div>
                    <transition-group class="options" name="flip-list" tag="ul" :allow-animation-for-list="allowAnimationForList">
                        <template v-for="option in options">
                            <li     class="item single" 
                                    v-if="isSingle(option) && filter(option)" 
                                    :key="option.value">
                                <s-checkbox
                                    :value.sync="option.selected"
                                    @changed="selectStateChanged">
                                    {{option.text}}
                                </s-checkbox>
                            </li>
                            <template v-if="isGroup(option) && filter(option)">
                                <li     class="item group" 
                                        :key="option.text">
                                    <div class="group-header">
                                        <div class="group-name">
                                            {{option.text}}
                                        </div>
                                        <div class="group-selector">
                                            <s-checkbox 
                                                class="hint hint--bottom hint--info"
                                                :data-hint="option.selected ? 'Unselect Group' : 'Select Group'"
                                                :value.sync="option.selected"
                                                @changed="val => setSelectStateForGroup(val, option)">
                                            </s-checkbox>
                                        </div>
                                    </div>
                                </li>
                                <template v-for="item in option.items">
                                    <li     class="item single" 
                                            v-if="filter(item)" 
                                            :key="item.value">
                                        <s-checkbox :value.sync="item.selected" @changed="selectStateChanged">
                                            {{item.text}}
                                        </s-checkbox>
                                    </li>
                                </template>
                            </template>
                        </template>
                    </transition-group>
                </div>
            </transition>
        </div>
    </div>
</template>
<script src="./s-select.js"></script>
<style lang="scss" src="./s-select.scss" scoped></style>
<style lang="scss" src="./s-select.material.scss" scoped></style>
