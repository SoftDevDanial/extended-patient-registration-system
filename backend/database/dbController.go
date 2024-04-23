package database

import (
	"github.com/SoftDevDanial/extended-patient-registration-system/helpers"
)

func CreateRowDb(requestData map[string]any, model interface{}) error {
	db := DB
	dataModel := model
	err := helpers.MapTo(requestData, &dataModel)
	if err != nil {
		return err
	}
	result := db.Create(dataModel)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateRowDb() {
	panic("Not Implemented")
}

func DeleteRowDb[requestType any](requestData map[string]requestType, model interface{}, force bool) int64 {
	db := DB
	if force {
		result := db.Model(&model).Unscoped().Where(requestData).Delete(map[string]interface{}{})
		return result.RowsAffected
	}
	result := db.Where(requestData).Delete(model)
	return result.RowsAffected

}
func GetRowDb[requestType any, tableData map[string]any | []map[string]any](requestData map[string]requestType, model interface{}, filter []string) tableData {
	db := DB
	var result tableData

	db.Model(&model).Select(filter).Where(requestData).Find(&result)
	return result
}
