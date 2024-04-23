import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { colors } from "./helper/colors";
import Layout from "./layouts/Layout";
import AdminAuthentication from "./layouts/protected/AdminAuthentication";
import PatientRegisterAuthentication from "./layouts/protected/PatientRegisterAuthentication";
import AdminDashboard from "./routes/admin/Dashboard";
import AdminLogin from "./routes/admin/Login";
import RegisterForm from "./routes/patient/RegisterForm";

const theme = createTheme({
	palette: {
		primary: {
			main: colors.blue.main,
			contrastText: colors.yellow.main,
		},
		secondary: {
			main: colors.blue.main,
			contrastText: colors.white.main,
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/" element={<Navigate to="/admin" replace={true} />} />

						<Route element={<AdminAuthentication />}>
							<Route path="/admin" element={<AdminLogin />} />
							<Route path="/admin/dashboard" element={<AdminDashboard />} />
						</Route>

						<Route element={<PatientRegisterAuthentication />}>
							<Route path="/register-form/:id" element={<RegisterForm />} />
						</Route>
					</Routes>
				</Layout>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
