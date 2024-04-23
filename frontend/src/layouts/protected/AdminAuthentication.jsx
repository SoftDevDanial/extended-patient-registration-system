import dayjs from "dayjs";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getLocalStorage } from "../../helper/functions";
import { isLoggedIn } from "../../helper/localStorageNames";

const AdminAuthentication = () => {
	useEffect(() => {
		const authenticate = (intervalId) => () => {
			const loggedIn = getLocalStorage(isLoggedIn)
			const now = dayjs()
			if(loggedIn?.expiry && loggedIn.expiry.diff(now) < 0 ){
				console.log("HERE")
				localStorage.removeItem(isLoggedIn)
			}
			clearInterval(intervalId)
		}
		const delay = 1000 * 60 * 5
		let intervalId = setInterval(authenticate(intervalId) , delay)
		
		
	} , [])
	return isLoggedIn ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminAuthentication;
