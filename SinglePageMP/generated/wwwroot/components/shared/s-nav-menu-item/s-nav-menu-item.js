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
        'data': {
            type: Object,
            required: true
        }
    },
    computed: __assign({}, mapState({
        styleClass: function (state) { return state.base.styleClass; }
    }), { items: function () {
            return this.data.children.map(function (x) {
                if (!x.type) {
                    x.type = 'single';
                }
                return x;
            });
        } }),
    methods: {
        show: function () {
            this.data.show = true;
            this.$forceUpdate();
        },
        hide: function () {
            this.data.show = false;
            this.$forceUpdate();
        }
    }
};
