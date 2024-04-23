package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/SoftDevDanial/extended-patient-registration-system/database"
	"github.com/SoftDevDanial/extended-patient-registration-system/helpers"
	"github.com/SoftDevDanial/extended-patient-registration-system/initialize"
	"github.com/SoftDevDanial/extended-patient-registration-system/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func CreateAdminSession(appCtx *gin.Context) {

	var request map[string]string
	var secretKey = []byte(initialize.Config["JWT_KEY"])

	// Parse data from request
	if err := appCtx.BindJSON(&request); err != nil {
		appCtx.JSON(http.StatusUnprocessableEntity, &gin.H{"Error": err})
		return
	}

	// Serialize fields
	includeFields := []string{"username", "password"}
	request = helpers.FilterMap(request, includeFields, false)

	// Get admin from database
	user := database.GetRowDb[string, map[string]any](map[string]string{"username": request["username"]}, &models.Admin{}, nil)

	if user == nil {
		log.Println("incorrect username")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "incorrect username or password"})
		return
	}

	if password, ok := user["password"].([]byte); ok {

		// Decrypt and compare password with request password
		if err := bcrypt.CompareHashAndPassword(password, []byte(request["password"])); err != nil {
			log.Println("incorrect password")
			appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "incorrect username or password"})
			return
		}
	} else {
		appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": "password type conversion failed"})
		return
	}

	// Generate token with 18 hours expiry
	expiry := time.Now().Add(time.Hour * 18)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user["username"],
		"exp":      expiry.Unix(),
	})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		appCtx.JSON(http.StatusInternalServerError, &gin.H{"error": err})
		return
	}

	// Send Response back
	appCtx.SetCookie("login", tokenString, expiry.Second(), "/", "", true, true)
	appCtx.JSON(http.StatusOK, &gin.H{"expiry": expiry.Second()})
}
func GetAdmin(appCtx *gin.Context) {
	// Get query string in url and serialize in a map
	var request map[string]any
	adminModel := models.Admin{}
	colUsername := adminModel.GetColumnName("username")
	if query := appCtx.Query(colUsername); query == "" {
		log.Println("username not found in query")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "username not found in query"})
		return
	} else {
		request = map[string]any{colUsername: query}
	}

	// Retrieve admin data
	result := database.GetRowDb[any, map[string]any](request, &models.Admin{}, nil)
	if result == nil {
		log.Println("username does not exist")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": "username does not exist"})
		return
	}

	// Send response back
	appCtx.JSON(http.StatusOK, result)
}

func CreateAdmin(appCtx *gin.Context) {

	var request map[string]any
	adminModel := models.Admin{}

	// Parse data from request
	if err := appCtx.BindJSON(&request); err != nil {
		appCtx.JSON(http.StatusUnprocessableEntity, &gin.H{"Error": err})
		return
	}

	// Serialize fields
	includeFields := []string{"username", "password"}
	request = helpers.FilterMap(request, includeFields, false)

	err := adminModel.CreateSuperUser(request["username"].(string), request["password"].(string))
	if err != nil {
		log.Println(err)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"error": err})
		return
	}
	// Send response back
	appCtx.JSON(http.StatusOK, &gin.H{"success": "Admin Created"})
}
