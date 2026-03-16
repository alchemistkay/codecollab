package handlers

import (
    "net/http"

    "github.com/alchemistkay/codecollab/execution-service/internal/models"
    "github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
    c.JSON(http.StatusOK, models.HealthResponse{
        Status:  "healthy",
        Service: "execution-service",
        Version: "1.0.0",
    })
}
