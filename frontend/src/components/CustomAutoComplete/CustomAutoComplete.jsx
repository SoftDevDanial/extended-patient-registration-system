import { Autocomplete, Chip, TextField } from "@mui/material";
import { coloredTextFieldConstants } from "../ColoredTextField/constants";
import { customAutoCompleteConstants } from "./constants";

export default function CustomAutoComplete(props) {
	const { label = "", value = [], options = [], onChange = () => {} } = props;
	return (
		<Autocomplete
			options={options}
			value={value === [] ? undefined : value}
			renderTags={(tagValue, getTagProps) =>
				value.map((option, index) => (
					<Chip key={option} variant="outlined" label={option} {...getTagProps({ index })} />
				))
			}
			onChange={(event, values) => {
				onChange(values);
			}}
			renderInput={(params) => <TextField {...params} {...coloredTextFieldConstants}  label={label} />}
            {...customAutoCompleteConstants}
		/>
	);
}
