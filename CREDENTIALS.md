# Database Credentials

Setelah menjalankan `php artisan migrate:fresh --seed`, gunakan kredensial berikut untuk login:

## User Accounts

### 1. Super Admin (Full Access)
- **Email:** superadmin@ajibdarkah.com
- **Password:** password
- **Role:** super admin
- **Akses:** Full access ke semua menu dan fitur

### 2. Owner (View-Only)
- **Email:** owner@ajibdarkah.com
- **Password:** password
- **Role:** owner
- **Akses:** Dashboard, Orders, Products, Stock, Reports, Notifications (view only)

### 3. Branch Admin (Operations)
- **Email:** branchadmin@ajibdarkah.com
- **Password:** password
- **Role:** branch admin
- **Akses:** Orders (view & update status), Products (CRUD), Notifications

### 4. Admin Produksi (Production)
- **Email:** adminproduksi@ajibdarkah.com
- **Password:** password
- **Role:** admin produksi
- **Akses:** Production management, Inventory

### 5. Staff Produksi (Production Operations)
- **Email:** staffproduksi@ajibdarkah.com
- **Password:** password
- **Role:** staff produksi
- **Akses:** Production operations

### 6. Kurir (Delivery)
- **Email:** kurir@ajibdarkah.com
- **Password:** password
- **Role:** kurir
- **Akses:** Orders (view & update status), Notifications

### 6. Test Admin
- **Email:** test@admin.com
- **Password:** admin123
- **Role:** admin
- **Akses:** Full access (untuk testing)

## Permissions Overview

### Dashboard
- `dashboard.view` - View dashboard

### Orders
- `order.view` - View orders
- `order.update_status` - Update order status

### Products
- `product.view` - View products
- `product.create` - Create new product
- `product.update` - Update product
- `product.delete` - Delete product

### Stock
- `stock.view` - View stock
- `stock.adjust` - Adjust stock levels

### Reports
- `report.view` - View reports

### Notifications
- `notification.view` - View notifications

### Admin Settings
- `user.manage` - Manage users
- `role.manage` - Manage roles & permissions
- `system.manage` - System settings
- `audit.view` - View audit logs

## Menu System

### Desktop Sidebar (7 menus)
1. Dashboard
2. Pesanan
3. Produk
4. Stok
5. Laporan
6. Notifikasi
7. Pengaturan (dengan 8 submenu)

### Mobile Bottom Nav (5 menus max)
1. Dashboard
2. Pesanan
3. Notifikasi
4. Laporan
5. Pengaturan

### Mobile Drawer (4 menus)
1. Produk
2. Stok
3. Laporan
4. Pengaturan

## Database Commands

```bash
# Fresh migration dengan seeding
php artisan migrate:fresh --seed

# Atau step by step:
php artisan migrate:fresh
php artisan db:seed

# Seed spesifik
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=MenuSeeder
php artisan db:seed --class=MenuPositionSeeder
php artisan db:seed --class=UserSeeder
```

## Notes

- Semua password default adalah `password` (kecuali test@admin.com yang menggunakan `admin123`)
- Menu dengan `permission: null` dapat diakses oleh semua user (Profile, Security, Preferences, Logout)
- Menu Settings parent selalu visible, tapi submenu difilter berdasarkan permission
- Frontend tidak pernah check role/permission - semua filtering dilakukan di backend via MenuService
