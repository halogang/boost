# CLAUDE COPILOT HOOKS GUIDE

**Version**: 1.0  
**Purpose**: Automated code quality, formatting, and validation hooks for Laravel + React project

---

## OVERVIEW

Claude Copilot hooks allow you to automatically run commands at specific points in the development workflow:
- **PreToolUse**: Before Claude executes tools (can block execution)
- **PostToolUse**: After Claude executes tools (for formatting, validation)
- **PermissionRequest**: When permission dialogs are shown
- **Notification**: When notifications are sent
- **SessionStart**: When starting/resuming sessions

---

## HOOK CONFIGURATION LOCATION

### User Settings (Global)
```
~/.claude/settings.json
```
Use for hooks that apply to all projects (e.g., general logging)

### Project Settings (Local)
```
.claude/settings.json
```
Use for project-specific hooks (recommended for this project)

---

## 1. SETUP PROJECT HOOKS

Create `.claude/` directory in project root:
```bash
mkdir -p .claude/hooks
```

---

## 2. CODE FORMATTING HOOKS

### A. PHP Code Formatting (Laravel Pint)

**Hook**: Auto-format PHP files after editing

**File**: `.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -q '\\.php$'; then ./vendor/bin/pint \"$file_path\" --quiet; fi; }"
          }
        ]
      }
    ]
  }
}
```

**What it does**: Runs Laravel Pint on PHP files after editing to ensure PSR-12 compliance

---

### B. TypeScript/React Formatting (Prettier)

**Hook**: Auto-format TS/TSX files after editing

**File**: `.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.(ts|tsx|js|jsx)$'; then npx prettier --write \"$file_path\" --log-level=error; fi; }"
          }
        ]
      }
    ]
  }
}
```

**What it does**: Runs Prettier on TypeScript/React files after editing

---

### C. Combined PHP + TypeScript Formatter

**File**: `.claude/hooks/format_code.sh`
```bash
#!/bin/bash

# Read file path from stdin
file_path=$(jq -r '.tool_input.file_path')

# Format PHP files with Pint
if echo "$file_path" | grep -q '\.php$'; then
    ./vendor/bin/pint "$file_path" --quiet
    echo "✓ Formatted PHP: $file_path"
fi

# Format TypeScript/React files with Prettier
if echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx)$'; then
    npx prettier --write "$file_path" --log-level=error
    echo "✓ Formatted TypeScript: $file_path"
fi
```

Make executable:
```bash
chmod +x .claude/hooks/format_code.sh
```

**Settings**: `.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/format_code.sh"
          }
        ]
      }
    ]
  }
}
```

---

## 3. FILE PROTECTION HOOKS

### Protect Sensitive Files

**Hook**: Block edits to sensitive files

**File**: `.claude/hooks/protect_files.py`
```python
#!/usr/bin/env python3
import json
import sys

# Read stdin
data = json.load(sys.stdin)
file_path = data.get('tool_input', {}).get('file_path', '')

# Protected files/patterns
protected = [
    '.env',
    'composer.lock',
    'package-lock.json',
    'bun.lock',
    '.git/',
    'vendor/',
    'node_modules/',
]

# Check if file is protected
for pattern in protected:
    if pattern in file_path:
        print(f"❌ BLOCKED: Cannot modify protected file: {file_path}")
        sys.exit(2)  # Exit code 2 blocks the operation

sys.exit(0)  # Allow operation
```

Make executable:
```bash
chmod +x .claude/hooks/protect_files.py
```

**Settings**: `.claude/settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|Delete",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/protect_files.py"
          }
        ]
      }
    ]
  }
}
```

---

## 4. VALIDATION HOOKS

### A. Laravel Migration Validator

**File**: `.claude/hooks/validate_migration.php`
```php
#!/usr/bin/env php
<?php

$input = json_decode(file_get_contents('php://stdin'), true);
$filePath = $input['tool_input']['file_path'] ?? '';

// Only check migration files
if (!str_contains($filePath, 'database/migrations/')) {
    exit(0);
}

$content = file_get_contents($filePath);

// Check for required methods
if (!str_contains($content, 'public function up()')) {
    echo "❌ Migration missing up() method\n";
    exit(2);
}

if (!str_contains($content, 'public function down()')) {
    echo "❌ Migration missing down() method\n";
    exit(2);
}

echo "✓ Migration validation passed\n";
exit(0);
```

Make executable:
```bash
chmod +x .claude/hooks/validate_migration.php
```

---

### B. React Component Validator

**File**: `.claude/hooks/validate_component.py`
```python
#!/usr/bin/env python3
import json
import sys
import re

data = json.load(sys.stdin)
file_path = data.get('tool_input', {}).get('file_path', '')

# Only check React components
if not file_path.endswith(('.tsx', '.jsx')):
    sys.exit(0)

# Read file content (if it's a write operation, get new content)
content = data.get('tool_input', {}).get('new_string', '')
if not content:
    try:
        with open(file_path, 'r') as f:
            content = f.read()
    except:
        sys.exit(0)

# Validation rules
issues = []

# Check for proper TypeScript interface
if 'Props' in file_path and not re.search(r'interface \w+Props', content):
    issues.append("Missing Props interface definition")

# Check for proper export
if not re.search(r'export (default|const)', content):
    issues.append("Missing export statement")

# Check for className prop in reusable components
if '/Components/' in file_path and 'className?' not in content:
    issues.append("Consider adding optional className prop for flexibility")

if issues:
    print("⚠️ Component validation warnings:")
    for issue in issues:
        print(f"  - {issue}")
    # Warning only, don't block (exit 0)

print("✓ Component validation complete")
sys.exit(0)
```

Make executable:
```bash
chmod +x .claude/hooks/validate_component.py
```

---

## 5. LOGGING HOOKS

### Command Logger

**File**: `.claude/hooks/command_logger.sh`
```bash
#!/bin/bash

# Create log directory
mkdir -p .claude/logs

# Get command from stdin
command=$(jq -r '.tool_input.command // empty')
description=$(jq -r '.tool_input.description // "No description"')
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Log to file
if [ -n "$command" ]; then
    echo "[$timestamp] $command - $description" >> .claude/logs/commands.log
fi
```

Make executable:
```bash
chmod +x .claude/hooks/command_logger.sh
```

**Settings**: Add to `.claude/settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|PowerShell",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/command_logger.sh"
          }
        ]
      }
    ]
  }
}
```

---

## 6. LARAVEL SPECIFIC HOOKS

### A. Auto-run Migrations After Creating Migration Files

**File**: `.claude/hooks/auto_migrate.sh`
```bash
#!/bin/bash

file_path=$(jq -r '.tool_input.file_path')

# Check if it's a new migration file
if echo "$file_path" | grep -q 'database/migrations/.*\.php$'; then
    echo "🔄 New migration detected, running migrations..."
    php artisan migrate
fi
```

Make executable:
```bash
chmod +x .claude/hooks/auto_migrate.sh
```

---

### B. Validate Model Conventions

**File**: `.claude/hooks/validate_model.php`
```php
#!/usr/bin/env php
<?php

$input = json_decode(file_get_contents('php://stdin'), true);
$filePath = $input['tool_input']['file_path'] ?? '';

// Only check model files
if (!str_contains($filePath, 'app/Models/')) {
    exit(0);
}

$content = file_get_contents($filePath);

// Check for required traits
if (!str_contains($content, 'use HasFactory')) {
    echo "⚠️ Model should use HasFactory trait\n";
}

// Check for $fillable or $guarded
if (!str_contains($content, '$fillable') && !str_contains($content, '$guarded')) {
    echo "⚠️ Model should define \$fillable or \$guarded\n";
}

// Check for proper namespace
if (!str_contains($content, 'namespace App\Models;')) {
    echo "❌ Model must be in App\Models namespace\n";
    exit(2);
}

echo "✓ Model validation passed\n";
exit(0);
```

Make executable:
```bash
chmod +x .claude/hooks/validate_model.php
```

---

## 7. NOTIFICATION HOOKS

### Desktop Notification on Long Operations

**File**: `.claude/hooks/notify.sh`
```bash
#!/bin/bash

# For Windows (PowerShell)
if command -v powershell.exe &> /dev/null; then
    powershell.exe -Command "
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.MessageBox]::Show('Claude Code awaiting input', 'Claude Code')
    "
fi

# For Linux (notify-send)
if command -v notify-send &> /dev/null; then
    notify-send 'Claude Code' 'Awaiting your input'
fi

# For macOS (osascript)
if command -v osascript &> /dev/null; then
    osascript -e 'display notification "Awaiting your input" with title "Claude Code"'
fi
```

Make executable:
```bash
chmod +x .claude/hooks/notify.sh
```

**Settings**: Add to `.claude/settings.json`
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/notify.sh"
          }
        ]
      }
    ]
  }
}
```

---

## 8. COMPLETE CONFIGURATION EXAMPLE

### `.claude/settings.json` (Complete)
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|Delete",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/protect_files.py"
          }
        ]
      },
      {
        "matcher": "Bash|PowerShell",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/command_logger.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/format_code.sh"
          },
          {
            "type": "command",
            "command": "./.claude/hooks/validate_component.py"
          },
          {
            "type": "command",
            "command": "./.claude/hooks/validate_model.php"
          },
          {
            "type": "command",
            "command": "./.claude/hooks/validate_migration.php"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/notify.sh"
          }
        ]
      }
    ]
  }
}
```

---

## 9. TESTING HOOKS

### Verify Hook Configuration
```bash
# Check if hooks are registered
cat .claude/settings.json

# Test specific hook
echo '{"tool_input":{"file_path":"test.php"}}' | ./.claude/hooks/protect_files.py
```

### Debug Hooks
Add debug output to hook scripts:
```bash
# Add to beginning of script
echo "DEBUG: Hook triggered" >> .claude/logs/debug.log
echo "DEBUG: File path: $file_path" >> .claude/logs/debug.log
```

---

## 10. HOOK BEST PRACTICES

### Do's
- ✅ Keep hooks fast (< 1 second)
- ✅ Use exit code 0 for success
- ✅ Use exit code 2 to block PreToolUse
- ✅ Log important actions
- ✅ Make scripts executable (`chmod +x`)
- ✅ Add error handling
- ✅ Provide user feedback

### Don'ts
- ❌ Don't run slow operations (CI/CD, full test suites)
- ❌ Don't modify files outside project directory
- ❌ Don't make network calls without timeout
- ❌ Don't block on user input
- ❌ Don't ignore errors silently

---

## 11. TROUBLESHOOTING

### Hook Not Running
```bash
# Check file permissions
ls -la .claude/hooks/

# Make executable
chmod +x .claude/hooks/*.sh
chmod +x .claude/hooks/*.py
chmod +x .claude/hooks/*.php

# Check for syntax errors
bash -n .claude/hooks/script.sh
python3 -m py_compile .claude/hooks/script.py
php -l .claude/hooks/script.php
```

### Hook Blocking Operations
```bash
# Test hook in isolation
echo '{"tool_input":{"file_path":"test.php"}}' | .claude/hooks/protect_files.py
echo $?  # Should be 0 for allow, 2 for block
```

### Performance Issues
```bash
# Time hook execution
time echo '{"tool_input":{"file_path":"test.php"}}' | .claude/hooks/format_code.sh
```

---

## 12. WINDOWS-SPECIFIC NOTES

For PowerShell scripts, save with `.ps1` extension:

**File**: `.claude/hooks/format_code.ps1`
```powershell
$input = Get-Content -Raw | ConvertFrom-Json
$filePath = $input.tool_input.file_path

if ($filePath -match '\.php$') {
    & ./vendor/bin/pint $filePath --quiet
    Write-Host "✓ Formatted PHP: $filePath"
}

if ($filePath -match '\.(ts|tsx|js|jsx)$') {
    & npx prettier --write $filePath --log-level=error
    Write-Host "✓ Formatted TypeScript: $filePath"
}
```

**Settings**:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -File ./.claude/hooks/format_code.ps1"
          }
        ]
      }
    ]
  }
}
```

---

## QUICK REFERENCE

### Hook Events
- `PreToolUse` - Before tool execution (can block)
- `PostToolUse` - After tool execution
- `PermissionRequest` - On permission dialog
- `Notification` - On notification
- `Stop` - After response complete
- `SessionStart` - On session start

### Matchers
- `*` - All tools
- `Edit` - File edits
- `Write` - File writes
- `Delete` - File deletes
- `Bash` - Bash commands
- `PowerShell` - PowerShell commands
- `Edit|Write` - Multiple matchers (OR)

### Exit Codes
- `0` - Success, allow operation
- `1` - Error, but allow operation
- `2` - Block operation (PreToolUse only)

---

## SECURITY CONSIDERATIONS

⚠️ **IMPORTANT**: Hooks run with your environment credentials

- Review all hook code before enabling
- Don't download/run untrusted hooks
- Be cautious with hooks that make network calls
- Protect hook files from unauthorized modification
- Use version control for hook scripts
- Test hooks in safe environment first

---

## RESOURCES

- [Claude Code Hooks Documentation](https://code.claude.com/docs/en/hooks-guide)
- [Example Hooks Repository](https://github.com/anthropics/claude-code/tree/main/examples/hooks)
- Project-specific hooks: `.claude/hooks/`
- Hook logs: `.claude/logs/`
