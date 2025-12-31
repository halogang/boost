# Arsitektur Aplikasi - Model → Controller → Service

Dokumen ini menjelaskan arsitektur dan aturan pengembangan aplikasi ini.

## Prinsip Arsitektur

Aplikasi ini mengikuti pola **Model → Controller → Service** dengan prinsip:

1. **Model**: Hanya berisi definisi database, relationships, dan scopes
2. **Controller**: Hanya menangani HTTP request/response, routing, dan delegasi ke Service
3. **Service**: Menampung semua business logic dan operasi data
4. **Policy**: Menangani authorization dan permission checks
5. **Request**: Menangani validation dan authorization untuk form requests

## Struktur Layer

```
┌─────────────────┐
│   Controller    │  ← HTTP Request/Response, Routing
│  (Thin Layer)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │  ← Business Logic, Data Operations
│  (Business)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Model       │  ← Database, Relationships, Scopes
│  (Data Layer)   │
└─────────────────┘
```

## Aturan Pengembangan

### 1. Controller (app/Http/Controllers)

**DO:**
- ✅ Hanya menangani HTTP request/response
- ✅ Delegasi semua business logic ke Service
- ✅ Gunakan `authorize()` untuk permission checks
- ✅ Gunakan Form Request classes untuk validation
- ✅ Return Inertia responses atau redirects
- ✅ Inject Service melalui constructor

**DON'T:**
- ❌ Jangan tulis business logic di controller
- ❌ Jangan query database langsung (kecuali untuk authorization)
- ❌ Jangan tulis validation rules di controller
- ❌ Jangan handle exception secara detail (biarkan Service yang handle)

**Contoh:**
```php
class ProductProductController extends Controller
{
    public function __construct(
        protected ProductProductService $productService
    ) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', ProductProduct::class);
        
        $products = $this->productService->getPaginatedProducts(
            $request->only(['search', 'type', 'category', 'active']),
            $request->input('per_page', 10)
        );
        
        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }
}
```

### 2. Service (app/Services)

**DO:**
- ✅ Tampung semua business logic
- ✅ Handle semua operasi database
- ✅ Throw exceptions dengan pesan yang jelas
- ✅ Return data yang sudah diformat
- ✅ Gunakan Model scopes dan relationships
- ✅ Bisa inject Service lain jika perlu

**DON'T:**
- ❌ Jangan handle HTTP request/response
- ❌ Jangan return view atau redirect
- ❌ Jangan handle authorization (biarkan Policy)

**Contoh:**
```php
class ProductProductService
{
    public function getPaginatedProducts(array $filters = [], int $perPage = 10)
    {
        $query = ProductProduct::query()
            ->with(['uom', 'uomPo'])
            ->when(!empty($filters['search']), fn($q) => $q->search($filters['search']))
            ->ordered();
            
        return $query->paginate($perPage);
    }
    
    public function createProduct(array $data): ProductProduct
    {
        try {
            return ProductProduct::create($data);
        } catch (\Exception $e) {
            throw new \Exception('Gagal menambahkan produk: ' . $e->getMessage());
        }
    }
}
```

### 3. Model (app/Models)

**DO:**
- ✅ Definisikan fillable, casts, relationships
- ✅ Buat scopes untuk query yang sering digunakan
- ✅ Definisikan accessors/mutators jika perlu
- ✅ Gunakan traits (SoftDeletes, dll)

**DON'T:**
- ❌ Jangan tulis business logic kompleks
- ❌ Jangan handle HTTP request/response
- ❌ Jangan tulis validation rules

**Contoh:**
```php
class ProductProduct extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['name', 'default_code', ...];
    
    public function uom()
    {
        return $this->belongsTo(Uom::class, 'uom_id');
    }
    
    public function scopeSearch($query, string $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }
}
```

### 4. Policy (app/Policies)

**DO:**
- ✅ Handle semua authorization checks
- ✅ Gunakan permission-based authorization
- ✅ Return boolean (true/false)

**DON'T:**
- ❌ Jangan tulis business logic
- ❌ Jangan query database kompleks

**Contoh:**
```php
class ProductProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('read product');
    }
    
    public function update(User $user, ProductProduct $product): bool
    {
        return $user->hasPermissionTo('update product');
    }
}
```

### 5. Request (app/Http/Requests)

**DO:**
- ✅ Tampung validation rules
- ✅ Handle authorization via `authorize()` method
- ✅ Return validated data via `validated()`

**DON'T:**
- ❌ Jangan tulis business logic

**Contoh:**
```php
class StoreProductProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', ProductProduct::class);
    }
    
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'default_code' => 'nullable|unique:product_product,default_code',
        ];
    }
}
```

## Service Registration

Register Service di `AppServiceProvider` jika perlu singleton:

```php
public function register(): void
{
    $this->app->singleton(MenuService::class);
    $this->app->singleton(ProductProductService::class);
}
```

## Policy Auto-Discovery

Laravel akan otomatis menemukan Policy jika mengikuti konvensi:
- Model: `App\Models\ProductProduct`
- Policy: `App\Policies\ProductProductPolicy`

Tidak perlu register manual di Laravel 11+.

## Exception Handling

Service harus throw exception dengan pesan yang jelas:

```php
try {
    return ProductProduct::create($data);
} catch (\Exception $e) {
    throw new \Exception('Gagal menambahkan produk: ' . $e->getMessage());
}
```

Controller menangkap exception dan menampilkan ke user:

```php
try {
    $this->productService->createProduct($request->validated());
    return redirect()->route('products.index')
        ->with('success', 'Produk berhasil ditambahkan');
} catch (\Exception $e) {
    return back()->withInput()
        ->with('error', $e->getMessage());
}
```

## Best Practices

1. **Separation of Concerns**: Setiap layer punya tanggung jawab yang jelas
2. **Single Responsibility**: Setiap class hanya punya satu alasan untuk berubah
3. **Dependency Injection**: Inject Service melalui constructor
4. **DRY (Don't Repeat Yourself)**: Reuse Service methods
5. **Testability**: Service mudah di-test karena tidak depend pada HTTP

## Contoh Alur Lengkap

### Create Product Flow:

1. **Route** → `POST /products`
2. **Controller** → `ProductProductController::store()`
   - Authorize via `StoreProductProductRequest::authorize()`
   - Validate via `StoreProductProductRequest::rules()`
   - Call `ProductProductService::createProduct()`
3. **Service** → `ProductProductService::createProduct()`
   - Business logic (validasi tambahan, transformasi data, dll)
   - Call `ProductProduct::create()`
4. **Model** → `ProductProduct::create()`
   - Save ke database
5. **Return** → Service return ProductProduct
6. **Controller** → Return redirect dengan success message

## Checklist untuk Refactoring

Saat membuat controller baru atau refactoring:

- [ ] Business logic sudah dipindah ke Service?
- [ ] Controller hanya handle HTTP request/response?
- [ ] Validation sudah dipindah ke Request class?
- [ ] Authorization sudah menggunakan Policy?
- [ ] Service sudah di-inject via constructor?
- [ ] Exception handling sudah proper?
- [ ] Model hanya berisi relationships dan scopes?

## Naming Conventions

- **Controller**: `{Resource}Controller` (e.g., `ProductProductController`)
- **Service**: `{Resource}Service` (e.g., `ProductProductService`)
- **Policy**: `{Resource}Policy` (e.g., `ProductProductPolicy`)
- **Request**: `Store{Resource}Request`, `Update{Resource}Request`
- **Model**: `{Resource}` (e.g., `ProductProduct`)

