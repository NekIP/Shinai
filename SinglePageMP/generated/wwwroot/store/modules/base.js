var state = {
    styleClass: styleClass
};
var getters = {};
var actions = {};
var mutations = {
    setStyleClass: function (state, val) {
        state.styleClass = val;
    }
};
export default {
    //namespaced: true,
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations
};
