export function getReadableName(name) {
	let result = name[0].toUpperCase();
	for (let i = 1; i < name.length; i++) {
		let c = name[i];
		let cUpper = c.toUpperCase();
		if ('0123456789'.indexOf(c) === -1 && cUpper === c) {
			result += ' ' + cUpper;
		}
		else {
			result += c;
		}
	}
	return result;
}

export function removeItemInArray(array, item) {
	if (array && array.length) {
		let indexOfItem = array.indexOf(item);
		if (indexOfItem > -1) {
			array.splice(indexOfItem, 1);
		}
	}
}

export function getColumns( columns, 
							sortable, 
							filtrable, 
							groupable, 
							resizable, 
							movable,
							hidable) {
	const defaultType = 'string';
	return columns.map(x => {
		switch (typeof(x)) {
			case 'string':
				let readableName = getReadableName(x);
				let [columnSortable, columnFiltrable, columnGroupable, columnHidable] = 
					[sortable || false, filtrable || false, groupable || false, hidable || false];
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
				}
			case 'object':
				if (Array.isArray(x)) {
					let readableName = x[1] || getReadableName(x[0]);
					let [columnSortable, columnFiltrable, columnGroupable, columnHidable] = 
						[sortable || false, filtrable || false, groupable || false, hidable || false];
					return {
						id: x[0],
						name: readableName,
						type: x[2] || defaultType,
						sortable: columnSortable,
						filtrable: columnFiltrable,
						groupable: columnGroupable,
						hidable: columnHidable,
						resizable: resizable || false,
						movable: movable || false,
						width: calculateWidth(readableName, columnHidable, columnFiltrable, columnGroupable, columnSortable)
					}
				}
				else {
					let readableName = x.name || getReadableName(x.id);
					let [columnSortable, columnFiltrable, columnGroupable, columnHidable] = 
						[
							x.sortable ||  sortable || false, 
							x.filtrable ||  filtrable || false, 
							x.groupable || groupable || false, 
							x.hidable || hidable || false
						];
					return {
						id: x.id,
						name: readableName,
						type: x.type || defaultType,
						sortable: columnSortable,
						filtrable: columnFiltrable,
						groupable: columnGroupable,
						hidable: columnHidable,
						resizable: x.resizable || resizable || false,
						movable: x.movable || movable || false,
						width: x.width || calculateWidth(readableName, columnHidable, columnFiltrable, columnGroupable, columnSortable)
					}
				}
		}
	})
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