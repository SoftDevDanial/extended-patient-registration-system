import { AccountCircle, Lock } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ColoredTextField from "../../components/ColoredTextField/ColoredTextField";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import { colors } from "../../helper/colors";
import { gridBreakpoints } from "../../helper/functions";
import { Login, setAuthData, useAuthStore } from "../../store/Authentication";

const AdminLogin = () => {
	const navigate = useNavigate();

	// Store Data
	const username = useAuthStore((state) => state.data.username);
	const password = useAuthStore((state) => state.data.password);

	// Store State
	const errorMessage = useAuthStore((state) => state.cpnState.form.error.message);
	const loadingState = useAuthStore((state) => state.cpnState.form.loading.isLoading);

	const handleTextFieldInput = (field) => (event) => {
		setAuthData({ [field]: event.target.value });
	};

	const validateUser = () => {
		Login(() => navigate("/admin/dashboard"));
	};
	return loadingState ? (
		<Box sx={{ mx: 35 }}>
			<LoadingBar />
		</Box>
	) : (
		<Paper
			elevation={4}
			sx={
				{
					borderRadius: 3,
					mt: 10,
					mx:{
						...gridBreakpoints(40,40,30,10,5),
					},
					bgcolor: colors.white.main,
				}
			}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					validateUser();
				}
			}}
		>
			<Grid
				container
				rowGap={4}
				columnSpacing={0}
				sx={{
					px: 10,
					py: 7,
					mt: 0,
				}}
			>
				<Grid item align="center" {...gridBreakpoints(12)}>
					<Typography variant="h3" color={colors.yellow.main}>
						Login
					</Typography>
				</Grid>
				<Grid item align="center" {...gridBreakpoints(12)}>
					<Divider variant={"fullWidth"} />
				</Grid>
				<Grid item align="center" {...gridBreakpoints(12)}>
					<ColoredTextField
						label="Username"
						value={username || ""}
						onChange={handleTextFieldInput("username")}
						inputProps={{
							spellCheck: false,
						}}
						InputProps={{
							startAdornment: <AccountCircle fontSize={"large"} sx={{ p: 0.6, ml: -1 }} position="start" />,
						}}
						required
					/>
				</Grid>
				<Grid item align="center" {...gridBreakpoints(12)}>
					<ColoredTextField
						type="password"
						label="Password"
						value={password || ""}
						onChange={handleTextFieldInput("password")}
						InputProps={{
							startAdornment: <Lock fontSize={"large"} sx={{ p: 0.6, ml: -1 }} position="start" />,
						}}
					/>
					<Typography variant="caption" color={colors.red.main}>
						{errorMessage}
					</Typography>
				</Grid>

				<Grid item align="center" {...gridBreakpoints(12)}>
					<Button color="secondary" sx={{ width: "100%" }} variant="contained" onClick={validateUser}>
						Login
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default AdminLogin;
