import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { StyledAgGridContainer, defaultColDef } from "./constants";

const DataTable = (props) => {
	const { rowData = [], height = "60vh", columnDefs = [] } = props;
	
	return (
		<StyledAgGridContainer className={"ag-theme-alpine"} sx={{ height: height }}>
			<AgGridReact
				rowData={rowData}
				defaultColDef={defaultColDef}
				columnDefs={columnDefs}
				suppressMovableColumns={true}
			/>
		</StyledAgGridContainer>
	);
};

export default DataTable;
