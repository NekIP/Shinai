class RequestVerificationToken {
	static htmlElementName = "__RequestVerificationToken";

	static getFromHtml(): string {
		let element = this.getElement();
		if (element && element.value) {
			return element.value;
		}
		throw new Error(`Request verification token with name '${this.htmlElementName}' doesn't exist`);
	}

	static removeInHtml() {
		let element = this.getElement();
		element.remove();
	}

	private static getElement(): HTMLInputElement {
		let elements = document.getElementsByName(this.htmlElementName);
		if (elements.length > 0) {
			if (elements.length > 1) {
				throw new Error(`On the page there should be only one RequestVerificationToken with name '${this.htmlElementName}'`);
			}
			return elements[0] as HTMLInputElement;
		}
		throw new Error(`The page does not have a RequestVerificationToken with the name '${this.htmlElementName}'`);
	}
}