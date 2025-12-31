<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductProduct\StoreProductProductRequest;
use App\Http\Requests\ProductProduct\UpdateProductProductRequest;
use App\Models\ProductProduct;
use App\Services\ProductProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductProductController extends Controller
{
    public function __construct(
        protected ProductProductService $productService
    ) {
        // Authorization is now handled via Policy in Request classes and controller methods
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ProductProduct::class);

        $perPage = $request->input('per_page', 10);
        $filters = [
            'search' => $request->input('search', ''),
            'type' => $request->input('type', ''),
            'category' => $request->input('category', ''),
            'active' => $request->input('active', ''),
        ];

        $products = $this->productService->getPaginatedProducts($filters, $perPage);
        $categories = $this->productService->getCategories();
        $types = $this->productService->getTypes();

        return Inertia::render('MasterData/Pembelian/Product/Index', [
            'products' => $products,
            'categories' => $categories,
            'types' => $types,
            'filters' => [
                'search' => $filters['search'],
                'per_page' => (int) $perPage,
                'type' => $filters['type'],
                'category' => $filters['category'],
                'active' => $filters['active'],
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', ProductProduct::class);

        $uoms = $this->productService->getUoms();
        
        return Inertia::render('MasterData/Pembelian/Product/Create', [
            'uoms' => $uoms,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductProductRequest $request)
    {
        try {
            $this->productService->createProduct($request->validated());
            
            return redirect()->route('products.index')
                ->with('success', 'Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductProduct $product)
    {
        $this->authorize('view', $product);

        $product = $this->productService->getProduct($product);
        
        return Inertia::render('MasterData/Pembelian/Product/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductProduct $product)
    {
        $this->authorize('update', $product);

        $uoms = $this->productService->getUoms();
        
        return Inertia::render('MasterData/Pembelian/Product/Edit', [
            'product' => $product,
            'uoms' => $uoms,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductProductRequest $request, ProductProduct $product)
    {
        try {
            $this->productService->updateProduct($product, $request->validated());
            
            return redirect()->route('products.index')
                ->with('success', 'Produk berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductProduct $product)
    {
        $this->authorize('delete', $product);

        try {
            $productName = $this->productService->deleteProduct($product);
            
            return redirect()->route('products.index')
                ->with('success', "Produk '{$productName}' berhasil dihapus");
        } catch (\Exception $e) {
            return back()
                ->with('error', $e->getMessage());
        }
    }
}

