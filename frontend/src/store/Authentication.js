import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchData } from "../helper/fetch";
import { isObject, setLocalStorage } from "../helper/functions";
import { isLoggedIn } from "../helper/localStorageNames";
import { adminLoginUrl } from "../helper/urls";
import dayjs from "dayjs";

const initialData = {
	username: "",
	password: "",
};

const initialCpnState = {
	form: {
		error: {
			message: "",
			isError: false,
		},
		success: {
			message: "",
			isSuccess: false,
		},
		loading: {
			message: "",
			isLoading: false,
		},
	},
};

export const useAuthStore = create(
	immer(() => ({
		data: initialData,
		cpnState: initialCpnState,
	}))
);

export const setAuthData = (data) => {
	useAuthStore.setState((state) => {
		Object.keys(data).forEach((key) => {
			state.data[key] = data[key];
		});
	});
};

export const setErrorState = (component, message, isError) => {
	useAuthStore.setState((state) => {
		state.cpnState[component].error.message = message;
		state.cpnState[component].error.isError = isError;
		state.cpnState[component].success.message = "";
		state.cpnState[component].success.isSuccess = false;
	});
};

export const setLoadingState = (component, message, isLoading) => {
	useAuthStore.setState((state) => {
		state.cpnState[component].loading.message = message;
		state.cpnState[component].loading.isLoading = isLoading;
	});
};

export const Login = async (successCallback = () => {}, errorCallback = () => {}, finallyCallback = () => {}) => {
	const storeData = useAuthStore.getState().data;
	const jsonData = {
		username: storeData.username,
		password: storeData.password,
	};
	setLoadingState("form", "", true);
	fetchData(
		{
			url: adminLoginUrl,
			method: "POST",
			body: jsonData,
			credentials:"include"
		},
		(resp) => {
			setErrorState("form", "", false);
			if(resp?.expiry){
				const storedValue = {
					value: true,
					expiry: dayjs().add(resp.expiry , "second")
				}
				setLocalStorage(isLoggedIn , storedValue)
			}
			
			successCallback(resp);
		},
		(msg, status) => {
			if (status === -1) {
				setErrorState("form", "Error sending data to server", true);
				return;
			}
			setErrorState("form", isObject(msg) ? msg?.error : msg, true);
			localStorage.removeItem(isLoggedIn)
			errorCallback(msg, status);
		},
		() => {
			setLoadingState("form", "", false);
			finallyCallback();
		}
	);
};
