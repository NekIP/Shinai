<template>
	<div class="s-nav-menu-item" :class="styleClass" @mouseover="show" @mouseout="hide">
		<div class="header">
			<slot name="header-name" :headerName="data.name">
				{{data.name}}
			</slot>
		</div>
		<div class="dropdown-container">
			<transition name="dropdown">
				<div class="dropdown" v-show="data.show">
					<div class="item" v-for="item in items" :key="item.name">
						<div v-if="item.type == 'single'" class="single">
							<a :href="item.url">{{item.name}}</a>	
						</div>
						<template v-if="item.type == 'group'">
							<div class="group">
								{{item.name}}
							</div>
							<div v-for="child in item.children" class="group-child">
								<a :href="child.url">{{child.name}}</a>	
							</div>
						</template>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<script src="./s-nav-menu-item.js"></script>
<style lang="scss" src="./s-nav-menu-item.scss" scoped></style>
<style lang="scss" src="./s-nav-menu-item.material.scss" scoped></style>