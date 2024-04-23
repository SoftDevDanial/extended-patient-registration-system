package models

import (
	"log"
	"sync"

	"gorm.io/gorm/schema"
)

func GetAllColumnName(model interface{}) (map[string]string, error) {
	dbSchema, err := schema.Parse(&model, &sync.Map{}, schema.NamingStrategy{})
	if err != nil {
		return nil, err
	}
	nameMap := make(map[string]string)
	for _, field := range dbSchema.Fields {
		dbName := field.DBName
		modelName := field.Name
		nameMap[modelName] = dbName
	}

	return nameMap, nil
}

func GetColumnName(fieldName string, model interface{}) string {
	dbSchema, err := schema.Parse(&model, &sync.Map{}, schema.NamingStrategy{})
	if err != nil {
		return ""
	}
	for _, field := range dbSchema.Fields {
		dbName := field.DBName
		modelName := field.Name
		if modelName == fieldName {
			return dbName
		}
	}
	log.Panic("Column Name not found")
	return ""
}
