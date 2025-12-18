<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Get menus for sidebar (with permission check)
     */
    public function getMenus()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([]);
        }
        
        // Get main menus with their children
        $menus = Menu::with('children')
            ->mainMenus()
            ->active()
            ->get()
            ->filter(function ($menu) use ($user) {
                // If menu has permission, check if user has it
                if ($menu->permission && !$user->hasPermissionTo($menu->permission)) {
                    return false;
                }
                
                // Filter children by permission
                $menu->children = $menu->children->filter(function ($child) use ($user) {
                    if ($child->permission && !$user->hasPermissionTo($child->permission)) {
                        return false;
                    }
                    return true;
                });
                
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
        $menus = Menu::with('children', 'parent')
            ->mainMenus()
            ->get();

        return Inertia::render('Admin/Menus/Index', [
            'menus' => $menus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $parents = Menu::whereNull('parent_id')->get(['id', 'name']);
        
        return Inertia::render('Admin/Menus/Create', [
            'parents' => $parents,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer|min:0',
        ]);

        Menu::create($validated);

        return redirect()->route('menus.index')
            ->with('success', 'Menu created successfully');
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
        $parents = Menu::where('id', '!=', $menu->id)
            ->whereNull('parent_id')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Menus/Edit', [
            'menu' => $menu,
            'parents' => $parents,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'permission' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer|min:0',
            'active' => 'nullable|boolean',
        ]);

        $menu->update($validated);

        return redirect()->route('menus.index')
            ->with('success', 'Menu updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return redirect()->route('menus.index')
            ->with('success', 'Menu deleted successfully');
    }
}
