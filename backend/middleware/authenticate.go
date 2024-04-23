package middleware

import (
	"errors"
	"log"
	"net/http"

	"github.com/SoftDevDanial/extended-patient-registration-system/initialize"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AdminAuthClaims struct {
	jwt.RegisteredClaims
	Username string
}

func ValidateSession(appCtx *gin.Context) {
	tokenString, err := appCtx.Cookie("login")
	if err != nil {
		errMsg := "Token not found"
		log.Println(errMsg)
		appCtx.JSON(http.StatusBadRequest, &gin.H{"Error": errMsg})
		return
	}
	var secretKey = []byte(initialize.Config["JWT_KEY"])
	verifyJwt := func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secretKey), nil
	}

	// pass your custom claims to the parser function
	token, err := jwt.ParseWithClaims(tokenString, &AdminAuthClaims{}, verifyJwt)
	if err != nil {
		log.Println("Token Problem")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"Error": err})
		return
	}

	claims, ok := token.Claims.(*AdminAuthClaims)
	if !ok {
		log.Println("Claims Problem")
		appCtx.JSON(http.StatusBadRequest, &gin.H{"Error": err})
		return
	}

	log.Println(claims.Username)
	appCtx.Next()

}
