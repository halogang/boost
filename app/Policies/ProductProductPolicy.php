<?php

namespace App\Policies;

use App\Models\ProductProduct;
use App\Models\User;

class ProductProductPolicy
{
    /**
     * Determine whether the user can view any products.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('read product');
    }

    /**
     * Determine whether the user can view the product.
     */
    public function view(User $user, ProductProduct $product): bool
    {
        return $user->hasPermissionTo('read product');
    }

    /**
     * Determine whether the user can create products.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create product');
    }

    /**
     * Determine whether the user can update the product.
     */
    public function update(User $user, ProductProduct $product): bool
    {
        return $user->hasPermissionTo('update product');
    }

    /**
     * Determine whether the user can delete the product.
     */
    public function delete(User $user, ProductProduct $product): bool
    {
        return $user->hasPermissionTo('delete product');
    }
}

