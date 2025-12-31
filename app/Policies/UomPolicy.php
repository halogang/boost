<?php

namespace App\Policies;

use App\Models\Uom;
use App\Models\User;

class UomPolicy
{
    /**
     * Determine whether the user can view any UOMs.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('read uom');
    }

    /**
     * Determine whether the user can view the UOM.
     */
    public function view(User $user, Uom $uom): bool
    {
        return $user->hasPermissionTo('read uom');
    }

    /**
     * Determine whether the user can create UOMs.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create uom');
    }

    /**
     * Determine whether the user can update the UOM.
     */
    public function update(User $user, Uom $uom): bool
    {
        return $user->hasPermissionTo('update uom');
    }

    /**
     * Determine whether the user can delete the UOM.
     */
    public function delete(User $user, Uom $uom): bool
    {
        return $user->hasPermissionTo('delete uom');
    }
}

