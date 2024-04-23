import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import DisplayMessage from "../../routes/error/DisplayMessage";
import { usePatientStore, validateRegisteringPatient } from "../../store/Patient";

const PatientRegisterAuthentication = () => {
	const { id } = useParams();
	const authorized = usePatientStore((state) => state.cpnState.form.authorized);
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("404 Not Found");
	

	useEffect(() => {
		setLoading(true);
		validateRegisteringPatient(
			id,
			() => {},
			(msg, status) => {
				if(status === -1){
					setErrMsg("503 Service Unavailable")
				}
				if((status >= 500 && status <= 600)){
					setErrMsg(msg)
				}
			},
			() => {
				setLoading(false);
			}
		);
	}, [id]);

	return loading ? <LoadingSpinner /> : authorized ? <Outlet /> : <DisplayMessage message={errMsg} />;
};

export default PatientRegisterAuthentication;
