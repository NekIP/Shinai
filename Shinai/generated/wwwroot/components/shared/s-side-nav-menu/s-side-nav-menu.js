var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { mapState } from 'vuex';
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        show: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: function () {
        return {};
    },
    computed: __assign({}, mapState({
        styleClass: function (state) { return state.base.styleClass; }
    }), { navMenuItems: function () {
            return this.items.map(function (x) {
                var type = x.type || 'single';
                x.type = type;
                x.show = x.show == undefined && type == 'group'
                    ? x.children.filter(function (x) { return x.current; }).length > 0
                    : x.show;
                return x;
            });
        } }),
    methods: {
        showHide: function (item) {
            item.show = !item.show;
            for (var i in this.navMenuItems) {
                if (this.navMenuItems[i] != item) {
                    this.navMenuItems[i].show = false;
                }
            }
            this.$forceUpdate();
        },
    }
};
