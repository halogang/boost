# File Protection Hook
# Blocks edits to sensitive files

try {
    $input = $null
    if ($input:Length -gt 0) {
        $input = Get-Content -Raw | ConvertFrom-Json
    } else {
        $stdin = [Console]::In
        $inputText = $stdin.ReadToEnd()
        if ($inputText) {
            $input = $inputText | ConvertFrom-Json
        }
    }

    if (-not $input) {
        exit 0
    }

    $filePath = $input.tool_input.file_path

    if (-not $filePath) {
        exit 0
    }

    # Protected files/patterns
    $protected = @(
        '.env',
        'composer.lock',
        'package-lock.json',
        'bun.lock',
        '.git\',
        'vendor\',
        'node_modules\'
    )

    # Check if file is protected
    foreach ($pattern in $protected) {
        if ($filePath -like "*$pattern*") {
            Write-Host "❌ BLOCKED: Cannot modify protected file: $filePath" -ForegroundColor Red
            exit 2
        }
    }

    exit 0
}
catch {
    # Silently fail to not block operations
    exit 0
}
