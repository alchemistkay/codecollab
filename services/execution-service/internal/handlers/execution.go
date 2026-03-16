package handlers

import (
    "context"
    "net/http"
    "time"

    "github.com/alchemistkay/codecollab/execution-service/internal/models"
    "github.com/alchemistkay/codecollab/execution-service/pkg/docker"
    "github.com/gin-gonic/gin"
)

type ExecutionHandler struct {
    executor *docker.Executor
}

func NewExecutionHandler() (*ExecutionHandler, error) {
    executor, err := docker.NewExecutor()
    if err != nil {
        return nil, err
    }
    return &ExecutionHandler{executor: executor}, nil
}

func (h *ExecutionHandler) Execute(c *gin.Context) {
    var req models.ExecutionRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    startTime := time.Now()
    ctx := context.Background()

    stdout, stderr, exitCode, err := h.executor.Execute(ctx, req.Language, req.Code)

    duration := time.Since(startTime).Milliseconds()

    response := models.ExecutionResponse{
        SessionID:  req.SessionID,
        Status:     "completed",
        Output:     stdout,
        Error:      stderr,
        ExitCode:   exitCode,
        ExecutedAt: time.Now(),
        Duration:   duration,
    }

    if err != nil {
        response.Status = "failed"
        if response.Error == "" {
            response.Error = err.Error()
        }
    }

    c.JSON(http.StatusOK, response)
}

func (h *ExecutionHandler) Close() error {
    return h.executor.Close()
}
