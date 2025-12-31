<?php

namespace App\Http\Controllers\Purchase;

use App\Models\AccountMove;
use App\Models\AccountMoveLine;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class AccountMoveController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:read finance', ['only' => ['index', 'show']]);
        $this->middleware('permission:create finance', ['only' => ['create', 'store']]);
        $this->middleware('permission:update finance', ['only' => ['edit', 'update', 'post', 'registerPayment']]);
    }

    /**
     * Display a listing of vendor bills
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = trim($request->input('search', ''));
        $stateFilter = trim($request->input('state', ''));
        $paymentStateFilter = trim($request->input('payment_state', ''));
        $yearFilter = trim($request->input('year', ''));
        $monthFilter = trim($request->input('month', ''));

        $bills = AccountMove::query()
            ->vendorBills()
            ->with([
                'partner',
                'purchaseOrder' => function ($query) {
                    $query->withTrashed();
                },
                'user'
            ])
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('ref', 'like', "%{$search}%")
                      ->orWhereHas('partner', function ($partnerQuery) use ($search) {
                          $partnerQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when(!empty($stateFilter), function ($query) use ($stateFilter) {
                return $query->where('state', $stateFilter);
            })
            ->when(!empty($paymentStateFilter), function ($query) use ($paymentStateFilter) {
                return $query->where('payment_state', $paymentStateFilter);
            })
            ->when(!empty($yearFilter), function ($query) use ($yearFilter) {
                return $query->whereYear('invoice_date', $yearFilter);
            })
            ->when(!empty($monthFilter), function ($query) use ($monthFilter) {
                return $query->whereMonth('invoice_date', $monthFilter);
            })
            ->orderByRaw('YEAR(invoice_date) DESC')
            ->orderByRaw('MONTH(invoice_date) DESC')
            ->orderBy('invoice_date', 'asc') // Tanggal lama di bawah
            ->orderBy('created_at', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        // FORCE EXPLICIT SERIALIZATION
        $bills->through(function ($bill) {
            return [
                'id' => $bill->id,
                'name' => $bill->name,
                'ref' => $bill->ref,
                'purchase_id' => $bill->purchase_id,
                'state' => $bill->state,
                'payment_state' => $bill->payment_state,
                'invoice_date' => $bill->invoice_date?->format('Y-m-d'),
                'invoice_date_due' => $bill->invoice_date_due?->format('Y-m-d'),
                'amount_untaxed' => $bill->amount_untaxed,
                'amount_tax' => $bill->amount_tax,
                'amount_total' => $bill->amount_total,
                'amount_residual' => $bill->amount_residual,
                'created_at' => $bill->created_at?->format('Y-m-d H:i:s'),
                'partner' => $bill->partner ? [
                    'id' => $bill->partner->id,
                    'name' => $bill->partner->name,
                ] : null,
                'purchaseOrder' => $bill->purchaseOrder ? [
                    'id' => $bill->purchaseOrder->id,
                    'name' => $bill->purchaseOrder->name,
                ] : null,
            ];
        });

        // Get available years and months for filter
        $availableYears = AccountMove::selectRaw('YEAR(invoice_date) as year')
            ->vendorBills()
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter()
            ->values();

        return Inertia::render('Purchase/VendorBill/Index', [
            'bills' => $bills,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
                'state' => $stateFilter,
                'payment_state' => $paymentStateFilter,
                'year' => $yearFilter,
                'month' => $monthFilter,
            ],
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * Show the form for creating a new vendor bill from PO
     */
    public function create(Request $request)
    {
        $purchaseOrderId = $request->input('purchase_id');
        
        if ($purchaseOrderId) {
            // Load purchase order with all necessary relationships
            // Don't use refresh() as it removes loaded relationships
            $purchaseOrder = PurchaseOrder::with([
                'orderLines.product', 
                'orderLines.uom', 
                'partner'
            ])->findOrFail($purchaseOrderId);
            
            // Reload order lines with fresh data (including qty_received and qty_invoiced)
            $purchaseOrder->load(['orderLines.product', 'orderLines.uom']);
            
            return Inertia::render('Purchase/VendorBill/Create', [
                'purchaseOrder' => $purchaseOrder,
            ]);
        }

        // If no PO, show list of PO that can be invoiced
        // PO yang bisa di-invoice: 
        // - state = 'purchase' (confirmed) atau 'done' (full received)
        // - invoice_status != 'paid' (bisa 'no', null, 'to invoice', atau 'invoiced' untuk partial)
        // - Memiliki order lines
        $perPage = $request->input('per_page', 10);
        $search = trim($request->input('search', ''));
        $stateFilter = trim($request->input('state', ''));
        $yearFilter = trim($request->input('year', ''));
        $monthFilter = trim($request->input('month', ''));

        $purchaseOrdersQuery = PurchaseOrder::whereIn('state', ['purchase', 'done']) // Bisa 'purchase' atau 'done'
            ->where(function($query) {
                $query->whereNull('invoice_status')
                      ->orWhere('invoice_status', 'no')
                      ->orWhere('invoice_status', 'to invoice')
                      ->orWhere('invoice_status', 'invoiced'); // Bisa di-invoice lagi jika partial
            })
            ->whereHas('orderLines') // Pastikan ada order lines
            ->with(['partner', 'orderLines'])
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhereHas('partner', function ($partnerQuery) use ($search) {
                          $partnerQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when(!empty($stateFilter), function ($query) use ($stateFilter) {
                return $query->where('state', $stateFilter);
            })
            ->when(!empty($yearFilter), function ($query) use ($yearFilter) {
                return $query->whereYear('date_order', $yearFilter);
            })
            ->when(!empty($monthFilter), function ($query) use ($monthFilter) {
                return $query->whereMonth('date_order', $monthFilter);
            })
            // Prioritas 1: Invoice Status (yang belum di-invoice atau to invoice di atas)
            ->orderByRaw("
                CASE 
                    WHEN invoice_status = 'to invoice' THEN 1
                    WHEN invoice_status IS NULL OR invoice_status = 'no' THEN 2
                    WHEN invoice_status = 'invoiced' THEN 3
                    ELSE 4
                END
            ")
            // Prioritas 2: State (done = sudah selesai, lebih prioritas untuk di-invoice)
            ->orderByRaw("
                CASE 
                    WHEN state = 'done' THEN 1
                    WHEN state = 'purchase' THEN 2
                    ELSE 3
                END
            ")
            // Prioritas 3: Tanggal order terbaru di atas (DESC)
            ->orderBy('date_order', 'desc')
            // Prioritas 4: Created at terbaru di atas
            ->orderBy('created_at', 'desc');

        $purchaseOrders = $purchaseOrdersQuery->paginate($perPage)->withQueryString();

        // Get available years and months for filter
        $availableYears = PurchaseOrder::selectRaw('YEAR(date_order) as year')
            ->whereIn('state', ['purchase', 'done'])
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter()
            ->values();

        return Inertia::render('Purchase/VendorBill/Create', [
            'purchaseOrders' => $purchaseOrders,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
                'state' => $stateFilter,
                'year' => $yearFilter,
                'month' => $monthFilter,
            ],
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * Store a newly created vendor bill
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_id' => 'required|exists:purchase_order,id',
            'invoice_date' => 'required|date',
            'invoice_date_due' => 'nullable|date',
            'ref' => 'nullable|string|max:255',
            'narration' => 'nullable|string',
            'invoice_method' => 'required|in:ordered,received', // Ordered quantities or Received quantities
        ]);

        try {
            // Load purchase order with all necessary relationships
            $purchaseOrder = PurchaseOrder::with(['orderLines.product', 'orderLines.uom'])->findOrFail($validated['purchase_id']);
            
            // Reload order lines with fresh data (including qty_received and qty_invoiced)
            $purchaseOrder->load(['orderLines.product', 'orderLines.uom']);

            // Check if already invoiced
            if ($purchaseOrder->invoice_status === 'paid') {
                return back()->with('error', 'PO ini sudah di-invoice dan dibayar');
            }

            // Generate invoice number
            $invoiceNumber = 'BILL/' . date('Y') . '/' . str_pad(
                AccountMove::vendorBills()
                    ->whereYear('created_at', date('Y'))
                    ->count() + 1,
                5,
                '0',
                STR_PAD_LEFT
            );

            // Calculate due date from payment term
            $dueDate = $validated['invoice_date_due'] ?? 
                ($purchaseOrder->partner->property_payment_term_id === '30_days' 
                    ? \Carbon\Carbon::parse($validated['invoice_date'])->addDays(30)
                    : \Carbon\Carbon::parse($validated['invoice_date']));

            $bill = AccountMove::create([
                'name' => $invoiceNumber,
                'partner_id' => $purchaseOrder->partner_id,
                'purchase_id' => $purchaseOrder->id,
                'move_type' => 'in_invoice',
                'state' => 'draft',
                'payment_state' => 'not_paid',
                'invoice_date' => $validated['invoice_date'],
                'invoice_date_due' => $dueDate,
                'ref' => $validated['ref'] ?? null,
                'narration' => $validated['narration'] ?? null,
                'currency_id' => $purchaseOrder->currency_id ?? 'IDR',
                'invoice_payment_term_id' => $purchaseOrder->payment_term_id ?? $purchaseOrder->partner->property_payment_term_id,
                'journal_id' => 'PURCHASE', // Default purchase journal
                'user_id' => Auth::id(),
            ]);

            // Create move lines based on invoice method
            $amountUntaxed = 0;
            $amountTax = 0;

            foreach ($purchaseOrder->orderLines as $line) {
                // For consumable products (consu), always use ordered quantity (no receipt tracking)
                // For storable products (product), use method selected (ordered or received)
                // If method is 'received' but qty_received is 0, fallback to ordered qty
                $isStorableProduct = $line->product->type === 'product';
                $useReceivedQty = $validated['invoice_method'] === 'received' 
                    && $isStorableProduct
                    && ($line->qty_received ?? 0) > 0; // Only use received if there's actual qty_received
                
                $qty = $useReceivedQty 
                    ? ($line->qty_received ?? 0) 
                    : ($line->product_qty ?? 0);
                
                // Calculate qty to invoice (subtract already invoiced)
                $qtyToInvoice = $qty - ($line->qty_invoiced ?? 0);

                // Skip if no quantity to invoice
                if ($qtyToInvoice <= 0) continue;

                $subtotal = $qtyToInvoice * $line->price_unit;
                $tax = $subtotal * ($line->tax_rate / 100);
                $total = $subtotal + $tax;

                AccountMoveLine::create([
                    'move_id' => $bill->id,
                    'purchase_line_id' => $line->id,
                    'product_id' => $line->product_id,
                    'name' => $line->name,
                    'quantity' => $qtyToInvoice,
                    'price_unit' => $line->price_unit,
                    'price_subtotal' => $subtotal,
                    'price_total' => $total,
                    'tax_id' => $line->tax_id,
                    'tax_rate' => $line->tax_rate,
                ]);

                // Update purchase line invoiced quantity
                $line->update([
                    'qty_invoiced' => ($line->qty_invoiced ?? 0) + $qtyToInvoice,
                ]);

                $amountUntaxed += $subtotal;
                $amountTax += $tax;
            }

            // Update bill totals
            $bill->update([
                'amount_untaxed' => $amountUntaxed,
                'amount_tax' => $amountTax,
                'amount_total' => $amountUntaxed + $amountTax,
                'amount_residual' => $amountUntaxed + $amountTax,
            ]);

            // Update PO invoice status
            $purchaseOrder->update([
                'invoice_status' => 'invoiced',
            ]);

            return redirect()->route('vendor-bills.show', $bill)
                ->with('success', 'Vendor Bill berhasil dibuat');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Gagal membuat Vendor Bill: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified vendor bill
     */
    public function show(AccountMove $accountMove)
    {
        $accountMove->load([
            'partner',
            'purchaseOrder.partner',
            'moveLines.product',
            'moveLines.purchaseLine',
            'user',
            'payments.user' // Load payment history with user
        ]);

        return Inertia::render('Purchase/VendorBill/Show', [
            'bill' => $accountMove,
        ]);
    }

    /**
     * Post vendor bill
     */
    public function post(AccountMove $accountMove)
    {
        if ($accountMove->state !== 'draft') {
            return back()->with('error', 'Hanya draft bill yang dapat di-post');
        }

        try {
            $accountMove->post();

            return redirect()->route('vendor-bills.show', $accountMove)
                ->with('success', 'Vendor Bill berhasil di-post');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mem-post Vendor Bill: ' . $e->getMessage());
        }
    }

    /**
     * Register payment for vendor bill
     */
    public function registerPayment(Request $request, AccountMove $accountMove)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $accountMove->amount_residual,
            'payment_method' => 'required|in:bank,cash,giro',
            'payment_date' => 'required|date',
            'reference' => 'nullable|string|max:255',
        ]);

        try {
            $accountMove->registerPayment(
                $validated['amount'],
                $validated['payment_method'],
                $validated['payment_date'],
                $validated['reference'] ?? null,
                Auth::id()
            );

            return redirect()->route('vendor-bills.show', $accountMove)
                ->with('success', 'Pembayaran berhasil diregistrasi');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal meregistrasi pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Download PDF for Vendor Bill
     */
    public function downloadPdf(AccountMove $accountMove)
    {
        $accountMove->load([
            'partner',
            'purchaseOrder.partner',
            'moveLines.product',
            'moveLines.purchaseLine',
            'payments.user',
            'user'
        ]);

        $pdf = Pdf::loadView('pdfs.vendor-bill', [
            'bill' => $accountMove
        ]);

        $filename = $accountMove->name . '.pdf';
        
        return $pdf->download($filename);
    }
}

