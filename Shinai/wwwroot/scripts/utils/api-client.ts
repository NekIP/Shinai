import AntiForgeryTokenProvider from './anti-forgery-token-provider';
import axios from 'axios';

export default class ApiClient {
	private static antiForgeryTokenHeaderName: string = "x-forgery-token";
	private static antiForgeryToken: string = undefined;

	static get(	url: string, 
				parameters: Object | undefined = undefined,
				success: Function = (data) => undefined, 
				error: Function = (exception) => undefined) {
		axios
			.get(url, { 
				params: parameters 
			})
			.then(response => success(response.data))
			.catch(exception => error(exception))
	}

	static post(url: string, 
				data: Object | undefined = undefined,
				success: Function = (data) => undefined, 
				error: Function = (exception) => undefined) {
		this.ensureAntiForgeryToken();
		let parametrizedAxios = this.getParametrizedAxios();
		parametrizedAxios
			.post(url, data)
			.then(response => success(response.data))
			.catch(exception => error(exception))
	}

	static delete(	url: string, 
					parameters: Object | undefined = undefined,
					success: Function = (data) => undefined, 
					error: Function = (exception) => undefined) {
		this.ensureAntiForgeryToken();
		let parametrizedAxios = this.getParametrizedAxios();
		parametrizedAxios
			.delete(url, { 
				params: parameters
			})
			.then(response => success(response.data))
			.catch(exception => error(exception))
	}

	static put(url: string,
		data: Object | undefined = undefined,
		success: Function = (data) => undefined,
		error: Function = (exception) => undefined) {
		this.ensureAntiForgeryToken();
		let parametrizedAxios = this.getParametrizedAxios();
		parametrizedAxios
			.put(url, data)
			.then(response => success(response.data))
			.catch(exception => error(exception))
	}

	private static ensureAntiForgeryToken() {
		if (!this.antiForgeryToken) {
			this.antiForgeryToken = AntiForgeryTokenProvider.get();
		}
	}

	private static getParametrizedAxios() {
		let headers = {};
		headers[this.antiForgeryTokenHeaderName] = this.antiForgeryToken;
		return axios.create({
			headers: headers
		})
	}
}