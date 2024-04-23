package models

import (
	"fmt"

	"github.com/SoftDevDanial/extended-patient-registration-system/database"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Admin struct {
	gorm.Model
	Username string `json:"username" gorm:"column:username; type:VARCHAR(255); unique; not null"`
	Password []byte `json:"password" gorm:"column:password; type:BYTEA; not null"`
}

func (model *Admin) GetAllColumnName() (map[string]string, error) {
	result, err := GetAllColumnName(&model)
	return result, err
}

func (model *Admin) GetColumnName(fieldName string) string {
	return GetColumnName(fieldName, &model)
}

func (model *Admin) CreateSuperUser(username, password string) error {

	// Encrypt password
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}

	// Create admin record
	if err := database.CreateRowDb(map[string]any{"username": username, "password": encryptedPassword}, &model); err != nil {
		if err == gorm.ErrDuplicatedKey {
			return fmt.Errorf("Record already exist")
		} else {
			return err
		}
	}

	return nil

}
