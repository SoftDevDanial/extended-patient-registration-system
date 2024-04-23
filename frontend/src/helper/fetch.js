import { isObject } from "./functions";

export const fetchData = async (
	config = {},
	successCallback = () => {},
	errorCallback = () => {},
	finallyCallback = () => {}
) => {
	const { url, method = "GET", headers = {}, body = undefined , ...extraConfig} = config;
	try {
		let serializedConfig = extraConfig;
		serializedConfig.method = method;
		serializedConfig.headers = { "Content-Type": "application/json", ...headers };
		if (body !== undefined) {
			serializedConfig.body = JSON.stringify(body);
		}
		const response = await fetch(url, serializedConfig);
		const contentType = response.headers.get("content-type");
		const jsonResponse = contentType.startsWith("application/json;")
			? await response?.json()
			: contentType.startsWith("text/plain;")
			? await response?.text()
			: "";
		if (!response.ok) {
			throw { message: jsonResponse, status: response.status };
		}

		successCallback(jsonResponse);
	} catch (error) {
		if (isObject(error) && (error.message || error.status)) {
			console.error(error.message, error.status);
			errorCallback(error.message, error.status);
		} else {
			console.error("Unable to connect to server - ", error);
			errorCallback(error, -1);
		}
	} finally {
		finallyCallback();
	}
};
