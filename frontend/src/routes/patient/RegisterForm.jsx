import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Tooltip, Typography } from "@mui/material";
import { validatePhoneNumberLength } from "libphonenumber-js";
import { MuiChipsInput } from "mui-chips-input";
import { MuiTelInput } from "mui-tel-input";
import AutoCompleteMap from "../../components/AutoCompleteMap/AutoCompleteMap";
import ColoredTextField from "../../components/ColoredTextField/ColoredTextField";
import { coloredTextFieldConstants } from "../../components/ColoredTextField/constants";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import CustomSelectField from "../../components/CustomSelectField/CustomSelectField";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import { gridBreakpoints } from "../../helper/functions";
import { setErrorState, setPatientData, submitData, usePatientStore } from "../../store/Patient";
import DisplayMessage from "../error/DisplayMessage";

const genderOptions = ["Male", "Female"];
const maritalStatusOptions = ["Single", "Married", "Widowed", "Seperated", "Divorced"];

const gridRows = {
	fullname: gridBreakpoints(0),
	icNum: gridBreakpoints(1),
	race: gridBreakpoints(2),
	religion: gridBreakpoints(3),
	occupation: gridBreakpoints(4),
	illness: gridBreakpoints(5),
	referralSource: gridBreakpoints(6),
	gender: gridBreakpoints(7),
	maritalStatus: gridBreakpoints(8),
	birthDate: gridBreakpoints(9),
	personalTelNo: gridBreakpoints(10),
	guardianTelNo: gridBreakpoints(11),
	smoker: gridBreakpoints(12, 12, 13, 13, 13),
	currentAddress: gridBreakpoints(13, 13, 12, 12, 12),
	submit: gridBreakpoints(14),
};

const RegisterForm = () => {
	// const params = useParams();
	// Store Data
	const fullName = usePatientStore((state) => state.data.fullName);
	const icNum = usePatientStore((state) => state.data.icNum);
	const gender = usePatientStore((state) => state.data.gender);
	const maritalStatus = usePatientStore((state) => state.data.maritalStatus);
	const illness = usePatientStore((state) => state.data.illness);
	const referralSource = usePatientStore((state) => state.data.referralSource);
	const personalTelNo = usePatientStore((state) => state.data.personalTelNo);
	const guardianTelNo = usePatientStore((state) => state.data.guardianTelNo);

	// Store State
	const loadingState = usePatientStore((state) => state.cpnState.form.loading.isLoading);
	const submittedForm = usePatientStore((state) => state.cpnState.form.submitted);
	const errorBirthDate = usePatientStore((state) => state.cpnState.birthDate.error);
	const errorGender = usePatientStore((state) => state.cpnState.gender.error);
	const errorRace = usePatientStore((state) => state.cpnState.race.error);
	const errorReligion = usePatientStore((state) => state.cpnState.religion.error);
	const errorMaritalStatus = usePatientStore((state) => state.cpnState.maritalStatus.error);
	const errorCurrentAddress = usePatientStore((state) => state.cpnState.currentAddress.error);
	const errorOccupation = usePatientStore((state) => state.cpnState.occupation.error);
	const errorPersonalTelNo = usePatientStore((state) => state.cpnState.personalTelNo.error);
	const errorGuardianTelNo = usePatientStore((state) => state.cpnState.guardianTelNo.error);
	const errorIllness = usePatientStore((state) => state.cpnState.illness.error);
	const errorReferralSource = usePatientStore((state) => state.cpnState.referralSource.error);
	const errorForm = usePatientStore((state) => state.cpnState.form.error);
	const successForm = usePatientStore((state) => state.cpnState.form.success);

	const handleTextFieldInput = (field) => (ev) => {
		setErrorState("form", "", false);
		setErrorState(field, "", false);
		setPatientData({ [field]: ev.target.value });
	};

	const handleDatePickerInput = (field) => (value) => {
		setErrorState("form", "", false);
		setErrorState(field, "", false);
		setPatientData({ [field]: value.format("YYYY-MM-DD") });
	};

	const handlePhoneNumberInput = (field) => (value, context) => {
		if (validatePhoneNumberLength(value, context.countryCode) === "TOO_LONG") {
			return;
		} else {
			setErrorState("form", "", false);
			setErrorState(field, "", false);
			setPatientData({ [field]: value });
		}
	};

	const handleAutoCompleteInput = (field) => (ev, value) => {
		console.log(value);
		setErrorState("form", "", false);
		setErrorState(field, "", false);
		setPatientData({ [field]: value });
	};

	const handleAutoCompleteChipInput = (field) => (value) => {
		setErrorState("form", "", false);
		setErrorState(field, "", false);
		setPatientData({ [field]: [...new Set(value)] });
	};

	const handleCheckbox = (field) => (ev) => {
		setErrorState("form", "", false);
		setErrorState(field, "", false);
		setPatientData({ [field]: ev.target.checked });
	};

	const handleSubmit = () => {
		const termsOfService = usePatientStore.getState().data.termsOfService;
		if (termsOfService) {
			submitData();
		} else {
			setErrorState("form", "Please accept the terms and condition", true);
		}
	};

	return !submittedForm ? (
		loadingState ? (
			<Box sx={{ mx: 35 }}>
				<LoadingBar />
			</Box>
		) : (
			<Box
				sx={{
					mt: 5,
				}}
			>
				<>
					<ErrorPopup error={errorForm.isError} message={errorForm.message} />
					<Grid
						container
						rowGap={3}
						columnSpacing={2}
						sx={(theme) => ({
							[theme.breakpoints.only("xs")]: {
								px: 2,
								py: 3,
								mt: 0,
							},
							[theme.breakpoints.only("sm")]: {
								px: 5,
								py: 3,
								mt: 0,
							},
							[theme.breakpoints.up("md")]: {
								px: 5,
								py: 3,
								mt: 0,
							},
						})}
					>
						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.fullname}>
							<Tooltip title={fullName}>
								<Box>
									<ColoredTextField
										label="Full Name"
										value={fullName || ""}
										InputProps={{
											readOnly: true,
											
										}}
										inputProps={{
											sx:{
												textTransform:"capitalize"
											}
										}}
					
									/>
								</Box>
							</Tooltip>
						</Grid>
						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.icNum}>
							<Tooltip title={icNum}>
								<Box>
									<ColoredTextField
										label="Identification Number"
										value={icNum || ""}
										InputProps={{
											readOnly: true,
										}}
									/>
								</Box>
							</Tooltip>
						</Grid>
						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.race}>
							<ColoredTextField
								label="Race"
								onChange={handleTextFieldInput("race")}
								error={errorRace.isError}
								helperText={errorRace.isError ? errorRace.message : undefined}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.religion}>
							<ColoredTextField
								label="Religion"
								onChange={handleTextFieldInput("religion")}
								error={errorReligion.isError}
								helperText={errorReligion.isError ? errorReligion.message : undefined}
							/>
						</Grid>

						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.occupation}>
							<ColoredTextField
								label="Occupation"
								onChange={handleTextFieldInput("occupation")}
								error={errorOccupation.isError}
								helperText={errorOccupation.isError ? errorOccupation.message : undefined}
							/>
						</Grid>

						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.illness}>
							<MuiChipsInput
								label="Illness"
								value={illness}
								onChange={handleAutoCompleteChipInput("illness")}
								placeholder="Type and press enter to add multiple illness"
								error={errorIllness.isError}
								helperText={errorIllness.isError ? errorIllness.message : undefined}
								{...coloredTextFieldConstants}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.referralSource}>
							<MuiChipsInput
								label="Referral Source"
								value={referralSource}
								onChange={handleAutoCompleteChipInput("referralSource")}
								placeholder="Type and press enter to add multiple source"
								error={errorReferralSource.isError}
								helperText={errorReferralSource.isError ? errorReferralSource.message : undefined}
								{...coloredTextFieldConstants}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.gender}>
							<CustomSelectField
								label="Gender"
								options={genderOptions}
								value={gender || ""}
								onChange={handleTextFieldInput("gender")}
								error={errorGender.isError}
								helperText={errorGender.isError ? errorGender.message : undefined}
							/>
						</Grid>

						<Grid item {...gridBreakpoints(4, 4, 6, 6, 12)} order={gridRows.maritalStatus}>
							<CustomSelectField
								label="Marital Status"
								options={maritalStatusOptions}
								value={maritalStatus || ""}
								onChange={handleTextFieldInput("maritalStatus")}
								error={errorMaritalStatus.isError}
								helperText={errorMaritalStatus.isError ? errorMaritalStatus.message : undefined}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(3, 3, 6, 6, 12)} order={gridRows.birthDate}>
							<CustomDatePicker
								disableFuture
								label="Date of Birth"
								onChange={handleDatePickerInput("birthDate")}
								textfieldProps={{
									error: errorBirthDate.isError,
									helperText: errorBirthDate.isError ? errorBirthDate.message : undefined,
								}}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(3, 3, 6, 6, 12)} order={gridRows.personalTelNo}>
							<MuiTelInput
								disableDropdown
								forceCallingCode
								defaultCountry={"MY"}
								label="Personal Telephone Number"
								value={personalTelNo}
								onChange={handlePhoneNumberInput("personalTelNo")}
								getFlagElement={() => {
									return undefined;
								}}
								error={errorPersonalTelNo.isError}
								helperText={errorPersonalTelNo.isError ? errorPersonalTelNo.message : undefined}
								{...coloredTextFieldConstants}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(3, 3, 6, 6, 12)} order={gridRows.guardianTelNo}>
							<MuiTelInput
								disableDropdown
								forceCallingCode
								value={guardianTelNo}
								defaultCountry={"MY"}
								label="Guardian Telephone Number"
								onChange={handlePhoneNumberInput("guardianTelNo")}
								getFlagElement={() => {
									return undefined;
								}}
								error={errorGuardianTelNo.isError}
								helperText={errorGuardianTelNo.isError ? errorGuardianTelNo.message : undefined}
								{...coloredTextFieldConstants}
							/>
						</Grid>
						<Grid item {...gridBreakpoints(3, 3, 6, 6, 12)} alignSelf={"center"} order={gridRows.smoker}>
							<FormControlLabel control={<Checkbox onChange={handleCheckbox("smoker")} />} label="Are you a smoker?" />
						</Grid>
						<Grid item {...gridBreakpoints(8, 8, 12, 12, 12)} order={gridRows.currentAddress}>
							<AutoCompleteMap
								onChange={handleAutoCompleteInput("currentAddress")}
								onInputChange={handleAutoCompleteInput("currentAddress")}
								label="Address"
								textfieldProps={{
									error: errorCurrentAddress.isError,
									helperText: errorCurrentAddress.isError ? errorCurrentAddress.message : undefined,
								}}
							/>
						</Grid>
						<Grid container item {...gridBreakpoints(4, 4, 12, 12, 12)} order={gridRows.submit}>
							<Grid item {...gridBreakpoints(12, 12, 12, 12, 12)}>
								<FormControlLabel
									control={<Checkbox size="small" sx={{ py: 0 }} onChange={handleCheckbox("termsOfService")} />}
									label={
										<Typography variant="caption">
											Accept the <Link href="#">terms and condition</Link>
										</Typography>
									}
								/>
							</Grid>
							<Grid item {...gridBreakpoints(12, 12, 12, 12, 12)}>
								<Button
									color="secondary"
									sx={{ width: "100%", height: "100%" }}
									variant="contained"
									onClick={handleSubmit}
								>
									Submit
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</>
			</Box>
		)
	) : (
		<DisplayMessage
			message={
				errorForm.isError ? errorForm.message : successForm.isSuccess ? successForm.message : "Something Went Wrong!"
			}
		/>
	);
};

export default RegisterForm;
