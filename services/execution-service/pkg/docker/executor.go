package docker

import (
    "bytes"
    "context"
    "fmt"
    "os/exec"
    "time"
)

type Executor struct{}

func NewExecutor() (*Executor, error) {
    // Test if docker is available
    cmd := exec.Command("docker", "version")
    if err := cmd.Run(); err != nil {
        return nil, fmt.Errorf("docker not available: %w", err)
    }
    return &Executor{}, nil
}

func (e *Executor) Execute(ctx context.Context, language, code string) (string, string, int, error) {
    image, cmd := e.getDockerCommand(language, code)
    if image == "" {
        return "", fmt.Sprintf("unsupported language: %s", language), 1, fmt.Errorf("unsupported language")
    }

    // Pull image first
    pullCmd := exec.CommandContext(ctx, "docker", "pull", image)
    if err := pullCmd.Run(); err != nil {
        return "", fmt.Sprintf("failed to pull image: %v", err), 1, err
    }

    // Run code in container
    args := []string{
        "run",
        "--rm",                          // Remove container after execution
        "--network=none",                // No network access
        "--memory=128m",                 // 128MB memory limit
        "--cpus=1",                      // 1 CPU
        "--read-only",                   // Read-only filesystem
        image,
    }
    args = append(args, cmd...)

    // Create command with timeout
    timeoutCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
    defer cancel()

    dockerCmd := exec.CommandContext(timeoutCtx, "docker", args...)

    var stdout, stderr bytes.Buffer
    dockerCmd.Stdout = &stdout
    dockerCmd.Stderr = &stderr

    err := dockerCmd.Run()
    exitCode := 0

    if err != nil {
        if exitErr, ok := err.(*exec.ExitError); ok {
            exitCode = exitErr.ExitCode()
        } else {
            // Timeout or other error
            if timeoutCtx.Err() == context.DeadlineExceeded {
                return "", "Execution timeout (30s)", 124, nil
            }
            return "", fmt.Sprintf("execution error: %v", err), 1, err
        }
    }

    return stdout.String(), stderr.String(), exitCode, nil
}

func (e *Executor) getDockerCommand(language, code string) (string, []string) {
    switch language {
    case "python":
        return "python:3.11-alpine", []string{"python", "-c", code}
    case "javascript":
        return "node:18-alpine", []string{"node", "-e", code}
    case "go":
        // Go requires writing file first, more complex
        return "", nil
    case "rust":
        // Rust requires compilation, more complex
        return "", nil
    default:
        return "", nil
    }
}

func (e *Executor) Close() error {
    return nil
}
