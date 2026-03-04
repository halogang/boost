<?php

namespace App\Policies;

use App\Constants\Permissions;
use App\Models\Menu;
use App\Models\User;

class MenuPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::READ_MENUS);
    }

    public function view(User $user, Menu $menu): bool
    {
        return $user->hasPermissionTo(Permissions::READ_MENUS);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permissions::CREATE_MENUS);
    }

    public function update(User $user, Menu $menu): bool
    {
        return $user->hasPermissionTo(Permissions::UPDATE_MENUS);
    }

    public function delete(User $user, Menu $menu): bool
    {
        return $user->hasPermissionTo(Permissions::DELETE_MENUS);
    }
}
