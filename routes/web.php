<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UomController;
use App\Http\Controllers\ProductProductController;
use App\Http\Controllers\Purchase\PurchaseOrderController;
use App\Http\Controllers\Purchase\StockPickingController;
use App\Http\Controllers\Purchase\AccountMoveController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing/Index');
})->name('landing');

// Order Page (Public) - Mock only, no backend
Route::get('/order', function () {
    return Inertia::render('Order/Index', [
        'orderType' => request()->query('type', 'regular') === 'partnership' ? 'partnership' : 'regular',
    ]);
})->name('order.index');


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
    Route::get('/api/settings', [SettingsController::class, 'getAll'])->name('settings.getAll');
    
    // Audit Log
    Route::get('/audit', function () {
        return Inertia::render('Admin/Audit/Index');
    })->name('audit.index');
    
    // Menus CRUD
    Route::resource('menus', MenuController::class);
    Route::post('/menus/{menu}/toggle-active', [MenuController::class, 'toggleActive'])->name('menus.toggle-active');
    
    // Menu Role Positions Management
    Route::get('/menu-role-positions', [\App\Http\Controllers\MenuRolePositionController::class, 'index'])->name('menu-role-positions.index');
    Route::post('/menu-role-positions/roles/{role}', [\App\Http\Controllers\MenuRolePositionController::class, 'updateRolePositions'])->name('menu-role-positions.update');
    
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
    
    // Pembelian (Purchasing)
    Route::get('/purchasing', function () {
        return Inertia::render('Purchasing/Index');
    })->name('purchasing.index');
    
    // Inventori (Inventory)
    Route::get('/inventory', function () {
        return Inertia::render('Inventory/Index');
    })->name('inventory.index');
    
    // Produksi (Manufacturing)
    Route::get('/manufacturing', function () {
        return Inertia::render('Manufacturing/Index');
    })->name('manufacturing.index');
    
    // Distribusi (Distribution)
    Route::get('/distribution', function () {
        return Inertia::render('Distribution/Index');
    })->name('distribution.index');
    
    // Penjualan (Sales)
    Route::get('/sales', function () {
        return Inertia::render('Sales/Index');
    })->name('sales.index');
    
    // HR & Kehadiran (HR & Attendance)
    Route::get('/hr', function () {
        return Inertia::render('HR/Index');
    })->name('hr.index');
    
    // Keuangan (Finance)
    Route::get('/finance', function () {
        return Inertia::render('Finance/Index');
    })->name('finance.index');
    
    // CRM
    Route::get('/crm', function () {
        return Inertia::render('CRM/Index');
    })->name('crm.index');
    
    // Orders (Legacy - bisa digabung dengan Sales nanti)
    Route::get('/orders', function () {
        return Inertia::render('Orders/Index');
    })->name('orders.index');
    
    // Products (Legacy - bisa digabung dengan Inventory nanti)
    Route::get('/products', function () {
        return Inertia::render('Products/Index');
    })->name('products.index');
    
    // Stock (Legacy - bisa digabung dengan Inventory nanti)
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
        Route::get('/profile', [UserProfileController::class, 'index'])->name('profile');
        Route::put('/profile', [UserProfileController::class, 'updateProfile'])->name('profile.update');
        Route::put('/password', [UserProfileController::class, 'updatePassword'])->name('password.update');
        
        Route::get('/preferences', function () {
            return Inertia::render('Settings/Preferences');
        })->name('preferences');
    });

    // Master Data - UOM (Unit of Measure)
    Route::resource('uoms', UomController::class);
    
    // Master Data - Product (Product Product)
    Route::resource('products', ProductProductController::class);

    // Purchase - RFQ & PO
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::post('/purchase-orders/{purchaseOrder}/confirm', [PurchaseOrderController::class, 'confirm'])->name('purchase-orders.confirm');
    Route::get('/purchase-orders/{purchaseOrder}/pdf', [PurchaseOrderController::class, 'downloadPdf'])->name('purchase-orders.pdf');

    // Purchase - Receipt (Stock Picking)
    Route::get('/receipts', [StockPickingController::class, 'index'])->name('receipts.index');
    Route::get('/receipts/{stockPicking}', [StockPickingController::class, 'show'])->name('receipts.show');
    Route::post('/receipts/{stockPicking}/receive', [StockPickingController::class, 'receive'])->name('receipts.receive');
    Route::get('/receipts/{stockPicking}/pdf', [StockPickingController::class, 'downloadPdf'])->name('receipts.pdf');

    // Purchase - Vendor Bill
    Route::get('/vendor-bills', [AccountMoveController::class, 'index'])->name('vendor-bills.index');
    Route::get('/vendor-bills/create', [AccountMoveController::class, 'create'])->name('vendor-bills.create');
    Route::post('/vendor-bills', [AccountMoveController::class, 'store'])->name('vendor-bills.store');
    Route::get('/vendor-bills/{accountMove}', [AccountMoveController::class, 'show'])->name('vendor-bills.show');
    Route::post('/vendor-bills/{accountMove}/post', [AccountMoveController::class, 'post'])->name('vendor-bills.post');
    Route::post('/vendor-bills/{accountMove}/payment', [AccountMoveController::class, 'registerPayment'])->name('vendor-bills.payment');
    Route::get('/vendor-bills/{accountMove}/pdf', [AccountMoveController::class, 'downloadPdf'])->name('vendor-bills.pdf');
});

require __DIR__.'/auth.php';
