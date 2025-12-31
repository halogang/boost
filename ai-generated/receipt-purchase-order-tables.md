# Tabel Database untuk Receipt & Purchase Order

## 📊 Tabel yang Digunakan

### 1. **`stock_picking`** (Tabel Receipt/Goods Receipt)

**Kolom Penting:**
- `id` - Primary key
- `name` - Nomor Receipt (contoh: WH/IN/2025/00001)
- `purchase_id` - **Foreign Key ke `purchase_order.id`** ⭐
- `picking_type_code` - 'incoming' (untuk receipt)
- `state` - Status (draft, confirmed, done, dll)
- `scheduled_date` - Tanggal yang dijadwalkan
- `date_done` - Tanggal selesai
- `user_id` - User yang handle
- `created_at`, `updated_at`, `deleted_at`

**Relasi:**
- `belongsTo(PurchaseOrder)` via `purchase_id`

---

### 2. **`purchase_order`** (Tabel Purchase Order)

**Kolom Penting:**
- `id` - Primary key
- `name` - Nomor PO (contoh: PO202500001)
- `partner_id` - **Foreign Key ke `res_partner.id`** ⭐
- `order_type` - 'rfq' atau 'po'
- `state` - Status (draft, purchase, done, dll)
- `date_order` - Tanggal order
- `date_planned` - Tanggal yang direncanakan
- `amount_total` - Total amount
- `created_at`, `updated_at`, `deleted_at`

**Relasi:**
- `belongsTo(ResPartner)` via `partner_id`
- `hasMany(StockPicking)` via `purchase_id`

---

### 3. **`res_partner`** (Tabel Vendor/Supplier)

**Kolom Penting:**
- `id` - Primary key
- `name` - Nama Vendor/Supplier
- `is_company` - Apakah perusahaan
- `supplier_rank` - Ranking supplier
- `customer_rank` - Ranking customer
- `email`, `phone`, `mobile` - Kontak
- `street`, `city`, `state_id`, `country_id` - Alamat
- `created_at`, `updated_at`, `deleted_at`

**Relasi:**
- `hasMany(PurchaseOrder)` via `partner_id`

---

## 🔗 Relasi Database

```
stock_picking
  └── purchase_id (FK) ──> purchase_order.id
                              └── partner_id (FK) ──> res_partner.id
```

**Flow Data:**
1. `stock_picking.purchase_id` → `purchase_order.id`
2. `purchase_order.partner_id` → `res_partner.id`

---

## 📝 Query untuk Menampilkan Receipt dengan PO

### SQL Query:
```sql
SELECT 
    sp.id,
    sp.name AS receipt_number,
    sp.purchase_id,
    po.name AS po_number,
    po.id AS po_id,
    rp.name AS vendor_name
FROM stock_picking sp
LEFT JOIN purchase_order po ON sp.purchase_id = po.id
LEFT JOIN res_partner rp ON po.partner_id = rp.id
WHERE sp.picking_type_code = 'incoming'
ORDER BY sp.created_at DESC;
```

### Laravel Eloquent:
```php
StockPicking::with(['purchaseOrder.partner'])
    ->incoming()
    ->get();
```

---

## 🎯 Kolom yang Ditampilkan di Frontend

Dari `stock_picking`:
- `name` → Nomor Receipt
- `scheduled_date` → Tanggal
- `state` → Status

Dari `purchase_order` (via relationship):
- `purchaseOrder.name` → Nomor PO
- `purchaseOrder.partner.name` → Nama Vendor

---

## ⚠️ Catatan Penting

1. **Foreign Key:**
   - `stock_picking.purchase_id` → `purchase_order.id`
   - Bisa NULL (jika receipt dibuat manual tanpa PO)

2. **Soft Delete:**
   - Semua tabel menggunakan `softDeletes()`
   - Perlu `withTrashed()` untuk load data yang di-soft delete

3. **Relationship:**
   - `StockPicking::purchaseOrder()` → `belongsTo(PurchaseOrder)`
   - `PurchaseOrder::partner()` → `belongsTo(ResPartner)`

---

## 🔍 Debugging

Jika Purchase Order tidak muncul di Receipt, cek:

1. **Apakah `purchase_id` terisi?**
   ```sql
   SELECT id, name, purchase_id FROM stock_picking WHERE purchase_id IS NOT NULL;
   ```

2. **Apakah Purchase Order masih ada?**
   ```sql
   SELECT id, name, deleted_at FROM purchase_order WHERE id IN (1,2,3,4);
   ```

3. **Apakah Partner ter-load?**
   ```sql
   SELECT po.id, po.name, rp.name AS vendor 
   FROM purchase_order po
   LEFT JOIN res_partner rp ON po.partner_id = rp.id
   WHERE po.id IN (1,2,3,4);
   ```

