import { AppBar, Box, Button, Toolbar, alpha } from "@mui/material";
import logo from "../../assets/logo";
import { colors } from "../../helper/colors";

const Header = () => {
	const handleLogout = () => {
		
	}
	return (
		<AppBar sx={{ bgcolor: colors.white.main }}>
			<Toolbar
				sx={[
					{
						justifyContent: "space-between",
					},
					(theme) => ({
						[theme.breakpoints.down("sm")]: {
							flexDirection: "column",
							justifyContent: "center",
						},
					}),
				]}
			>
				<Box>
					<img src={logo} alt="logo" width={150} height={100} />
				</Box>
				<Box>
					<Button
						sx={{
							textTransform: "capitalize",
							"&:hover": {
								bgcolor: "transparent",
								color: alpha(colors.blue.main, 0.7)
							},
							"&:active": {
								bgcolor: "transparent",
								color: alpha(colors.blue.main, 0.4)
							},
						}}
						disableElevation
						disableRipple
						onClick={handleLogout}
					>
						logout
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
