<?php

namespace App\Policies;

use App\Models\User;

class SettingsPolicy
{
    /**
     * Determine whether the user can view system settings.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('read settings') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update system settings.
     */
    public function update(User $user): bool
    {
        return $user->hasPermissionTo('update settings') || $user->hasRole('admin');
    }
}

