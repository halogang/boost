# Best Practice: Relasi Users dan Karyawan (Employee)

## 🎯 Overview

Pertanyaan: Bagaimana relasi antara table `users` (authentication) dan `karyawan` (employee data)?

**Jawaban Singkat**: Gunakan **One-to-One Relationship** dengan table terpisah `employees` yang memiliki foreign key ke `users`.

---

## 📊 Pendekatan yang Umum Digunakan

### 1. ✅ **RECOMMENDED: One-to-One Relationship (Separate Table)**

**Struktur:**
```
users (authentication)
  - id
  - name
  - email
  - password
  - email_verified_at
  - created_at
  - updated_at

employees (karyawan data)
  - id
  - user_id (FK -> users.id) UNIQUE
  - employee_code (NIK)
  - phone
  - address
  - birth_date
  - hire_date
  - position
  - department
  - salary
  - status (active/inactive)
  - created_at
  - updated_at
```

**Keuntungan:**
- ✅ Separation of Concerns: Authentication terpisah dari business data
- ✅ Flexible: User bisa ada tanpa employee data (untuk admin/system user)
- ✅ Scalable: Mudah menambah field employee tanpa mengotori users table
- ✅ Best Practice: Mengikuti prinsip Single Responsibility
- ✅ Security: Employee data tidak perlu di expose di authentication layer

**Kekurangan:**
- ⚠️ Perlu join query untuk mendapatkan data lengkap
- ⚠️ Perlu handle case dimana user belum punya employee record

---

### 2. ❌ **NOT RECOMMENDED: Extend Users Table**

**Struktur:**
```
users
  - id
  - name
  - email
  - password
  - employee_code (nullable)
  - phone (nullable)
  - address (nullable)
  - birth_date (nullable)
  - hire_date (nullable)
  - position (nullable)
  - department (nullable)
  - ...
```

**Kekurangan:**
- ❌ Mixing concerns: Authentication + Business data dalam satu table
- ❌ Banyak nullable fields (tidak semua user adalah employee)
- ❌ Sulit maintain jika ada perubahan requirement
- ❌ Tidak scalable untuk multiple user types

---

### 3. ⚠️ **CONDITIONAL: Polymorphic Relationship**

**Struktur:**
```
users
  - id
  - name
  - email
  - password
  - userable_type (Userable)
  - userable_id

employees
  - id
  - employee_code
  - phone
  - ...

customers
  - id
  - customer_code
  - phone
  - ...
```

**Kapan digunakan:**
- Jika user bisa menjadi multiple types (Employee, Customer, Vendor, dll)
- Jika ada requirement untuk multiple user types dengan data berbeda

**Kekurangan:**
- ⚠️ Lebih kompleks
- ⚠️ Foreign key constraint tidak bisa langsung
- ⚠️ Query lebih kompleks

---

## 🏗️ Implementasi Recommended (One-to-One)

### Migration

```php
// database/migrations/YYYY_MM_DD_create_employees_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete(); // Jika user dihapus, employee juga dihapus
            
            // Employee Data
            $table->string('employee_code')->unique()->comment('NIK/Nomor Induk Karyawan');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            
            // Employment Data
            $table->date('hire_date')->nullable();
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->decimal('salary', 15, 2)->nullable();
            $table->enum('status', ['active', 'inactive', 'resigned'])->default('active');
            
            // Additional Info
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('employee_code');
            $table->index('status');
            $table->index('department');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
```

### Model Employee

```php
// app/Models/Employee.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_code',
        'phone',
        'address',
        'birth_date',
        'birth_place',
        'gender',
        'hire_date',
        'position',
        'department',
        'salary',
        'status',
        'emergency_contact_name',
        'emergency_contact_phone',
        'notes',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'salary' => 'decimal:2',
    ];

    /**
     * Relationship: Employee belongs to User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### Update Model User

```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    // ... existing code ...

    /**
     * Relationship: User has one Employee
     */
    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    /**
     * Check if user is an employee
     */
    public function isEmployee(): bool
    {
        return $this->employee !== null;
    }

    /**
     * Get employee code if exists
     */
    public function getEmployeeCode(): ?string
    {
        return $this->employee?->employee_code;
    }
}
```

---

## 🔍 Query Examples

### Get User with Employee Data

```php
// Eager loading
$user = User::with('employee')->find($id);

// Access employee data
$employeeCode = $user->employee?->employee_code;
$position = $user->employee?->position;

// Check if employee exists
if ($user->isEmployee()) {
    // User is an employee
}
```

### Get All Employees

```php
// Via Employee model
$employees = Employee::with('user')
    ->where('status', 'active')
    ->get();

// Via User model
$employeeUsers = User::whereHas('employee')
    ->with('employee')
    ->get();
```

### Create User with Employee

```php
// Option 1: Create separately
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => Hash::make('password'),
]);

$employee = Employee::create([
    'user_id' => $user->id,
    'employee_code' => 'EMP001',
    'position' => 'Manager',
    'department' => 'IT',
    'hire_date' => now(),
    'status' => 'active',
]);

// Option 2: Using relationship
$user = User::create([...]);
$user->employee()->create([
    'employee_code' => 'EMP001',
    'position' => 'Manager',
    // ...
]);
```

---

## 🎨 Service Layer Implementation

```php
// app/Services/EmployeeService.php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    /**
     * Create user with employee data
     */
    public function createUserWithEmployee(array $userData, array $employeeData): User
    {
        return DB::transaction(function () use ($userData, $employeeData) {
            // Create user
            $user = User::create($userData);
            
            // Assign role if needed
            if (isset($employeeData['role'])) {
                $user->assignRole($employeeData['role']);
                unset($employeeData['role']);
            }
            
            // Create employee
            $employeeData['user_id'] = $user->id;
            $user->employee()->create($employeeData);
            
            return $user->load('employee');
        });
    }

    /**
     * Get paginated employees
     */
    public function getPaginatedEmployees(array $filters = [], int $perPage = 10)
    {
        $query = Employee::with('user')
            ->when(isset($filters['search']), function ($q) use ($filters) {
                $q->where(function ($query) use ($filters) {
                    $query->where('employee_code', 'like', "%{$filters['search']}%")
                        ->orWhereHas('user', function ($q) use ($filters) {
                            $q->where('name', 'like', "%{$filters['search']}%")
                              ->orWhere('email', 'like', "%{$filters['search']}%");
                        });
                });
            })
            ->when(isset($filters['status']), function ($q) use ($filters) {
                $q->where('status', $filters['status']);
            })
            ->when(isset($filters['department']), function ($q) use ($filters) {
                $q->where('department', $filters['department']);
            });

        return $query->orderBy('hire_date', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }
}
```

---

## 📋 Frontend Implementation

### TypeScript Interface

```typescript
// resources/js/types/employee.ts
export interface Employee {
  id: number;
  user_id: number;
  employee_code: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  birth_place?: string;
  gender?: 'male' | 'female';
  hire_date?: string;
  position?: string;
  department?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'resigned';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
```

---

## ✅ Best Practices Summary

1. **✅ Gunakan Separate Table** - `employees` table dengan foreign key ke `users`
2. **✅ One-to-One Relationship** - Satu user punya satu employee record (optional)
3. **✅ Use Soft Deletes** - Untuk employee data (jika user dihapus, employee juga)
4. **✅ Eager Loading** - Selalu load relationship saat query
5. **✅ Service Layer** - Handle business logic di Service
6. **✅ Transaction** - Gunakan transaction untuk create user + employee
7. **✅ Nullable Fields** - Employee fields bisa nullable (tidak semua user adalah employee)

---

## 🚫 Anti-Patterns (Hindari)

1. **❌ Jangan tambah employee fields ke users table**
2. **❌ Jangan hardcode employee logic di User model**
3. **❌ Jangan asumsi semua user adalah employee**
4. **❌ Jangan lupa handle null check untuk employee relationship**

---

## 📝 Kesimpulan

**Recommended Approach:**
- ✅ Table `employees` terpisah dengan `user_id` sebagai foreign key
- ✅ One-to-One relationship (optional - user bisa tanpa employee)
- ✅ Gunakan Service layer untuk handle business logic
- ✅ Always check `isEmployee()` sebelum akses employee data

**Struktur yang disarankan:**
```
users (authentication)
  └── hasOne(Employee)

employees (karyawan data)
  └── belongsTo(User)
```

Dengan pendekatan ini, sistem tetap fleksibel dan scalable untuk kebutuhan di masa depan! 🚀

