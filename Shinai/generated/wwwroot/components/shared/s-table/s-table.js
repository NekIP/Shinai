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
import { removeItemInArray, getColumns, getMinWidth, calculateWidth } from './s-table.functions.js';
import { sort, group, filter, page } from './s-table.gates.js';
import { columnFilters } from './s-table.data.js';
import vClickOutside from 'v-click-outside';
import { mapState } from 'vuex';
export default {
    directives: {
        clickOutside: vClickOutside.directive,
        scroll: {
            inserted: function (el, binding) {
                var f = function (evt) {
                    if (binding.value(evt, el)) {
                        window.removeEventListener('scroll', f);
                    }
                };
                window.addEventListener('scroll', f);
            }
        }
    },
    props: {
        items: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            required: true
        },
        filtrable: {
            type: Boolean,
            default: true,
            required: false
        },
        sortable: {
            type: Boolean,
            default: true,
            required: false
        },
        groupable: {
            type: Boolean,
            default: true,
            required: false
        },
        movable: {
            type: Boolean,
            default: true,
            required: false
        },
        resizable: {
            type: Boolean,
            default: true,
            required: false
        },
        pageable: {
            type: Boolean,
            default: true,
            required: false
        },
        hidable: {
            type: Boolean,
            default: true,
            required: false
        },
        pageSizes: {
            type: Array,
            default: function () {
                return [25, 50, 100, 0];
            },
            required: false
        }
    },
    data: function () {
        return {
            state: {
                columns: [],
                sortable: this.sortable,
                sortingColumns: [],
                filtrable: this.filtrable,
                filteringColumns: [],
                groupable: this.groupable,
                groupingColumns: [],
                hiddenGroups: {},
                enabledGroupingArea: true,
                hidable: this.hidable,
                hidingColumns: [],
                movable: this.movable,
                moving: {
                    dragable: null,
                    dropable: null
                },
                resizable: this.resizable,
                resizing: {
                    column: null,
                    mousePosition: {
                        x: null,
                        y: null
                    }
                },
                pageable: this.pageable,
                paging: {
                    size: this.pageSizes[0],
                    count: this.countPage(this.pageSizes[0]),
                    current: 1
                },
                fixedHeader: false,
                recalculate: 1
            },
            gates: [
                filter,
                sort,
                group,
                page
            ],
            filteringModes: columnFilters,
            groupAreaName: '*group-area*',
            minWidthBias: 100,
            hiddenColumnSize: screen.width < 1025 ? 40 : 20,
            maxCountOfPage: 5
        };
    },
    created: function () {
        this.state.columns = getColumns(this.columns, this.sortable, this.filtrable, this.groupable, this.resizable, this.movable, this.hidable);
        var self = this;
        window.onresize = function (event) {
            console.log('resize');
            for (var i = 0; i < self.state.columns.length; i++) {
                var column = self.state.columns[i];
                column.width = calculateWidth(column.name, column.hidable, column.filtrable, column.groupable, column.sortable);
                console.log(column.width);
            }
        };
    },
    watch: {
        'state.paging.size': function (size) {
            this.state.paging.count = this.countPage(size);
            if (this.state.paging.current > this.state.paging.count) {
                this.state.paging.current = this.state.paging.count;
            }
        }
    },
    computed: __assign({}, mapState({
        styleClass: function (state) { return state.base.styleClass; }
    }), { hasGrouped: function () {
            return this.state.groupingColumns && this.state.groupingColumns.length > 0;
        },
        data: function () {
            var recalulate = this.state.recalculate;
            var result = {
                items: this.items.map(function (x) { return x; }),
                paging: null
            };
            for (var i = 0; i < this.gates.length; i++) {
                var gate = this.gates[i];
                gate(result, this.state);
            }
            return result;
        } }),
    methods: {
        /* SORTING */
        sortByMany: function (column) {
            if (this.state.sortable || this.state.groupable) {
                if (!column.sortingDirection) {
                    column.sortingDirection = 1;
                    this.state.sortingColumns.push(column);
                }
                else {
                    column.sortingDirection = column.sortingDirection === -1 ? 1 : -1;
                    this.forceUpdate();
                }
            }
        },
        sortByOne: function (column) {
            if (this.state.sortable || this.state.groupable) {
                if (!column.sortingDirection) {
                    this.cleanSorting();
                }
                this.sortByMany(column);
            }
        },
        cleanSorting: function () {
            for (var i = this.state.sortingColumns.length - 1; i >= 0; i--) {
                var column = this.state.sortingColumns[i];
                var indexOfColumnInGrouping = this.state.groupingColumns.indexOf(column);
                if (indexOfColumnInGrouping < 0) {
                    this.removeColumnForSorting(column);
                }
            }
        },
        removeColumnForSorting: function (column) {
            column.sortingDirection = undefined;
            removeItemInArray(this.state.sortingColumns, column);
        },
        /* GROUPING */
        addColumForGrouping: function (column) {
            if (this.state.groupable && !column.grouping) {
                this.cleanSorting();
                this.sortByMany(column);
                column.grouping = true;
                this.state.hiddenGroups = {};
                this.state.groupingColumns.push(column);
            }
        },
        getGroupingItems: function () {
            var result = [];
            var current = new Array(this.state.groupingColumns.length);
            var levelHidden = Number.MAX_VALUE;
            for (var i = 0; i < this.data.items.length; i++) {
                var item = this.data.items[i];
                var groupingValues = item.$_grouping_values;
                var mismatchOnPrevStep = false;
                var joinGroupedValues = "";
                for (var j = 0; j < groupingValues.length; j++) {
                    joinGroupedValues += groupingValues[j];
                    if (current[j] !== groupingValues[j] || mismatchOnPrevStep) {
                        if (levelHidden >= j + 1) {
                            if (this.hasHiddenGroup(joinGroupedValues)) {
                                levelHidden = j + 1;
                            }
                            else {
                                levelHidden = Number.MAX_VALUE;
                            }
                        }
                        mismatchOnPrevStep = true;
                        current[j] = groupingValues[j];
                        result.push({
                            level: j + 1,
                            group: groupingValues[j],
                            column: this.state.groupingColumns[j],
                            hidden: j + 1 > levelHidden,
                            hiding: j + 1 == levelHidden,
                            joinGroupedValues: joinGroupedValues
                        });
                    }
                }
                result.push({
                    level: groupingValues.length,
                    item: item,
                    hidden: groupingValues.length >= levelHidden
                });
            }
            return result;
        },
        removeColumForGrouping: function (column) {
            column.grouping = false;
            this.state.hiddenGroups = {};
            removeItemInArray(this.state.groupingColumns, column);
            this.cleanSorting();
        },
        hasHiddenGroup: function (joinGroupedValues) {
            return this.state.hiddenGroups[joinGroupedValues];
        },
        hideGroup: function (joinGroupedValues) {
            this.state.hiddenGroups[joinGroupedValues] = true;
            this.forceUpdate();
        },
        showGroup: function (joinGroupedValues) {
            this.state.hiddenGroups[joinGroupedValues] = false;
            this.forceUpdate();
        },
        changeGroupingOrder: function () {
            var groupingColumn = this.state.groupingColumns.map(function (x) { return x; });
            for (var i = this.state.groupingColumns.length - 1; i >= 0; i--) {
                this.removeColumForGrouping(this.state.groupingColumns[i]);
            }
            for (var i in groupingColumn) {
                this.addColumForGrouping(groupingColumn[i]);
            }
        },
        /* FILTERING */
        addColumForFiltering: function (column) {
            if (column.filtering && !column.filtering.enabled) {
                column.filtering.enabled = true;
                this.state.filteringColumns.push(column);
            }
            this.forceUpdate();
        },
        removeColumForFiltering: function (column) {
            if (column.filtering) {
                column.filtering.enabled = false;
                column.filtering.expected = '';
                removeItemInArray(this.state.filteringColumns, column);
                this.forceUpdate();
            }
        },
        selectFilter: function (column, mode) {
            column.filtering.filter = this.filteringModes[mode];
            column.filtering.filterMode = mode;
            if (column.filtering.filter.single || column.filtering.expected) {
                this.addColumForFiltering(column);
            }
        },
        selectValueForFilter: function (column, value) {
            if (column.filtering) {
                column.filtering.expected = value;
                if (value) {
                    this.addColumForFiltering(column);
                }
                else {
                    this.removeColumForFiltering(column);
                }
            }
        },
        showFilterForm: function (column) {
            if (!column.filtering) {
                column.filtering = {
                    filter: this.filteringModes.eq,
                    expected: '',
                    enabled: false,
                    filterMode: 'eq'
                };
            }
            column.showFilterForm = true;
            this.forceUpdate();
        },
        hideFilterForm: function (column) {
            column.showFilterForm = false;
            this.forceUpdate();
        },
        /* PAGING */
        goToPage: function (i) {
            if (i > 0 && i <= this.data.paging.count) {
                this.data.paging.current = i;
            }
        },
        canShowPageNumber: function (i) {
            var num = Math.floor((this.data.paging.current - 1) / this.maxCountOfPage) * this.maxCountOfPage;
            return i >= num && i < num + this.maxCountOfPage;
        },
        countPage: function (size) {
            return size == 0 ? 1 : Math.ceil(this.items.length / size);
        },
        /* RESIZING */
        beginResizeColumn: function (column, event) {
            var columnElement = event.target.parentNode.parentNode.parentNode;
            this.state.resizing.column = column;
            if (!this.state.resizing.column.width) {
                this.state.resizing.column.width = this.getMinWidth(column) + this.minWidthBias;
            }
            this.state.resizing.mousePosition.x = event.clientX;
        },
        resizeColumn: function (event) {
            if (this.state.resizing.column) {
                var currentPosMouseX = event.clientX;
                var currentWidth = this.state.resizing.column.width;
                var deff = currentPosMouseX - this.state.resizing.mousePosition.x;
                var minWidth = this.getMinWidth(this.state.resizing.column) + this.minWidthBias;
                if (deff > 0 || currentWidth + deff > minWidth) {
                    this.state.resizing.column.width += currentPosMouseX - this.state.resizing.mousePosition.x;
                    this.state.resizing.mousePosition.x = currentPosMouseX;
                }
            }
        },
        stopResizeColumn: function () {
            this.state.resizing.column = null;
            this.state.resizing.mousePosition.x = null;
        },
        /* MOVING */
        move: function (from, to, array) {
            var indexOfDragable = array.indexOf(from);
            var indexOfDropable = array.indexOf(to);
            if (indexOfDropable > -1) {
                array.splice(indexOfDragable, 1);
                array.splice(indexOfDropable, 0, from);
            }
        },
        /* HIDDING */
        hideColumn: function (column, event) {
            column.hidden = true;
            this.forceUpdate();
        },
        showColumn: function (column, event) {
            column.hidden = false;
            this.forceUpdate();
        },
        /* SIZES */
        getTableWidth: function () {
            var self = this;
            var result = this.state.columns.reduce(function (a, b) {
                return a + (!b.hidden
                    ? b.width || b.name.length * 18 + 50
                    : self.hiddenColumnSize);
            }, 0);
            console.log(result);
            return result;
        },
        getMinWidth: function (column) {
            return getMinWidth(column.name);
        },
        getColumnSizeById: function (columnId) {
            return document.getElementById(columnId + "Column");
        },
        /* DRAG AND DROP */
        columnDragStart: function (column, event, enabledGroupingArea) {
            if (enabledGroupingArea === void 0) { enabledGroupingArea = true; }
            event.dataTransfer.setData('text/plain', 'anything');
            this.state.enabledGroupingArea = enabledGroupingArea;
            if (!this.state.resizing.column) {
                this.state.moving.dragable = column;
            }
            else {
                event.preventDefault();
            }
        },
        columnDragEnter: function (column, event) {
            if (!this.state.resizing.column) {
                this.state.moving.dropable = column;
            }
            else {
                event.preventDefault();
            }
        },
        columnDragEnd: function (event, groupMove) {
            if (!this.state.resizing.column) {
                var dragableColumn = this.state.moving.dragable;
                var dropableColumn = this.state.moving.dropable;
                if (!dragableColumn || !dropableColumn) {
                    return;
                }
                if (dragableColumn != dropableColumn) {
                    if (dropableColumn == this.groupAreaName) {
                        this.addColumForGrouping(dragableColumn);
                    }
                    else if (groupMove) {
                        this.move(dragableColumn, dropableColumn, this.state.groupingColumns);
                        this.changeGroupingOrder();
                    }
                    else {
                        this.move(dragableColumn, dropableColumn, this.state.columns);
                    }
                }
                this.state.moving.dragable = null;
                this.state.moving.dropable = null;
                this.state.enabledGroupingArea = true;
                this.forceUpdate();
            }
            else {
                event.preventDefault();
            }
        },
        /* OTHER */
        getCells: function (items, key) {
            var result = [];
            for (var i in items) {
                var item = items[i];
                result.push(item[key]);
            }
            return result;
        },
        forceUpdate: function (hard) {
            if (hard === void 0) { hard = true; }
            if (hard) {
                this.state.recalculate = -this.state.recalculate;
            }
            this.$forceUpdate();
        },
        scroll: function (evt, el) {
            if (window.scrollY > el.offsetTop) {
                this.state.fixedHeader = true;
            }
            else {
                this.state.fixedHeader = false;
            }
            if (this.state.fixedHeaderCache !== this.state.fixedHeader) {
                this.forceUpdate(false);
            }
            this.state.fixedHeaderCache = this.state.fixedHeader;
        }
    }
};
