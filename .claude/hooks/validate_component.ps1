# React Component Validator Hook
# Validates React/TypeScript component conventions

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

    # Only check React components
    if ($filePath -notmatch '\.(tsx|jsx)$') {
        exit 0
    }

    # Get content
    $content = $input.tool_input.new_string
    if (-not $content) {
        if (Test-Path $filePath) {
            $content = Get-Content -Path $filePath -Raw
        } else {
            exit 0
        }
    }

    $issues = @()

    # Check for proper TypeScript interface
    if ($filePath -match 'Props' -and $content -notmatch 'interface \w+Props') {
        $issues += "Missing Props interface definition"
    }

    # Check for proper export
    if ($content -notmatch 'export (default|const)') {
        $issues += "Missing export statement"
    }

    # Check for className prop in reusable components
    if ($filePath -match '[/\\]Components[/\\]' -and $content -notmatch 'className\?') {
        $issues += "Consider adding optional className prop for flexibility"
    }

    if ($issues.Count -gt 0) {
        Write-Host "⚠️ Component validation warnings:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor Yellow
        }
    }

    Write-Host "✓ Component validation complete" -ForegroundColor Green
    exit 0
}
catch {
    # Don't block on validation errors
    exit 0
}
