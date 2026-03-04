<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GeneralNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $title,
        protected string $message,
        protected string $type = 'info',  // info | success | warning | danger
        protected ?string $actionUrl = null,
        protected ?string $actionLabel = null,
    ) {}

    /**
     * Delivery channels: only 'database' for in-app notifications.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Data stored in the notifications table.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title'        => $this->title,
            'message'      => $this->message,
            'type'         => $this->type,
            'action_url'   => $this->actionUrl,
            'action_label' => $this->actionLabel,
        ];
    }
}
