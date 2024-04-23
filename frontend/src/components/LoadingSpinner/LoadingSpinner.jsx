import { CircularProgress, Grid } from "@mui/material";


const LoadingSpinner = (props) => {
	const {
		size = "9rem"
	} = props
	return (
		<Grid
			container
            justifyContent="center"
            alignItems="center"
            minHeight={"95vh"}
		>
			<CircularProgress disableShrink size={size} thickness={2} />
		</Grid>
	);
};

export default LoadingSpinner;
