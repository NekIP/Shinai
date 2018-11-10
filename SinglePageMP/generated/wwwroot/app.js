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
Vue.component('s-table', table);
Vue.component('s-select', select);
Vue.component('s-checkbox', checkbox);
Vue.component('s-material-input', materialInput);
Vue.component('s-nav-menu', navMenu);
Vue.component('s-nav-menu-item', navMenuItem);
Vue.component('s-side-nav-menu', sideNavMenu);
/* ROUTING */
import VueRouter from 'vue-router';
import home from './components/application/home/home.vue';
import experiment from './components/application/experiment/experiment.vue';
Vue.use(VueRouter);
var router = new VueRouter({
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
import store from './store';
var application = new Vue({
    el: '.application',
    render: function (h) { return h(app); },
    router: router,
    store: store
});
