<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display role-based permission management
     */
    public function index()
    {
        // Get all roles with their permissions
        $roles = Role::with('permissions')->orderBy('name')->get();
        
        // Get all permissions grouped by resource
        $allPermissions = Permission::orderBy('name')->get();
        
        // Group permissions by resource
        $groupedPermissions = $allPermissions->groupBy(function ($permission) {
            // Extract resource name from permission name (e.g., "read users" -> "users")
            $parts = explode(' ', $permission->name);
            return end($parts); // Get last part (resource name)
        });
        
        // Transform roles with grouped permissions for easier access
        $rolesData = $roles->map(function ($role) use ($groupedPermissions) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('id')->toArray(),
                'permissions_count' => $role->permissions->count(),
            ];
        });

        return Inertia::render('Admin/Permissions/Index', [
            'roles' => $rolesData,
            'allPermissions' => $allPermissions,
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    /**
     * Update role permissions
     */
    public function updateRolePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // Get permission IDs and names
        $permissions = Permission::whereIn('id', $validated['permissions'] ?? [])->pluck('name')->toArray();

        // Sync permissions for the role
        $role->syncPermissions($permissions);

        return back()->with('success', "Permissions for '{$role->name}' role updated successfully");
    }

    /**
     * Get matrix data as JSON (for API)
     */
    public function getMatrix()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::orderBy('name')->get();

        // Build matrix
        $matrix = [];
        foreach ($permissions as $permission) {
            $row = [
                'id' => $permission->id,
                'name' => $permission->name,
            ];

            foreach ($roles as $role) {
                $row['role_' . $role->id] = $role->permissions->contains('id', $permission->id);
            }

            $matrix[] = $row;
        }

        return response()->json([
            'roles' => $roles,
            'matrix' => $matrix,
        ]);
    }

    /**
     * Toggle permission for a role (via AJAX)
     */
    public function togglePermission(Request $request)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
        ]);

        $role = Role::find($validated['role_id']);
        $permission = Permission::find($validated['permission_id']);

        if ($role->hasPermissionTo($permission)) {
            $role->revokePermissionTo($permission);
            $hasPermission = false;
        } else {
            $role->givePermissionTo($permission);
            $hasPermission = true;
        }

        return response()->json([
            'success' => true,
            'hasPermission' => $hasPermission,
            'message' => $hasPermission
                ? "Permission '{$permission->name}' added to '{$role->name}' role"
                : "Permission '{$permission->name}' removed from '{$role->name}' role",
        ]);
    }
}
