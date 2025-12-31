import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';

export interface ProductProduct {
  id: number;
  name: string;
  default_code?: string;
  barcode?: string;
  description?: string;
  description_purchase?: string;
  description_sale?: string;
  type: 'consu' | 'service' | 'product';
  purchase_method: 'purchase' | 'make_to_order' | 'receive';
  purchase_ok: boolean;
  sale_ok: boolean;
  active: boolean;
  uom_id?: number;
  uom_po_id?: number;
  list_price?: number;
  standard_price?: number;
  categ_name?: string;
  order: number;
  created_at: string;
  uom?: {
    id: number;
    name: string;
  };
  uom_po?: {
    id: number;
    name: string;
  };
}

interface ProductColumnsOptions {
  onDelete?: (id: number, name: string) => void;
}

export const createProductColumns = (options?: ProductColumnsOptions): ColumnDef<ProductProduct>[] => [
  {
    accessorKey: 'name',
    header: 'Nama Produk',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10l8 4m-8-4v10" />
          </svg>
        </div>
        <div>
          <span className="font-medium text-gray-900 dark:text-white block">{row.original.name}</span>
          {row.original.default_code && (
            <span className="text-xs text-gray-500 dark:text-gray-400">SKU: {row.original.default_code}</span>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ getValue }) => {
      const type = getValue() as string;
      const typeLabels: Record<string, { label: string; color: string }> = {
        consu: { label: 'Consumable', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
        service: { label: 'Service', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
        product: { label: 'Storable', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      };
      const typeInfo = typeLabels[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
      return (
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'categ_name',
    header: 'Kategori',
    cell: ({ getValue }) => {
      const category = getValue() as string | undefined;
      if (!category) return <span className="text-gray-400">-</span>;
      return (
        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-medium">
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: 'uom',
    header: 'UOM',
    cell: ({ row }) => {
      const uom = row.original.uom;
      if (!uom) return <span className="text-gray-400">-</span>;
      return <span className="text-sm text-gray-600 dark:text-gray-300">{uom.name}</span>;
    },
  },
  {
    accessorKey: 'list_price',
    header: 'Harga Jual',
    cell: ({ getValue }) => {
      const price = getValue() as number | undefined;
      if (!price) return <span className="text-gray-400">-</span>;
      return <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(price)}</span>;
    },
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ getValue }) => (
      <span
        className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
          getValue()
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}
      >
        {getValue() ? 'Aktif' : 'Nonaktif'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/products/${row.original.id}/edit`}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Edit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={() => {
            if (options?.onDelete) {
              options.onDelete(row.original.id, row.original.name);
            }
          }}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Hapus"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    ),
  },
];

// Default export for backward compatibility
export const productColumns = createProductColumns();

