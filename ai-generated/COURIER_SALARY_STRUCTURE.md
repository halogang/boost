# Struktur Database: Kurir dengan Base Salary & Bonus Performa

## 🎯 Overview

Case: Kurir memiliki **base salary** (gaji pokok) dan **bonus** berdasarkan performa (jumlah delivery, rating, dll).

---

## 📊 Struktur Database Recommended

### 1. **Table: `employees`** (Base Employee Data)

```php
Schema::create('employees', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
    
    // Basic Info
    $table->string('employee_code')->unique();
    $table->string('phone')->nullable();
    $table->date('hire_date');
    $table->string('position'); // 'kurir', 'staff', 'manager', dll
    $table->string('department')->nullable();
    $table->enum('status', ['active', 'inactive', 'resigned'])->default('active');
    
    $table->timestamps();
    $table->softDeletes();
});
```

### 2. **Table: `employee_salaries`** (Base Salary & Compensation)

```php
Schema::create('employee_salaries', function (Blueprint $table) {
    $table->id();
    $table->foreignId('employee_id')
        ->constrained('employees')
        ->cascadeOnDelete();
    
    // Base Salary
    $table->decimal('base_salary', 15, 2)->default(0); // Gaji pokok bulanan
    $table->decimal('transport_allowance', 15, 2)->default(0); // Tunjangan transport
    $table->decimal('meal_allowance', 15, 2)->default(0); // Tunjangan makan
    
    // Effective Date
    $table->date('effective_date'); // Tanggal mulai berlaku
    $table->date('end_date')->nullable(); // Tanggal berakhir (untuk history)
    
    // Status
    $table->boolean('is_active')->default(true);
    
    $table->timestamps();
    
    // Indexes
    $table->index(['employee_id', 'is_active']);
    $table->index('effective_date');
});
```

**Catatan:**
- Satu employee bisa punya multiple salary records (untuk history/riwayat perubahan gaji)
- Hanya satu record yang `is_active = true` per employee
- `end_date` untuk tracking kapan gaji berubah

### 3. **Table: `courier_performances`** (Performance Tracking)

```php
Schema::create('courier_performances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('employee_id')
        ->constrained('employees')
        ->cascadeOnDelete();
    
    // Period (Bulan/Tahun)
    $table->year('year');
    $table->tinyInteger('month'); // 1-12
    
    // Performance Metrics
    $table->integer('total_deliveries')->default(0); // Total pengiriman
    $table->integer('successful_deliveries')->default(0); // Pengiriman berhasil
    $table->integer('failed_deliveries')->default(0); // Pengiriman gagal
    $table->integer('on_time_deliveries')->default(0); // Pengiriman tepat waktu
    
    // Ratings
    $table->decimal('average_rating', 3, 2)->default(0); // Rating rata-rata (0-5)
    $table->integer('total_ratings')->default(0); // Jumlah rating
    
    // Additional Metrics
    $table->integer('total_distance_km')->default(0); // Total jarak (km)
    $table->integer('total_working_hours')->default(0); // Total jam kerja
    
    // Calculated Score (untuk bonus calculation)
    $table->decimal('performance_score', 5, 2)->default(0); // Score 0-100
    
    // Status
    $table->enum('status', ['draft', 'calculated', 'approved', 'paid'])->default('draft');
    $table->timestamp('calculated_at')->nullable();
    $table->timestamp('approved_at')->nullable();
    
    $table->timestamps();
    
    // Unique constraint: satu employee hanya punya satu record per bulan
    $table->unique(['employee_id', 'year', 'month']);
    $table->index(['year', 'month']);
    $table->index('status');
});
```

### 4. **Table: `bonus_rules`** (Bonus Configuration)

```php
Schema::create('bonus_rules', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Nama bonus rule
    $table->string('code')->unique(); // Kode unik (e.g., 'BONUS_DELIVERY', 'BONUS_RATING')
    
    // Bonus Type
    $table->enum('type', [
        'fixed',           // Bonus tetap per achievement
        'percentage',      // Bonus persentase dari base salary
        'tiered',          // Bonus tiered (per range)
        'formula'          // Bonus berdasarkan formula custom
    ]);
    
    // Configuration (JSON untuk fleksibilitas)
    $table->json('config')->nullable(); // Config sesuai type
    
    // Example config:
    // For 'fixed': {"amount": 5000, "per_delivery": true}
    // For 'percentage': {"percentage": 10, "min_deliveries": 50}
    // For 'tiered': {"tiers": [{"min": 0, "max": 50, "amount": 0}, {"min": 51, "max": 100, "amount": 5000}]}
    // For 'formula': {"formula": "base_salary * 0.1 * (deliveries / 100)"}
    
    // Conditions
    $table->integer('min_deliveries')->nullable(); // Minimum deliveries untuk dapat bonus
    $table->decimal('min_rating', 3, 2)->nullable(); // Minimum rating
    $table->decimal('min_performance_score', 5, 2)->nullable(); // Minimum performance score
    
    // Effective Date
    $table->date('effective_date');
    $table->date('end_date')->nullable();
    $table->boolean('is_active')->default(true);
    
    $table->timestamps();
    
    $table->index('code');
    $table->index('is_active');
});
```

### 5. **Table: `employee_bonuses`** (Calculated Bonuses)

```php
Schema::create('employee_bonuses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('employee_id')
        ->constrained('employees')
        ->cascadeOnDelete();
    $table->foreignId('courier_performance_id')
        ->nullable()
        ->constrained('courier_performances')
        ->nullOnDelete();
    $table->foreignId('bonus_rule_id')
        ->constrained('bonus_rules');
    
    // Period
    $table->year('year');
    $table->tinyInteger('month');
    
    // Bonus Calculation
    $table->string('bonus_name'); // Nama bonus (dari bonus_rule)
    $table->enum('bonus_type', ['fixed', 'percentage', 'tiered', 'formula']);
    $table->decimal('base_amount', 15, 2)->default(0); // Base untuk calculation
    $table->decimal('bonus_amount', 15, 2)->default(0); // Jumlah bonus yang didapat
    $table->decimal('multiplier', 10, 2)->default(1); // Multiplier (untuk per delivery, dll)
    
    // Calculation Details (JSON untuk audit)
    $table->json('calculation_details')->nullable();
    // Example: {"deliveries": 75, "rating": 4.5, "formula_used": "base_salary * 0.1 * (75/100)"}
    
    // Status
    $table->enum('status', ['calculated', 'approved', 'paid', 'cancelled'])->default('calculated');
    $table->timestamp('approved_at')->nullable();
    $table->timestamp('paid_at')->nullable();
    $table->foreignId('approved_by')->nullable()->constrained('users');
    
    $table->timestamps();
    
    $table->index(['employee_id', 'year', 'month']);
    $table->index('status');
});
```

### 6. **Table: `payrolls`** (Monthly Payroll Summary)

```php
Schema::create('payrolls', function (Blueprint $table) {
    $table->id();
    $table->foreignId('employee_id')
        ->constrained('employees')
        ->cascadeOnDelete();
    
    // Period
    $table->year('year');
    $table->tinyInteger('month');
    
    // Salary Components
    $table->decimal('base_salary', 15, 2)->default(0);
    $table->decimal('transport_allowance', 15, 2)->default(0);
    $table->decimal('meal_allowance', 15, 2)->default(0);
    $table->decimal('total_allowances', 15, 2)->default(0); // Sum of all allowances
    
    // Bonuses
    $table->decimal('total_bonuses', 15, 2)->default(0); // Sum of all bonuses
    
    // Deductions (potongan)
    $table->decimal('deductions', 15, 2)->default(0); // Potongan (jika ada)
    
    // Totals
    $table->decimal('gross_salary', 15, 2)->default(0); // Base + Allowances + Bonuses
    $table->decimal('net_salary', 15, 2)->default(0); // Gross - Deductions
    
    // Performance Summary
    $table->integer('total_deliveries')->default(0);
    $table->decimal('average_rating', 3, 2)->default(0);
    $table->decimal('performance_score', 5, 2)->default(0);
    
    // Status
    $table->enum('status', ['draft', 'calculated', 'approved', 'paid'])->default('draft');
    $table->timestamp('calculated_at')->nullable();
    $table->timestamp('approved_at')->nullable();
    $table->timestamp('paid_at')->nullable();
    $table->foreignId('approved_by')->nullable()->constrained('users');
    $table->foreignId('paid_by')->nullable()->constrained('users');
    
    // Payment Info
    $table->string('payment_method')->nullable(); // 'transfer', 'cash', dll
    $table->string('payment_reference')->nullable(); // No. transfer, dll
    $table->text('notes')->nullable();
    
    $table->timestamps();
    
    // Unique: satu employee hanya punya satu payroll per bulan
    $table->unique(['employee_id', 'year', 'month']);
    $table->index(['year', 'month']);
    $table->index('status');
});
```

---

## 🔗 Relationship Diagram

```
users
  └── hasOne(Employee)

employees
  ├── belongsTo(User)
  ├── hasMany(EmployeeSalary)
  ├── hasMany(CourierPerformance)
  ├── hasMany(EmployeeBonus)
  └── hasMany(Payroll)

employee_salaries
  └── belongsTo(Employee)

courier_performances
  ├── belongsTo(Employee)
  └── hasMany(EmployeeBonus)

bonus_rules
  └── hasMany(EmployeeBonus)

employee_bonuses
  ├── belongsTo(Employee)
  ├── belongsTo(CourierPerformance)
  └── belongsTo(BonusRule)

payrolls
  └── belongsTo(Employee)
```

---

## 💻 Model Implementation

### Employee Model

```php
// app/Models/Employee.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    protected $fillable = [
        'user_id', 'employee_code', 'phone', 'hire_date',
        'position', 'department', 'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function salaries(): HasMany
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    public function activeSalary(): HasOne
    {
        return $this->hasOne(EmployeeSalary::class)->where('is_active', true);
    }

    public function performances(): HasMany
    {
        return $this->hasMany(CourierPerformance::class);
    }

    public function bonuses(): HasMany
    {
        return $this->hasMany(EmployeeBonus::class);
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }

    public function isCourier(): bool
    {
        return $this->position === 'kurir';
    }
}
```

### CourierPerformance Model

```php
// app/Models/CourierPerformance.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourierPerformance extends Model
{
    protected $fillable = [
        'employee_id', 'year', 'month',
        'total_deliveries', 'successful_deliveries', 'failed_deliveries',
        'on_time_deliveries', 'average_rating', 'total_ratings',
        'total_distance_km', 'total_working_hours', 'performance_score',
        'status', 'calculated_at', 'approved_at',
    ];

    protected $casts = [
        'average_rating' => 'decimal:2',
        'performance_score' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function bonuses(): HasMany
    {
        return $this->hasMany(EmployeeBonus::class);
    }

    /**
     * Calculate performance score
     */
    public function calculateScore(): float
    {
        // Formula: bisa disesuaikan
        $successRate = $this->total_deliveries > 0 
            ? ($this->successful_deliveries / $this->total_deliveries) * 100 
            : 0;
        
        $onTimeRate = $this->total_deliveries > 0
            ? ($this->on_time_deliveries / $this->total_deliveries) * 100
            : 0;
        
        $ratingScore = $this->average_rating * 20; // Convert 0-5 to 0-100
        
        // Weighted average
        $score = ($successRate * 0.4) + ($onTimeRate * 0.3) + ($ratingScore * 0.3);
        
        return round($score, 2);
    }
}
```

### BonusRule Model

```php
// app/Models/BonusRule.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BonusRule extends Model
{
    protected $fillable = [
        'name', 'code', 'type', 'config',
        'min_deliveries', 'min_rating', 'min_performance_score',
        'effective_date', 'end_date', 'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'min_rating' => 'decimal:2',
        'min_performance_score' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
    ];

    public function bonuses(): HasMany
    {
        return $this->hasMany(EmployeeBonus::class);
    }

    /**
     * Check if employee qualifies for this bonus
     */
    public function qualifies(CourierPerformance $performance): bool
    {
        // Check minimum deliveries
        if ($this->min_deliveries && $performance->total_deliveries < $this->min_deliveries) {
            return false;
        }

        // Check minimum rating
        if ($this->min_rating && $performance->average_rating < $this->min_rating) {
            return false;
        }

        // Check minimum performance score
        if ($this->min_performance_score && $performance->performance_score < $this->min_performance_score) {
            return false;
        }

        return true;
    }

    /**
     * Calculate bonus amount
     */
    public function calculateBonus(CourierPerformance $performance, EmployeeSalary $salary): float
    {
        if (!$this->qualifies($performance)) {
            return 0;
        }

        $config = $this->config ?? [];

        switch ($this->type) {
            case 'fixed':
                $amount = $config['amount'] ?? 0;
                if (isset($config['per_delivery']) && $config['per_delivery']) {
                    return $amount * $performance->successful_deliveries;
                }
                return $amount;

            case 'percentage':
                $percentage = $config['percentage'] ?? 0;
                return ($salary->base_salary * $percentage) / 100;

            case 'tiered':
                $tiers = $config['tiers'] ?? [];
                $deliveries = $performance->total_deliveries;
                
                foreach ($tiers as $tier) {
                    if ($deliveries >= $tier['min'] && $deliveries <= $tier['max']) {
                        return $tier['amount'];
                    }
                }
                return 0;

            case 'formula':
                // Custom formula calculation
                $formula = $config['formula'] ?? '0';
                // Replace variables
                $formula = str_replace('base_salary', $salary->base_salary, $formula);
                $formula = str_replace('deliveries', $performance->total_deliveries, $formula);
                $formula = str_replace('rating', $performance->average_rating, $formula);
                $formula = str_replace('score', $performance->performance_score, $formula);
                
                // Evaluate formula (gunakan library yang aman untuk eval)
                // Atau gunakan parser yang lebih aman
                return eval("return $formula;");

            default:
                return 0;
        }
    }
}
```

---

## 🔧 Service Implementation

### PayrollService

```php
// app/Services/PayrollService.php
<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\CourierPerformance;
use App\Models\Payroll;
use App\Models\EmployeeBonus;
use App\Models\BonusRule;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    /**
     * Calculate payroll for employee in specific month
     */
    public function calculatePayroll(Employee $employee, int $year, int $month): Payroll
    {
        return DB::transaction(function () use ($employee, $year, $month) {
            // Get active salary
            $salary = $employee->activeSalary;
            if (!$salary) {
                throw new \Exception("Employee tidak memiliki active salary");
            }

            // Get or create performance
            $performance = CourierPerformance::firstOrCreate(
                [
                    'employee_id' => $employee->id,
                    'year' => $year,
                    'month' => $month,
                ],
                [
                    'status' => 'draft',
                ]
            );

            // Calculate performance score
            $performance->performance_score = $performance->calculateScore();
            $performance->status = 'calculated';
            $performance->calculated_at = now();
            $performance->save();

            // Calculate bonuses
            $activeBonusRules = BonusRule::where('is_active', true)
                ->where('effective_date', '<=', now())
                ->where(function ($q) {
                    $q->whereNull('end_date')
                      ->orWhere('end_date', '>=', now());
                })
                ->get();

            $totalBonuses = 0;
            foreach ($activeBonusRules as $rule) {
                if ($rule->qualifies($performance)) {
                    $bonusAmount = $rule->calculateBonus($performance, $salary);

                    if ($bonusAmount > 0) {
                        EmployeeBonus::updateOrCreate(
                            [
                                'employee_id' => $employee->id,
                                'bonus_rule_id' => $rule->id,
                                'year' => $year,
                                'month' => $month,
                            ],
                            [
                                'courier_performance_id' => $performance->id,
                                'bonus_name' => $rule->name,
                                'bonus_type' => $rule->type,
                                'base_amount' => $salary->base_salary,
                                'bonus_amount' => $bonusAmount,
                                'multiplier' => $performance->total_deliveries,
                                'calculation_details' => [
                                    'deliveries' => $performance->total_deliveries,
                                    'rating' => $performance->average_rating,
                                    'score' => $performance->performance_score,
                                ],
                                'status' => 'calculated',
                            ]
                        );

                        $totalBonuses += $bonusAmount;
                    }
                }
            }

            // Calculate totals
            $totalAllowances = $salary->transport_allowance + $salary->meal_allowance;
            $grossSalary = $salary->base_salary + $totalAllowances + $totalBonuses;
            $netSalary = $grossSalary; // Assuming no deductions for now

            // Create or update payroll
            $payroll = Payroll::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'year' => $year,
                    'month' => $month,
                ],
                [
                    'base_salary' => $salary->base_salary,
                    'transport_allowance' => $salary->transport_allowance,
                    'meal_allowance' => $salary->meal_allowance,
                    'total_allowances' => $totalAllowances,
                    'total_bonuses' => $totalBonuses,
                    'deductions' => 0,
                    'gross_salary' => $grossSalary,
                    'net_salary' => $netSalary,
                    'total_deliveries' => $performance->total_deliveries,
                    'average_rating' => $performance->average_rating,
                    'performance_score' => $performance->performance_score,
                    'status' => 'calculated',
                    'calculated_at' => now(),
                ]
            );

            return $payroll;
        });
    }

    /**
     * Get payroll summary for employee
     */
    public function getPayrollSummary(Employee $employee, int $year, int $month): array
    {
        $payroll = Payroll::where('employee_id', $employee->id)
            ->where('year', $year)
            ->where('month', $month)
            ->first();

        if (!$payroll) {
            $payroll = $this->calculatePayroll($employee, $year, $month);
        }

        $bonuses = EmployeeBonus::where('employee_id', $employee->id)
            ->where('year', $year)
            ->where('month', $month)
            ->get();

        return [
            'payroll' => $payroll,
            'bonuses' => $bonuses,
            'breakdown' => [
                'base_salary' => $payroll->base_salary,
                'allowances' => $payroll->total_allowances,
                'bonuses' => $payroll->total_bonuses,
                'gross' => $payroll->gross_salary,
                'net' => $payroll->net_salary,
            ],
        ];
    }
}
```

---

## 📝 Contoh Data Bonus Rules

```php
// Seeder untuk bonus rules
BonusRule::create([
    'name' => 'Bonus Delivery',
    'code' => 'BONUS_DELIVERY',
    'type' => 'fixed',
    'config' => [
        'amount' => 5000,
        'per_delivery' => true, // 5000 per delivery
    ],
    'min_deliveries' => 10,
    'effective_date' => now(),
    'is_active' => true,
]);

BonusRule::create([
    'name' => 'Bonus Rating',
    'code' => 'BONUS_RATING',
    'type' => 'percentage',
    'config' => [
        'percentage' => 10, // 10% dari base salary
    ],
    'min_rating' => 4.5,
    'min_deliveries' => 50,
    'effective_date' => now(),
    'is_active' => true,
]);

BonusRule::create([
    'name' => 'Bonus Tiered Delivery',
    'code' => 'BONUS_TIERED',
    'type' => 'tiered',
    'config' => [
        'tiers' => [
            ['min' => 0, 'max' => 50, 'amount' => 0],
            ['min' => 51, 'max' => 100, 'amount' => 500000],
            ['min' => 101, 'max' => 150, 'amount' => 1000000],
            ['min' => 151, 'max' => 999, 'amount' => 2000000],
        ],
    ],
    'min_rating' => 4.0,
    'effective_date' => now(),
    'is_active' => true,
]);
```

---

## ✅ Best Practices

1. **✅ Separate Tables** - Salary, Performance, Bonus, Payroll terpisah
2. **✅ History Tracking** - Semua perubahan gaji dan bonus tercatat
3. **✅ Flexible Bonus Rules** - Configurable bonus rules dengan JSON
4. **✅ Monthly Period** - Semua data di-group per bulan
5. **✅ Status Tracking** - Draft → Calculated → Approved → Paid
6. **✅ Audit Trail** - Calculation details disimpan untuk audit
7. **✅ Transaction** - Gunakan DB transaction untuk consistency

---

## 🎯 Kesimpulan

**Struktur yang disarankan:**
- `employees` - Base employee data
- `employee_salaries` - Base salary & allowances (dengan history)
- `courier_performances` - Performance tracking per bulan
- `bonus_rules` - Configurable bonus rules
- `employee_bonuses` - Calculated bonuses per bulan
- `payrolls` - Monthly payroll summary

Dengan struktur ini, sistem bisa:
- ✅ Track performance kurir per bulan
- ✅ Calculate bonus berdasarkan multiple rules
- ✅ Maintain history salary changes
- ✅ Generate payroll dengan breakdown lengkap
- ✅ Flexible untuk perubahan bonus rules di masa depan

