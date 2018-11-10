export function getReadableName(name) {
    var result = name[0].toUpperCase();
    for (var i = 1; i < name.length; i++) {
        var c = name[i];
        var cUpper = c.toUpperCase();
        if ('0123456789'.indexOf(c) === -1 && cUpper === c) {
            result += ' ' + cUpper;
        }
        else {
            result += c;
        }
    }
    return result;
}
export function indexOfItemInArray(array, item, selector) {
    var result = -1;
    for (var i = 0; i < array.length; i++) {
        if (selector(array[i]) === item) {
            result = i;
            break;
        }
    }
    return result;
}
export function removeItemInArray(array, item, selector) {
    var indexOfItem = indexOfItemInArray(array, item, selector);
    if (indexOfItem !== -1) {
        array.splice(indexOfItem, 1);
    }
}
export function itemExistInArray(array, item, selector) {
    var indexOfItem = indexOfItemInArray(array, item, selector);
    if (indexOfItem !== -1) {
        return false;
    }
    return true;
}
export function getColumns(columns, sortable, filtrable, groupable, resizable, movable, hidable) {
    var defaultType = 'string';
    return columns.map(function (x) {
        switch (typeof (x)) {
            case 'string':
                var readableName = getReadableName(x);
                var _a = [sortable || false, filtrable || false, groupable || false, hidable || false], columnSortable = _a[0], columnFiltrable = _a[1], columnGroupable = _a[2], columnHidable = _a[3];
                return {
                    id: x,
                    name: readableName,
                    type: defaultType,
                    sortable: columnSortable,
                    filtrable: columnFiltrable,
                    groupable: columnGroupable,
                    hidable: columnHidable,
                    resizable: resizable || false,
                    movable: movable || false,
                    width: calculateWidth(readableName, columnHidable, columnFiltrable, columnGroupable, columnSortable)
                };
            case 'object':
                if (Array.isArray(x)) {
                    var readableName_1 = x[1] || getReadableName(x[0]);
                    var _b = [sortable || false, filtrable || false, groupable || false, hidable || false], columnSortable_1 = _b[0], columnFiltrable_1 = _b[1], columnGroupable_1 = _b[2], columnHidable_1 = _b[3];
                    return {
                        id: x[0],
                        name: readableName_1,
                        type: x[2] || defaultType,
                        sortable: columnSortable_1,
                        filtrable: columnFiltrable_1,
                        groupable: columnGroupable_1,
                        hidable: columnHidable_1,
                        resizable: resizable || false,
                        movable: movable || false,
                        width: calculateWidth(readableName_1, columnHidable_1, columnFiltrable_1, columnGroupable_1, columnSortable_1)
                    };
                }
                else {
                    var readableName_2 = x.name || getReadableName(x.id);
                    var _c = [
                        x.sortable || sortable || false,
                        x.filtrable || filtrable || false,
                        x.groupable || groupable || false,
                        x.hidable || hidable || false
                    ], columnSortable_2 = _c[0], columnFiltrable_2 = _c[1], columnGroupable_2 = _c[2], columnHidable_2 = _c[3];
                    return {
                        id: x.id,
                        name: readableName_2,
                        type: x.type || defaultType,
                        sortable: columnSortable_2,
                        filtrable: columnFiltrable_2,
                        groupable: columnGroupable_2,
                        hidable: columnHidable_2,
                        resizable: x.resizable || resizable || false,
                        movable: x.movable || movable || false,
                        width: x.width || calculateWidth(readableName_2, columnHidable_2, columnFiltrable_2, columnGroupable_2, columnSortable_2)
                    };
                }
        }
    });
}
export function getMinWidth(columnName) {
    return columnName.length * 8 + 10; // 8
}
export function calculateWidth(columnName, hidable, filtrable, groupable, sortable) {
    return getMinWidth(columnName) +
        (hidable ? 20 : 0) +
        (filtrable ? 20 : 0) +
        (groupable ? 30 : 0) +
        (sortable ? 30 : 0);
}
export function getTypedValue(value, type) {
    switch (type) {
        case 'date':
            /* TODO: use moment.js */
            return Date.parse(value);
        case 'string':
            return value;
        case 'number':
            return +value;
        case 'boolean':
            return !!value;
    }
}
export function sort(data, state) {
    function sortComparer(item1, item2, sortingColumns) {
        var result = 0;
        for (var i = 0; i < sortingColumns.length; i++) {
            var sortingColumn = sortingColumns[i];
            var _a = [item1[sortingColumn.id], item2[sortingColumn.id]], a = _a[0], b = _a[1];
            result = result || compare(getTypedValue(a, sortingColumn.type), getTypedValue(b, sortingColumn.type), sortingColumn.sortingDirection);
        }
        return result;
    }
    function compare(a, b, direction) {
        return a > b
            ? direction
            : a < b
                ? -direction
                : 0;
    }
    if (state.sortingColumns && state.sortingColumns.length > 0) {
        data.items.sort(function (item1, item2) { return sortComparer(item1, item2, state.sortingColumns); });
    }
}
export function filter(data, state) {
    if (state.filteringColumns && state.filteringColumns.length > 0) {
        data.items = data.items.filter(function (value) {
            var result = true;
            for (var i = 0; i < state.filteringColumns.length; i++) {
                var filteringColumn = state.filteringColumns[i];
                result = result &&
                    filteringColumn
                        .filtering
                        .filter
                        .predicate(getTypedValue(value[filteringColumn.id], filteringColumn.type), getTypedValue(filteringColumn.filtering.expected, filteringColumn.type));
            }
            return result;
        });
    }
}
export function group(data, state) {
    if (state.groupingColumns && state.groupingColumns.length > 0) {
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            var valueOfGroupingFields = [];
            for (var j = 0; j < state.groupingColumns.length; j++) {
                var groupingColumn = state.groupingColumns[j];
                var value = item[groupingColumn.id];
                valueOfGroupingFields.push(value);
            }
            item.$_grouping_values = valueOfGroupingFields;
        }
    }
}
export function page(data, state) {
    if (state.paging) {
        state.paging.count = state.paging.size == 0 ? 1 : Math.ceil(data.items.length / state.paging.size) || 1;
        if (state.paging.current > state.paging.count) {
            state.paging.current = state.paging.count;
        }
        if (state.paging.size !== 0) {
            var from = state.paging.size * (state.paging.current - 1);
            var to = state.paging.size * state.paging.current;
            data.items = data.items.slice(from, to);
        }
        data.paging = state.paging;
    }
}
