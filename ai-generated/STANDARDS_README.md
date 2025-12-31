# STANDARD KODE - DOKUMENTASI LENGKAP

Dokumentasi standar kode untuk project Laravel + React + Inertia.js dengan Claude Copilot hooks.

## 📚 Dokumentasi Utama

### 1. [FRONTEND_STANDARDS.md](./FRONTEND_STANDARDS.md)
Standar coding untuk frontend (React + TypeScript + Inertia.js)
- Struktur project & naming conventions
- Component patterns & TypeScript usage
- Form handling dengan Inertia
- Styling dengan TailwindCSS
- Hooks, state management, error handling
- Testing & accessibility guidelines

### 2. [LARAVEL_STANDARDS.md](./LARAVEL_STANDARDS.md)
Standar coding untuk backend (Laravel 11)
- Struktur project & naming conventions
- Model, Controller, Migration patterns
- Form Request validation
- Routing & middleware conventions
- Database queries & Eloquent best practices
- Spatie Permission usage
- Testing & Artisan commands

### 3. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
Design system lengkap (colors, typography, spacing)
- Color palette (primary, secondary, semantic, neutral)
- Dark mode colors
- Typography scale & font families
- Spacing scale (padding, margin, gap)
- Border radius, shadows, elevation
- Component sizing (buttons, inputs, avatars)
- Grid system & breakpoints
- Animations & transitions
- CSS custom properties implementation

### 4. [CLAUDE_HOOKS_GUIDE.md](./CLAUDE_HOOKS_GUIDE.md)
Panduan lengkap Claude Copilot hooks
- Overview hooks & event types
- Code formatting hooks (PHP + TypeScript)
- File protection hooks
- Validation hooks (Model & Component)
- Logging & notification hooks
- Configuration examples
- Troubleshooting guide

### 5. [CODING_STANDARDS.md](./CODING_STANDARDS.md)
Standar coding umum (existing, sudah ada)
- Project structure overview
- Quick reference untuk naming conventions

## 🎯 Quick Start

### Setup Hooks
```powershell
# Hooks sudah dikonfigurasi di .claude/settings.json
# Tidak perlu setup manual, hooks akan otomatis aktif

# Verifikasi hooks
Get-Content .claude/settings.json
```

### Formatter Setup
```powershell
# Install Laravel Pint (PHP formatter)
composer require laravel/pint --dev

# Install Prettier (TypeScript formatter)
npm install -D prettier

# Format manual (optional, hooks akan auto-format)
./vendor/bin/pint
npx prettier --write "resources/js/**/*.{ts,tsx}"
```

## 🎨 Design System Usage

### Colors
```typescript
// Gunakan design tokens
<div className="bg-primary text-primary-foreground">
<p className="text-muted-foreground">
```

### Typography
```typescript
// Heading
<h1 className="text-4xl font-bold tracking-tight">

// Body
<p className="text-base text-foreground">

// Small text
<span className="text-sm text-muted-foreground">
```

### Spacing
```typescript
// Component padding
<div className="p-6">

// Section spacing
<section className="py-12">

// Gap between elements
<div className="flex gap-4">
```

## 🔧 Development Workflow

### 1. Laravel (Backend)
```bash
# Generate model dengan MCRS pattern
php artisan make:model Product -mcrs

# Creates:
# - Model: app/Models/Product.php
# - Controller: app/Http/Controllers/ProductController.php
# - Request: app/Http/Requests/Store/UpdateProductRequest.php
# - Seeder: database/seeders/ProductSeeder.php
# - Migration: database/migrations/..._create_products_table.php
```

### 2. React (Frontend)
```bash
# Struktur component baru
resources/js/
├── Components/ProductCard.tsx    # Reusable component
└── Pages/Admin/Products/
    ├── Index.tsx                 # List page
    ├── Create.tsx                # Create form
    └── Edit.tsx                  # Edit form
```

### 3. Inertia Routes
```php
// routes/web.php
Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    Route::resource('products', ProductController::class);
});
```

## 📋 Checklist Development

### Sebelum Commit (Backend)
- [ ] Controller mengikuti MCRS pattern
- [ ] Model punya relationships yang benar
- [ ] Migration punya up() & down()
- [ ] Form Request untuk validation
- [ ] Routes menggunakan route model binding
- [ ] Query menggunakan eager loading
- [ ] Error handling dengan try-catch
- [ ] Authorization checks (permissions)

### Sebelum Commit (Frontend)
- [ ] Component naming PascalCase
- [ ] TypeScript interfaces lengkap
- [ ] Proper error handling
- [ ] Accessibility attributes (ARIA)
- [ ] Responsive design tested
- [ ] Dark mode support
- [ ] Loading & error states
- [ ] No console.logs

### Sebelum Commit (Design)
- [ ] Colors menggunakan design tokens
- [ ] Typography mengikuti scale
- [ ] Spacing multiples of 4px
- [ ] Border radius konsisten
- [ ] Shadows sesuai elevation
- [ ] Dark mode colors defined

## 🤖 Claude Copilot Hooks

### Hooks Aktif

#### 1. File Protection ✅
Melindungi file sensitive dari modifikasi:
- `.env`, lock files, `.git`, `vendor`, `node_modules`

#### 2. Auto-Formatting ✅
Otomatis format setelah edit:
- PHP files → Laravel Pint
- TypeScript files → Prettier

#### 3. Command Logger ✅
Log semua terminal commands ke `.claude/logs/commands.log`

#### 4. Notifications ✅
Desktop notification saat Claude butuh input

### Testing Hooks
```powershell
# Test file protection
echo '{"tool_input":{"file_path":".env"}}' | powershell -File ./.claude/hooks/protect_files.ps1

# Test formatter
echo '{"tool_input":{"file_path":"test.php"}}' | powershell -File ./.claude/hooks/format_code.ps1

# Check logs
Get-Content .claude/logs/commands.log
```

## 📖 Dokumentasi Tambahan

### Resources
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)

### Tools
- [Laravel Pint](https://laravel.com/docs/pint) - PHP Formatter
- [Prettier](https://prettier.io) - TypeScript Formatter
- [ESLint](https://eslint.org) - JavaScript Linter

## 🚀 Tips & Tricks

### Quick Commands
```bash
# Development server
npm run dev          # Frontend (Vite)
php artisan serve    # Backend (Laravel)

# Database
php artisan migrate:fresh --seed

# Clear cache
php artisan optimize:clear

# Code formatting
./vendor/bin/pint
npx prettier --write .
```

### Common Patterns
```typescript
// Inertia form submission
const { data, setData, post, processing, errors } = useForm({...});

// Conditional classes
className={cn('base-class', condition && 'conditional-class')}

// Route navigation
router.visit(route('admin.users.index'))
```

## 📞 Support

Jika ada pertanyaan atau issues:
1. Cek dokumentasi yang relevan di atas
2. Review hook logs: `.claude/logs/commands.log`
3. Test hooks secara manual

---

**Version**: 1.0  
**Last Updated**: December 18, 2025  
**Project**: Aqua Galon - Laravel + React + Inertia.js
