# Laravel Model Validator Hook
# Validates Laravel model conventions

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

    # Only check model files
    if ($filePath -notmatch 'app[/\\]Models[/\\]') {
        exit 0
    }

    if (-not (Test-Path $filePath)) {
        exit 0
    }

    $content = Get-Content -Path $filePath -Raw

    # Check for required traits
    if ($content -notmatch 'use HasFactory') {
        Write-Host "⚠️ Model should use HasFactory trait" -ForegroundColor Yellow
    }

    # Check for $fillable or $guarded
    if ($content -notmatch '\$fillable' -and $content -notmatch '\$guarded') {
        Write-Host "⚠️ Model should define `$fillable or `$guarded" -ForegroundColor Yellow
    }

    # Check for proper namespace
    if ($content -notmatch 'namespace App\\Models;') {
        Write-Host "❌ Model must be in App\Models namespace" -ForegroundColor Red
        exit 2
    }

    Write-Host "✓ Model validation passed" -ForegroundColor Green
    exit 0
}
catch {
    # Don't block on validation errors
    exit 0
}
