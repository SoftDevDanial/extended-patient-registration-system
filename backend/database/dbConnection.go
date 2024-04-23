package database

import (
	"fmt"
	"log"

	"github.com/SoftDevDanial/extended-patient-registration-system/initialize"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func EstablishDBConnection() {
	var err error
	config := initialize.Config
	connection := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config["POSTGRES_HOST"],
		config["POSTGRES_PORT"],
		config["POSTGRES_USERNAME"],
		config["POSTGRES_PASSWORD"],
		config["POSTGRES_DBNAME"])
	log.Println("Establishing connection to database")
	DB, err = gorm.Open(postgres.Open(connection), &gorm.Config{TranslateError: true})

	if err != nil {
		log.Fatal("Connection to database failed. Reason - ", err)
	}
	log.Println("Successfully connected to database")
}
