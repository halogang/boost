<?php

namespace App\Policies;

use App\Constants\Permissions;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class PermissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::READ_PERMISSIONS);
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::READ_PERMISSIONS);
    }
}
