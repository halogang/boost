<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permission\TogglePermissionRequest;
use App\Http\Requests\Permission\UpdateRolePermissionsRequest;
use App\Services\PermissionService;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * GET /permissions
     */
    public function index()
    {
        $this->authorize('viewAny', Permission::class);

        return Inertia::render('Admin/Permissions/Index', $this->permissionService->getPermissionsPageData());
    }

    /**
     * POST /permissions/roles/{role}
     */
    public function updateRolePermissions(UpdateRolePermissionsRequest $request, Role $role)
    {
        $this->permissionService->syncRolePermissions($role, $request->input('permissions', []));

        return back()->with('success', "Permissions untuk role '{$role->name}' berhasil diperbarui");
    }

    /**
     * GET /api/permissions/matrix
     */
    public function getMatrix()
    {
        $this->authorize('viewAny', Permission::class);

        return response()->json($this->permissionService->getMatrix());
    }

    /**
     * POST /api/permissions/toggle
     */
    public function togglePermission(TogglePermissionRequest $request)
    {
        $role       = Role::find($request->input('role_id'));
        $permission = Permission::find($request->input('permission_id'));

        $hasPermission = $this->permissionService->togglePermission($role, $permission);

        return response()->json([
            'success'       => true,
            'hasPermission' => $hasPermission,
            'message'       => $hasPermission
                ? "Permission '{$permission->name}' ditambahkan ke role '{$role->name}'"
                : "Permission '{$permission->name}' dihapus dari role '{$role->name}'",
        ]);
    }
}
