import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const initialData = {
	patientData: [],
	columns: [
		{
			field: "id",
			flex:1,
		},
		{
			field: "fullName",
			flex:4,
		},
		{
			field: "icNum",
			flex:3,
		},
	],
};

const initialCpnState = {
	patientTable: {
		group: "dashboardMenu",
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
	registerAdmin: {
		group: "dashboardMenu",
		selected: false,
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

export const useAdminStore = create(
	immer(
		() => ({
			data: initialData,
			cpnState: initialCpnState,
		})
	)
);

export const setAdminData = (data) => {
	useAdminStore.setState((state) => {
		Object.keys(data).forEach((key) => {
			state.data[key] = [data[key]];
		});
	});
};

export const setPatientData = (data) => {
	useAdminStore.setState((state) => {
		const dataWithId = data.map((patientData , index) => {
			return {
				id:index,
				fullName : patientData.fullname,  
				icNum:patientData.ic_num,	
			}
		});
		state.data.patientData = dataWithId
	});
};

export const setSelectedDashboardMenu = (selected) => {
	useAdminStore.setState((state) => {
		state.cpnState[selected].selected = true;
		Object.keys(state.cpnState).forEach((component) => {
			const group = state.cpnState[component].group;
			if (group === "dashboardMenu" && component !== selected) {
				state.cpnState[component].selected = false;
			}
		});
	});
};

export const setErrorState = (component, message, isError) => {
	useAdminStore.setState((state) => {
		state.cpnState[component].error.message = message;
		state.cpnState[component].error.isError = isError;
		state.cpnState[component].success.message = "";
		state.cpnState[component].success.isSuccess = false;
	});
};

export const setLoadingState = (component, message, isLoading) => {
	useAdminStore.setState((state) => {
		state.cpnState[component].loading.message = message;
		state.cpnState[component].loading.isLoading = isLoading;
	});
};


