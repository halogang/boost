<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuRolePosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class MenuRolePositionController extends Controller
{
    /**
     * Display the menu role positions management page
     */
    public function index()
    {
        // Check permission
        if (!Auth::user()->can('read menu-role-positions')) {
            abort(403, 'Unauthorized action.');
        }

        $roles = Role::orderBy('name')->get(['id', 'name']);
        $menus = Menu::whereNull('parent_id')
            ->orderBy('order')
            ->get(['id', 'name', 'icon', 'route', 'parent_id', 'order', 'active']);

        // Get all menu role positions
        $menuRolePositions = MenuRolePosition::with(['menu', 'role'])
            ->get()
            ->groupBy('role_id');

        // Format data for frontend
        $roleMenus = $roles->map(function ($role) use ($menus, $menuRolePositions) {
            $rolePositions = $menuRolePositions->get($role->id, collect());
            
            return [
                'id' => $role->id,
                'name' => $role->name,
                'menus' => $menus->map(function ($menu) use ($rolePositions, $role) {
                    $positions = $rolePositions->where('menu_id', $menu->id);
                    
                    return [
                        'id' => $menu->id,
                        'name' => $menu->name,
                        'icon' => $menu->icon,
                        'route' => $menu->route,
                        'parent_id' => $menu->parent_id,
                        'order' => $menu->order,
                        'active' => $menu->active,
                        'positions' => [
                            'desktop_sidebar' => $positions->where('device', 'desktop')->where('position', 'sidebar')->isNotEmpty(),
                            'mobile_drawer' => $positions->where('device', 'mobile')->where('position', 'drawer')->isNotEmpty(),
                            'mobile_bottom' => $positions->where('device', 'mobile')->where('position', 'bottom')->isNotEmpty(),
                        ],
                    ];
                }),
            ];
        });

        return Inertia::render('Admin/MenuRolePositions/Index', [
            'roles' => $roleMenus,
        ]);
    }

    /**
     * Update menu positions for a specific role
     */
    public function updateRolePositions(Request $request, Role $role)
    {
        // Check permission
        if (!Auth::user()->can('update menu-role-positions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.positions' => 'required|array',
            'menus.*.positions.desktop_sidebar' => 'nullable|boolean',
            'menus.*.positions.mobile_drawer' => 'nullable|boolean',
            'menus.*.positions.mobile_bottom' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($role, $validated) {
            // Delete all existing positions for this role
            MenuRolePosition::where('role_id', $role->id)->delete();

            // Create new positions
            foreach ($validated['menus'] as $menuData) {
                $menuId = $menuData['id'];
                $positions = $menuData['positions'] ?? [];

                // Desktop sidebar
                if (!empty($positions['desktop_sidebar'])) {
                    MenuRolePosition::create([
                        'menu_id' => $menuId,
                        'role_id' => $role->id,
                        'device' => 'desktop',
                        'position' => 'sidebar',
                    ]);
                }

                // Mobile drawer
                if (!empty($positions['mobile_drawer'])) {
                    MenuRolePosition::create([
                        'menu_id' => $menuId,
                        'role_id' => $role->id,
                        'device' => 'mobile',
                        'position' => 'drawer',
                    ]);
                }

                // Mobile bottom
                if (!empty($positions['mobile_bottom'])) {
                    MenuRolePosition::create([
                        'menu_id' => $menuId,
                        'role_id' => $role->id,
                        'device' => 'mobile',
                        'position' => 'bottom',
                    ]);
                }
            }
        });

        return back()->with('success', 'Menu positions untuk role berhasil diperbarui.');
    }
}
