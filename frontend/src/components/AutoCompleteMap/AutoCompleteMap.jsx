import { Autocomplete } from "@mui/material";
import { useMemo } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { mapsApiKey } from "../../helper/urls";
import ColoredTextField from "../ColoredTextField/ColoredTextField";
import { coloredTextFieldConstants } from "../ColoredTextField/constants";

export default function AutoCompleteMap(props) {
	const { label, onInputChange = () => {}, onChange = () => {}, textfieldProps = {}, ...autocompleteProps } = props;
	const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
		apiKey: mapsApiKey,
		debounce: 400,
		options: {
			types: ["address"],
			componentRestrictions: { country: ["my"] },
		},
	});
	const placeDetails = useMemo(() => {
		if (placePredictions.length > 0) {
			return placePredictions.map((place) => {
				return place.description;
			});
		}
		return [];
	}, [placePredictions]);

	return (
		<Autocomplete
			freeSolo
			loading={isPlacePredictionsLoading}
			options={isPlacePredictionsLoading ? [] : placeDetails}
			filterOptions={(options) => options}
			onInputChange={(ev, value) => {
				onInputChange(ev, value);
				getPlacePredictions({ input: value });
			}}
			onChange={(ev, value) => {
				onChange(ev, value);
			}}
			renderInput={(params) => (
				<ColoredTextField {...params} {...coloredTextFieldConstants} {...textfieldProps} label={label} />
			)}
			{...autocompleteProps}
		/>
	);
}
