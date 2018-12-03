export default class StringUtils {
	static capitalizeFirstLetter(string) {
		if (!string) {
			return string;
		}
		return string.charAt(0).toUpperCase() 
			+ (string.length > 1 ? string.slice(1) : "");
	}
}