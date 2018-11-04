import './styles/all';
import './scripts/all';

import Vue from 'vue';

/* COMPONENTS REGISTRATION */
	import vueTable from './components/shared/vue-table/vue-table.vue';
	import vueSelect from './components/shared/vue-select/vue-select.vue';
	import customCheckbox from './components/shared/custom-checkbox/custom-checkbox.vue';
	import customHeader from './components/shared/custom-header/custom-header.vue';
	import customHeaderDropdown from './components/shared/custom-header-dropdown/custom-header-dropdown.vue';
	import sideNavigationMenu from './components/shared/side-navigation-menu/side-navigation-menu.vue';
	Vue.component('vue-table', vueTable);
	Vue.component('vue-select', vueSelect);
	Vue.component('custom-header', customHeader);
	Vue.component('custom-checkbox', customCheckbox);
	Vue.component('custom-header-dropdown', customHeaderDropdown);
	Vue.component('side-navigation-menu', sideNavigationMenu);

/* ROUTING */
	import VueRouter from 'vue-router';

	import home from './components/application/home/home.vue';
	import experiment from './components/application/experiment/experiment.vue';
	Vue.use(VueRouter);
	const router = new VueRouter({
		routes: [
			{
				path: '/',
				name: 'home',
				component: home
			},
			{
				path: '/experiment',
				name: 'experiment',
				component: experiment
			}
		]
	});

/* APPLICATION */
	import app from './components/app.vue';
	const application = new Vue({
		el: '.application',
		render: h => h(app),
		router
	});