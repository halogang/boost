<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class UomController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:read uom', ['only' => ['index', 'show']]);
        $this->middleware('permission:create uom', ['only' => ['create', 'store']]);
        $this->middleware('permission:update uom', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete uom', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = trim($request->input('search', ''));
        $categoryFilter = trim($request->input('category', ''));
        $activeFilter = trim($request->input('active', ''));

        $uoms = Uom::query()
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
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();

        // Get unique categories for filter
        $categories = Uom::distinct()->pluck('category')->sort()->values();

        return Inertia::render('MasterData/Pembelian/Uom/Index', [
            'uoms' => $uoms,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
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
        $categories = Uom::distinct()->pluck('category')->sort()->values();
        
        return Inertia::render('MasterData/Pembelian/Uom/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'ratio' => 'required|numeric|min:0',
            'uom_type' => 'required|in:reference,bigger,smaller',
            'rounding' => 'nullable|numeric|min:0',
            'active' => 'boolean',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ]);

        try {
            Uom::create($validated);

            return redirect()->route('uoms.index')
                ->with('success', 'UOM berhasil dibuat');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Gagal membuat UOM: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Uom $uom)
    {
        return Inertia::render('MasterData/Pembelian/Uom/Show', [
            'uom' => $uom,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Uom $uom)
    {
        $categories = Uom::distinct()->pluck('category')->sort()->values();
        
        return Inertia::render('MasterData/Pembelian/Uom/Edit', [
            'uom' => $uom,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Uom $uom)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'ratio' => 'required|numeric|min:0',
            'uom_type' => 'required|in:reference,bigger,smaller',
            'rounding' => 'nullable|numeric|min:0',
            'active' => 'boolean',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ]);

        try {
            $uom->update($validated);

            return redirect()->route('uoms.index')
                ->with('success', 'UOM berhasil diperbarui');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Gagal memperbarui UOM: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Uom $uom)
    {
        try {
            $uomName = $uom->name;
            $uom->delete();

            return redirect()->route('uoms.index')
                ->with('success', "UOM \"{$uomName}\" berhasil dihapus");
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Gagal menghapus UOM: ' . $e->getMessage());
        }
    }
}
