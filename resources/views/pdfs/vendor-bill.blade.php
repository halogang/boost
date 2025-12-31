<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $bill->name }} - Vendor Bill</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }
        .header-left {
            flex: 1;
        }
        .header-right {
            flex: 1;
            text-align: right;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .document-title {
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .document-number {
            font-size: 16px;
            font-weight: bold;
            color: #0066cc;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
        }
        .info-value {
            flex: 1;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th {
            background-color: #f0f0f0;
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
        }
        .table td {
            padding: 8px 10px;
            border: 1px solid #ddd;
        }
        .table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .summary {
            margin-top: 20px;
            margin-left: auto;
            width: 300px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
        }
        .summary-row.total {
            font-weight: bold;
            font-size: 14px;
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
            padding: 10px 0;
        }
        .summary-row.residual {
            color: #dc3545;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
        }
        .status-draft { background-color: #e0e0e0; color: #333; }
        .status-posted { background-color: #d4edda; color: #155724; }
        .status-cancel { background-color: #f8d7da; color: #721c24; }
        .payment-not_paid { background-color: #f8d7da; color: #721c24; }
        .payment-partial { background-color: #fff3cd; color: #856404; }
        .payment-paid { background-color: #d4edda; color: #155724; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="company-name">PT. AJIB DARKAH</div>
            <div style="margin-top: 10px;">
                <div>Jl. Contoh No. 123</div>
                <div>Jakarta, Indonesia</div>
                <div>Telp: (021) 12345678</div>
            </div>
        </div>
        <div class="header-right">
            <div class="document-title">VENDOR BILL</div>
            <div class="document-number">{{ $bill->name }}</div>
            <div style="margin-top: 15px;">
                <div><strong>Status:</strong> 
                    <span class="status-badge status-{{ $bill->state }}">
                        @if($bill->state === 'draft') Draft
                        @elseif($bill->state === 'posted') Posted
                        @elseif($bill->state === 'cancel') Cancelled
                        @else {{ ucfirst($bill->state) }}
                        @endif
                    </span>
                </div>
                <div style="margin-top: 5px;"><strong>Payment Status:</strong> 
                    <span class="status-badge payment-{{ $bill->payment_state }}">
                        @if($bill->payment_state === 'not_paid') Belum Dibayar
                        @elseif($bill->payment_state === 'partial') Partial
                        @elseif($bill->payment_state === 'paid') Paid
                        @else {{ ucfirst($bill->payment_state) }}
                        @endif
                    </span>
                </div>
                <div style="margin-top: 5px;"><strong>Tanggal Invoice:</strong> {{ $bill->invoice_date->format('d/m/Y') }}</div>
                @if($bill->invoice_date_due)
                <div style="margin-top: 5px;"><strong>Jatuh Tempo:</strong> {{ $bill->invoice_date_due->format('d/m/Y') }}</div>
                @endif
            </div>
        </div>
    </div>

    <div class="info-section">
        <div class="info-row">
            <div class="info-label">Vendor:</div>
            <div class="info-value">{{ $bill->partner->name }}</div>
        </div>
        @if($bill->purchaseOrder)
        <div class="info-row">
            <div class="info-label">Purchase Order:</div>
            <div class="info-value">{{ $bill->purchaseOrder->name }}</div>
        </div>
        @endif
        @if($bill->ref)
        <div class="info-row">
            <div class="info-label">Reference:</div>
            <div class="info-value">{{ $bill->ref }}</div>
        </div>
        @endif
    </div>

    <table class="table">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 35%;">Produk</th>
                <th style="width: 10%;" class="text-center">Qty</th>
                <th style="width: 15%;" class="text-right">Harga/Unit</th>
                <th style="width: 10%;" class="text-center">Pajak</th>
                <th style="width: 15%;" class="text-right">Subtotal</th>
                <th style="width: 10%;" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bill->moveLines as $index => $line)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $line->product->name ?? $line->name }}</strong>
                    @if($line->product && $line->product->default_code)
                    <br><small style="color: #666;">{{ $line->product->default_code }}</small>
                    @endif
                </td>
                <td class="text-center">{{ number_format($line->quantity, 3, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($line->price_unit, 2, ',', '.') }}</td>
                <td class="text-center">{{ number_format($line->tax_rate, 2) }}%</td>
                <td class="text-right">Rp {{ number_format($line->price_subtotal, 2, ',', '.') }}</td>
                <td class="text-right"><strong>Rp {{ number_format($line->price_total, 2, ',', '.') }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>Rp {{ number_format($bill->amount_untaxed, 2, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span>Pajak:</span>
            <span>Rp {{ number_format($bill->amount_tax, 2, ',', '.') }}</span>
        </div>
        <div class="summary-row total">
            <span>TOTAL:</span>
            <span>Rp {{ number_format($bill->amount_total, 2, ',', '.') }}</span>
        </div>
        @if($bill->amount_residual > 0)
        <div class="summary-row residual">
            <span>Sisa Tagihan:</span>
            <span>Rp {{ number_format($bill->amount_residual, 2, ',', '.') }}</span>
        </div>
        @endif
    </div>

    @if($bill->payments && $bill->payments->count() > 0)
    <div style="margin-top: 30px;">
        <strong>Riwayat Pembayaran:</strong>
        <table class="table" style="margin-top: 10px;">
            <thead>
                <tr>
                    <th style="width: 20%;">Tanggal</th>
                    <th style="width: 20%;">No. Payment</th>
                    <th style="width: 15%;">Metode</th>
                    <th style="width: 20%;" class="text-right">Jumlah</th>
                    <th style="width: 25%;">Reference</th>
                </tr>
            </thead>
            <tbody>
                @foreach($bill->payments as $payment)
                <tr>
                    <td>{{ $payment->payment_date->format('d/m/Y') }}</td>
                    <td>{{ $payment->name }}</td>
                    <td>
                        @if($payment->payment_method === 'bank') Bank Transfer
                        @elseif($payment->payment_method === 'cash') Cash
                        @elseif($payment->payment_method === 'giro') Giro
                        @else {{ ucfirst($payment->payment_method) }}
                        @endif
                    </td>
                    <td class="text-right">Rp {{ number_format($payment->amount, 2, ',', '.') }}</td>
                    <td>{{ $payment->ref ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($bill->narration)
    <div style="margin-top: 30px;">
        <strong>Catatan:</strong>
        <div style="margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #0066cc;">
            {{ $bill->narration }}
        </div>
    </div>
    @endif

    <div class="footer">
        <div style="text-align: center;">
            Dokumen ini dibuat secara otomatis oleh sistem pada {{ now()->format('d/m/Y H:i:s') }}
        </div>
    </div>
</body>
</html>

