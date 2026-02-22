# Panduan Pembersihan Boilerplate (Boilerplate Cleanup Guide)

Dokumen ini berisi langkah-langkah untuk membersihkan project dari fitur-fitur spesifik (seperti Purchasing, Inventory, dll) sehingga project ini menjadi **Boilerplate Murni** yang siap digunakan untuk project-project selanjutnya. Boilerplate ini hanya akan berfokus pada fitur inti (Core System).

## Fitur Inti yang Dipertahankan (Core System)
- Authentication & Profile
- Dashboard
- User Management (CRUD Users)
- Role & Permission Management
- Menu & Menu Role Position Management
- System Settings & Preferences
- Audit Log

---

## Langkah-langkah Pembersihan

### Langkah 1: Membersihkan Routes (`routes/web.php`)
Kita akan menghapus semua route yang berkaitan dengan modul bisnis spesifik dan hanya menyisakan route inti.

**Yang akan dihapus:**
- Route `/order` (Mock)
- Route Application Modules: `/purchasing`, `/inventory`, `/manufacturing`, `/distribution`, `/sales`, `/hr`, `/finance`, `/crm`, `/orders`, `/products`, `/stock`, `/reports`, `/notifications`
- Route Master Data: `uoms`, `products`
- Route Purchase: `purchase-orders`, `receipts`, `vendor-bills`

### Langkah 2: Membersihkan Controllers (`app/Http/Controllers`)
Menghapus file controller yang sudah tidak memiliki route.

**Yang akan dihapus:**
- Folder `app/Http/Controllers/MasterData/` (beserta isinya: `UomController.php`, `ProductProductController.php`)
- Folder `app/Http/Controllers/Purchase/` (beserta isinya: `PurchaseOrderController.php`, `StockPickingController.php`, `AccountMoveController.php`)

### Langkah 3: Membersihkan Models & Policies (`app/Models` & `app/Policies`)
Menghapus model dan policy yang berkaitan dengan entitas bisnis spesifik.

**Model yang akan dihapus:**
- `AccountMove.php`
- `AccountMoveLine.php`
- `AccountPayment.php`
- `ProductProduct.php`
- `PurchaseOrder.php`
- `PurchaseOrderLine.php`
- `ResPartner.php`
- `StockMove.php`
- `StockPicking.php`
- `Uom.php`

**Policy yang akan dihapus:**
- `ProductProductPolicy.php`
- `UomPolicy.php`

### Langkah 4: Membersihkan Services (`app/Services`)
Menghapus service class yang menangani logika bisnis spesifik.

**Yang akan dihapus:**
- `ProductProductService.php`
- `UomService.php`

### Langkah 5: Membersihkan Frontend Pages (`resources/js/Pages`)
Menghapus folder dan file Vue/Inertia yang tidak lagi digunakan.

**Folder yang akan dihapus:**
- `resources/js/Pages/Order/`
- `resources/js/Pages/Purchasing/`
- `resources/js/Pages/Inventory/`
- `resources/js/Pages/Manufacturing/`
- `resources/js/Pages/Distribution/`
- `resources/js/Pages/Sales/`
- `resources/js/Pages/HR/`
- `resources/js/Pages/Finance/`
- `resources/js/Pages/CRM/`
- `resources/js/Pages/Orders/`
- `resources/js/Pages/Products/`
- `resources/js/Pages/Stock/`
- `resources/js/Pages/Reports/`
- `resources/js/Pages/Notifications/`

### Langkah 6: Membersihkan Database Migrations & Seeders
Memastikan database hanya berisi tabel-tabel inti.

**Yang perlu dilakukan:**
- Hapus file migration yang membuat tabel bisnis (seperti tabel `uoms`, `products`, `purchase_orders`, dll) di folder `database/migrations/`.
- Periksa dan bersihkan `database/seeders/DatabaseSeeder.php` agar hanya menjalankan seeder untuk:
  - Users
  - Roles & Permissions
  - Menus & Menu Positions
  - Settings

---

## Status: SELESAI ✓

Semua langkah pembersihan sudah di-implementasikan. Boilerplate sekarang hanya berisi fitur inti (Core System).
