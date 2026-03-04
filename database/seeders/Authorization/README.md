# Authorization Seeders

Folder ini berisi seeder untuk mengassign **permissions**, **menus**, dan **menu positions** ke setiap role.

## Structure

```
Authorization/
├── AllAuthorizationSeeder.php          # Runner - memanggil semua seeder di bawah
├── SuperAdminAuthorizationSeeder.php   # Super Admin: full access
├── OwnerAuthorizationSeeder.php        # Owner: read-heavy, limited write
├── ManagerAuthorizationSeeder.php      # Manager: full operational, no system config
├── AdminAuthorizationSeeder.php        # Admin: limited read + preferences
└── README.md
```

## Cara Menambah Role Baru

1. Buat file baru: `{RoleName}AuthorizationSeeder.php`
2. Tentukan permissions, menus, dan menu positions yang sesuai
3. Daftarkan ke `AllAuthorizationSeeder::run()` dalam array `$this->call()`

## Run Commands

```bash
# Jalankan semua authorization seeders
php artisan db:seed --class=Database\\Seeders\\Authorization\\AllAuthorizationSeeder

# Jalankan seeder untuk role tertentu saja
php artisan db:seed --class=Database\\Seeders\\Authorization\\AdminAuthorizationSeeder
```

## Catatan

- Seeder ini **idempotent** - aman dijalankan berkali-kali
- Menggunakan `syncPermissions()` → mengganti permissions lama
- Menggunakan `syncWithoutDetaching()` → menambah menus tanpa menghapus yang sudah ada
- Menggunakan `MenuRolePosition::firstOrCreate()` → tidak duplikat menu positions
