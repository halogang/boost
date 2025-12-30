<?php

namespace Database\Seeders;

use App\Models\Uom;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Data UOM sesuai standar Odoo
     */
    public function run(): void
    {
        $uoms = [
            // ===== UNIT CATEGORY =====
            [
                'name' => 'Unit',
                'category' => 'Unit',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Standard unit of measure',
                'order' => 1,
            ],
            [
                'name' => 'Dozen',
                'category' => 'Unit',
                'ratio' => 12.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => '12 units',
                'order' => 2,
            ],
            [
                'name' => 'Gross',
                'category' => 'Unit',
                'ratio' => 144.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => '144 units (12 dozen)',
                'order' => 3,
            ],
            [
                'name' => 'Box',
                'category' => 'Unit',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Box unit',
                'order' => 4,
            ],
            [
                'name' => 'Pack',
                'category' => 'Unit',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Pack unit',
                'order' => 5,
            ],

            // ===== WEIGHT CATEGORY =====
            [
                'name' => 'Kilogram',
                'category' => 'Weight',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Kilogram (kg)',
                'order' => 1,
            ],
            [
                'name' => 'Gram',
                'category' => 'Weight',
                'ratio' => 0.001,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Gram (g)',
                'order' => 2,
            ],
            [
                'name' => 'Ton',
                'category' => 'Weight',
                'ratio' => 1000.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Metric ton (1000 kg)',
                'order' => 3,
            ],
            [
                'name' => 'Pound',
                'category' => 'Weight',
                'ratio' => 0.453592,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Pound (lb)',
                'order' => 4,
            ],
            [
                'name' => 'Ounce',
                'category' => 'Weight',
                'ratio' => 0.0283495,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Ounce (oz)',
                'order' => 5,
            ],

            // ===== VOLUME CATEGORY =====
            [
                'name' => 'Liter',
                'category' => 'Volume',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Liter (L)',
                'order' => 1,
            ],
            [
                'name' => 'Milliliter',
                'category' => 'Volume',
                'ratio' => 0.001,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Milliliter (mL)',
                'order' => 2,
            ],
            [
                'name' => 'Gallon',
                'category' => 'Volume',
                'ratio' => 3.78541,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'US Gallon',
                'order' => 3,
            ],
            [
                'name' => 'Cubic Meter',
                'category' => 'Volume',
                'ratio' => 1000.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Cubic meter (m³)',
                'order' => 4,
            ],

            // ===== LENGTH CATEGORY =====
            [
                'name' => 'Meter',
                'category' => 'Length',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Meter (m)',
                'order' => 1,
            ],
            [
                'name' => 'Centimeter',
                'category' => 'Length',
                'ratio' => 0.01,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Centimeter (cm)',
                'order' => 2,
            ],
            [
                'name' => 'Millimeter',
                'category' => 'Length',
                'ratio' => 0.001,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Millimeter (mm)',
                'order' => 3,
            ],
            [
                'name' => 'Kilometer',
                'category' => 'Length',
                'ratio' => 1000.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Kilometer (km)',
                'order' => 4,
            ],
            [
                'name' => 'Inch',
                'category' => 'Length',
                'ratio' => 0.0254,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Inch (in)',
                'order' => 5,
            ],
            [
                'name' => 'Foot',
                'category' => 'Length',
                'ratio' => 0.3048,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Foot (ft)',
                'order' => 6,
            ],

            // ===== TIME CATEGORY =====
            [
                'name' => 'Hour',
                'category' => 'Time',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Hour (h)',
                'order' => 1,
            ],
            [
                'name' => 'Minute',
                'category' => 'Time',
                'ratio' => 0.0166667,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Minute (min)',
                'order' => 2,
            ],
            [
                'name' => 'Day',
                'category' => 'Time',
                'ratio' => 24.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Day (24 hours)',
                'order' => 3,
            ],
            [
                'name' => 'Week',
                'category' => 'Time',
                'ratio' => 168.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Week (7 days)',
                'order' => 4,
            ],
            [
                'name' => 'Month',
                'category' => 'Time',
                'ratio' => 730.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Month (approximately 30.4 days)',
                'order' => 5,
            ],

            // ===== AREA CATEGORY =====
            [
                'name' => 'Square Meter',
                'category' => 'Area',
                'ratio' => 1.0,
                'uom_type' => 'reference',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Square meter (m²)',
                'order' => 1,
            ],
            [
                'name' => 'Square Centimeter',
                'category' => 'Area',
                'ratio' => 0.0001,
                'uom_type' => 'smaller',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Square centimeter (cm²)',
                'order' => 2,
            ],
            [
                'name' => 'Hectare',
                'category' => 'Area',
                'ratio' => 10000.0,
                'uom_type' => 'bigger',
                'rounding' => 0.01,
                'active' => true,
                'description' => 'Hectare (ha)',
                'order' => 3,
            ],
        ];

        foreach ($uoms as $uom) {
            Uom::firstOrCreate(
                ['name' => $uom['name'], 'category' => $uom['category']],
                $uom
            );
        }
    }
}
