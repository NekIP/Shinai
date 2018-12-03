export default class TwoSideBindingUtils {
	static updateParentField(vueObject, field, fieldName) {
		vueObject.$emit(`update:${fieldName}`, field);
	}
}