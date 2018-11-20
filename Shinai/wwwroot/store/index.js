import Vue from 'vue';
import Vuex from 'vuex';

import base from './modules/base';	/* TODO: 
									 * rename base to style, 
									 * becouse now base contains only style 
									 * and need to do system more modular 
									 */
import localization from './modules/localization';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		base,
		localization
	}
})