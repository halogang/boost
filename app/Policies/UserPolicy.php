<?php

namespace App\Policies;

use App\Constants\Permissions;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::READ_USERS);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermissionTo(Permissions::READ_USERS);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::CREATE_USERS);
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasPermissionTo(Permissions::UPDATE_USERS);
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasPermissionTo(Permissions::DELETE_USERS);
    }
}

