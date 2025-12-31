<?php

namespace App\Http\Controllers\Purchase;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderLine;
use App\Models\ResPartner;
use App\Models\ProductProduct;
use App\Models\StockPicking;
use App\Models\StockMove;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PurchaseOrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:read purchasing', ['only' => ['index', 'show']]);
        $this->middleware('permission:create purchasing', ['only' => ['create', 'store']]);
        $this->middleware('permission:update purchasing', ['only' => ['edit', 'update', 'confirm']]);
        $this->middleware('permission:delete purchasing', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of RFQ/PO
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = trim($request->input('search', ''));
        $typeFilter = trim($request->input('type', '')); // rfq atau po
        $stateFilter = trim($request->input('state', ''));

        $orders = PurchaseOrder::query()
            ->with(['partner', 'user'])
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhereHas('partner', function ($partnerQuery) use ($search) {
                          $partnerQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when(!empty($typeFilter), function ($query) use ($typeFilter) {
                if ($typeFilter === 'rfq') {
                    return $query->rfq();
                } elseif ($typeFilter === 'po') {
                    return $query->po();
                }
            })
            ->when(!empty($stateFilter), function ($query) use ($stateFilter) {
                return $query->where('state', $stateFilter);
            })
            ->orderBy('date_order', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Purchase/Order/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
                'type' => $typeFilter,
                'state' => $stateFilter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new RFQ
     */
    public function create()
    {
        $vendors = ResPartner::suppliers()->orderBy('name')->get();
        $products = ProductProduct::purchasable()->active()->with(['uom', 'uomPo'])->ordered()->get();
        
        return Inertia::render('Purchase/Order/Create', [
            'vendors' => $vendors,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created RFQ
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_id' => 'required|exists:res_partner,id',
            'date_order' => 'required|date',
            'date_planned' => 'nullable|date',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'lines' => 'required|array|min:1',
            'lines.*.product_id' => 'required|exists:product_product,id',
            'lines.*.product_qty' => 'required|numeric|min:0.001',
            'lines.*.price_unit' => 'required|numeric|min:0',
            'lines.*.tax_rate' => 'nullable|numeric|min:0|max:100',
            'lines.*.date_planned' => 'nullable|date',
        ]);

        try {
            // Generate RFQ number
            $rfqNumber = 'RFQ' . date('Y') . str_pad(
                PurchaseOrder::whereYear('created_at', date('Y'))->count() + 1,
                5,
                '0',
                STR_PAD_LEFT
            );

            $order = PurchaseOrder::create([
                'name' => $rfqNumber,
                'partner_id' => $validated['partner_id'],
                'date_order' => $validated['date_order'],
                'date_planned' => $validated['date_planned'] ?? $validated['date_order'],
                'state' => 'draft',
                'order_type' => 'rfq',
                'currency_id' => 'IDR',
                'notes' => $validated['notes'] ?? null,
                'terms' => $validated['terms'] ?? null,
                'user_id' => Auth::id(),
            ]);

            // Create order lines
            $amountUntaxed = 0;
            $amountTax = 0;

            foreach ($validated['lines'] as $lineData) {
                $product = ProductProduct::find($lineData['product_id']);
                $subtotal = $lineData['product_qty'] * $lineData['price_unit'];
                $tax = $subtotal * (($lineData['tax_rate'] ?? 0) / 100);
                $total = $subtotal + $tax;

                PurchaseOrderLine::create([
                    'order_id' => $order->id,
                    'product_id' => $lineData['product_id'],
                    'name' => $product->description_purchase ?? $product->name,
                    'product_qty' => $lineData['product_qty'],
                    'product_uom_id' => $product->uom_po_id ?? $product->uom_id,
                    'price_unit' => $lineData['price_unit'],
                    'price_subtotal' => $subtotal,
                    'price_tax' => $tax,
                    'price_total' => $total,
                    'tax_rate' => $lineData['tax_rate'] ?? 0,
                    'date_planned' => $lineData['date_planned'] ?? $order->date_planned,
                ]);

                $amountUntaxed += $subtotal;
                $amountTax += $tax;
            }

            // Update order totals
            $order->update([
                'amount_untaxed' => $amountUntaxed,
                'amount_tax' => $amountTax,
                'amount_total' => $amountUntaxed + $amountTax,
            ]);

            // Reload order with relationships for redirect
            $order->load(['orderLines.product', 'orderLines.uom', 'partner']);
            
            return redirect()->route('purchase-orders.show', $order)
                ->with('success', 'RFQ berhasil dibuat');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Gagal membuat RFQ: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified RFQ/PO
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        // Load all relationships - use fresh query to ensure data is current
        $purchaseOrder = PurchaseOrder::with([
            'partner',
            'orderLines' => function ($query) {
                $query->with(['product', 'uom']);
            },
            'pickings.moves',
            'vendorBills.moveLines',
            'user'
        ])->findOrFail($purchaseOrder->id);

        // Ensure orderLines and nested relationships are loaded
        if (!$purchaseOrder->relationLoaded('orderLines')) {
            $purchaseOrder->load(['orderLines.product', 'orderLines.uom']);
        } else {
            // If already loaded, ensure nested relationships are loaded
            foreach ($purchaseOrder->orderLines as $line) {
                if (!$line->relationLoaded('product')) {
                    $line->load('product');
                }
                if (!$line->relationLoaded('uom')) {
                    $line->load('uom');
                }
            }
        }

        // Debug: Check if orderLines are loaded
        Log::info('PurchaseOrder Show Debug', [
            'order_id' => $purchaseOrder->id,
            'order_name' => $purchaseOrder->name,
            'orderLines_count' => $purchaseOrder->orderLines->count(),
            'orderLines_loaded' => $purchaseOrder->relationLoaded('orderLines'),
            'orderLines_ids' => $purchaseOrder->orderLines->pluck('id')->toArray(),
        ]);

        return Inertia::render('Purchase/Order/Show', [
            'order' => $purchaseOrder,
        ]);
    }

    /**
     * Show the form for editing the specified RFQ
     */
    public function edit(PurchaseOrder $purchaseOrder)
    {
        // Only allow edit if still in draft/sent state
        if (!in_array($purchaseOrder->state, ['draft', 'sent', 'to approve'])) {
            return redirect()->route('purchase-orders.show', $purchaseOrder)
                ->with('error', 'RFQ/PO tidak dapat diedit karena sudah dikonfirmasi');
        }

        $purchaseOrder->load(['orderLines.product', 'orderLines.uom']);
        $vendors = ResPartner::suppliers()->orderBy('name')->get();
        $products = ProductProduct::purchasable()->active()->with(['uom', 'uomPo'])->ordered()->get();

        return Inertia::render('Purchase/Order/Edit', [
            'order' => $purchaseOrder,
            'vendors' => $vendors,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified RFQ
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Only allow update if still in draft/sent state
        if (!in_array($purchaseOrder->state, ['draft', 'sent', 'to approve'])) {
            return back()->with('error', 'RFQ/PO tidak dapat diupdate karena sudah dikonfirmasi');
        }

        $validated = $request->validate([
            'partner_id' => 'required|exists:res_partner,id',
            'date_order' => 'required|date',
            'date_planned' => 'nullable|date',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'lines' => 'required|array|min:1',
            'lines.*.product_id' => 'required|exists:product_product,id',
            'lines.*.product_qty' => 'required|numeric|min:0.001',
            'lines.*.price_unit' => 'required|numeric|min:0',
            'lines.*.tax_rate' => 'nullable|numeric|min:0|max:100',
            'lines.*.date_planned' => 'nullable|date',
        ]);

        try {
            $purchaseOrder->update([
                'partner_id' => $validated['partner_id'],
                'date_order' => $validated['date_order'],
                'date_planned' => $validated['date_planned'] ?? $validated['date_order'],
                'notes' => $validated['notes'] ?? null,
                'terms' => $validated['terms'] ?? null,
            ]);

            // Delete existing lines
            $purchaseOrder->orderLines()->delete();

            // Create new lines
            $amountUntaxed = 0;
            $amountTax = 0;

            foreach ($validated['lines'] as $lineData) {
                $product = ProductProduct::find($lineData['product_id']);
                $subtotal = $lineData['product_qty'] * $lineData['price_unit'];
                $tax = $subtotal * (($lineData['tax_rate'] ?? 0) / 100);
                $total = $subtotal + $tax;

                PurchaseOrderLine::create([
                    'order_id' => $purchaseOrder->id,
                    'product_id' => $lineData['product_id'],
                    'name' => $product->description_purchase ?? $product->name,
                    'product_qty' => $lineData['product_qty'],
                    'product_uom_id' => $product->uom_po_id ?? $product->uom_id,
                    'price_unit' => $lineData['price_unit'],
                    'price_subtotal' => $subtotal,
                    'price_tax' => $tax,
                    'price_total' => $total,
                    'tax_rate' => $lineData['tax_rate'] ?? 0,
                    'date_planned' => $lineData['date_planned'] ?? $purchaseOrder->date_planned,
                ]);

                $amountUntaxed += $subtotal;
                $amountTax += $tax;
            }

            // Update order totals
            $purchaseOrder->update([
                'amount_untaxed' => $amountUntaxed,
                'amount_tax' => $amountTax,
                'amount_total' => $amountUntaxed + $amountTax,
            ]);

            return redirect()->route('purchase-orders.show', $purchaseOrder)
                ->with('success', 'RFQ berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Gagal memperbarui RFQ: ' . $e->getMessage());
        }
    }

    /**
     * Confirm RFQ to PO
     */
    public function confirm(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->state !== 'draft' && $purchaseOrder->state !== 'sent') {
            return back()->with('error', 'Hanya RFQ dengan status draft atau sent yang dapat dikonfirmasi');
        }

        try {
            // Generate PO number
            $poNumber = 'PO' . date('Y') . str_pad(
                PurchaseOrder::where('order_type', 'po')
                    ->whereYear('created_at', date('Y'))
                    ->count() + 1,
                5,
                '0',
                STR_PAD_LEFT
            );

            $purchaseOrder->update([
                'name' => $poNumber,
                'order_type' => 'po',
                'state' => 'purchase',
                'date_confirm' => now(),
                'receipt_status' => $purchaseOrder->orderLines()
                    ->whereHas('product', function ($q) {
                        $q->whereIn('type', ['product', 'consu']);
                    })
                    ->exists() ? 'to receive' : 'no',
            ]);

            // Reload purchase order with orderLines to ensure we have fresh data
            $purchaseOrder->load(['orderLines.product']);
            
            // Create stock picking if has products that can be received
            // Both 'product' (storable) and 'consu' (consumable) can be received
            $hasReceivableProducts = $purchaseOrder->orderLines()
                ->whereHas('product', function ($q) {
                    $q->whereIn('type', ['product', 'consu']);
                })
                ->exists();

            if ($hasReceivableProducts) {
                // Create stock picking (receipt)
                $pickingNumber = 'WH/IN/' . date('Y') . '/' . str_pad(
                    StockPicking::whereYear('created_at', date('Y'))->count() + 1,
                    5,
                    '0',
                    STR_PAD_LEFT
                );

                $picking = StockPicking::create([
                    'name' => $pickingNumber,
                    'purchase_id' => $purchaseOrder->id, // Ensure purchase_id is set
                    'picking_type_code' => 'incoming',
                    'location_dest_id' => 'WH/Stock', // Default warehouse location
                    'state' => 'confirmed',
                    'scheduled_date' => $purchaseOrder->date_planned,
                    'user_id' => Auth::id(),
                ]);

                // Reload picking to ensure purchase_id is saved
                $picking->refresh();

                // Create stock moves for each receivable product line (both product and consu)
                foreach ($purchaseOrder->orderLines as $line) {
                    // Ensure product is loaded
                    if (!$line->relationLoaded('product')) {
                        $line->load('product');
                    }
                    
                    // Both 'product' (storable) and 'consu' (consumable) can be received
                    if (in_array($line->product->type, ['product', 'consu'])) {
                        StockMove::create([
                            'picking_id' => $picking->id,
                            'purchase_line_id' => $line->id,
                            'product_id' => $line->product_id,
                            'product_uom_qty' => $line->product_qty,
                            'quantity_done' => 0,
                            'product_uom_id' => $line->product_uom_id,
                            'location_dest_id' => 'WH/Stock',
                            'state' => 'confirmed',
                            'reference' => $purchaseOrder->name,
                        ]);
                    }
                }
            }

            return redirect()->route('purchase-orders.show', $purchaseOrder)
                ->with('success', 'RFQ berhasil dikonfirmasi menjadi PO');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengonfirmasi RFQ: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified RFQ/PO
     */
    public function destroy(PurchaseOrder $purchaseOrder)
    {
        // Only allow delete if still in draft
        if ($purchaseOrder->state !== 'draft') {
            return back()->with('error', 'Hanya RFQ dengan status draft yang dapat dihapus');
        }

        try {
            $orderName = $purchaseOrder->name;
            $purchaseOrder->delete();

            return redirect()->route('purchase-orders.index')
                ->with('success', "RFQ/PO '{$orderName}' berhasil dihapus");
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus RFQ/PO: ' . $e->getMessage());
        }
    }

    /**
     * Download PDF for Purchase Order / RFQ
     */
    public function downloadPdf(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load([
            'partner',
            'orderLines.product',
            'orderLines.uom',
            'user'
        ]);

        $pdf = Pdf::loadView('pdfs.purchase-order', [
            'order' => $purchaseOrder
        ]);

        $filename = $purchaseOrder->name . '.pdf';
        
        return $pdf->download($filename);
    }
}

