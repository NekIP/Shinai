import './styles/all';
import './scripts/all';
import Vue from 'vue';
import vueTable from './components/shared/vue-table/vue-table.vue';
import vueSelect from './components/shared/vue-select/vue-select.vue';
Vue.component('vue-table', vueTable);
Vue.component('vue-select', vueSelect);
import VueRouter from 'vue-router';
import home from './components/application/home/home.vue';
import experiment from './components/application/experiment/experiment.vue';
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        {
            path: '',
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
import app from './components/app.vue';
var application = new Vue({
    el: '.application',
    render: function (h) { return h(app); },
    router: router
});
