package main

import (
    "log"
    "os"

    "github.com/alchemistkay/codecollab/execution-service/internal/handlers"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // Load .env file
    godotenv.Load()

    // Create execution handler
    execHandler, err := handlers.NewExecutionHandler()
    if err != nil {
        log.Fatalf("Failed to create execution handler: %v", err)
    }
    defer execHandler.Close()

    // Setup Gin
    router := gin.Default()

    // CORS middleware
    router.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    // Routes
    router.GET("/health", handlers.HealthCheck)
    router.POST("/execute", execHandler.Execute)

    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8002"
    }

    log.Printf("Execution Service starting on port %s", port)
    if err := router.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
