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
        value: {
            required: true,
            type: Boolean
        },
        callback: {
            required: false,
            type: Function
        }
    },
    computed: __assign({}, mapState({
        styleClass: function (state) { return state.base.styleClass; }
    })),
    methods: {
        onValueChange: function () {
            this.value = !this.value;
            this.$emit('update:value', this.value);
            if (this.callback) {
                this.callback(this.value);
            }
            this.$forceUpdate();
        }
    }
};
