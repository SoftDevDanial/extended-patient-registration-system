import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { coloredTextFieldConstants } from "../ColoredTextField/constants";
import { customDatePickerConstants } from "./constants";

export default function CustomDatePicker(props) {
    const {
        textfieldProps = {}
    } = props
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
                {...customDatePickerConstants}
                slotProps={{
                    textField:{
                        ...coloredTextFieldConstants, 
                        ...textfieldProps
                    }
                }}
                {...props}

			/>
		</LocalizationProvider>
	);
}
