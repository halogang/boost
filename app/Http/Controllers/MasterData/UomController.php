<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\Uom\StoreUomRequest;
use App\Http\Requests\Uom\UpdateUomRequest;
use App\Models\Uom;
use App\Services\UomService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UomController extends Controller
{
    public function __construct(
        protected UomService $uomService
    ) {
        // Authorization is now handled via Policy in Request classes and controller methods
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Uom::class);

        $perPage = $request->input('per_page', 10);
        $filters = [
            'search' => $request->input('search', ''),
            'category' => $request->input('category', ''),
            'active' => $request->input('active', ''),
        ];

        $uoms = $this->uomService->getPaginatedUoms($filters, $perPage);
        $categories = $this->uomService->getCategories();

        return Inertia::render('MasterData/Pembelian/Uom/Index', [
            'uoms' => $uoms,
            'categories' => $categories,
            'filters' => [
                'search' => $filters['search'],
                'per_page' => (int) $perPage,
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
        $this->authorize('create', Uom::class);

        $categories = $this->uomService->getCategories();
        
        return Inertia::render('MasterData/Pembelian/Uom/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUomRequest $request)
    {
        try {
            $this->uomService->createUom($request->validated());

            return redirect()->route('uoms.index')
                ->with('success', 'UOM berhasil dibuat');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Uom $uom)
    {
        $this->authorize('view', $uom);

        $uom = $this->uomService->getUom($uom);

        return Inertia::render('MasterData/Pembelian/Uom/Show', [
            'uom' => $uom,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Uom $uom)
    {
        $this->authorize('update', $uom);

        $categories = $this->uomService->getCategories();
        
        return Inertia::render('MasterData/Pembelian/Uom/Edit', [
            'uom' => $uom,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUomRequest $request, Uom $uom)
    {
        try {
            $this->uomService->updateUom($uom, $request->validated());

            return redirect()->route('uoms.index')
                ->with('success', 'UOM berhasil diperbarui');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Uom $uom)
    {
        $this->authorize('delete', $uom);

        try {
            $uomName = $this->uomService->deleteUom($uom);

            return redirect()->route('uoms.index')
                ->with('success', "UOM \"{$uomName}\" berhasil dihapus");
        } catch (\Exception $e) {
            return back()
                ->with('error', $e->getMessage());
        }
    }
}
