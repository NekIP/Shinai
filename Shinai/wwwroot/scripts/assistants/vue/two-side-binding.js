export function updateParentField(vueObject, field, fieldName) {
	vueObject.$emit(`update:${fieldName}`, field);
}