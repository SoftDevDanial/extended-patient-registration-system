package routes

import (
	"net/http"

	"github.com/SoftDevDanial/extended-patient-registration-system/controllers"
	"github.com/SoftDevDanial/extended-patient-registration-system/middleware"

	"github.com/gin-gonic/gin"
)

func Setup(app *gin.Engine) {

	dataChannel := make(chan string)

	// Register Groups
	api := app.Group("/api")
	patient := api.Group("/patient")
	admin := api.Group("/admin")

	// Register Middleware
	admin.Use(middleware.ValidateSession)

	/* Get Requests */

	// Health Check
	{
		api.GET("/", func(appCtx *gin.Context) {
			appCtx.String(http.StatusOK, "Api is running")
		})
	}

	// Admin
	// api.GET("/get-admin", controllers.GetAdmin)

	// Patient
	{
		api.GET("/get/patient", controllers.GetPatientJSON)
		patient.GET("/verify", controllers.VerifyPatientUniqueID)
	}

	/* Post Requests */

	// Admin

	{
		admin.POST("/login", controllers.CreateAdminSession)
		admin.POST("/register", controllers.CreateAdmin)
	}
	// Patient

	{
		patient.POST("/register", controllers.CreatePatientApi)
		patient.POST("/send-link", controllers.SendPatientWhatsapp)

	}

	/* Webhook Requests */
	webhook := api.Group("/webhook")
	{
		webhook.POST("/kumodent/patient/on-register", func(appCtx *gin.Context) {
			controllers.KumodentRegisterWebhook(appCtx, dataChannel)
		})
	}

	/* Websocket Requests */

	/* Server Side Events */
	sse := api.Group("/sse")
	{
		sse.GET("/send-registered-patient", func(appCtx *gin.Context) {
			controllers.SendRegisteredPatientSSE(appCtx, dataChannel)
		})
	}

}
