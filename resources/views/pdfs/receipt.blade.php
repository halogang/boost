<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $picking->name }} - Receipt</title>
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
        .status-assigned { background-color: #fff3cd; color: #856404; }
        .status-done { background-color: #d4edda; color: #155724; }
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
            <div class="document-title">RECEIPT / GOODS RECEIPT</div>
            <div class="document-number">{{ $picking->name }}</div>
            <div style="margin-top: 15px;">
                <div><strong>Status:</strong> 
                    <span class="status-badge status-{{ $picking->state }}">
                        @if($picking->state === 'draft') Draft
                        @elseif($picking->state === 'assigned') Assigned
                        @elseif($picking->state === 'done') Done
                        @elseif($picking->state === 'cancel') Cancelled
                        @else {{ ucfirst($picking->state) }}
                        @endif
                    </span>
                </div>
                <div style="margin-top: 5px;"><strong>Tanggal:</strong> {{ $picking->scheduled_date ? $picking->scheduled_date->format('d/m/Y') : '-' }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <div class="info-row">
            <div class="info-label">Purchase Order:</div>
            <div class="info-value">{{ $picking->purchaseOrder->name ?? '-' }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Vendor:</div>
            <div class="info-value">{{ $picking->purchaseOrder->partner->name ?? '-' }}</div>
        </div>
        @if($picking->location_id)
        <div class="info-row">
            <div class="info-label">Lokasi:</div>
            <div class="info-value">{{ $picking->location_id }}</div>
        </div>
        @endif
    </div>

    <table class="table">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 40%;">Produk</th>
                <th style="width: 15%;" class="text-center">Dipesan</th>
                <th style="width: 15%;" class="text-center">Diterima</th>
                <th style="width: 15%;" class="text-center">UoM</th>
                <th style="width: 10%;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($picking->moves as $index => $move)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $move->product->name }}</strong><br>
                    <small style="color: #666;">{{ $move->product->default_code }}</small>
                </td>
                <td class="text-center">{{ number_format($move->product_uom_qty, 3, ',', '.') }}</td>
                <td class="text-center">
                    <strong>{{ number_format($move->quantity_done, 3, ',', '.') }}</strong>
                </td>
                <td class="text-center">{{ $move->uom->name ?? '' }}</td>
                <td class="text-center">
                    @if($move->state === 'done')
                        <span style="color: #155724; font-weight: bold;">✓ Diterima</span>
                    @else
                        <span style="color: #856404;">Pending</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <div style="text-align: center;">
            Dokumen ini dibuat secara otomatis oleh sistem pada {{ now()->format('d/m/Y H:i:s') }}
        </div>
    </div>
</body>
</html>

