package models

import (
	"gorm.io/gorm"
)

// gorm.Model definition
//
//	type Model struct {
//		ID        uint `gorm:"primaryKey"`
//		CreatedAt time.Time
//		UpdatedAt time.Time
//		DeletedAt gorm.DeletedAt `gorm:"index"`
//	}

type PatientTemp struct {
	gorm.Model
	Fullname         string `json:"fullname" gorm:"column:fullname; type:VARCHAR(255); not null"`
	PermanentAddress string `json:"permanent_address" gorm:"column:permanent_address; type:VARCHAR(255); not null"`
	IC               string `json:"ic_num" gorm:"column:ic_num; type:VARCHAR(12); unique"`
	UniqueID         string `json:"unique_id" gorm:"column:unique_id; type:VARCHAR(30); unique"`
}

func (model *PatientTemp) GetAllColumnName() (map[string]string, error) {
	result, err := GetAllColumnName(&model)
	return result, err
}

func (model *PatientTemp) GetColumnName(fieldName string) string {
	return GetColumnName(fieldName, &model)
}
