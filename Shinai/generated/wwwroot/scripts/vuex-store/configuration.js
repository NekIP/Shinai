import Vuex from 'vuex';
var baseStore = new Vuex.Store({
    state: {
        baseStyleClass: undefined
    },
    mutations: {
        increment: function (state) {
            state.count++;
        }
    }
});
