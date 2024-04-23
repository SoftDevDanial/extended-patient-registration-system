package helpers

import (
	"encoding/json"
	"reflect"
	"strings"
	"time"

	"github.com/jaevor/go-nanoid"
)

func GetType(goStruct interface{}) string {
	if t := reflect.TypeOf(goStruct); t.Kind() == reflect.Ptr {
		return "*" + t.Elem().Name()
	} else {
		return t.Name()
	}
}

func GetStructKeys(goStruct interface{}, fieldType string) []string {
	structType := reflect.TypeOf(goStruct)
	structVal := reflect.ValueOf(goStruct)
	if fieldType == "json" {
		names := make([]string, structType.NumField())
		for i := range names {
			fieldName := structType.Field(i).Name
			if structType.Field(i).Type.Kind() == reflect.Struct && structType.Field(i).Anonymous {
				result := GetStructKeys(structVal.Field(i).Interface(), fieldType)
				names = append(names, result...)
			} else {
				switch jsonTag := structType.Field(i).Tag.Get(fieldType); jsonTag {
				case "-":
				case "":
					names[i] = fieldName
				default:
					parts := strings.Split(jsonTag, ",")
					name := parts[0]
					if name == "" {
						name = fieldName
					}
					names[i] = name
				}
			}

		}
		return names
	} else {
		names := make([]string, structType.NumField())
		for i := range names {
			names[i] = structType.Field(i).Name
		}
		return names
	}

}

func SerializeStructToMap(iStruct interface{}, fields []string, reverse bool) (map[string]any, error) {

	// Get all fields related to the given struct
	structKeys := GetStructKeys(iStruct, "json")

	// Filter the structfields for fields that are not needed for the struct
	if !reverse {
		for _, iValue := range fields {
			for sIndex, sValue := range structKeys {
				if sValue == iValue {
					structKeys = append(structKeys[:sIndex], structKeys[sIndex+1:]...)
					break
				}
			}
		}
	} else {
		structKeys = fields
	}

	// Convert struct to map
	var resultMap map[string]any
	err := ToMap(iStruct, &resultMap)
	if err != nil {
		return nil, err
	}
	// Remove fields in the map
	for _, val := range structKeys {
		delete(resultMap, val)
	}

	return resultMap, nil
}

func ToMap[T comparable, V any](iStruct interface{}, iMap *map[T]V) error {

	jsonBytes, err := json.Marshal(iStruct)
	if err != nil {
		return err
	}

	err = json.Unmarshal(jsonBytes, &iMap)
	if err != nil {
		return err
	}
	return nil
}

func MapTo[T comparable, V any](iMap map[T]V, iInterface *interface{}) error {
	jsonBytes, err := json.Marshal(iMap)
	if err != nil {
		return err
	}

	err = json.Unmarshal(jsonBytes, &iInterface)
	if err != nil {
		return err
	}
	return nil
}

func FilterMap[T comparable, V any](iMap map[T]V, fields []T, reverse bool) map[T]V {

	newMap := make(map[T]V)
	// Copy key value of field into new map
	if !reverse {
		for _, iValue := range fields {
			val, found := iMap[iValue]
			if found {
				newMap[iValue] = val
			}
		}
	} else {
		newMap = iMap
		// Remove fields in the map
		for _, val := range fields {
			delete(newMap, val)
		}
	}

	return newMap
}

func GetAge(birthDate string) (int, error) {
	parsedDate, err := time.Parse(time.DateOnly, birthDate)
	if err != nil {
		return 0, err
	}
	age := int(time.Since(parsedDate).Hours() / (365 * 24))

	return age, nil
}

func GenerateUniqueID() (string, error) {
	canonicID, err := nanoid.Standard(24)
	if err != nil {
		return "", err
	}
	id := canonicID()
	return id, nil
}

func MapStringToLower(iMap map[string]any) map[string]any {
	copyMap := iMap
	for key, val := range iMap {
		if valString, ok := val.(string); ok {
			copyMap[key] = strings.ToLower(valString)
		}
	}
	return copyMap
}
