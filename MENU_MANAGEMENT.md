# 📋 Menu Management Guide

Panduan lengkap untuk mengelola menu di sistem ERP AJIB dengan role-based access control.

---

## 📚 Table of Contents

1. [Konsep Dasar](#konsep-dasar)
2. [Struktur Database](#struktur-database)
3. [Cara Menambah Menu Manual](#cara-menambah-menu-manual)
4. [Cara Edit Menu](#cara-edit-menu)
5. [Cara Assign Role ke Menu](#cara-assign-role-ke-menu)
6. [Icon Reference](#icon-reference)
7. [Best Practices](#best-practices)

---

## 🎯 Konsep Dasar

### Bagaimana Menu Bekerja?

1. **Menu** disimpan di tabel `menus`
2. **Role Assignment** disimpan di tabel pivot `menu_roles`
3. **Permission Check** dilakukan di `MenuController->getMenus()`
4. **Dynamic Sidebar** fetch dari API `/api/menus`

### Tipe Menu

| Tipe | Karakteristik | Contoh |
|------|---------------|--------|
| **Main Menu** | `parent_id = null` | Dashboard, Pesanan, Produk |
| **Parent Menu** | `parent_id = null`, `route = null` | Pengaturan |
| **Submenu** | `parent_id != null` | Kelola User, Profil |

---

## 🗄️ Struktur Database

### Tabel: `menus`

```sql
id              bigint          PRIMARY KEY
name            varchar(255)    NOT NULL (Nama tampil di sidebar)
icon            varchar(50)     NOT NULL (Icon lucide-react)
route           varchar(255)    NULL (Route Laravel, null = parent)
permission      varchar(100)    NULL (Format: resource.action)
parent_id       bigint          NULL (FK ke menus.id)
order           int             DEFAULT 0 (Urutan tampil)
active          boolean         DEFAULT true
created_at      timestamp
updated_at      timestamp
```

### Tabel: `menu_roles` (Pivot)

```sql
id              bigint          PRIMARY KEY
menu_id         bigint          FK ke menus.id
role_id         bigint          FK ke roles.id
created_at      timestamp
updated_at      timestamp

UNIQUE (menu_id, role_id)
```

---

## ➕ Cara Menambah Menu Manual

### Metode 1: Via Tinker (Recommended untuk Testing)

```bash
php artisan tinker
```

```php
use App\Models\Menu;
use Spatie\Permission\Models\Role;

// 1. Create menu baru
$menu = Menu::create([
    'name' => 'Keuangan',
    'icon' => 'dollar-sign',
    'route' => 'finance.index',
    'permission' => 'finance.view',
    'parent_id' => null,  // Main menu
    'order' => 10,
    'active' => true,
]);

// 2. Assign roles
$adminRole = Role::where('name', 'admin')->first();
$staffRole = Role::where('name', 'staff')->first();

// Admin only
$menu->roles()->attach([$adminRole->id]);

// OR Both roles
$menu->roles()->attach([$adminRole->id, $staffRole->id]);
```

### Metode 2: Via Database Direct (MySQL)

```sql
-- 1. Insert menu
INSERT INTO menus (name, icon, route, permission, parent_id, `order`, active, created_at, updated_at)
VALUES ('Keuangan', 'dollar-sign', 'finance.index', 'finance.view', NULL, 10, 1, NOW(), NOW());

-- Get menu_id yang baru dibuat
SET @menu_id = LAST_INSERT_ID();

-- 2. Get role IDs
SELECT id FROM roles WHERE name IN ('admin', 'staff');
-- Misal: admin = 1, staff = 2

-- 3. Assign role ke menu
INSERT INTO menu_roles (menu_id, role_id, created_at, updated_at)
VALUES 
(@menu_id, 1, NOW(), NOW()),  -- Admin
(@menu_id, 2, NOW(), NOW());  -- Staff
```

### Metode 3: Via Controller (Production)

Buat `MenuController@store` untuk form:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'icon' => 'required|string|max:50',
        'route' => 'nullable|string|max:255',
        'permission' => 'nullable|string|max:100',
        'parent_id' => 'nullable|exists:menus,id',
        'order' => 'required|integer',
        'active' => 'boolean',
        'roles' => 'required|array', // [1, 2]
    ]);
    
    // Create menu
    $menu = Menu::create([
        'name' => $validated['name'],
        'icon' => $validated['icon'],
        'route' => $validated['route'],
        'permission' => $validated['permission'],
        'parent_id' => $validated['parent_id'],
        'order' => $validated['order'],
        'active' => $validated['active'] ?? true,
    ]);
    
    // Assign roles
    $menu->roles()->attach($validated['roles']);
    
    return redirect()->route('menus.index')
        ->with('success', 'Menu berhasil ditambahkan!');
}
```

---

## ✏️ Cara Edit Menu

### Via Tinker

```php
use App\Models\Menu;

// Find menu by ID
$menu = Menu::find(5);

// Update properties
$menu->update([
    'name' => 'Keuangan (Updated)',
    'icon' => 'credit-card',
    'order' => 15,
]);

// Update role assignment
$menu->roles()->sync([1, 2]); // Admin & Staff
```

### Via SQL

```sql
-- Update menu
UPDATE menus 
SET name = 'Keuangan (Updated)', 
    icon = 'credit-card',
    `order` = 15,
    updated_at = NOW()
WHERE id = 5;

-- Update roles (replace existing)
DELETE FROM menu_roles WHERE menu_id = 5;
INSERT INTO menu_roles (menu_id, role_id, created_at, updated_at)
VALUES (5, 1, NOW(), NOW()), (5, 2, NOW(), NOW());
```

---

## 🔗 Cara Assign Role ke Menu

### Scenario 1: Menu untuk Admin Only

```php
$menu = Menu::find($menuId);
$adminRole = Role::where('name', 'admin')->first();

$menu->roles()->sync([$adminRole->id]);
```

### Scenario 2: Menu untuk Staff Only

```php
$staffRole = Role::where('name', 'staff')->first();
$menu->roles()->sync([$staffRole->id]);
```

### Scenario 3: Menu untuk Semua Role

```php
$adminRole = Role::where('name', 'admin')->first();
$staffRole = Role::where('name', 'staff')->first();

$menu->roles()->sync([$adminRole->id, $staffRole->id]);
```

### Scenario 4: Tambah Role Baru ke Menu (Tanpa Hapus yang Lama)

```php
$managerRole = Role::where('name', 'manager')->first();
$menu->roles()->attach([$managerRole->id]); // Append
```

### Scenario 5: Hapus Role dari Menu

```php
$staffRole = Role::where('name', 'staff')->first();
$menu->roles()->detach([$staffRole->id]);
```

---

## 🎨 Icon Reference

Menggunakan [Lucide React Icons](https://lucide.dev/icons/)

### Icon yang Sering Dipakai

| Icon | Nama | Use Case |
|------|------|----------|
| 🏠 | `home` | Dashboard |
| 🛒 | `shopping-cart` | Orders/Pesanan |
| 📦 | `box` | Products/Produk |
| 👥 | `users` | User Management |
| 🗄️ | `database` | Stock/Inventory |
| 📊 | `bar-chart` | Reports/Laporan |
| ⚙️ | `settings` | Settings/Pengaturan |
| 🔒 | `lock` | Security/Keamanan |
| 🔔 | `bell` | Notifications |
| 📄 | `file-text` | Documents |
| 🛡️ | `shield` | Permissions |
| 🖥️ | `server` | System |
| 👁️ | `eye` | Audit/Monitoring |
| 💵 | `dollar-sign` | Finance |
| 📝 | `clipboard` | Notes/Forms |
| 🚪 | `log-out` | Logout |

**Cara Cari Icon:**
1. Buka https://lucide.dev/icons/
2. Search icon yang diinginkan
3. Copy nama icon (lowercase, dash-separated)
4. Gunakan di field `icon`

---

## 📋 Best Practices

### ✅ DO

1. **Selalu assign role ke menu** - Jangan biarkan menu tanpa role
2. **Gunakan order yang konsisten** - Gap 10 (10, 20, 30...) untuk flexibility
3. **Permission naming convention** - Format: `{resource}.{action}` (product.view, user.manage)
4. **Test setelah menambah** - Login dengan role berbeda untuk verify
5. **Comment di seeder** - Jelaskan purpose setiap menu

### ❌ DON'T

1. **Jangan hard-delete menu** - Set `active = false` instead
2. **Jangan duplicate route** - Satu route = satu menu
3. **Jangan lupa sync roles** - Gunakan `sync()` untuk replace, `attach()` untuk append
4. **Jangan skip permission** - Kecuali menu public (profil, logout)
5. **Jangan gunakan icon yang tidak ada** - Cek lucide.dev dulu

---

## 🧪 Testing Menu Baru

### 1. Verify Menu Created

```php
php artisan tinker

Menu::where('name', 'Keuangan')->with('roles')->first();
// Should return menu with roles relation
```

### 2. Check API Response

```bash
# Login sebagai admin
# Then check API
curl http://localhost:8000/api/menus
```

### 3. Test di Browser

1. Login sebagai **admin** → Should see menu
2. Login sebagai **staff** → Check visibility based on role assignment
3. Check submenu expand/collapse

---

## 📝 Contoh Lengkap: Menambah Module Keuangan

```php
use App\Models\Menu;
use Spatie\Permission\Models\Role;

// Get roles
$adminRole = Role::where('name', 'admin')->first();
$staffRole = Role::where('name', 'staff')->first();

// 1. Create main menu
$finance = Menu::create([
    'name' => 'Keuangan',
    'icon' => 'dollar-sign',
    'route' => null, // Parent menu
    'permission' => null,
    'parent_id' => null,
    'order' => 100,
    'active' => true,
]);
$finance->roles()->attach([$adminRole->id, $staffRole->id]);

// 2. Create submenu: Pemasukan
$income = Menu::create([
    'name' => 'Pemasukan',
    'icon' => 'trending-up',
    'route' => 'finance.income.index',
    'permission' => 'finance.view',
    'parent_id' => $finance->id,
    'order' => 1,
    'active' => true,
]);
$income->roles()->attach([$adminRole->id, $staffRole->id]);

// 3. Create submenu: Pengeluaran
$expense = Menu::create([
    'name' => 'Pengeluaran',
    'icon' => 'trending-down',
    'route' => 'finance.expense.index',
    'permission' => 'finance.view',
    'parent_id' => $finance->id,
    'order' => 2,
    'active' => true,
]);
$expense->roles()->attach([$adminRole->id, $staffRole->id]);

// 4. Create submenu: Laporan Keuangan (Admin only)
$report = Menu::create([
    'name' => 'Laporan Keuangan',
    'icon' => 'file-text',
    'route' => 'finance.report.index',
    'permission' => 'finance.report.view',
    'parent_id' => $finance->id,
    'order' => 3,
    'active' => true,
]);
$report->roles()->attach([$adminRole->id]); // Admin only
```

---

## 🔄 Migration Guide

Jika butuh update struktur tabel:

```bash
php artisan make:migration add_description_to_menus_table
```

```php
// Migration file
public function up()
{
    Schema::table('menus', function (Blueprint $table) {
        $table->text('description')->nullable()->after('name');
    });
}
```

---

## 📞 Support

Untuk pertanyaan atau issue:
- Check `MenuController->getMenus()` untuk logic filtering
- Check `Sidebar.tsx` untuk frontend rendering
- Check `MenuSeeder.php` untuk contoh implementasi

**Version**: 1.0.0  
**Last Updated**: December 2025
