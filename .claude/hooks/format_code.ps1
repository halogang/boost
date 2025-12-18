# Code Formatter Hook
# Auto-formats PHP and TypeScript files

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

    $filePath = $input.tool_input.file_path

    if (-not $filePath) {
        exit 0
    }

    # Check if file exists
    if (-not (Test-Path $filePath)) {
        exit 0
    }

    # Format PHP files with Pint
    if ($filePath -match '\.php$') {
        if (Test-Path "./vendor/bin/pint") {
            & ./vendor/bin/pint $filePath --quiet 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Formatted PHP: $filePath" -ForegroundColor Green
            }
        }
    }

    # Format TypeScript/React files with Prettier
    if ($filePath -match '\.(ts|tsx|js|jsx)$') {
        & npx prettier --write $filePath --log-level=error 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Formatted TypeScript: $filePath" -ForegroundColor Green
        }
    }

    exit 0
}
catch {
    # Don't block on formatting errors
    Write-Host "⚠️ Formatting skipped: $_" -ForegroundColor Yellow
    exit 0
}
