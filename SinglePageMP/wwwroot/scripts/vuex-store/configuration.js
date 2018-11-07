import Vuex from 'vuex';

const baseStore = new Vuex.Store({
	state: {
		baseStyleClass: undefined
	},
	mutations: {
		increment (state) {
			state.count++
		}
	}
})