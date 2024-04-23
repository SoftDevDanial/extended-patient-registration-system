package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/SoftDevDanial/extended-patient-registration-system/database"
	"github.com/SoftDevDanial/extended-patient-registration-system/helpers"
	"github.com/SoftDevDanial/extended-patient-registration-system/httprequest"
	"github.com/SoftDevDanial/extended-patient-registration-system/initialize"
	"github.com/SoftDevDanial/extended-patient-registration-system/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreatePatientApi(appCtx *gin.Context) {
	var request map[string]any
	patientModel := models.Patient{}
	patientTempModel := models.PatientTemp{}
	// Parse data from request
	if err := appCtx.ShouldBindJSON(&request); err != nil {
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "Bad Request"})
		return
	}

	// Extract UniqueId
	var uniqueId string

	if _, ok := request[patientTempModel.GetColumnName("UniqueID")]; ok {
		if id, isString := request[patientTempModel.GetColumnName("UniqueID")].(string); isString {
			uniqueId = id
		} else {
			err := fmt.Sprintf("%s is not a string", patientTempModel.GetColumnName("UniqueID"))
			log.Println(err)
			appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
			return
		}
	} else {
		err := fmt.Sprintf("Missing %s", patientTempModel.GetColumnName("UniqueID"))
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
		return
	}

	// Update the record that is system generated
	request[patientModel.GetColumnName("CreatedBy")] = "System"
	request[patientModel.GetColumnName("UpdatedBy")] = "System"
	if birthDate, ok := request[patientModel.GetColumnName("BirthDate")].(string); ok {
		// Calculate age from birth date
		if age, err := helpers.GetAge(birthDate); err != nil {
			log.Println(err)
			appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
			return
		} else {
			request[patientModel.GetColumnName("Age")] = age
		}
	} else {
		err := fmt.Sprintf("%s is not a string", patientModel.GetColumnName("BirthDate"))
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
		return
	}

	// Serialize fields
	excludeFields := []string{
		patientModel.GetColumnName("ID"),
		patientModel.GetColumnName("CreatedAt"),
		patientModel.GetColumnName("UpdatedAt"),
		patientModel.GetColumnName("DeletedAt"),
	}
	request = helpers.FilterMap(request, excludeFields, true)
	// Force lowercase if its a string for streamlined data
	request = helpers.MapStringToLower(request)

	// Update patient record in kumodent
	// TODO: MAKE THIS A GOROUTINE FOR BETTER PERFORMANCE
	if err := sendDataToMainSystem(request); err != nil {
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
		return
	} else {
		log.Println("Successfully sent patient record to KumoDent")
	}

	// Register patient into database
	// TODO: MAKE THIS A GOROUTINE FOR BETTER PERFORMANCE
	if err := database.CreateRowDb(request, &patientModel); err != nil {
		if err == gorm.ErrDuplicatedKey {
			log.Println("Record already exist. Ic number should be unique")
			appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "Record already exist. Ic number should be unique"})
			return
		} else {
			log.Println(err)
			appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": "Internal Server Error"})
			return
		}
	} else {
		log.Println("Successfully inserted patient record to Database")

		// Remove from patient temp if exist and only after inserting
		database.DeleteRowDb(map[string]any{
			patientTempModel.GetColumnName("Fullname"): request[patientModel.GetColumnName("Fullname")],
			patientTempModel.GetColumnName("IC"):       request[patientModel.GetColumnName("IC")],
			patientTempModel.GetColumnName("UniqueID"): uniqueId,
		}, &patientTempModel, true)

		log.Println("Successfully removed patient temp record from Database")

	}

	// Send Response back
	appCtx.JSON(http.StatusOK, &gin.H{"success": "Data has successfully been recorded "})
}

func GetPatientJSON(appCtx *gin.Context) {
	// Initialize the model to be returned
	patientModel := new(models.Patient)

	// Serialize fields
	excludeFields := []string{
		patientModel.GetColumnName("ID"),
		patientModel.GetColumnName("CreatedAt"),
		patientModel.GetColumnName("UpdatedAt"),
		patientModel.GetColumnName("DeletedAt"),
	}
	serializePatient, err := helpers.SerializeStructToMap(*patientModel, excludeFields, true)
	if err != nil {
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
		return
	}

	// Send Response back
	appCtx.JSON(http.StatusOK, serializePatient)
}

type SendPatientWhatsappRequest struct {
	PhoneNumber      string `json:"phone_number"`
	RegisterationUrl string `json:"registeration_url"`
}

func SendPatientWhatsapp(appCtx *gin.Context) {
	var request SendPatientWhatsappRequest

	// Parse data from request
	if err := appCtx.ShouldBindJSON(&request); err != nil {
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "Bad Request"})
		return
	}

	// Make sure api key and url is present
	if wassengerApiKey, ok := initialize.Config["WASSENGER_API_KEY"]; ok {
		if wassengerUrl, ok := initialize.Config["WASSENGER_URL"]; ok {

			// Send whatsapp message
			_, err := httprequest.Post(wassengerUrl, map[string]string{
				"Content-Type": "application/json",
				"Token":        wassengerApiKey,
			}, map[string]string{
				"phone": request.PhoneNumber,
				"message": "Please finish your registeration using the link provided.\n" +
					request.RegisterationUrl,
			})

			if err != nil {
				log.Println(err)
				appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": err})
				return
			}
			appCtx.JSON(http.StatusOK, &gin.H{"success": fmt.Sprintf("Registeration url has successfully been sent to %v", request.PhoneNumber)})
			return
		} else {
			log.Println("wassengerApiKey missing")
			appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": "Unable to send whatsapp. Please contact IT Administrator."})
			return
		}
	} else {
		log.Println("wassengerUrl missing")
		appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": "Unable to send whatsapp. Please contact IT Administrator."})
		return
	}
}

func VerifyPatientUniqueID(appCtx *gin.Context) {

	// Get query string in url and serialize in a map
	var request map[string]any
	patientTempModel := models.PatientTemp{}
	colUniqueId := patientTempModel.GetColumnName("UniqueID")
	if query := appCtx.Query(colUniqueId); query == "" {
		log.Println("unique_id not found in query")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "unique_id not found in query"})
		return
	} else {
		request = map[string]any{colUniqueId: query}
	}

	// Check if id exist in database
	result := database.GetRowDb[any, map[string]any](request, &patientTempModel, []string{
		patientTempModel.GetColumnName("Fullname"),
		patientTempModel.GetColumnName("IC"),
		patientTempModel.GetColumnName("PermanentAddress"),
	})
	if result == nil {
		log.Println("Id does not exist")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "Id does not exist"})
		return
	}

	// Send Response back
	appCtx.JSON(http.StatusOK, &gin.H{"success": "Id found", "data": result})
}
