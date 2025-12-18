<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display permission matrix
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::orderBy('name')->get();

        // Group permissions by resource
        $groupedPermissions = $permissions->groupBy(function ($permission) {
            // Extract resource name from permission name (e.g., "read users" -> "users")
            $parts = explode(' ', $permission->name);
            return end($parts); // Get last part (resource name)
        });

        return Inertia::render('Admin/Permissions/Index', [
            'roles' => $roles,
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
