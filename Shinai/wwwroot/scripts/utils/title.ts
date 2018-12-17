export default class Title {
	static prefix = 'Merchant Portal';
	static format = '{prefix} - {text}';

	static set(value: string) {
		let headElement = document.getElementsByTagName('head')[0];
		if (headElement) {
			let titleElement = headElement.getElementsByTagName('title')[0];
			if (titleElement) {
				titleElement.innerHTML = 
					this.format
						.replace('{prefix}', this.prefix)
						.replace('{text}', value);
				return;
			}
		}
		throw new Error('At the <head> of the site should be an element <title>');
	}
}