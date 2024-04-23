import { WhatsApp } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import PopupTextfield from "../../components/PopupTextfield/PopupTextfield";
import { colors } from "../../helper/colors";
import { gridBreakpoints } from "../../helper/functions";
import { sseRegisteredPatientUrl } from "../../helper/urls";
import { setPatientData, useAdminStore } from "../../store/Admin";

const AdminDashboard = () => {
	// Store Data
	const [openPopup, setOpenPopup] = useState(false);
	const patientData = useAdminStore((state) => state.data.patientData);
	const columns = useAdminStore((state) => state.data.columns);

	// Store State
	// const patientTableSelected = useAdminStore((state) => state.cpnState.patientTable.selected);
	// const registerAdminSelected = useAdminStore((state) => state.cpnState.registerAdmin.selected);
	// const loadingState = useAuthStore((state) => state.cpnState.form.loading.isLoading);

	// const selectButton = (id) => () => {
	// 	setSelectedDashboardMenu(id);
	// };

	const handleSendLink = () => {
		setOpenPopup(true)
	};

	useEffect(() => {
		const eventSource = new EventSource(sseRegisteredPatientUrl);
		eventSource.onmessage = (event) => {
			const parsedData = JSON.parse(event.data);
			console.log(parsedData);
			if (parsedData) {
				setPatientData(parsedData);
			}
		};
	}, []);

	return (
		<>
			<PopupTextfield
				open={openPopup}
				textfieldProps={{
					label: "Phone Number",
					onChange:()=>{},
				}}
				handleClose={() => {
					setOpenPopup(false);
				}}
				handleSubmit={() => {}}
				handleCancel={() => {}}
			/>
			<Box
				sx={{
					mt: 5,
					mx: gridBreakpoints(20, 20, 15, 5, 0),
					bgcolor: colors.white.main,
				}}
			>
				<Grid
					container
					rowGap={2}
					columnGap={2}
					alignItems="flex-start"
					justifyContent="flex-start"
					sx={{
						px: 3,
						py: 7,
						mt: 0,
					}}
				>
					{/* <Grid container item rowGap={0} {...gridBreakpoints(1.5 , 1.5 , 2 , 12 , 12)}>
					<Grid item xs={12}>
						<Button
							disableElevation
							fullWidth
							color="secondary"
							variant={patientTableSelected ? "contained" : "outlined"}
							sx={{
								borderRadius:0,
							}}
							onClick={selectButton("patientTable")}
						>
							Patients
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button
							disableElevation
							fullWidth
							color="secondary"
							variant={registerAdminSelected ? "contained" : "outlined"}
							sx={{
								borderRadius:0,
							}}
							onClick={selectButton("registerAdmin")}
						>
							Register Admin
						</Button>
					</Grid>
				</Grid> */}
					<Grid container item rowGap={0.5} {...gridBreakpoints(12, 12, 12, 12, 12)}>
						<Grid item xs={2}>
							<Button
								variant="contained"
								size="small"
								color="secondary"
								disableElevation
								sx={{ py: 0.7, px: 1.5, textTransform: "capitalize" }}
								startIcon={<WhatsApp fontSize="small" sx={{ p: 0.2 }} />}
								onClick={handleSendLink}
							>
								<Typography sx={{ fontSize: 13 }}>Send link</Typography>
							</Button>
						</Grid>
						<Grid item xs={12}>
							<DataTable rowData={patientData} columnDefs={columns} />
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default AdminDashboard;
