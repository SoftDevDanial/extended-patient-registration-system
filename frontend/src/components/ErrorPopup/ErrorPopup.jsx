import { Alert, Box, Slide } from "@mui/material";
import { useEffect, useState } from "react";

const ErrorPopup = (props) => {
	const { error = false, message = "" } = props;
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (message) {
			setErrorMessage(message);
		}
	}, [message]);
	
	return (
		<Box
			sx={{
				position: "fixed",
				right: 20,
				bottom: 20,
				zIndex: 9999,
			}}
		>
			<Slide
				direction="up"
				in={error}
				onExited={() => {
					setErrorMessage("");
				}}
				mountOnEnter
				unmountOnExit
			>
				<Alert variant="filled" severity="error">
					{errorMessage}
				</Alert>
			</Slide>
		</Box>
	);
};

export default ErrorPopup;
