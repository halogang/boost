<?php

namespace App\Http\Controllers;

use App\Models\ProductProduct;
use App\Models\Uom;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ProductProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:read product', ['only' => ['index', 'show']]);
        $this->middleware('permission:create product', ['only' => ['create', 'store']]);
        $this->middleware('permission:update product', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete product', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = trim($request->input('search', ''));
        $typeFilter = trim($request->input('type', ''));
        $categoryFilter = trim($request->input('category', ''));
        $activeFilter = trim($request->input('active', ''));

        $products = ProductProduct::query()
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
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();

        // Get unique categories and types for filter
        $categories = ProductProduct::distinct()->whereNotNull('categ_name')->pluck('categ_name')->sort()->values();
        $types = [
            'consu' => 'Consumable',
            'service' => 'Service',
            'product' => 'Storable Product',
        ];

        return Inertia::render('MasterData/Pembelian/Product/Index', [
            'products' => $products,
            'categories' => $categories,
            'types' => $types,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
                'type' => $typeFilter,
                'category' => $categoryFilter,
                'active' => $activeFilter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $uoms = Uom::active()->ordered()->get();
        
        return Inertia::render('MasterData/Pembelian/Product/Create', [
            'uoms' => $uoms,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'default_code' => 'nullable|string|max:255|unique:product_product,default_code',
            'barcode' => 'nullable|string|max:255|unique:product_product,barcode',
            'description' => 'nullable|string',
            'description_purchase' => 'nullable|string',
            'description_sale' => 'nullable|string',
            'type' => 'required|in:consu,service,product',
            'purchase_method' => 'required|in:purchase,make_to_order,receive',
            'purchase_ok' => 'boolean',
            'sale_ok' => 'boolean',
            'active' => 'boolean',
            'uom_id' => 'nullable|exists:uoms,id',
            'uom_po_id' => 'nullable|exists:uoms,id',
            'list_price' => 'nullable|numeric|min:0',
            'standard_price' => 'nullable|numeric|min:0',
            'categ_name' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        try {
            ProductProduct::create($validated);
            
            return redirect()->route('products.index')
                ->with('success', 'Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Gagal menambahkan produk: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductProduct $product)
    {
        $product->load(['uom', 'uomPo']);
        
        return Inertia::render('MasterData/Pembelian/Product/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductProduct $product)
    {
        $uoms = Uom::active()->ordered()->get();
        
        return Inertia::render('MasterData/Pembelian/Product/Edit', [
            'product' => $product,
            'uoms' => $uoms,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductProduct $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'default_code' => 'nullable|string|max:255|unique:product_product,default_code,' . $product->id,
            'barcode' => 'nullable|string|max:255|unique:product_product,barcode,' . $product->id,
            'description' => 'nullable|string',
            'description_purchase' => 'nullable|string',
            'description_sale' => 'nullable|string',
            'type' => 'required|in:consu,service,product',
            'purchase_method' => 'required|in:purchase,make_to_order,receive',
            'purchase_ok' => 'boolean',
            'sale_ok' => 'boolean',
            'active' => 'boolean',
            'uom_id' => 'nullable|exists:uoms,id',
            'uom_po_id' => 'nullable|exists:uoms,id',
            'list_price' => 'nullable|numeric|min:0',
            'standard_price' => 'nullable|numeric|min:0',
            'categ_name' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        try {
            $product->update($validated);
            
            return redirect()->route('products.index')
                ->with('success', 'Produk berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Gagal memperbarui produk: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductProduct $product)
    {
        try {
            $productName = $product->name;
            $product->delete();
            
            return redirect()->route('products.index')
                ->with('success', "Produk '{$productName}' berhasil dihapus");
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}

