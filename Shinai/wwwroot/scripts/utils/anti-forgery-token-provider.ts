export default class AntiForgeryTokenProvider {
	static get(htmlElementName = "__RequestVerificationToken"): string {
		let element = this.getElement(htmlElementName);
		if (element && element.value) {
			return element.value;
		}
		throw new Error(`Request verification token with name '${htmlElementName}' doesn't exist`);
	}

	private static getElement(htmlElementName: string): HTMLInputElement {
		let elements = document.getElementsByName(htmlElementName);
		if (elements.length > 0) {
			if (elements.length > 1) {
				throw new Error(`On the page there should be only one RequestVerificationToken with name '${htmlElementName}'`);
			}
			return elements[0] as HTMLInputElement;
		}
		throw new Error(`The page does not have a RequestVerificationToken with the name '${htmlElementName}'`);
	}
}