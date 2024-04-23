import { Box, Typography } from "@mui/material";
import { colors } from "../../helper/colors";

const DisplayMessage = (props) => {
	const { message = "" } = props;
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" , width:"95vw" , height:"95vh" }}>
			<Typography variant="h3" sx={{color:colors.yellow.main}}>{message}</Typography>
		</Box>
	);
};

export default DisplayMessage;
