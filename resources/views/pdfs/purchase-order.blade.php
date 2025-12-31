<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $order->name }} - {{ $order->order_type === 'rfq' ? 'Request for Quotation' : 'Purchase Order' }}</title>
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
        .status-sent { background-color: #fff3cd; color: #856404; }
        .status-purchase { background-color: #d4edda; color: #155724; }
        .status-done { background-color: #cce5ff; color: #004085; }
        .status-cancel { background-color: #f8d7da; color: #721c24; }
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
            <div class="document-title">
                {{ $order->order_type === 'rfq' ? 'REQUEST FOR QUOTATION' : 'PURCHASE ORDER' }}
            </div>
            <div class="document-number">{{ $order->name }}</div>
            <div style="margin-top: 15px;">
                <div><strong>Status:</strong> 
                    <span class="status-badge status-{{ $order->state }}">
                        @if($order->state === 'draft') Draft
                        @elseif($order->state === 'sent') Sent
                        @elseif($order->state === 'purchase') Purchase Order
                        @elseif($order->state === 'done') Done
                        @elseif($order->state === 'cancel') Cancelled
                        @else {{ ucfirst($order->state) }}
                        @endif
                    </span>
                </div>
                <div style="margin-top: 5px;"><strong>Tanggal:</strong> {{ $order->date_order->format('d/m/Y') }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <div class="info-row">
            <div class="info-label">Vendor:</div>
            <div class="info-value">{{ $order->partner->name }}</div>
        </div>
        @if($order->partner->street)
        <div class="info-row">
            <div class="info-label">Alamat:</div>
            <div class="info-value">{{ $order->partner->street }}</div>
        </div>
        @endif
        @if($order->date_planned)
        <div class="info-row">
            <div class="info-label">Tanggal Direncanakan:</div>
            <div class="info-value">{{ $order->date_planned->format('d/m/Y') }}</div>
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
            @foreach($order->orderLines as $index => $line)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $line->product->name }}</strong><br>
                    <small style="color: #666;">{{ $line->product->default_code }}</small>
                </td>
                <td class="text-center">
                    {{ number_format($line->product_qty, 3, ',', '.') }} {{ $line->uom->name ?? '' }}
                </td>
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
            <span>Rp {{ number_format($order->amount_untaxed, 2, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span>Pajak:</span>
            <span>Rp {{ number_format($order->amount_tax, 2, ',', '.') }}</span>
        </div>
        <div class="summary-row total">
            <span>TOTAL:</span>
            <span>Rp {{ number_format($order->amount_total, 2, ',', '.') }}</span>
        </div>
    </div>

    @if($order->notes)
    <div style="margin-top: 30px;">
        <strong>Catatan:</strong>
        <div style="margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #0066cc;">
            {{ $order->notes }}
        </div>
    </div>
    @endif

    @if($order->terms)
    <div style="margin-top: 20px;">
        <strong>Syarat & Ketentuan:</strong>
        <div style="margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #0066cc;">
            {{ $order->terms }}
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

