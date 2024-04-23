import { TextField } from "@mui/material";
import { coloredTextFieldConstants } from "./constants";

export default function ColoredTextField(props) {
	return <TextField {...coloredTextFieldConstants} {...props} />;
}
