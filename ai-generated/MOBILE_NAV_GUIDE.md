# Mobile Bottom Navigation - Guide

## 📱 Fitur Mobile Navigation

### Komponen yang Dibuat:
1. **MobileBottomNav.tsx** - Bottom navigation bar untuk mobile
2. **Active State** di Sidebar dan Mobile Nav
3. **Responsive Design** - Sidebar hidden di mobile, Bottom Nav hidden di desktop

### 🎯 Cara Kerja:

#### Desktop (≥ md breakpoint)
- Sidebar tampil di kiri
- Bottom navigation tersembunyi
- Active state ditampilkan dengan background biru

#### Mobile (< md breakpoint)
- Sidebar tersembunyi
- Bottom navigation tampil di bawah
- Menampilkan maksimal 5 menu utama
- Active state dengan:
  - Icon filled (tidak outline)
  - Text biru dan bold
  - Bar indikator di atas

### 🎨 Active State Styling

#### Sidebar (Desktop)
```tsx
// Menu aktif
bg-blue-600 text-white font-semibold

// Menu tidak aktif
hover:bg-gray-800
```

#### Bottom Nav (Mobile)
```tsx
// Active
text-blue-600 scale-110 font-semibold
+ bar indikator di atas

// Inactive
text-gray-500 hover:text-gray-700
```

### 📝 Implementasi

**1. Layout Structure**
```tsx
<div className="flex h-screen">
  {/* Sidebar - Hidden on mobile */}
  <Sidebar /> {/* className="hidden md:flex ..." */}
  
  {/* Main Content */}
  <div className="flex-1">
    <main className="pb-20 md:pb-0"> {/* Padding bottom untuk mobile nav */}
      {children}
    </main>
  </div>
  
  {/* Mobile Bottom Nav - Hidden on desktop */}
  <MobileBottomNav />
</div>
```

**2. Active Detection**
```tsx
const { url } = usePage();

const isActive = (route: string | null) => {
  if (!route) return false;
  return url.startsWith(route);
};
```

**3. Menu Selection for Mobile**
```tsx
// Hanya ambil main menus dengan route (max 5)
const mainMenus = data
  .filter((menu: MenuItem) => menu.route && !menu.parent_id)
  .slice(0, 5);
```

### 🎨 Customization

#### Mengubah Jumlah Menu Mobile
```tsx
// Di MobileBottomNav.tsx
.slice(0, 5); // Ubah angka 5 sesuai kebutuhan (recommended: 4-5)
```

#### Mengubah Warna Active
```tsx
// Sidebar
bg-blue-600 // Ganti dengan warna lain

// Mobile Nav
text-blue-600 // Ganti dengan warna lain
```

#### Mengubah Icon Style
```tsx
// Icon filled saat active
fill={active ? 'currentColor' : 'none'}
strokeWidth={active ? 0 : 2}
```

### 📐 Breakpoints

```css
md: 768px /* Titik perubahan dari mobile ke desktop */
```

**Mobile**: < 768px
- Bottom Nav visible
- Sidebar hidden

**Desktop**: ≥ 768px
- Bottom Nav hidden
- Sidebar visible

### 💡 Best Practices

1. **Menu Priority**: Pastikan menu terpenting di urutan atas (akan muncul di mobile)
2. **Icon Consistency**: Gunakan icon yang sama di sidebar dan bottom nav
3. **Label Length**: Gunakan label pendek untuk mobile (max 2 kata)
4. **Touch Target**: Minimal 44x44px untuk touch (sudah implemented)
5. **Z-index**: Bottom nav di atas konten (z-50)

### 🔧 Troubleshooting

**Bottom nav menutupi konten:**
```tsx
// Tambahkan padding bottom di main content
<main className="pb-20 md:pb-0">
```

**Active state tidak update:**
- Pastikan menggunakan `usePage().url` dari Inertia
- Pastikan route dimulai dengan '/' 
- Check console untuk error API menu

**Icon tidak muncul:**
- Pastikan icon name di database sesuai dengan key di `getIconSvg()`
- Tambahkan icon baru di object `icons` jika perlu

### 📱 Preview Layout

```
┌─────────────────────────────┐
│  Header (User Profile, etc) │
├─────────────────────────────┤
│                             │
│  Main Content               │
│  (dengan padding bottom)    │
│                             │
├─────────────────────────────┤
│ [Home] [Order] [Prod] [Adm] │ <- Bottom Nav (Mobile Only)
└─────────────────────────────┘
```

### 🚀 Future Enhancements

- [ ] Badge notification di icon
- [ ] Haptic feedback on tap (PWA)
- [ ] Gesture swipe untuk menu
- [ ] Long press untuk quick actions
- [ ] Animation transitions yang lebih smooth

---

**Files Modified:**
- [AdminLayout.tsx](./AdminLayout.tsx) - Add MobileBottomNav
- [Sidebar.tsx](./Sidebar.tsx) - Add active state & hide on mobile
- [MobileBottomNav.tsx](./MobileBottomNav.tsx) - New component
