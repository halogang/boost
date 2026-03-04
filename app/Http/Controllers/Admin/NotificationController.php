<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Get recent unread notifications (for header dropdown).
     */
    public function recent(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $notifications = $this->notificationService
            ->getRecentUnread($user, 10)
            ->map(fn ($n) => $this->notificationService->format($n));

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $this->notificationService->countUnread($user),
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $success = $this->notificationService->markAsRead($user, $id);

        return response()->json([
            'success'     => $success,
            'unread_count' => $this->notificationService->countUnread($user),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $this->notificationService->markAllAsRead($user);

        return response()->json(['success' => true, 'unread_count' => 0]);
    }

    /**
     * Delete a single notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $success = $this->notificationService->delete($user, $id);

        return response()->json([
            'success'      => $success,
            'unread_count' => $this->notificationService->countUnread($user),
        ]);
    }
}
