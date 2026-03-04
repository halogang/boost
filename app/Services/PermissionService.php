<?php

namespace App\Services;

use App\Constants\Permissions;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionService
{
    /**
     * Get all data needed for the permissions management page.
     */
    public function getPermissionsPageData(): array
    {
        $allPermissions = Permission::orderBy('module')->orderBy('name')->get();

        // Group by module, falling back to 'Lainnya' for unassigned permissions
        $groupedPermissions = $allPermissions->groupBy(function ($permission) {
            return $permission->module ?: 'Lainnya';
        });

        $rolesData = Role::with('permissions')->orderBy('name')->get()
            ->map(fn($role) => [
                'id'                 => $role->id,
                'name'               => $role->name,
                'permissions'        => $role->permissions->pluck('id')->toArray(),
                'permissions_count'  => $role->permissions->count(),
            ]);

        return [
            'roles'              => $rolesData,
            'allPermissions'     => $allPermissions,
            'groupedPermissions' => $groupedPermissions,
        ];
    }

    /**
     * Sync permissions for a role.
     */
    public function syncRolePermissions(Role $role, array $permissionIds): void
    {
        $permissions = Permission::whereIn('id', $permissionIds)->pluck('name')->toArray();
        $role->syncPermissions($permissions);
    }

    /**
     * Toggle a single permission on a role. Returns whether the role now has the permission.
     */
    public function togglePermission(Role $role, Permission $permission): bool
    {
        if ($role->hasPermissionTo($permission)) {
            $role->revokePermissionTo($permission);
            return false;
        }

        $role->givePermissionTo($permission);
        return true;
    }

    /**
     * Get permission matrix as JSON-ready array.
     */
    public function getMatrix(): array
    {
        $roles       = Role::with('permissions')->get();
        $permissions = Permission::orderBy('module')->orderBy('name')->get();

        $matrix = $permissions->map(function ($permission) use ($roles) {
            $row = ['id' => $permission->id, 'name' => $permission->name, 'module' => $permission->module];
            foreach ($roles as $role) {
                $row['role_' . $role->id] = $role->permissions->contains('id', $permission->id);
            }
            return $row;
        })->values()->toArray();

        return [
            'roles'  => $roles,
            'matrix' => $matrix,
        ];
    }

    /**
     * Sync module column for all permissions based on Permissions constants.
     */
    public function syncPermissionModules(): void
    {
        $moduleMap = Permissions::moduleMap();

        foreach ($moduleMap as $permissionName => $moduleName) {
            Permission::where('name', $permissionName)
                ->update(['module' => $moduleName]);
        }
    }
}
