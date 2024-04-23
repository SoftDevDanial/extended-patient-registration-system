import { Box } from "@mui/material";
import Header from "./header/Header";

const Layout = (props) => {
	return (
		<>
			<Header />
			<main>
				<Box
					sx={[
						(theme) => ({
							[theme.breakpoints.up("sm")]: {
								pt:10
							},
							[theme.breakpoints.down("sm")]: {
								pt:15
							},
						}),
					]}
				>
					{props.children}
				</Box>
			</main>
		</>
	);
};

export default Layout;
