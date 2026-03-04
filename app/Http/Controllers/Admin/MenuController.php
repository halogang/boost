<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Menu\StoreMenuRequest;
use App\Http\Requests\Menu\UpdateMenuRequest;
use App\Models\Menu;
use App\Services\MenuService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function __construct(
        protected MenuService $menuService
    ) {}

    /**
     * GET /api/menus â€“ sidebar menus filtered by role & permission.
     */
    public function getMenus()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([]);
        }

        return response()->json($this->menuService->getMenusForApi($user));
    }

    /**
     * GET /menus
     */
    public function index()
    {
        $this->authorize('viewAny', Menu::class);

        return Inertia::render('Admin/Menus/Index', [
            'menus' => $this->menuService->getAllMenusForAdmin(),
        ]);
    }

    /**
     * GET /menus/create
     */
    public function create()
    {
        $this->authorize('create', Menu::class);

        return Inertia::render('Admin/Menus/Create', $this->menuService->getCreateFormData());
    }

    /**
     * POST /menus
     */
    public function store(StoreMenuRequest $request)
    {
        $this->menuService->createMenu($request->validated());

        return redirect()->route('menus.index')->with('success', 'Menu berhasil dibuat');
    }

    /**
     * GET /menus/{menu}
     */
    public function show(Menu $menu)
    {
        $this->authorize('view', $menu);

        return Inertia::render('Admin/Menus/Show', [
            'menu' => $menu->load('children', 'parent'),
        ]);
    }

    /**
     * GET /menus/{menu}/edit
     */
    public function edit(Menu $menu)
    {
        $this->authorize('update', $menu);

        return Inertia::render('Admin/Menus/Edit', $this->menuService->getEditFormData($menu));
    }

    /**
     * PUT /menus/{menu}
     */
    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $this->menuService->updateMenu($menu, $request->validated());

        return redirect()->route('menus.index')->with('success', 'Menu berhasil diperbarui');
    }

    /**
     * POST /menus/{menu}/toggle-active
     */
    public function toggleActive(Menu $menu)
    {
        $this->authorize('update', $menu);

        $this->menuService->toggleActive($menu);

        return back()->with('success', 'Status menu berhasil diperbarui');
    }

    /**
     * DELETE /menus/{menu}
     */
    public function destroy(Menu $menu)
    {
        $this->authorize('delete', $menu);

        $this->menuService->deleteMenu($menu);

        return redirect()->route('menus.index')->with('success', 'Menu berhasil dihapus');
    }
}
