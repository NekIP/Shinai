import './styles/all';
import './scripts/all';

import Vue from 'vue';



/* COMPONENTS REGISTRATION */
	import table from './components/shared/s-table/s-table.vue';
	import select from './components/shared/s-select/s-select.vue';
	import checkbox from './components/shared/s-checkbox/s-checkbox.vue';
	import navMenu from './components/shared/s-nav-menu/s-nav-menu.vue';
	import navMenuItem from './components/shared/s-nav-menu-item/s-nav-menu-item.vue';
	import sideNavMenu from './components/shared/s-side-nav-menu/s-side-nav-menu.vue';
	import materialInput from './components/shared/s-material-input/s-material-input.vue';
	import datepickerRangeCalendars from './components/shared/s-datepicker-range-calendars/s-datepicker-range-calendars.vue';
	import datepickerRange from './components/shared/s-datepicker-range/s-datepicker-range.vue';
	import window from './components/shared/s-window/s-window.vue';
	import datePickerAnother from './components/shared/s-datepicker-another/s-date-picker.vue';
	import dateRangePickerAnother from './components/shared/s-datepicker-another/s-daterange-picker.vue';
	import button from './components/shared/s-button/s-button.vue';

	Vue.component('s-table', table);
	Vue.component('s-select', select);
	Vue.component('s-checkbox', checkbox);
	Vue.component('s-material-input', materialInput);
	Vue.component('s-nav-menu', navMenu);
	Vue.component('s-nav-menu-item', navMenuItem);
	Vue.component('s-side-nav-menu', sideNavMenu);
	//Vue.component('s-calendar', calendar);
	//Vue.component('s-datepicker-org', datepickerOrg);
	Vue.component('s-datepicker-range-calendars', datepickerRangeCalendars);
	Vue.component('s-datepicker-range', datepickerRange);
	Vue.component('s-window', window);
	Vue.component('s-button', button);
	Vue.component('s-date-picker-another', datePickerAnother);
	Vue.component('s-daterange-picker-another', dateRangePickerAnother);

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



/* LOCALIZATION */
	import VueI18n from 'vue-i18n';

	Vue.use(VueI18n);

	const i18n = new VueI18n({ 
		locale: 'en-EN', 
		fallbackLocale: 'en-EN', 
	}); 										/* 
												 * don't rename it, 
												 * because this name can use in all childrens 
												 */

/* APPLICATION */
	import app from './components/app.vue';
	import store from './store';	/* 
									* don't rename it, 
									* because this name can use in all childrens 
									*/
	import { mapState } from 'vuex';

	/* 
	 * this constant contains all information about application, 
	 * it allow from all vue app
	 * but don't use it never becouse it can lead to unsupported code
	 */
	const application = new Vue({
		el: '.application',
		render: h => h(app),
		router,
		store,
		i18n,

		created() {
			this.$i18n.locale = this.language;
		},

		/* current language is bound to state in vuex */
		computed: {
			...mapState({
				language: state => state.localization.language
			})
		},

		watch: {
			language(value) {
				this.$i18n.locale = value;
			}
		}
	});