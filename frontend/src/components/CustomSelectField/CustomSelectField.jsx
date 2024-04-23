import { MenuItem } from "@mui/material";
import ColoredTextField from "../ColoredTextField/ColoredTextField";

export default function CustomSelectField(props) {
	const { options, ...textfieldProps } = props;

	return (
		<ColoredTextField select {...textfieldProps}>
			{options.map((option) => (
				<MenuItem key={option} value={option}>
					{option}
				</MenuItem>
			))}
		</ColoredTextField>
	);
}
