<?php

namespace App\Http\Controllers\Purchase;

use App\Models\StockPicking;
use App\Models\StockMove;
use App\Models\PurchaseOrder;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StockPickingController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:read inventory', ['only' => ['index', 'show']]);
        $this->middleware('permission:update inventory', ['only' => ['update', 'receive']]);
    }

    /**
     * Display a listing of receipts
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = trim($request->input('search', ''));
        $stateFilter = trim($request->input('state', ''));

        $pickings = StockPicking::query()
            ->with([
                'purchaseOrder.partner',
                'user'
            ])
            ->incoming()
            ->when(!empty($search), function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhereHas('purchaseOrder', function ($poQuery) use ($search) {
                          $poQuery->where('name', 'like', "%{$search}%");
                      });
            });
            })
            ->when(!empty($stateFilter), function ($query) use ($stateFilter) {
                return $query->where('state', $stateFilter);
            })
            ->orderBy('scheduled_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // FORCE EXPLICIT SERIALIZATION
        $pickings->through(function ($picking) {
            return [
                'id' => $picking->id,
                'name' => $picking->name,
                'purchase_id' => $picking->purchase_id,
                'state' => $picking->state,
                'scheduled_date' => $picking->scheduled_date?->format('Y-m-d'),
                'date_done' => $picking->date_done?->format('Y-m-d H:i:s'),
                'created_at' => $picking->created_at?->format('Y-m-d H:i:s'),
                'purchaseOrder' => $picking->purchaseOrder ? [
                    'id' => $picking->purchaseOrder->id,
                    'name' => $picking->purchaseOrder->name,
                    'partner' => $picking->purchaseOrder->partner ? [
                        'id' => $picking->purchaseOrder->partner->id,
                        'name' => $picking->purchaseOrder->partner->name,
                    ] : null,
                ] : null,
            ];
        });

        return Inertia::render('Purchase/Receipt/Index', [
            'pickings' => $pickings,
            'filters' => [
                'search' => $search,
                'per_page' => (int) $perPage,
                'state' => $stateFilter,
            ],
        ]);
    }

    /**
     * Display the specified receipt
     */
    public function show(StockPicking $stockPicking)
    {
        $stockPicking->load([
            'purchaseOrder.partner',
            'purchaseOrder.orderLines.product',
            'moves.product',
            'moves.uom',
            'moves.purchaseLine',
            'user'
        ]);

        return Inertia::render('Purchase/Receipt/Show', [
            'picking' => $stockPicking,
        ]);
    }

    /**
     * Receive products (partial or full)
     */
    public function receive(Request $request, StockPicking $stockPicking)
    {
        $validated = $request->validate([
            'moves' => 'required|array',
            'moves.*.id' => 'required|exists:stock_move,id',
            'moves.*.quantity_done' => 'required|numeric|min:0',
        ]);

        try {
            foreach ($validated['moves'] as $moveData) {
                $move = StockMove::find($moveData['id']);
                
                if ($move && $move->picking_id === $stockPicking->id) {
                    $qtyDone = min($moveData['quantity_done'], $move->product_uom_qty);
                    $move->markAsDone($qtyDone);
                }
            }

            // Check if all moves are done
            $allDone = $stockPicking->moves()
                ->where('state', '!=', 'done')
                ->doesntExist();

            if ($allDone) {
                $stockPicking->markAsDone();
            } else {
                $stockPicking->update(['state' => 'assigned']);
            }

            return redirect()->route('receipts.show', $stockPicking)
                ->with('success', 'Barang berhasil diterima');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menerima barang: ' . $e->getMessage());
        }
    }

    /**
     * Download PDF for Receipt
     */
    public function downloadPdf(StockPicking $stockPicking)
    {
        $stockPicking->load([
            'purchaseOrder.partner',
            'purchaseOrder.orderLines.product',
            'moves.product',
            'moves.uom',
            'moves.purchaseLine',
            'user'
        ]);

        $pdf = Pdf::loadView('pdfs.receipt', [
            'picking' => $stockPicking
        ]);

        $filename = $stockPicking->name . '.pdf';
        
        return $pdf->download($filename);
    }
}