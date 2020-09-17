import { AxiosError } from 'axios';
import { ENV } from '../config/env';

type HttpFieldError = {
	param: string;
	msg: string;
};

export default class HttpErrorParser {
	private error?: AxiosError;

	constructor(err?: AxiosError) {
		if (err) {
			this.error = err;
		}
	}

	setError(err: AxiosError) {
		this.error = err;
	}

	private checkError() {
		if (!this.error) {
			throw new Error('Error must be set. Use "setError" method first.');
		}
	}

	getMessage(): string {
		this.checkError();
		const code = this.getCode();
		if (code === 404) {
			return 'Recourses not found. Most likely the request address is incorrect.';
		}
		if (code === 422) {
			let msg = 'Please correct wrong entries.';
			if (
				this.getFieldsErrors().length === 0 &&
				this.error?.response?.data.message
			) {
				msg = this.error.response.data.message;
			}
			return msg;
		}
		if (code === 401) {
			return this.error!.response?.data.message || 'Un-Authorized access.';
		}
		if (code === 500) {
			if (ENV === 'development') {
				return this.error?.response?.data.message || this.error!.message;
			} else {
				return 'Sorry, something went wrong. Please try again later.';
			}
		}
		// 406, 409, ...
		return (
			this.error!.response?.data.message ||
			this.error!.message ||
			'Sorry, something went wrong. Please try again later.'
		);
	}

	getCode() {
		this.checkError();
		if (this.error!.response) {
			return this.error!.response.status || 500;
		}
		return this.error!.code && !isNaN(parseInt(this.error!.code, 10))
			? +this.error!.code
			: 500;
	}

	getFieldsErrors() {
		this.checkError();
		let errorsArray: HttpFieldError[] = [];
		if (this.error!.isAxiosError) {
			if (this.error!.response) {
				const data = this.error!.response?.data;
				if (data && data.errorsArray) {
					errorsArray = [...data.errorsArray];
				}
			}
		}
		return errorsArray;
	}
}
