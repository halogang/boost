<?php

namespace App\Services;

use App\Models\ProductProduct;
use App\Models\Uom;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

class ProductProductService
{
    /**
     * Get paginated products with filters
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedProducts(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $search = trim($filters['search'] ?? '');
        $typeFilter = trim($filters['type'] ?? '');
        $categoryFilter = trim($filters['category'] ?? '');
        $activeFilter = trim($filters['active'] ?? '');

        $query = ProductProduct::query()
            ->with(['uom', 'uomPo'])
            ->when(!empty($search), function ($query) use ($search) {
                return $query->search($search);
            })
            ->when(!empty($typeFilter), function ($query) use ($typeFilter) {
                return $query->where('type', $typeFilter);
            })
            ->when(!empty($categoryFilter), function ($query) use ($categoryFilter) {
                return $query->where('categ_name', $categoryFilter);
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
     * @return SupportCollection
     */
    public function getCategories(): SupportCollection
    {
        return ProductProduct::distinct()
            ->whereNotNull('categ_name')
            ->pluck('categ_name')
            ->sort()
            ->values();
    }

    /**
     * Get product types mapping
     *
     * @return array
     */
    public function getTypes(): array
    {
        return [
            'consu' => 'Consumable',
            'service' => 'Service',
            'product' => 'Storable Product',
        ];
    }

    /**
     * Get active UOMs for dropdown
     *
     * @return Collection
     */
    public function getUoms(): Collection
    {
        return Uom::active()->ordered()->get();
    }

    /**
     * Get a single product with relationships
     *
     * @param ProductProduct $product
     * @return ProductProduct
     */
    public function getProduct(ProductProduct $product): ProductProduct
    {
        $product->load(['uom', 'uomPo']);
        return $product;
    }

    /**
     * Create a new product
     *
     * @param array $data
     * @return ProductProduct
     * @throws \Exception
     */
    public function createProduct(array $data): ProductProduct
    {
        try {
            return ProductProduct::create($data);
        } catch (\Exception $e) {
            throw new \Exception('Gagal menambahkan produk: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing product
     *
     * @param ProductProduct $product
     * @param array $data
     * @return ProductProduct
     * @throws \Exception
     */
    public function updateProduct(ProductProduct $product, array $data): ProductProduct
    {
        try {
            $product->update($data);
            return $product->fresh();
        } catch (\Exception $e) {
            throw new \Exception('Gagal memperbarui produk: ' . $e->getMessage());
        }
    }

    /**
     * Delete a product
     *
     * @param ProductProduct $product
     * @return string Product name for success message
     * @throws \Exception
     */
    public function deleteProduct(ProductProduct $product): string
    {
        try {
            $productName = $product->name;
            $product->delete();
            return $productName;
        } catch (\Exception $e) {
            throw new \Exception('Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}

