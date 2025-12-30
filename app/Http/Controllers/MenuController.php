<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class MenuController extends Controller
{
    /**
     * Get menus for sidebar (with role & permission check)
     */
    public function getMenus()
    {
        $user = Auth::user();
        
        if (!$user) {
            // $menus = Menu::all();
            return response()->json([]);
        }
        
        // Get user's role IDs
        $userRoleIds = $user->roles->pluck('id')->toArray();
        $isSuperAdmin = $user->hasRole('super admin');
        
        // Get main menus with their children and nested children and roles (include inactive)
        // Inactive menus will be styled differently in frontend
        $menus = Menu::with(['children.children.roles', 'children.roles', 'roles'])
            ->mainMenus()
            ->orderBy('order')
            ->get()
            ->filter(function ($menu) use ($user, $userRoleIds, $isSuperAdmin) {
                // Check if menu has role restrictions (skip for super admin - they have all permissions)
                if (!$isSuperAdmin) {
                    $menuRoleIds = $menu->roles->pluck('id')->toArray();
                    
                    // If menu has roles assigned, check if user has matching role
                    if (!empty($menuRoleIds) && empty(array_intersect($userRoleIds, $menuRoleIds))) {
                        return false;
                    }
                }
                
                // If menu has permission, check if user has it
                // Super admin will pass because they have all permissions
                if ($menu->permission && !$user->hasPermissionTo($menu->permission)) {
                    return false;
                }
                
                // Filter children by role & permission
                // For super admin: load all children and nested children (they have all permissions)
                if ($isSuperAdmin) {
                    $allChildren = Menu::with(['children.roles'])
                        ->where('parent_id', $menu->id)
                        ->orderBy('order')
                        ->get()
                        ->map(function ($child) {
                            // Load nested children for each child (include inactive)
                            $nestedChildren = Menu::where('parent_id', $child->id)
                                ->orderBy('order')
                                ->get();
                            $child->setRelation('children', $nestedChildren);
                            return $child;
                        });
                    $menu->setRelation('children', $allChildren);
                } else {
                    // For other users: filter by role and permission, and load nested children
                    $menu->setRelation('children', $menu->children->filter(function ($child) use ($user, $userRoleIds, $isSuperAdmin) {
                        // Check child role restrictions
                        $childRoleIds = $child->roles->pluck('id')->toArray();
                        
                        if (!empty($childRoleIds) && empty(array_intersect($userRoleIds, $childRoleIds))) {
                            return false;
                        }
                        
                        // Check child permission (only if active)
                        if ($child->active && $child->permission && !$user->hasPermissionTo($child->permission)) {
                            return false;
                        }
                        
                        // Load and filter nested children (grandchildren)
                        if ($isSuperAdmin) {
                            $nestedChildren = Menu::where('parent_id', $child->id)
                                ->orderBy('order')
                                ->get();
                        } else {
                            $nestedChildren = Menu::where('parent_id', $child->id)
                                ->orderBy('order')
                                ->get()
                                ->filter(function ($nestedChild) use ($user, $userRoleIds) {
                                    // Check nested child role restrictions
                                    $nestedChildRoleIds = $nestedChild->roles->pluck('id')->toArray();
                                    
                                    if (!empty($nestedChildRoleIds) && empty(array_intersect($userRoleIds, $nestedChildRoleIds))) {
                                        return false;
                                    }
                                    
                                    // Check nested child permission (only if active)
                                    if ($nestedChild->active && $nestedChild->permission && !$user->hasPermissionTo($nestedChild->permission)) {
                                        return false;
                                    }
                                    
                                    return true;
                                });
                        }
                        $child->setRelation('children', $nestedChildren);
                        
                        return true;
                    }));
                }
                
                return true;
            })
            ->values();

        return response()->json($menus);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check permission
        if (!Auth::user()->can('read menus')) {
            abort(403, 'Unauthorized action.');
        }

        // Get all menus (main menus and children) in flat structure for DataTable
        $allMenus = Menu::with(['parent', 'positions'])
            ->orderBy('parent_id')
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/Menus/Index', [
            'menus' => $allMenus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check permission
        if (!Auth::user()->can('create menus')) {
            abort(403, 'Unauthorized action.');
        }
        $parents = Menu::whereNull('parent_id')->get(['id', 'name']);
        $roles = Role::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/Menus/Create', [
            'parents' => $parents,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check permission
        if (!Auth::user()->can('create menus')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
            'positions' => 'nullable|array',
            'positions.desktop_sidebar' => 'nullable|boolean',
            'positions.mobile_drawer' => 'nullable|boolean',
            'positions.mobile_bottom' => 'nullable|boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $menu = Menu::create([
                'name' => $validated['name'],
                'icon' => $validated['icon'] ?? null,
                'route' => $validated['route'] ?? null,
                'permission' => $validated['permission'] ?? null,
                'parent_id' => $validated['parent_id'] ?? null,
                'order' => $validated['order'] ?? 0,
                'active' => $validated['active'] ?? true,
            ]);

            // Sync roles
            if (isset($validated['roles'])) {
                $menu->roles()->sync($validated['roles']);
            }

            // Save menu positions
            $positions = $validated['positions'] ?? [];
            $this->syncMenuPositions($menu, $positions);
        });

        return redirect()->route('menus.index')
            ->with('success', 'Menu created successfully');
    }

    /**
     * Sync menu positions
     */
    private function syncMenuPositions(Menu $menu, array $positions)
    {
        // Delete existing positions
        $menu->positions()->delete();

        // Desktop sidebar
        if (!empty($positions['desktop_sidebar'])) {
            MenuPosition::create([
                'menu_id' => $menu->id,
                'device' => 'desktop',
                'position' => 'sidebar',
            ]);
        }

        // Mobile drawer
        if (!empty($positions['mobile_drawer'])) {
            MenuPosition::create([
                'menu_id' => $menu->id,
                'device' => 'mobile',
                'position' => 'drawer',
            ]);
        }

        // Mobile bottom
        if (!empty($positions['mobile_bottom'])) {
            MenuPosition::create([
                'menu_id' => $menu->id,
                'device' => 'mobile',
                'position' => 'bottom',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        return Inertia::render('Admin/Menus/Show', [
            'menu' => $menu->load('children', 'parent'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        // Check permission
        if (!Auth::user()->can('update menus')) {
            abort(403, 'Unauthorized action.');
        }
        $parents = Menu::where('id', '!=', $menu->id)
            ->whereNull('parent_id')
            ->get(['id', 'name']);

        $roles = Role::orderBy('name')->get(['id', 'name']);
        $menu->load(['positions', 'roles']);

        // Format positions for frontend
        $positions = [
            'desktop_sidebar' => $menu->positions->where('device', 'desktop')->where('position', 'sidebar')->isNotEmpty(),
            'mobile_drawer' => $menu->positions->where('device', 'mobile')->where('position', 'drawer')->isNotEmpty(),
            'mobile_bottom' => $menu->positions->where('device', 'mobile')->where('position', 'bottom')->isNotEmpty(),
        ];

        // Get selected role IDs
        $selectedRoles = $menu->roles->pluck('id')->toArray();

        return Inertia::render('Admin/Menus/Edit', [
            'menu' => $menu,
            'parents' => $parents,
            'positions' => $positions,
            'roles' => $roles,
            'selectedRoles' => $selectedRoles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        // Check permission
        if (!Auth::user()->can('update menus')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
            'positions' => 'nullable|array',
            'positions.desktop_sidebar' => 'nullable|boolean',
            'positions.mobile_drawer' => 'nullable|boolean',
            'positions.mobile_bottom' => 'nullable|boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        DB::transaction(function () use ($validated, $menu) {
            $menu->update([
                'name' => $validated['name'],
                'icon' => $validated['icon'] ?? null,
                'route' => $validated['route'] ?? null,
                'permission' => $validated['permission'] ?? null,
                'parent_id' => $validated['parent_id'] ?? null,
                'order' => $validated['order'] ?? 0,
                'active' => $validated['active'] ?? true,
            ]);

            // Sync roles
            if (isset($validated['roles'])) {
                $menu->roles()->sync($validated['roles']);
            } else {
                $menu->roles()->sync([]);
            }

            // Sync menu positions
            $positions = $validated['positions'] ?? [];
            $this->syncMenuPositions($menu, $positions);
        });

        return redirect()->route('menus.index')
            ->with('success', 'Menu updated successfully');
    }

    /**
     * Toggle active status of the menu
     */
    public function toggleActive(Menu $menu)
    {
        $menu->update([
            'active' => !$menu->active
        ]);

        return back()->with('success', 'Menu status updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        // Check permission
        if (!Auth::user()->can('delete menus')) {
            abort(403, 'Unauthorized action.');
        }

        $menu->delete();

        return redirect()->route('menus.index')
            ->with('success', 'Menu deleted successfully');
    }
}
