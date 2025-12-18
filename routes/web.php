<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ===== PUBLIC API ROUTES =====
Route::middleware('auth')->group(function () {
    Route::get('/api/menus', [MenuController::class, 'getMenus']);
    Route::get('/api/permissions/matrix', [PermissionController::class, 'getMatrix']);
    Route::post('/api/permissions/toggle', [PermissionController::class, 'togglePermission']);
});

// ===== ADMIN ROUTES (User Management, Roles, System) =====
Route::middleware(['auth'])->group(function () {
    // Users CRUD
    Route::resource('users', UserController::class);
    
    // Roles & Permissions
    Route::get('/roles', function () {
        return Inertia::render('Admin/Roles/Index');
    })->name('roles.index');
    
    // System Settings
    Route::get('/system', function () {
        return Inertia::render('Admin/System/Index');
    })->name('system.index');
    
    // Audit Log
    Route::get('/audit', function () {
        return Inertia::render('Admin/Audit/Index');
    })->name('audit.index');
    
    // Menus CRUD
    Route::resource('menus', MenuController::class);
    
    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions/roles/{role}', [PermissionController::class, 'updateRolePermissions'])->name('permissions.update');
});

// ===== APPLICATION ROUTES =====
Route::middleware(['auth'])->group(function () {
    // Orders
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard/Index');
    })->name('dashboard');
    
    Route::get('/orders', function () {
        return Inertia::render('Orders/Index');
    })->name('orders.index');
    
    // Products
    Route::get('/products', function () {
        return Inertia::render('Products/Index');
    })->name('products.index');
    
    // Stock
    Route::get('/stock', function () {
        return Inertia::render('Stock/Index');
    })->name('stock.index');
    
    // Reports
    Route::get('/reports', function () {
        return Inertia::render('Reports/Index');
    })->name('reports.index');
    
    // Notifications
    Route::get('/notifications', function () {
        return Inertia::render('Notifications/Index');
    })->name('notifications.index');
    
    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/profile', function () {
            return Inertia::render('Settings/Profile');
        })->name('profile');
        
        Route::get('/security', function () {
            return Inertia::render('Settings/Security');
        })->name('security');
        
        Route::get('/preferences', function () {
            return Inertia::render('Settings/Preferences');
        })->name('preferences');
    });
});

require __DIR__.'/auth.php';
