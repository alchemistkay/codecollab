package models

import "time"

type ExecutionRequest struct {
    SessionID string `json:"session_id" binding:"required"`
    Language  string `json:"language" binding:"required"`
    Code      string `json:"code" binding:"required"`
}

type ExecutionResponse struct {
    SessionID  string    `json:"session_id"`
    Status     string    `json:"status"`
    Output     string    `json:"output"`
    Error      string    `json:"error,omitempty"`
    ExitCode   int       `json:"exit_code"`
    ExecutedAt time.Time `json:"executed_at"`
    Duration   int64     `json:"duration_ms"`
}
