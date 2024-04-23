package controllers

import (
	"io"
	"log"

	"github.com/SoftDevDanial/extended-patient-registration-system/database"
	"github.com/SoftDevDanial/extended-patient-registration-system/models"

	"github.com/gin-gonic/gin"
)

func sendTable() []map[string]any {
	log.Println("Sending temporary patient table")
	patientTempModel := models.PatientTemp{}
	result := database.GetRowDb[any, []map[string]any](nil, &patientTempModel, []string{
		patientTempModel.GetColumnName("Fullname"),
		patientTempModel.GetColumnName("IC"),
	})
	return result
}

func SendRegisteredPatientSSE(appCtx *gin.Context, dataChannel chan string) {
	initialConnection := true

	appCtx.Stream(func(writer io.Writer) bool {
		if initialConnection {
			initialConnection = false
			appCtx.SSEvent("message", sendTable())
			return true
		}
		for {
			select {
			case _, ok := <-dataChannel:
				if !ok {
					return false
				}
				appCtx.SSEvent("message", sendTable())
				return true
			case <-appCtx.Request.Context().Done():
				return false
			}
		}
	})
}
