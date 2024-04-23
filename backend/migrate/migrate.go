package main

import (
	"github.com/SoftDevDanial/extended-patient-registration-system/database"
	"github.com/SoftDevDanial/extended-patient-registration-system/initialize"
	"github.com/SoftDevDanial/extended-patient-registration-system/models"

	"log"
)

func init() {
	initialize.LoadEnvVariables()
	database.EstablishDBConnection()
}

func main() {

	// Need to use a better gorm migrator.
	// TODO: Look into https://github.com/go-gormigrate/gormigrate

	// Migrate models
	log.Println("Migrating...")
	database.DB.AutoMigrate(&models.Patient{}, &models.Admin{}, &models.PatientTemp{})

	// Create Superuser
	log.Println("Creating Superuser...")
	(&models.Admin{}).CreateSuperUser("admin", "admin123")
}
