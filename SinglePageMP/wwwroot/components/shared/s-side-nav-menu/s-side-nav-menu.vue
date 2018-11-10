<template>
	<div class="s-side-nav-menu" :class="styleClass">
		<template v-for="item in navMenuItems">
			<div v-if="item.type == 'single'" 
					:key="item.name" 
					class="menu-item"
					:class="item.current ? 'selected-menu-item' : ''">
				<div class="name">
					<a :href="item.url" v-if="!item.current">{{item.name}}</a>
					<template v-if="item.current">{{item.name}}</template>
				</div>
			</div>
			<div v-if="item.type == 'group'" 
					:key="item.name"
					class="menu-item dropdown"
					:class="item.show ? 'opened' : ''">
				<div class="name" @click="showHide(item)" role="button">
					<div class="text">
						{{item.name}}
					</div>
					<div class="caret">
						<i class="fa fa-caret-down" aria-hidden="true" v-show="item.show"></i>
						<i class="fa fa-caret-right" aria-hidden="true" v-show="!item.show"></i>
					</div>
				</div>
				<transition name="dropdown-content">
					<div class="dropdown-content" v-show="item.show" key="dropdown">
						<div v-for="child in item.children" 
								:key="child.name" 
								class="children"
								:class="child.current ? 'selected-menu-item' : ''">
							<a :href="child.url" v-if="!child.current">{{child.name}}</a>
							<template v-if="child.current">{{child.name}}</template>
						</div>
					</div>
				</transition>
			</div>
		</template>
	</div>
</template>
<script src="./s-side-nav-menu.js"></script>
<style lang="scss" src="./s-side-nav-menu.scss"></style>
<style lang="scss" src="./s-side-nav-menu.material.scss"></style>