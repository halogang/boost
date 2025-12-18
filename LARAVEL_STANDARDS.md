# LARAVEL BACKEND STANDARDS

**Version**: 1.0  
**Framework**: Laravel 11 + Spatie Permission

---

## 1. PROJECT ARCHITECTURE

```
app/
├── Http/
│   ├── Controllers/         # Controllers (CamelCase + Controller suffix)
│   ├── Middleware/          # Custom middleware
│   └── Requests/            # Form request validation
├── Models/                  # Eloquent models (Singular, PascalCase)
└── Providers/               # Service providers

config/                      # Configuration files
database/
├── migrations/              # Database migrations
├── seeders/                 # Database seeders
└── factories/               # Model factories

routes/
├── web.php                  # Web routes
├── api.php                  # API routes
└── auth.php                 # Authentication routes

resources/
└── views/                   # Blade templates

storage/
├── app/                     # Application files
├── framework/               # Framework files
└── logs/                    # Log files

tests/
├── Feature/                 # Feature tests
└── Unit/                    # Unit tests
```

---

## 2. NAMING CONVENTIONS

### Controllers
```php
// Resource controllers: Singular + Controller
UserController.php
ProductController.php
OrderController.php

// Action naming
public function index()     // List all
public function create()    // Show create form
public function store()     // Save new
public function show($id)   // Show one
public function edit($id)   // Show edit form
public function update($id) // Update existing
public function destroy($id)// Delete
```

### Models
```php
// Singular, PascalCase
User.php
Product.php
OrderItem.php (not OrdersItem)
ProductCategory.php (not ProductsCategories)

// Properties
protected $table = 'users';              // Explicit table name (optional)
protected $fillable = ['name', 'email']; // Mass assignable
protected $guarded = ['id'];             // Mass assignment guard
protected $hidden = ['password'];        // Hidden in JSON
protected $casts = ['is_active' => 'boolean']; // Type casting
```

### Migrations
```php
// Auto-generated format
2025_12_18_000000_create_users_table.php
2025_12_18_000001_add_phone_to_users_table.php
2025_12_18_000002_create_products_table.php

// Method names
public function up()    // Create/modify schema
public function down()  // Reverse the migration
```

### Routes
```php
// Naming: dot notation, lowercase
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::post('/users', [UserController::class, 'store'])->name('users.store');

// Group prefix
Route::prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', UserController::class);
});
// Results in: admin.users.index, admin.users.store, etc.
```

### Database
```sql
-- Tables: plural, snake_case
users
products
order_items
product_categories

-- Pivot tables: alphabetical order
role_user (not user_role)
product_tag (not tag_product)

-- Columns: snake_case
user_id
product_name
created_at
is_active
```

---

## 3. MODEL CONVENTIONS

### Basic Model Structure
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // Table name (optional if follows convention)
    protected $table = 'products';

    // Primary key (optional if 'id')
    protected $primaryKey = 'id';

    // Fillable attributes
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'category_id',
        'is_active',
    ];

    // Hidden attributes
    protected $hidden = [
        'deleted_at',
    ];

    // Cast attributes
    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class)
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    // Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = ucfirst($value);
    }
}
```

### Relationships
```php
// One to One
public function phone()
{
    return $this->hasOne(Phone::class);
}

public function user()
{
    return $this->belongsTo(User::class);
}

// One to Many
public function posts()
{
    return $this->hasMany(Post::class);
}

public function user()
{
    return $this->belongsTo(User::class);
}

// Many to Many
public function roles()
{
    return $this->belongsToMany(Role::class);
}

// Polymorphic
public function comments()
{
    return $this->morphMany(Comment::class, 'commentable');
}

public function commentable()
{
    return $this->morphTo();
}
```

---

## 4. CONTROLLER CONVENTIONS

### Resource Controller (MCRS Pattern)
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->role, function ($query, $role) {
                $query->role($role);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        
        if ($request->has('role')) {
            $user->assignRole($request->role);
        }

        return redirect()
            ->route('admin.users.index')
            ->with('message', 'User created successfully.');
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user->load('roles', 'permissions'),
        ]);
    }

    /**
     * Show the form for editing the user
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all(),
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        
        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return redirect()
            ->route('admin.users.index')
            ->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('message', 'User deleted successfully.');
    }
}
```

### Controller Best Practices
```php
// Use route model binding
public function show(User $user) 
{
    // Automatically retrieves user or throws 404
}

// Use Form Requests for validation
public function store(StoreUserRequest $request)
{
    $validated = $request->validated();
}

// Use transactions for multiple operations
DB::transaction(function () use ($data) {
    $user = User::create($data);
    $user->profile()->create($profileData);
});

// Return Inertia responses
return Inertia::render('Admin/Users/Index', [
    'users' => $users,
]);

// Redirect with flash message
return redirect()
    ->route('users.index')
    ->with('message', 'Success!');
```

---

## 5. FORM REQUEST VALIDATION

### Creating Form Request
```bash
php artisan make:request StoreUserRequest
```

### Form Request Structure
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request
     */
    public function authorize(): bool
    {
        return $this->user()->can('create users');
    }

    /**
     * Get the validation rules
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom attribute names
     */
    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'email' => 'email address',
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'role.exists' => 'The selected role is invalid.',
        ];
    }

    /**
     * Prepare data for validation
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}
```

### Common Validation Rules
```php
'name' => 'required|string|max:255'
'email' => 'required|email|unique:users,email'
'age' => 'required|integer|min:18|max:100'
'price' => 'required|numeric|min:0'
'date' => 'required|date|after:today'
'role' => 'required|in:admin,user,guest'
'file' => 'required|file|mimes:pdf,doc|max:2048'
'image' => 'required|image|dimensions:min_width=100,min_height=100'
```

---

## 6. ROUTING CONVENTIONS

### Resource Routes
```php
// Single resource route
Route::resource('users', UserController::class);
// Generates: index, create, store, show, edit, update, destroy

// API resource (no create/edit)
Route::apiResource('users', UserController::class);
// Generates: index, store, show, update, destroy

// Partial resource
Route::resource('users', UserController::class)->only([
    'index', 'show'
]);

Route::resource('users', UserController::class)->except([
    'destroy'
]);
```

### Route Groups
```php
// Prefix & namespace
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:admin'])
    ->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('products', ProductController::class);
    });

// Result: admin.users.index, admin.products.index, etc.
```

### Inertia Routes
```php
use Inertia\Inertia;

// Simple page
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// With data
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all(),
    ]);
});
```

---

## 7. MIDDLEWARE

### Creating Middleware
```bash
php artisan make:middleware CheckRole
```

### Middleware Structure
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
```

### Registering Middleware
```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

### Using Middleware
```php
// In routes
Route::get('/admin', function () {
    //
})->middleware(['auth', 'role:admin']);

// In controller constructor
public function __construct()
{
    $this->middleware('auth');
    $this->middleware('role:admin')->only(['destroy']);
}
```

---

## 8. DATABASE MIGRATIONS

### Creating Migration
```bash
# Create table
php artisan make:migration create_products_table

# Modify table
php artisan make:migration add_phone_to_users_table

# With model
php artisan make:model Product -m
```

### Migration Structure
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

### Common Column Types
```php
$table->id();                           // BIGINT UNSIGNED AUTO_INCREMENT
$table->string('name');                 // VARCHAR(255)
$table->string('code', 50);             // VARCHAR(50)
$table->text('description');            // TEXT
$table->integer('quantity');            // INTEGER
$table->decimal('price', 10, 2);        // DECIMAL(10,2)
$table->boolean('is_active');           // BOOLEAN
$table->date('birth_date');             // DATE
$table->dateTime('published_at');       // DATETIME
$table->timestamp('verified_at');       // TIMESTAMP
$table->timestamps();                   // created_at & updated_at
$table->softDeletes();                  // deleted_at
$table->foreignId('user_id')           // BIGINT UNSIGNED
    ->constrained()                     // Foreign key to users.id
    ->cascadeOnDelete();                // Delete on parent delete
```

---

## 9. DATABASE SEEDERS

### Creating Seeder
```bash
php artisan make:seeder UserSeeder
```

### Seeder Structure
```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Create multiple users with factory
        User::factory()
            ->count(10)
            ->create()
            ->each(function ($user) {
                $user->assignRole('user');
            });
    }
}
```

### Running Seeders
```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=UserSeeder

# Fresh migration with seed
php artisan migrate:fresh --seed
```

---

## 10. QUERY CONVENTIONS

### Eloquent Best Practices
```php
// Use query builder chains
$users = User::query()
    ->where('is_active', true)
    ->whereHas('orders', function ($query) {
        $query->where('status', 'completed');
    })
    ->with(['roles', 'profile'])
    ->latest()
    ->paginate(15);

// Use scopes
public function scopeActive($query)
{
    return $query->where('is_active', true);
}

$users = User::active()->get();

// Eager loading to prevent N+1
$users = User::with(['roles', 'permissions'])->get();

// Lazy eager loading
$users = User::all();
$users->load('roles');

// Count relationships
$users = User::withCount('posts')->get();

// Conditional queries
$users = User::query()
    ->when($request->search, function ($query, $search) {
        $query->where('name', 'like', "%{$search}%");
    })
    ->get();
```

---

## 11. SPATIE PERMISSION

### Setup
```php
// Assign role
$user->assignRole('admin');
$user->assignRole(['admin', 'editor']);

// Check role
if ($user->hasRole('admin')) {
    //
}

// Assign permission
$user->givePermissionTo('edit posts');

// Check permission
if ($user->can('edit posts')) {
    //
}

// Role with permissions
$role = Role::create(['name' => 'admin']);
$role->givePermissionTo(['create users', 'edit users', 'delete users']);
```

### Middleware Usage
```php
// Check role
Route::group(['middleware' => ['role:admin']], function () {
    //
});

// Check permission
Route::group(['middleware' => ['permission:edit posts']], function () {
    //
});

// Check role or permission
Route::group(['middleware' => ['role_or_permission:admin|edit posts']], function () {
    //
});
```

### Blade Directives
```php
@role('admin')
    <!-- Admin only content -->
@endrole

@can('edit posts')
    <!-- User with permission -->
@endcan

@hasrole('admin')
    <!-- Alternative syntax -->
@endhasrole
```

---

## 12. API RESPONSES

### JSON Response Format
```php
// Success response
return response()->json([
    'success' => true,
    'message' => 'User created successfully',
    'data' => $user,
], 201);

// Error response
return response()->json([
    'success' => false,
    'message' => 'Validation failed',
    'errors' => $validator->errors(),
], 422);

// Using API Resources
return new UserResource($user);
return UserResource::collection($users);
```

### API Resource
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->roles->pluck('name')->first(),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
```

---

## 13. ERROR HANDLING

### Try-Catch Pattern
```php
use Illuminate\Support\Facades\DB;
use Exception;

public function store(StoreUserRequest $request)
{
    try {
        DB::beginTransaction();
        
        $user = User::create($request->validated());
        $user->assignRole($request->role);
        
        DB::commit();
        
        return redirect()
            ->route('users.index')
            ->with('message', 'User created successfully.');
            
    } catch (Exception $e) {
        DB::rollBack();
        
        return redirect()
            ->back()
            ->withInput()
            ->with('error', 'Failed to create user: ' . $e->getMessage());
    }
}
```

---

## 14. TESTING

### Feature Test
```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_users_list()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->get(route('users.index'));

        $response->assertStatus(200);
    }

    public function test_user_can_create_new_user()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)
            ->post(route('users.store'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }
}
```

---

## 15. ARTISAN COMMANDS

### Common Commands
```bash
# Generate files
php artisan make:model Product -mcrs
php artisan make:controller UserController --resource
php artisan make:request StoreUserRequest
php artisan make:middleware CheckRole
php artisan make:seeder UserSeeder
php artisan make:factory ProductFactory

# Database
php artisan migrate
php artisan migrate:fresh --seed
php artisan migrate:rollback
php artisan db:seed

# Cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimization
php artisan optimize
php artisan config:cache
php artisan route:cache

# Development
php artisan serve
php artisan tinker
php artisan queue:work
```

---

## CHECKLIST

Before committing Laravel code:

- [ ] Controllers follow MCRS pattern
- [ ] Models have proper relationships defined
- [ ] Migrations have both up() and down() methods
- [ ] Form requests used for validation
- [ ] Routes use route model binding
- [ ] Queries use eager loading (no N+1)
- [ ] Transactions used for multi-step operations
- [ ] Error handling with try-catch
- [ ] Flash messages for user feedback
- [ ] Authorization checks (permissions/roles)
- [ ] Code follows PSR-12 standards
- [ ] Tests written for critical features
