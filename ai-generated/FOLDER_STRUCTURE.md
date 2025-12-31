# Struktur Folder - Organisasi Controller

Dokumen ini menjelaskan struktur folder yang direkomendasikan untuk mengorganisir controller berdasarkan domain/module.

## Struktur Folder yang Direkomendasikan

```
app/Http/Controllers/
├── Auth/                          # Authentication controllers
│   ├── AuthenticatedSessionController.php
│   ├── RegisteredUserController.php
│   └── ...
├── MasterData/                    # Master Data controllers
│   ├── UomController.php
│   └── ProductProductController.php
├── Admin/                        # Admin/System management controllers
│   ├── UserController.php
│   ├── SettingsController.php
│   ├── MenuController.php
│   ├── PermissionController.php
│   └── MenuRolePositionController.php
├── Purchase/                     # Purchase module controllers
│   ├── PurchaseOrderController.php
│   ├── StockPickingController.php
│   └── AccountMoveController.php
└── Controller.php                # Base controller
```

## Struktur Service

```
app/Services/
├── MenuService.php
├── ProductProductService.php
├── UomService.php
├── UserService.php
└── SettingsService.php
```

## Struktur Policy

```
app/Policies/
├── ProductProductPolicy.php
├── UomPolicy.php
├── UserPolicy.php
└── SettingsPolicy.php
```

## Struktur Request

```
app/Http/Requests/
├── Auth/
│   └── LoginRequest.php
├── ProductProduct/
│   ├── StoreProductProductRequest.php
│   └── UpdateProductProductRequest.php
├── Uom/
│   ├── StoreUomRequest.php
│   └── UpdateUomRequest.php
├── User/
│   ├── StoreUserRequest.php
│   └── UpdateUserRequest.php
├── Settings/
│   └── UpdateSettingsRequest.php
└── ProfileUpdateRequest.php
```

## Catatan

Saat ini, controller masih berada di root `app/Http/Controllers/` untuk menjaga kompatibilitas dengan routes yang ada. 

Jika ingin memindahkan ke folder terorganisir:
1. Pindahkan file ke folder yang sesuai
2. Update namespace (e.g., `App\Http\Controllers\MasterData\UomController`)
3. Update routes untuk menggunakan namespace lengkap

Contoh update routes:
```php
// Sebelum
use App\Http\Controllers\UomController;
Route::resource('uoms', UomController::class);

// Sesudah
use App\Http\Controllers\MasterData\UomController;
Route::resource('uoms', UomController::class);
```

## Keuntungan Struktur Terorganisir

1. **Kemudahan Navigasi**: Mudah menemukan controller berdasarkan domain
2. **Skalabilitas**: Mudah menambah module baru tanpa membuat folder root berantakan
3. **Maintainability**: Struktur yang jelas memudahkan maintenance
4. **Team Collaboration**: Tim lebih mudah memahami struktur project

