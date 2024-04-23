package controllers

import (
	"log"
	"net/http"

	"github.com/SoftDevDanial/extended-patient-registration-system/database"
	"github.com/SoftDevDanial/extended-patient-registration-system/helpers"
	"github.com/SoftDevDanial/extended-patient-registration-system/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func KumodentRegisterWebhook(appCtx *gin.Context, dataChannel chan string) {

	var request map[string]any
	patientTempModel := models.PatientTemp{}
	// Parse data from request
	if err := appCtx.BindJSON(&request); err != nil {
		appCtx.JSON(http.StatusUnprocessableEntity, &gin.H{"Error": err})
		return
	}

	// Serialize fields
	includeFields := []string{
		patientTempModel.GetColumnName("Fullname"),
		patientTempModel.GetColumnName("IC"),
		patientTempModel.GetColumnName("PermanentAddress"),
	}
	request = helpers.FilterMap(request, includeFields, false)

	// Force lowercase if its a string for streamlined data
	request = helpers.MapStringToLower(request)

	// Generate unique id
	if id, err := helpers.GenerateUniqueID(); err != nil {
		log.Println("Fail to generate id")
		appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": "Fail to generate id"})
		return
	} else {
		request[patientTempModel.GetColumnName("UniqueID")] = id
	}

	// Send to database
	if err := database.CreateRowDb(request, &patientTempModel); err != nil {
		if err == gorm.ErrDuplicatedKey {
			log.Println("Record already exist.")
			appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "Record already exist."})
			return
		} else {
			log.Println(err)
			appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
			return
		}
	} else {
		log.Println("Successfully inserted patient record to Database")
	}

	// Trigger sse
	go func() {
		dataChannel <- "Webhook triggered"
	}()

	appCtx.JSON(http.StatusBadRequest, &gin.H{"success": "Patient Successfully received"})
}
