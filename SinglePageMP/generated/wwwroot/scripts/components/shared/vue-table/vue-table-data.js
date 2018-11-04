var Column = /** @class */ (function () {
    function Column() {
        this.id;
        this.name;
        this.type;
        this.sortable;
        this.filtrable;
        this.groupable;
        this.resizable;
        this.width;
        this.grouping;
        this.resizing;
        this.sorting;
        this.filtering;
    }
    return Column;
}());
export { Column };
export var columnFilters = {
    'eq': {
        predicate: function (curr, exp) { return curr === exp; },
        title: 'Is equal to',
        type: 'all'
    },
    "neq": {
        predicate: function (curr, exp) { return curr !== exp; },
        title: 'Is not equal to',
        type: 'all'
    },
    'null': {
        predicate: function (curr) { return curr === null; },
        title: 'Is null',
        type: 'all',
        single: true
    },
    'nnull': {
        predicate: function (curr) { return curr !== null; },
        title: 'Is not null',
        type: 'all',
        single: true
    },
    'greq': {
        predicate: function (curr, exp) { return +curr >= +exp; },
        title: 'Is greater than or equal to',
        type: 'number'
    },
    'gr': {
        predicate: function (curr, exp) { return +curr > +exp; },
        title: 'Is greater than',
        type: 'number'
    },
    'lseq': {
        predicate: function (curr, exp) { return +curr <= +exp; },
        title: 'Is less than or equal to',
        type: 'number'
    },
    'ls': {
        predicate: function (curr, exp) { return +curr < +exp; },
        title: 'Is less than',
        type: 'number'
    },
    'strtwth': {
        predicate: function (curr, exp) { return curr.startsWith(exp); },
        title: 'Starts with',
        type: 'string'
    },
    'endwth': {
        predicate: function (curr, exp) { return curr.endsWith(exp); },
        title: 'Ends with',
        type: 'string'
    },
    'in': {
        predicate: function (curr, exp) { return curr.includes(exp); },
        title: 'Contains',
        type: 'string'
    },
    'nin': {
        predicate: function (curr, exp) { return !curr.includes(exp); },
        title: 'Does not contain',
        type: 'string'
    },
    'empt': {
        predicate: function (curr, exp) { return curr === ""; },
        type: 'Is empty',
        type: 'string'
    },
    'nempt': {
        predicate: function (curr, exp) { return curr !== ""; },
        type: 'Is not empty',
        type: 'string'
    }
};
