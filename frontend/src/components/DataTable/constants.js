import { Box, styled } from "@mui/material";
import { colors } from "../../helper/colors";

export const StyledAgGridContainer = styled(Box)(() => {
	return {
		"&.ag-theme-alpine": {
			"--ag-header-height": "35px",
			"--ag-header-foreground-color": colors.white.main,
			"--ag-header-background-color": colors.blue.main,
			// "--ag-header-cell-moving-background-color": "#E90029",
		},
		"& .ag-root-wrapper": {
			borderRadius: "5px",
		},
		"& .ag-invisible": {
			display: "none !important",
		},
		"& .ag-center-cols-container": {
			minWidth: "100%",
		},
	};
});

export const defaultColDef = {
        flex: 1,
};
