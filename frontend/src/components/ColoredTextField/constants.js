import { colors } from "../../helper/colors";

export const coloredTextFieldConstants = {
    fullWidth:true,
    InputLabelProps:{
        shrink: true,
        sx: {
            fontSize: "1.3rem",
            fontWeight: 700,
            color: colors.yellow.main,
        },
    },
    sx:{
        "& label.Mui-focused": {
            color: colors.yellow.main,
        },

        "& legend": {
            fontSize: "calc(0.75 * 1.37rem)",
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: colors.blue.main,
            },
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.blue.main,
        },
    }
}