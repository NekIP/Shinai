import Vue from 'vue';

export default class TwoSideBindingUtils {
	static updateParentField(vueObject: Vue, field, fieldName: string) {
		vueObject.$emit(`update:${fieldName}`, field);
	}
}