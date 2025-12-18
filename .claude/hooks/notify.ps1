# Notification Hook
# Shows desktop notification when Claude needs input

try {
    Add-Type -AssemblyName System.Windows.Forms

    # Create notification
    $notification = New-Object System.Windows.Forms.NotifyIcon
    $notification.Icon = [System.Drawing.SystemIcons]::Information
    $notification.BalloonTipTitle = "Claude Code"
    $notification.BalloonTipText = "Awaiting your input"
    $notification.Visible = $true

    # Show notification
    $notification.ShowBalloonTip(3000)

    # Cleanup
    Start-Sleep -Seconds 1
    $notification.Dispose()

    exit 0
}
catch {
    # Silently fail if notifications not supported
    exit 0
}
