import { Grid, LinearProgress } from "@mui/material";


const LoadingBar = () => {
	return (
		<Grid
			container
            justifyContent="center"
            alignItems="center"
            minHeight={"95vh"}
		>
			<Grid item xs={12}><LinearProgress /></Grid>
		</Grid>
	);
};

export default LoadingBar;
