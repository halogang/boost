<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\MenuRolePositionController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing/Index');
})->name('landing');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ===== API ROUTES =====
Route::middleware('auth')->group(function () {
    Route::get('/api/menus', [MenuController::class, 'getMenus']);
    Route::get('/api/permissions/matrix', [PermissionController::class, 'getMatrix']);
    Route::post('/api/permissions/toggle', [PermissionController::class, 'togglePermission']);
    Route::get('/api/settings', [SettingsController::class, 'getAll'])->name('settings.getAll');
});

// ===== MANAGEMENT ROUTES (User Management, Roles, System) =====
Route::middleware(['auth'])->group(function () {
    // Users CRUD
    Route::resource('users', UserController::class);
    
    // Roles & Permissions
    Route::get('/roles', function () {
        return Inertia::render('Admin/Roles/Index');
    })->name('roles.index');
    
    // System Settings
    Route::get('/system', [SettingsController::class, 'index'])->name('system.index');
    Route::post('/system', [SettingsController::class, 'update'])->name('system.update');
    
    // Audit Log
    Route::get('/audit', function () {
        return Inertia::render('Admin/Audit/Index');
    })->name('audit.index');
    
    // Menus CRUD
    Route::resource('menus', MenuController::class);
    Route::post('/menus/{menu}/toggle-active', [MenuController::class, 'toggleActive'])->name('menus.toggle-active');
    
    // Menu Role Positions Management
    Route::get('/menu-role-positions', [MenuRolePositionController::class, 'index'])->name('menu-role-positions.index');
    Route::post('/menu-role-positions/roles/{role}', [MenuRolePositionController::class, 'updateRolePositions'])->name('menu-role-positions.update');
    
    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::post('/permissions/roles/{role}', [PermissionController::class, 'updateRolePermissions'])->name('permissions.update');
});

// ===== APPLICATION ROUTES =====
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard/Index');
    })->name('dashboard');
    
    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/profile', [UserProfileController::class, 'index'])->name('profile');
        Route::put('/profile', [UserProfileController::class, 'updateProfile'])->name('profile.update');
        Route::put('/password', [UserProfileController::class, 'updatePassword'])->name('password.update');
        
        Route::get('/preferences', function () {
            return Inertia::render('Settings/Preferences');
        })->name('preferences');
    });
});

require __DIR__.'/auth.php';
