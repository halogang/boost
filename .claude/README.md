# .claude Directory

This directory contains Claude Copilot hooks and configurations for automated code quality checks.

## Structure

```
.claude/
├── settings.json          # Hook configuration
├── hooks/                 # Hook scripts
│   ├── protect_files.ps1      # Protects sensitive files from modification
│   ├── format_code.ps1        # Auto-formats PHP and TypeScript
│   ├── command_logger.ps1     # Logs executed commands
│   ├── notify.ps1             # Desktop notifications
│   ├── validate_model.ps1     # Validates Laravel models
│   └── validate_component.ps1 # Validates React components
└── logs/                  # Log files
    └── commands.log       # Command execution log
```

## What Are Hooks?

Hooks are automated scripts that run at specific points in Claude's workflow:
- **PreToolUse**: Before file edits/commands (can block)
- **PostToolUse**: After file edits (formatting, validation)
- **Notification**: When Claude needs input

## Enabled Hooks

### 1. File Protection (PreToolUse)
Blocks modifications to:
- `.env` files
- Lock files (`composer.lock`, `package-lock.json`, `bun.lock`)
- `.git` directory
- `vendor` and `node_modules` directories

### 2. Code Formatting (PostToolUse)
Automatically formats:
- **PHP files**: Laravel Pint (PSR-12)
- **TypeScript/React files**: Prettier

### 3. Command Logger (PreToolUse)
Logs all terminal commands to `.claude/logs/commands.log`

### 4. Notifications
Shows desktop notification when Claude needs input

### 5. Validators (Optional)
- Laravel Model validator
- React Component validator

## Usage

Hooks are automatically triggered by Claude Code. No manual intervention needed.

## Logs

Command logs are stored in `.claude/logs/commands.log`

## Troubleshooting

If hooks aren't working:
```powershell
# Check PowerShell execution policy
Get-ExecutionPolicy

# If restricted, allow scripts for this project
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Documentation

See [CLAUDE_HOOKS_GUIDE.md](../CLAUDE_HOOKS_GUIDE.md) for detailed documentation.
