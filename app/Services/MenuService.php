<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\User;
use Illuminate\Support\Collection;

class MenuService
{
    /**
     * Get menus filtered by device, position, and user permissions
     *
     * @param string $device 'desktop' or 'mobile'
     * @param string $position 'sidebar', 'bottom', or 'drawer'
     * @param User|null $user
     * @return Collection
     */
    public function getMenus(string $device, string $position, ?User $user = null): Collection
    {
        $query = Menu::with(['children' => function ($query) use ($user) {
                // Load active children and filter by permissions
                $query->where('active', true)
                      ->orderBy('order');
            }])
            // ->active()
            ->mainMenus()
            ->forPosition($device, $position);

        $menus = $query->get();

        // Filter menus based on permissions
        return $menus->filter(function ($menu) use ($user) {
            return $this->canAccessMenu($menu, $user);
        })->map(function ($menu) use ($user) {
            // Filter children based on permissions
            if ($menu->children->isNotEmpty()) {
                $menu->setRelation(
                    'children',
                    $menu->children->filter(function ($child) use ($user) {
                        return $this->canAccessMenu($child, $user);
                    })
                );
            }
            return $menu;
        })->values();
    }

    /**
     * Check if user can access a menu based on permission
     *
     * @param Menu $menu
     * @param User|null $user
     * @return bool
     */
    protected function canAccessMenu(Menu $menu, ?User $user): bool
    {
        // If menu has no permission requirement, it's public
        if (empty($menu->permission)) {
            return true;
        }

        // If no user is provided, menu is not accessible
        if (!$user) {
            return false;
        }

        // Check if user has the required permission
        return $user->can($menu->permission);
    }

    /**
     * Get sidebar menus for desktop
     */
    public function getDesktopSidebar(?User $user = null): Collection
    {
        return $this->getMenus('desktop', 'sidebar', $user);
    }

    /**
     * Get bottom navigation menus for mobile
     */
    public function getMobileBottom(?User $user = null): Collection
    {
        return $this->getMenus('mobile', 'bottom', $user);
    }

    /**
     * Get drawer menus for mobile
     */
    public function getMobileDrawer(?User $user = null): Collection
    {
        return $this->getMenus('mobile', 'drawer', $user);
    }

    /**
     * Build menu tree structure for frontend
     *
     * @param Collection $menus
     * @return array
     */
    public function buildMenuTree(Collection $menus): array
    {
        return $menus->map(function ($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
                'key' => $menu->key,
                'icon' => $menu->icon,
                'route' => $menu->route,
                'children' => $this->buildMenuTree($menu->children ?? collect()),
            ];
        })->toArray();
    }
}
