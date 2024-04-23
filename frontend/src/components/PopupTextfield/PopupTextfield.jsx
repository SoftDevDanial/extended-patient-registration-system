import { Backdrop, Button, Paper } from "@mui/material";
import ColoredTextField from "../ColoredTextField/ColoredTextField";

export default function PopupTextfield(props) {
	const {
		open = false,
		textfieldProps = {},
		handleClose = () => {},
		handleSubmit = () => {},
		handleCancel = () => {},
	} = props;
	return (
		<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
			<Paper elevation={2}>
				<ColoredTextField {...textfieldProps} />
				<Button color="secondary" sx={{ width: "100%", height: "100%" }} variant="contained" onClick={handleCancel}>
					Cancel
				</Button>
				<Button color="secondary" sx={{ width: "100%", height: "100%" }} variant="contained" onClick={handleSubmit}>
					Submit
				</Button>
			</Paper>
		</Backdrop>
	);
}
