<?php

namespace App\Services;

use App\Models\Uom;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UomService
{
    /**
     * Get paginated UOMs with filters
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedUoms(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $search = trim($filters['search'] ?? '');
        $categoryFilter = trim($filters['category'] ?? '');
        $activeFilter = trim($filters['active'] ?? '');

        $query = Uom::query()
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(!empty($categoryFilter), function ($query) use ($categoryFilter) {
                return $query->where('category', $categoryFilter);
            })
            ->when($activeFilter !== '', function ($query) use ($activeFilter) {
                return $query->where('active', $activeFilter === '1');
            })
            ->ordered();

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get all unique categories
     *
     * @return Collection
     */
    public function getCategories(): Collection
    {
        return Uom::distinct()
            ->pluck('category')
            ->sort()
            ->values();
    }

    /**
     * Get a single UOM
     *
     * @param Uom $uom
     * @return Uom
     */
    public function getUom(Uom $uom): Uom
    {
        return $uom;
    }

    /**
     * Create a new UOM
     *
     * @param array $data
     * @return Uom
     * @throws \Exception
     */
    public function createUom(array $data): Uom
    {
        try {
            return Uom::create($data);
        } catch (\Exception $e) {
            throw new \Exception('Gagal membuat UOM: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing UOM
     *
     * @param Uom $uom
     * @param array $data
     * @return Uom
     * @throws \Exception
     */
    public function updateUom(Uom $uom, array $data): Uom
    {
        try {
            $uom->update($data);
            return $uom->fresh();
        } catch (\Exception $e) {
            throw new \Exception('Gagal memperbarui UOM: ' . $e->getMessage());
        }
    }

    /**
     * Delete a UOM
     *
     * @param Uom $uom
     * @return string UOM name for success message
     * @throws \Exception
     */
    public function deleteUom(Uom $uom): string
    {
        try {
            $uomName = $uom->name;
            $uom->delete();
            return $uomName;
        } catch (\Exception $e) {
            throw new \Exception('Gagal menghapus UOM: ' . $e->getMessage());
        }
    }
}

