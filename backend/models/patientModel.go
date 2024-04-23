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
type Patient struct {
	gorm.Model
	Fullname         string `json:"fullname" gorm:"column:fullname; type:VARCHAR(255); not null"`
	IC               string `json:"ic_num" gorm:"column:ic_num; type:VARCHAR(12); unique"`
	Age              int    `json:"age" gorm:"column:age; type:SMALLINT; not null"`
	BirthDate        string `json:"birth_date" gorm:"column:birth_date; type:DATE; not null"`
	Gender           string `json:"gender" gorm:"column:gender; type:VARCHAR(255); not null"`
	Race             string `json:"race" gorm:"column:race; type:VARCHAR(255); not null"`
	Religion         string `json:"religion" gorm:"column:religion; type:VARCHAR(255); not null"`
	MaritalStatus    string `json:"marital_status" gorm:"column:marital_status; type:VARCHAR(255); not null"`
	CurrentAddress   string `json:"current_address" gorm:"column:current_address; type:VARCHAR(255); not null"`
	PermanentAddress string `json:"permanent_address" gorm:"column:permanent_address; type:VARCHAR(255); not null"`
	Occupation       string `json:"occupation" gorm:"column:occupation; type:VARCHAR(255); not null"`
	PersonalTelNo    string `json:"personal_tel_no" gorm:"column:personal_tel_no; type:VARCHAR(255); not null"`
	GuardianTelNo    string `json:"guardian_tel_no" gorm:"column:guardian_tel_no; type:VARCHAR(255); not null"`
	Smoker           bool   `json:"smoker" gorm:"column:smoker; type:BOOLEAN; not null"`
	Illness          string `json:"illness" gorm:"column:illness; type:VARCHAR(255); not null"`
	ReferralSource   string `json:"referral_source" gorm:"column:referral_source; type:VARCHAR(255); not null"`
	CreatedBy        string `json:"created_by" gorm:"column:created_by; type:VARCHAR(255); not null"`
	UpdatedBy        string `json:"updated_by" gorm:"column:updated_by; type:VARCHAR(255); not null"`
}

func (model *Patient) GetAllColumnName() (map[string]string, error) {
	result, err := GetAllColumnName(&model)
	return result, err
}

func (model *Patient) GetColumnName(fieldName string) string {
	return GetColumnName(fieldName, &model)
}
