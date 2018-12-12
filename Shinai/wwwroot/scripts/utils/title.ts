class Title {
	static prefix = 'Something';
	static format = '{prefix} - {text}';

	static set(value: string) {
		let titleElement = document.getElementsByTagName('head').namedItem('title');
		if (titleElement) {
			titleElement.innerHTML = 
				this.format
					.replace('{prefix}', this.prefix)
					.replace('{text}', value);
		}
		throw new Error('At the <head> of the site should be an element <title>');
	}
}