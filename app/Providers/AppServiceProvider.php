<?php

namespace App\Providers;

use App\Models\Settings;
use App\Services\MenuService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register MenuService as singleton
        $this->app->singleton(MenuService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Share settings to all views (for app.blade.php)
        View::composer('*', function ($view) {
            $view->with('settings', [
                'primary_color' => Settings::get('primary_color', '#2563eb'),
            ]);
        });

        // Share user data and navigation menus with Inertia
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();
                return [
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'roles' => $user->getRoleNames()->toArray(),
                        'permissions' => $user->getPermissionNames()->toArray(),
                    ] : null,
                ];
            },
            
            // Share navigation menus (permission-filtered)
            'navigation' => function () {
                $user = Auth::user();
                $menuService = app(MenuService::class);
                
                return [
                    'sidebar' => $menuService->getDesktopSidebar($user),
                    'bottom' => $menuService->getMobileBottom($user),
                    'drawer' => $menuService->getMobileDrawer($user),
                ];
            },
            
            // Share system settings
            'settings' => function () {
                return [
                    'primary_color' => Settings::get('primary_color', '#2563eb'),
                ];
            },
        ]);
    }
}
