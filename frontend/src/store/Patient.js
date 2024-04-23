import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchData } from "../helper/fetch";
import { isObject } from "../helper/functions";
import { patientRegisterUrl, verifyPatientUrl } from "../helper/urls";

const initialData = {
	fullName: "",
	icNum: "",
	birthDate: "",
	gender: "",
	race: "",
	religion: "",
	maritalStatus: "",
	currentAddress: "",
	permanentAddress: "",
	occupation: "",
	personalTelNo: "",
	guardianTelNo: "",
	smoker: false,
	termsOfService: false,
	illness: [],
	referralSource: [],
	uniqueId: "",
};

const initialCpnState = {
	birthDate: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	gender: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	race: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	religion: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	maritalStatus: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	currentAddress: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	occupation: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	personalTelNo: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	guardianTelNo: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	smoker: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	illness: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	referralSource: {
		group: "formSubmit",
		type: "textfield",
		selected: true,
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
	form: {
		authorized: false,
		submitted: false,
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

export const usePatientStore = create(
	immer(() => ({
		data: initialData,
		cpnState: initialCpnState,
	}))
);

export const setPatientData = (data) => {
	usePatientStore.setState((state) => {
		Object.keys(data).forEach((key) => {
			state.data[key] = data[key];
		});
	});
};

export const setErrorState = (component, message, isError) => {
	usePatientStore.setState((state) => {
		if (component in state.cpnState) {
			state.cpnState[component].error.message = message;
			state.cpnState[component].error.isError = isError;
			state.cpnState[component].success.message = "";
			state.cpnState[component].success.isSuccess = false;
		}
	});
};

export const setLoadingState = (component, message, isLoading) => {
	usePatientStore.setState((state) => {
		if (component in state.cpnState) {
			state.cpnState[component].loading.message = message;
			state.cpnState[component].loading.isLoading = isLoading;
		}
	});
};

export const setSuccessState = (component, message, isSuccess) => {
	usePatientStore.setState((state) => {
		if (component in state.cpnState) {
			state.cpnState[component].error.message = "";
			state.cpnState[component].error.isError = false;
			state.cpnState[component].success.message = message;
			state.cpnState[component].success.isSuccess = isSuccess;
		}
	});
};


export const submitData = (successCallback = () => {}, errorCallback = () => {}, finallyCallback = () => {}) => {
	const storeData = usePatientStore.getState().data;
	let hasError = false;
	for (const key in storeData) {
		if (typeof storeData[key] !== "boolean" && (!storeData[key] || !storeData[key].length)) {
			console.log(key);
			if (!hasError) {
				hasError = true;
			}
			setErrorState(key, "", true);
		} else {
			setErrorState(key, "", false);
		}
	}

	if (hasError) {
		setErrorState("form", "Please fill all the fields", true);
	} else {
		const jsonData = {
			fullname: storeData.fullName,
			ic_num: storeData.icNum,
			birth_date: storeData.birthDate,
			gender: storeData.gender,
			race: storeData.race,
			religion: storeData.religion,
			marital_status: storeData.maritalStatus,
			current_address: storeData.currentAddress,
			permanent_address: storeData.permanentAddress,
			occupation: storeData.occupation,
			personal_tel_no: storeData.guardianTelNo,
			guardian_tel_no: storeData.guardianTelNo,
			smoker: storeData.smoker,
			illness: storeData.illness.join(),
			referral_source: storeData.referralSource.join(),
			unique_id: storeData.uniqueId
		};
		setLoadingState("form", "", true);
		fetchData(
			{
				url: patientRegisterUrl,
				method: "POST",
				body: jsonData,
			},
			(resp) => {
				setSuccessState("form", "Thank you for registering", true);
				usePatientStore.setState((state) => {
					state.cpnState.form.submitted = true;
				});
				successCallback(resp);
			},
			(msg, status) => {
				if (status === -1) {
					setErrorState("form", "Error sending data to server", true);
					return;
				}
				setErrorState("form", isObject(msg) ? JSON.stringify(msg?.error) : JSON.stringify(msg), true);
				usePatientStore.setState((state) => {
					state.cpnState.form.submitted = false;
				});
				errorCallback(msg, status);
			},
			() => {
				setLoadingState("form", "", false);
				finallyCallback();
			}
		);
	}
};

export const validateRegisteringPatient = (
	id,
	successCallback = () => {},
	errorCallback = () => {},
	finallyCallback = () => {}
) => {
	fetchData(
		{
			url: `${verifyPatientUrl}?unique_id=${id}`,
		},
		(resp) => {
			const data = resp.data
			usePatientStore.setState((state) => {
				state.data.fullName = data.fullname
				state.data.icNum = data.ic_num
				state.data.permanentAddress = data.permanent_address
				state.data.uniqueId = id
				state.cpnState.form.authorized = true;
			});
			successCallback(resp);
		},
		(msg, status) => {
			usePatientStore.setState((state) => {
				state.cpnState.form.authorized = false;
			});
			errorCallback(msg, status);
		},
		() => {
			finallyCallback();
		}
	);
};
