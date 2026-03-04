<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\GeneralNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\DatabaseNotification;

class NotificationService
{
    /**
     * Send a general in-app notification to a specific user.
     */
    public function send(
        User $user,
        string $title,
        string $message,
        string $type = 'info',
        ?string $actionUrl = null,
        ?string $actionLabel = null,
    ): void {
        $user->notify(new GeneralNotification($title, $message, $type, $actionUrl, $actionLabel));
    }

    /**
     * Send the same notification to multiple users.
     */
    public function sendToMany(
        iterable $users,
        string $title,
        string $message,
        string $type = 'info',
        ?string $actionUrl = null,
        ?string $actionLabel = null,
    ): void {
        foreach ($users as $user) {
            $this->send($user, $title, $message, $type, $actionUrl, $actionLabel);
        }
    }

    /**
     * Send a notification to all users.
     */
    public function broadcast(
        string $title,
        string $message,
        string $type = 'info',
        ?string $actionUrl = null,
        ?string $actionLabel = null,
    ): void {
        $this->sendToMany(User::all(), $title, $message, $type, $actionUrl, $actionLabel);
    }

    /**
     * Get paginated notifications for a user.
     */
    public function getForUser(User $user, int $perPage = 15): \Illuminate\Pagination\LengthAwarePaginator
    {
        return $user->notifications()->paginate($perPage);
    }

    /**
     * Get latest unread notifications for a user (used in header dropdown).
     */
    public function getRecentUnread(User $user, int $limit = 10): Collection
    {
        return $user->unreadNotifications()->latest()->limit($limit)->get();
    }

    /**
     * Count unread notifications for a user.
     */
    public function countUnread(User $user): int
    {
        return $user->unreadNotifications()->count();
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(User $user, string $notificationId): bool
    {
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (! $notification) {
            return false;
        }

        $notification->markAsRead();

        return true;
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead(User $user): void
    {
        $user->unreadNotifications()->update(['read_at' => now()]);
    }

    /**
     * Delete a notification.
     */
    public function delete(User $user, string $notificationId): bool
    {
        return (bool) $user->notifications()->where('id', $notificationId)->delete();
    }

    /**
     * Delete all read notifications for a user.
     */
    public function deleteAllRead(User $user): void
    {
        $user->notifications()->whereNotNull('read_at')->delete();
    }

    /**
     * Format a notification for JSON/Inertia output.
     */
    public function format(DatabaseNotification $notification): array
    {
        return [
            'id'           => $notification->id,
            'title'        => $notification->data['title'] ?? '',
            'message'      => $notification->data['message'] ?? '',
            'type'         => $notification->data['type'] ?? 'info',
            'action_url'   => $notification->data['action_url'] ?? null,
            'action_label' => $notification->data['action_label'] ?? null,
            'read'         => ! is_null($notification->read_at),
            'created_at'   => $notification->created_at->diffForHumans(),
        ];
    }
}
