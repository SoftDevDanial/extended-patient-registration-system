package initialize

import (
	"log"
	"path/filepath"

	"github.com/joho/godotenv"
)

var Config map[string]string

func LoadEnvVariables() map[string]string {
	envPath, err := filepath.Abs("./local.env")
	if err != nil {
		log.Fatal("File missing")
	}
	if Config, err = godotenv.Read(envPath); err != nil {
		log.Fatal("Failed to load env file")
	} else {
		log.Println("Environment file loaded")
	}

	return Config
}
