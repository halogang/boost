# Command Logger Hook
# Logs all commands executed by Claude

try {
    $input = $null
    $stdin = [Console]::In
    $inputText = $stdin.ReadToEnd()
    if ($inputText) {
        $input = $inputText | ConvertFrom-Json
    }

    if (-not $input) {
        exit 0
    }

    $command = $input.tool_input.command
    $description = $input.tool_input.description
    if (-not $description) {
        $description = "No description"
    }

    if (-not $command) {
        exit 0
    }

    # Create log directory if it doesn't exist
    $logDir = ".claude/logs"
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }

    # Log to file
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $command - $description"
    Add-Content -Path "$logDir/commands.log" -Value $logEntry

    exit 0
}
catch {
    # Silently fail
    exit 0
}
