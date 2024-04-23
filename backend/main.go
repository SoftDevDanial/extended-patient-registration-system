package main

import (
	"fmt"
	"log"

	"github.com/SoftDevDanial/extended-patient-registration-system/database"
	"github.com/SoftDevDanial/extended-patient-registration-system/initialize"
	"github.com/SoftDevDanial/extended-patient-registration-system/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initialize.LoadEnvVariables()
	database.EstablishDBConnection()
}

func main() {
	app := gin.Default()
	url := fmt.Sprintf("%v:%v", initialize.Config["API_HOST"], initialize.Config["API_PORT"])
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"POST", "GET"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Credentials", "Accept", "Content-Length", "Accept-Language", "Accept-Encoding", "Connection", "Access-Control-Allow-Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	routes.Setup(app)
	log.Fatal(app.Run(url))
}
