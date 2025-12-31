import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';

export interface PurchaseOrder {
  id: number;
  name: string;
  partner: {
    id: number;
    name: string;
  };
  date_order: string;
  date_planned?: string;
  state: 'draft' | 'sent' | 'to approve' | 'purchase' | 'done' | 'cancel';
  order_type: 'rfq' | 'po';
  amount_total: number;
  receipt_status: 'no' | 'to receive' | 'partial' | 'full';
  invoice_status: 'no' | 'to invoice' | 'invoiced' | 'paid';
  created_at: string;
}

interface PurchaseOrderColumnsOptions {
  onDelete?: (id: number, name: string) => void;
}

export const createPurchaseOrderColumns = (options?: PurchaseOrderColumnsOptions): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: 'name',
    header: 'Nomor',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${
          row.original.order_type === 'rfq' 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        }`}>
          {row.original.order_type === 'rfq' ? 'RFQ' : 'PO'}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.original.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.original.date_order).toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'partner.name',
    header: 'Vendor',
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 dark:text-white">
        {row.original.partner.name}
      </span>
    ),
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ getValue }) => {
      const state = getValue() as string;
      const stateLabels: Record<string, { label: string; color: string }> = {
        draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        'to approve': { label: 'To Approve', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        purchase: { label: 'PO Confirmed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        done: { label: 'Done', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
        cancel: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      };
      const stateInfo = stateLabels[state] || { label: state, color: 'bg-gray-100 text-gray-700' };
      return (
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${stateInfo.color}`}>
          {stateInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'receipt_status',
    header: 'Receipt',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusLabels: Record<string, { label: string; color: string }> = {
        no: { label: '-', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        'to receive': { label: 'To Receive', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        partial: { label: 'Partial', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
        full: { label: 'Received', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      };
      const statusInfo = statusLabels[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
      return (
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'invoice_status',
    header: 'Invoice',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusLabels: Record<string, { label: string; color: string }> = {
        no: { label: '-', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        'to invoice': { label: 'To Invoice', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
        invoiced: { label: 'Invoiced', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
        paid: { label: 'Paid', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      };
      const statusInfo = statusLabels[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
      return (
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount_total',
    header: 'Total',
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900 dark:text-white">
        Rp {Number(getValue()).toLocaleString('id-ID')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/purchase-orders/${row.original.id}`}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Lihat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
        {['draft', 'sent', 'to approve'].includes(row.original.state) && (
          <Link
            href={`/purchase-orders/${row.original.id}/edit`}
            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
        )}
        {['draft'].includes(row.original.state) && options?.onDelete && (
          <button
            onClick={() => options.onDelete!(row.original.id, row.original.name)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Hapus"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    ),
  },
];

