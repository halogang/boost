## CODING STANDARDS & GUIDELINES

**Version**: 1.1 (Simplified - No Services, Using MCRS with Permission Middleware)

---

## 1. PROJECT STRUCTURE

### Backend (Laravel)
```
app/
├── Http/
│   ├── Controllers/         # Route controllers (CamelCase + Controller)
│   ├── Middleware/          # Custom middleware
│   └── Requests/            # Form requests validation (optional)
├── Models/                  # Eloquent models (Singular, PascalCase)
└── Providers/               # Service providers
database/
├── migrations/              # Migration files (snake_case)
└── seeders/                 # Database seeders
routes/
├── web.php                  # Web routes
└── auth.php                 # Auth routes
resources/
├── js/
│   ├── Components/          # Reusable React components
│   ├── Layouts/             # Layout wrappers
│   ├── Pages/               # Page components (match routes)
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript interfaces
└── css/                     # Tailwind CSS
```

---

## 2. NAMING CONVENTIONS

### PHP Files & Classes
```php
// Controllers: Singular + Controller
// php artisan make:controller UserController -mcrs
UserController.php
ProductController.php

// Models: Singular, PascalCase
// php artisan make:model User -mcrs
User.php
Product.php

// Migrations: auto-generated
// Created by -m flag in make:model
2025_12_18_000000_create_users_table.php

// Seeders: PascalCase + Seeder
RolePermissionSeeder.php
```

### Database
```sql
-- Tables: plural, snake_case
users
products
attendances

-- Columns: snake_case
user_id
product_name
created_at
```

### React Components
```typescript
// Components: PascalCase
UserCard.tsx
ProductForm.tsx

// Pages: Match route, PascalCase
Admin/Users/Index.tsx
Admin/Users/Create.tsx
Admin/Users/Edit.tsx
```

---

## 3. LARAVEL CONVENTIONS

### Generate Model with MCRS
```bash
# M = Model, C = Controller, R = Request, S = Seeder
php artisan make:model User -mcrs

# Creates:
# - app/Models/User.php
# - app/Http/Controllers/UserController.php
# - app/Http/Requests/StoreUserRequest.php & UpdateUserRequest.php
# - database/seeders/UserSeeder.php
```

### Controller Structure (Simple MCRS)
```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        // Permission middleware per action
        $this->middleware('permission:read users', ['only' => ['index', 'show']]);
        $this->middleware('permission:create users', ['only' => ['create', 'store']]);
        $this->middleware('permission:update users', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete users', ['only' => ['destroy']]);
    }

    // LIST
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::paginate(15),
        ]);
    }

    // CREATE FORM
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    // STORE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully');
    }

    // SHOW
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    // EDIT FORM
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    // UPDATE
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully');
    }

    // DELETE
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully');
    }
}
```

### Models
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email'];

    // Relationships
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
```

### Routes (MCRS Style)
```php
// routes/web.php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Auto-generates: index, create, store, show, edit, update, destroy
    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class);
});
```

---

## 4. PERMISSIONS & ROLES (CRUD Format)

### Permission Naming
```
{action} {resource}

Actions: create, read, update, delete

Examples:
- create users
- read users
- update users
- delete users
- create products
- read products
- update products
- delete products
```

### Role Permission Assignment
```php
// Admin: All CRUD permissions
$admin = Role::findByName('admin');
$admin->syncPermissions(Permission::all());

// Staff: Limited permissions
$staff = Role::findByName('staff');
$staff->syncPermissions(['read products', 'create products', 'update products']);
```

### Permission Checks in Controller
```php
// Middleware in __construct
$this->middleware('permission:read users', ['only' => ['index', 'show']]);
$this->middleware('permission:create users', ['only' => ['create', 'store']]);
$this->middleware('permission:update users', ['only' => ['edit', 'update']]);
$this->middleware('permission:delete users', ['only' => ['destroy']]);
```

### Use in React
```typescript
import { usePage } from '@inertiajs/react';

export default function UserList() {
  const { auth } = usePage().props;
  const canCreate = auth.user?.permissions.includes('create users');
  
  return (
    <div>
      {canCreate && <CreateButton />}
    </div>
  );
}
```

---

## 5. FORM VALIDATION

### Inline Validation (Simple)
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed|min:8',
    ]);

    User::create($validated);
}
```

### Form Request (Advanced)
```bash
php artisan make:request StoreUserRequest
```

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ];
    }
}
```

---

## 6. MIGRATION STRUCTURE

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

---

## 7. REACT/TYPESCRIPT COMPONENTS

### Types
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}
```

### Page Components
```typescript
import { PageProps } from '@inertiajs/react';
import { User } from '@/types';

interface Props extends PageProps {
  users: User[];
}

export default function Index({ users }: Props) {
  return (
    <div className="p-6">
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 8. COMMANDS REFERENCE

### Generate Resources
```bash
# Model with Migration, Controller, Requests, Seeder
php artisan make:model User -mcrs

# Or separately
php artisan make:model Product
php artisan make:controller ProductController -r
php artisan make:request StoreProductRequest
php artisan make:seeder ProductSeeder

# Request (Form Validation)
php artisan make:request StoreUserRequest
php artisan make:request UpdateUserRequest

# Seeder
php artisan make:seeder RolePermissionSeeder
```

### Database
```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Seed specific seeder
php artisan db:seed --class=RolePermissionSeeder
```

### Development
```bash
# Start dev server
php artisan serve

# Start Vite
npm run dev

# Tinker shell
php artisan tinker
```

---

## 9. GIT WORKFLOW

### Commit Format
```
[TYPE]: Description

Types: feat, fix, refactor, docs, test, chore
Examples:
- feat: Add user CRUD with permissions
- fix: Fix pagination bug in users index
- refactor: Simplify user controller
- docs: Update CODING_STANDARDS.md
```

### Branch Naming
```
feature/user-management
bugfix/permission-issue
docs/setup-guide
```

---

## 10. BEST PRACTICES

✅ **DO:**
- Use resource routes `Route::resource()`
- Apply middleware in controller `__construct()`
- Use permission in action methods
- Validate input with `$request->validate()`
- Use named routes: `route('admin.users.index')`
- Load relationships: `User::with('posts')->get()`
- Use pagination: `User::paginate(15)`

❌ **DON'T:**
- Don't query directly in views
- Don't repeat permission checks
- Don't forget route model binding
- Don't use `all()` for large datasets
- Don't commit `.env` file
- Don't hardcode values

---

**Last Updated**: December 18, 2025

### Backend (Laravel)
```
app/
├── Http/
│   ├── Controllers/         # Route controllers (CamelCase)
│   ├── Middleware/          # Custom middleware
│   └── Requests/            # Form requests validation
├── Models/                  # Eloquent models (Singular, PascalCase)
├── Services/                # Business logic layer
├── Enums/                   # PHP Enums for status/types
└── Providers/               # Service providers
database/
├── migrations/              # Migration files (snake_case)
├── seeders/                 # Database seeders
└── factories/               # Model factories
routes/
├── web.php                  # Web routes
├── auth.php                 # Auth routes
└── console.php              # Console routes
resources/
├── js/
│   ├── Components/          # Reusable React components
│   ├── Layouts/             # Layout wrappers
│   ├── Pages/               # Page components (match routes)
│   ├── lib/                 # Utility functions
│   ├── types/               # TypeScript interfaces
│   └── app.tsx              # App entry point
└── css/                     # Tailwind CSS
tests/
├── Feature/                 # Feature tests
└── Unit/                    # Unit tests
```

---

## 2. NAMING CONVENTIONS

### PHP Files & Classes
```php
// Controllers: Singular + Controller
ProductController.php
UserManagementController.php

// Models: Singular, PascalCase
Product.php
User.php
Permission.php

// Migrations: Timestamp + snake_case
2025_12_18_040525_create_products_table.php
2025_12_18_050000_add_status_to_users_table.php

// Seeders: PascalCase + Seeder
ProductSeeder.php
RolePermissionSeeder.php

// Middleware: PascalCase
CheckProductAccess.php
EnsureUserHasRole.php

// Enums: PascalCase
ProductStatus.php
UserRole.php

// Services: PascalCase + Service
ProductService.php
UserService.php

// Requests: PascalCase + Request
StoreProductRequest.php
UpdateUserRequest.php
```

### Database Tables & Columns
```sql
-- Tables: plural, snake_case
products
user_permissions
role_has_permissions

-- Columns: snake_case
user_id
product_name
created_at
is_active
```

### React Components & Files
```typescript
// Components: PascalCase (file and export)
ProductCard.tsx
UserProfile.tsx
DashboardLayout.tsx

// Utilities/hooks: camelCase
useAuth.ts
useProducts.ts
formatCurrency.ts

// Types: PascalCase
types/Product.ts
types/User.ts

// Pages: Match route structure, PascalCase
Pages/Products/Index.tsx
Pages/Products/Show.tsx
Pages/Admin/Dashboard.tsx
```

---

## 3. LARAVEL CONVENTIONS

### Controllers
```php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // List items
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Product::paginate(15),
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    // Store new item
    public function store(StoreProductRequest $request)
    {
        Product::create($request->validated());
        return redirect()->route('products.index')
            ->with('success', 'Product created successfully');
    }

    // Show detail
    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    // Show edit form
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    // Update item
    public function update(StoreProductRequest $request, Product $product)
    {
        $product->update($request->validated());
        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully');
    }

    // Delete item
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully');
    }
}
```

**Rules:**
- Use route model binding: `public function show(Product $product)`
- Use form requests for validation: `StoreProductRequest`
- Always return with named routes: `route('products.index')`
- Use Inertia::render for page views
- Include flash messages for actions

### Models
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasRoles;

    protected $fillable = ['name', 'description', 'price', 'status'];

    protected $casts = [
        'price' => 'decimal:2',
        'status' => 'string',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Accessors
    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}
```

**Rules:**
- Use `protected $fillable` for mass assignment
- Use `protected $casts` for type casting
- Use scopes for query building: `Product::active()->recent()`
- One relationship per method
- Use accessors for computed properties
- Add timestamps: `$timestamps = true;` (default)

### Form Requests
```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required',
            'price.min' => 'Price must be greater than 0',
        ];
    }
}
```

**Rules:**
- Always validate in form requests
- Use `authorize()` for permission checks
- Define custom messages
- Use `unique:table,column` for database validation

### Migrations
```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

**Rules:**
- Use `$table->id()` for primary key
- Use `foreignId()` for foreign keys
- Use `enum()` for fixed options
- Add `index()` for frequently queried columns
- Add `timestamps()` and `softDeletes()` when needed
- Always create `down()` method

### Routes
```php
// routes/web.php

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Auth required
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Resource routes
    Route::resource('products', ProductController::class);
});

// Admin only routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    Route::middleware('permission:manage users')->group(function () {
        Route::resource('users', UserController::class);
    });
});

// Include auth routes
require __DIR__.'/auth.php';
```

**Rules:**
- Group related routes with middleware
- Use `resource()` for CRUD routes
- Always name routes: `->name('products.index')`
- Protect admin routes with `role:admin` and `permission:*`

---

## 4. REACT & TYPESCRIPT CONVENTIONS

### Type Definitions
```typescript
// resources/js/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  per_page: number;
}

export interface InertiaPageProps {
  auth: {
    user: User | null;
  };
  [key: string]: any;
}
```

### Page Components
```typescript
// resources/js/Pages/Products/Index.tsx

import React from 'react';
import { PageProps } from '@inertiajs/react';
import { Product, PaginatedResponse } from '@/types';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ProductCard from '@/Components/ProductCard';

interface Props extends PageProps {
  products: PaginatedResponse<Product>;
}

export default function Index({ products }: Props) {
  return (
    <DashboardLayout title="Products">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
```

**Rules:**
- Extend `PageProps` for Inertia
- Import types from `@/types`
- Use layout wrappers for consistent structure
- Prop destructuring at function signature
- Use Tailwind for styling
- Handle null states explicitly

### Components
```typescript
// resources/js/Components/ProductCard.tsx

import React from 'react';
import { Product } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-xl font-bold mb-4">Rp {Number(product.price).toLocaleString('id-ID')}</p>
      
      <div className="flex gap-2">
        <Link href={`/products/${product.id}`} className="btn btn-primary">
          View
        </Link>
        <Link href={`/products/${product.id}/edit`} className="btn btn-secondary">
          Edit
        </Link>
      </div>
    </div>
  );
}
```

**Rules:**
- Define Props interface
- One component per file
- Export default function
- Use semantic HTML
- Use Tailwind classes consistently
- Handle responsive design

### Custom Hooks
```typescript
// resources/js/lib/useAuth.ts

import { usePage } from '@inertiajs/react';
import { User, InertiaPageProps } from '@/types';

export function useAuth() {
  const { auth } = usePage<InertiaPageProps>().props;

  const hasRole = (role: string): boolean => {
    return auth.user?.roles.includes(role) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    return auth.user?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(perm => hasPermission(perm));
  };

  return {
    user: auth.user,
    hasRole,
    hasPermission,
    hasAnyPermission,
    isAuthenticated: !!auth.user,
  };
}
```

**Rules:**
- Prefix with `use`
- Return object with functions/state
- Handle null/undefined gracefully
- Include JSDoc for complex logic

### Utility Functions
```typescript
// resources/js/lib/helpers.ts

/**
 * Format currency to Indonesian Rupiah
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Check if user can access resource
 */
export const canAccess = (permission: string, userPermissions: string[]): boolean => {
  return userPermissions.includes(permission);
};
```

**Rules:**
- Include JSDoc comments
- Pure functions (no side effects)
- Export individually or as group
- Type parameters and return values

---

## 5. PERMISSIONS & ROLES STRUCTURE

### Permission Naming Convention (CRUD Format)

```
{action}_{resource}

Where action is: create, read, update, delete
Format: {action} {resource}

Examples:
- create products
- read products
- update products
- delete products
- read users
- create users
- update users
- delete users
- create attendance
- read attendance
- update attendance
- delete attendance
```

### Resource Permissions

Each major resource should have 4 CRUD permissions:

```
Products:
- create products     (POST /products)
- read products       (GET /products, GET /products/{id})
- update products     (PUT /products/{id})
- delete products     (DELETE /products/{id})

Users:
- create users        (POST /users)
- read users          (GET /users)
- update users        (PUT /users/{id})
- delete users        (DELETE /users/{id})

Attendance:
- create attendance   (POST /attendance)
- read attendance     (GET /attendance)
- update attendance   (PUT /attendance/{id})
- delete attendance   (DELETE /attendance/{id})

Settings:
- create settings     (POST /settings)
- read settings       (GET /settings)
- update settings     (PUT /settings/{id})
- delete settings     (DELETE /settings/{id})

Master Data:
- create master data
- read master data
- update master data
- delete master data

Permissions:
- create permissions
- read permissions
- update permissions
- delete permissions
```

### Role Hierarchy & Permissions

```
Admin Role:
- All CRUD permissions for all resources

Staff Role:
- read products
- create products
- update products
- read attendance
- create attendance
- update attendance

User Role (optional):
- read products
- read attendance
```

### Permission Implementation - 3 Approaches

#### Approach 1: Middleware di Controller (Simple & Clean) ✅ RECOMMENDED

```php
// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to specific methods
        $this->middleware('permission:read products', ['only' => ['index', 'show']]);
        $this->middleware('permission:create products', ['only' => ['create', 'store']]);
        $this->middleware('permission:update products', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete products', ['only' => ['destroy']]);
    }

    public function index()
    {
        // Automatically authorized by middleware
        return Inertia::render('Products/Index');
    }
}
```

**Routes (web.php - Clean & Simple):**
```php
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('products', ProductController::class);
    Route::resource('users', UserController::class);
    Route::resource('attendance', AttendanceController::class);
});
```

**Advantages:**
- Routes file tetap clean dan ringkas
- Permission logic ada di controller (Separation of Concerns)
- Mudah di-maintain ketika pakai resource routes
- Spesifik per method CRUD

---

#### Approach 2: Policies (Most Professional) ⭐ BEST FOR ADVANCED

```php
// app/Policies/ProductPolicy.php
class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('read products');
    }

    public function view(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('read products');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create products');
    }

    public function update(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('update products');
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('delete products');
    }
}

// Register di AppServiceProvider
public function boot()
{
    $this->registerPolicies();
}

// Use di Controller
class ProductController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Product::class);
        return Inertia::render('Products/Index');
    }

    public function store(StoreProductRequest $request)
    {
        $this->authorize('create', Product::class);
        Product::create($request->validated());
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);
        $product->update($request->validated());
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
    }
}
```

**Use in React:**
```typescript
import { can } from '@inertiajs/react';

export default function ProductCard({ product }) {
  return (
    <div>
      {can('create products') && <CreateButton />}
      {can('update products', product) && <EditButton />}
      {can('delete products', product) && <DeleteButton />}
    </div>
  );
}
```

**Advantages:**
- Most secure & scalable
- Policies reusable di views/react
- Model-level authorization
- Industry standard approach

---

#### Approach 3: Route Middleware (❌ NOT RECOMMENDED - Terlalu Verbose)

```php
// Hanya gunakan jika tidak pakai resource routes
Route::middleware('permission:read products')->get('/products', [ProductController::class, 'index']);
Route::middleware('permission:create products')->post('/products', [ProductController::class, 'store']);
```

**Disadvantages:**
- Routes file terlalu panjang
- Hard to maintain
- Repetitif untuk resource routes

---

### Best Practice Recommendation

**GUNAKAN APPROACH 1 (Controller Middleware + Resource Routes)**

```php
// routes/web.php - CLEAN ✅
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::resource('products', ProductController::class);
    Route::resource('users', UserController::class);
    Route::resource('attendance', AttendanceController::class);
});

// routes/web.php - STAFF (Limited actions)
Route::middleware(['auth', 'role:staff'])->prefix('staff')->group(function () {
    Route::resource('products', StaffProductController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update']);
});

// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:read products', ['only' => ['index', 'show']]);
        $this->middleware('permission:create products', ['only' => ['create', 'store']]);
        $this->middleware('permission:update products', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete products', ['only' => ['destroy']]);
    }

    // Implementation...
}
```

**Why?**
- Routes tetap ringkas dan readable
- Permission logic tersentralisasi di controller
- Scalable untuk project besar
- Mudah testing
- Mudah onboarding developer baru

---

## 6. API RESPONSES

### Success Response
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 50000
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "name": ["The name field is required"],
    "price": ["The price must be a number"]
  }
}
```

### Validation Errors (Form Request)
```php
// Automatically formatted by Laravel
{
  "message": "The POST method is not supported for route...",
  "errors": {
    "name": ["Name is required"],
    "email": ["Email must be valid"]
  }
}
```

---

## 7. TESTING STANDARDS

### Feature Tests
```php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;

class ProductControllerTest extends TestCase
{
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_view_products_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/products');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) =>
            $page
                ->component('Products/Index')
                ->has('products')
        );
    }

    public function test_can_create_product(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/products', [
                'name' => 'Test Product',
                'price' => 50000,
            ]);

        $response->assertRedirect('/products');
        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
        ]);
    }

    public function test_unauthorized_user_cannot_access_admin_panel(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/admin/dashboard');

        $response->assertStatus(403);
    }
}
```

**Rules:**
- Test one scenario per test method
- Use descriptive names: `test_can_...`, `test_cannot_...`
- Set up test data in `setUp()`
- Assert both response and database state
- Test unauthorized access

### Unit Tests
```php
namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    public function test_user_has_admin_role(): void
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $this->assertTrue($user->hasRole('admin'));
    }

    public function test_user_has_permission(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('manage products');

        $this->assertTrue($user->hasPermissionTo('manage products'));
    }
}
```

---

## 8. CODE QUALITY

### Formatting
- **Indentation**: 4 spaces (PHP), 2 spaces (JavaScript/TypeScript)
- **Line length**: 120 characters max
- **Imports**: Group by: Laravel, third-party, then local
- **Trailing comma**: Required in multi-line arrays/objects

### PHP Code Style
```php
// ✅ GOOD
$users = User::where('status', 'active')
    ->orderBy('created_at', 'desc')
    ->paginate(15);

// ❌ BAD
$users = User::where('status', 'active')->orderBy('created_at', 'desc')->paginate(15);
```

### TypeScript Code Style
```typescript
// ✅ GOOD
interface Props {
  product: Product;
  onUpdate: (product: Product) => void;
}

// ❌ BAD
interface Props {product: Product; onUpdate: (product: Product) => void}
```

### Comments
```php
// Use when WHY, not WHAT
// ✅ GOOD: Why are we checking this?
// Soft deleted products should not appear in public listings
$products = Product::active()->toBase()->get();

// ❌ BAD: This is obvious from code
// Get all products where status is active
$products = Product::where('status', 'active')->get();
```

---

## 9. GIT WORKFLOW

### Commit Messages
```
Format: [TYPE]: Description

Types: feat, fix, refactor, docs, style, test, chore

Examples:
- feat: Add role-based access control
- fix: Fix product pagination bug
- refactor: Extract product service logic
- docs: Update API documentation
- test: Add tests for user permissions
```

### Branch Naming
```
feature/role-permission-system
bugfix/product-pagination-issue
hotfix/auth-crash
docs/setup-guide
```

---

## 10. DOCUMENTATION

### README Requirements
```markdown
# Project Name

## Setup
1. Install dependencies
2. Configure .env
3. Run migrations
4. Run seeder

## Features
- List features

## Usage
- Basic usage examples

## API Endpoints
- Document key endpoints

## Architecture
- Explain structure
```

### Code Comments
- Docblocks for classes, methods, functions
- Inline comments for complex logic
- JSDoc for TypeScript functions

---

## 11. SECURITY CHECKLIST

- [ ] Always validate user input
- [ ] Use prepared statements (Laravel ORM does this)
- [ ] Check permissions before operations
- [ ] Hash passwords (Laravel does this)
- [ ] Use HTTPS in production
- [ ] Never commit `.env` to git
- [ ] Sanitize output in views
- [ ] Use CSRF tokens (Laravel does this)
- [ ] Rate limit API endpoints
- [ ] Log sensitive operations

---

## 12. PERFORMANCE BEST PRACTICES

### Database
```php
// ✅ GOOD: Eager loading
$products = Product::with('user')->paginate();

// ❌ BAD: N+1 queries
$products = Product::paginate();
foreach ($products as $product) {
    echo $product->user->name; // Query per iteration
}
```

### Queries
```php
// ✅ GOOD: Use select for specific columns
Product::select('id', 'name', 'price')->get();

// ❌ BAD: Fetch all columns
Product::all();
```

### Caching
```php
// Cache expensive queries
$products = cache()->remember('products_list', 3600, function () {
    return Product::with('user')->get();
});
```

---

## 13. FILE TEMPLATES

### New Controller
```bash
php artisan make:controller ProductController --model=Product
```

### New Model with Migration
```bash
php artisan make:model Product -m
```

### New Form Request
```bash
php artisan make:request StoreProductRequest
```

### New Test
```bash
php artisan make:test ProductControllerTest --feature
```

---

## 14. CHECKLIST FOR CODE REVIEW

- [ ] Follows naming conventions
- [ ] Has proper type hints
- [ ] Includes validation
- [ ] Checks permissions
- [ ] Has error handling
- [ ] Includes tests
- [ ] Documentation updated
- [ ] No console logs (production)
- [ ] No hardcoded values
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Follows project structure

---

## 15. ENVIRONMENT SETUP

### Required Files
- `.env` - Configuration (git ignored)
- `.env.example` - Template for .env

### Key Environment Variables
```
APP_NAME=AquaGalon
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=galon_aqua
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

---

## 16. RUNNING COMMANDS

### Setup
```bash
composer install
npm install
php artisan migrate
php artisan db:seed
```

### Development
```bash
php artisan serve              # Backend
npm run dev                    # Frontend (Vite)
php artisan tinker             # Interactive shell
```

### Testing
```bash
php artisan test               # Run all tests
php artisan test tests/Feature # Run specific suite
php artisan test --filter=ProductController
```

### Deployment
```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build                  # Build frontend
```

---

**Last Updated**: December 18, 2025  
**Version**: 1.0  
**Author**: Development Team
