<?php

namespace App\Policies;

use App\Constants\Permissions;
use App\Models\User;

class SettingsPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::READ_SETTINGS);
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::UPDATE_SETTINGS);
    }
}

