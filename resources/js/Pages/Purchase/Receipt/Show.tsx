import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';
import { Button } from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { useToast } from '@/hooks/useToast';

interface StockMove {
  id: number;
  product: {
    id: number;
    name: string;
    default_code: string;
  };
  uom: {
    id: number;
    name: string;
  } | null;
  product_uom_qty: number;
  quantity_done: number;
  state: string;
  purchaseLine?: {
    id: number;
    product_qty: number;
    qty_received: number;
  };
}

interface StockPicking {
  id: number;
  name: string;
  purchaseOrder: {
    id: number;
    name: string;
    partner: {
      name: string;
    };
  } | null;
  state: string;
  scheduled_date: string;
  date_done?: string;
  moves: StockMove[];
}

interface Props {
  picking: StockPicking;
}

export default function Show({ picking }: Props) {
  const { success, error } = useToast();
  const { data, setData, post, processing } = useForm({
    moves: picking.moves.map(move => ({
      id: move.id,
      quantity_done: move.quantity_done || move.product_uom_qty,
    })),
  });

  const handleReceive = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/receipts/${picking.id}/receive`, {
      preserveScroll: true,
      onSuccess: () => {
        success('Barang berhasil diterima');
      },
      onError: () => {
        error('Gagal menerima barang');
      },
    });
  };

  const canReceive = ['confirmed', 'assigned'].includes(picking.state);
  const isDone = picking.state === 'done';

  return (
    <AdminLayout title={`Receipt - ${picking.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <PageHeader
                title={`Receipt - ${picking.name}`}
                description={
                  picking.purchaseOrder
                    ? `PO: ${picking.purchaseOrder.name} • ${picking.purchaseOrder.partner.name}`
                    : 'Goods Receipt'
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Link href="/receipts">
                <Button variant="outline">
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {picking.state === 'draft' && 'Draft'}
              {picking.state === 'waiting' && 'Waiting'}
              {picking.state === 'confirmed' && 'Confirmed'}
              {picking.state === 'assigned' && 'Assigned'}
              {picking.state === 'done' && 'Received'}
              {picking.state === 'cancel' && 'Cancelled'}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Dijadwalkan</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {new Date(picking.scheduled_date).toLocaleDateString('id-ID')}
            </div>
          </div>
          {picking.date_done && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Diterima</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {new Date(picking.date_done).toLocaleDateString('id-ID')}
              </div>
            </div>
          )}
        </div>

        {/* Receive Form */}
        {canReceive && !isDone && (
          <form onSubmit={handleReceive} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Terima Barang</h3>
            
            <div className="space-y-4">
              {picking.moves.map((move, index) => {
                const formMove = data.moves.find(m => m.id === move.id);
                const qtyDone = formMove?.quantity_done ?? (move.quantity_done ?? 0);
                const maxQty = move.product_uom_qty;
                // Sisa = Qty Dipesan - Qty yang sudah diterima (dari semua stock moves yang sudah done)
                const alreadyReceived = move.purchaseLine?.qty_received ?? 0;
                const remainingQty = Math.max(0, (move.purchaseLine?.product_qty ?? move.product_uom_qty) - alreadyReceived);

                return (
                  <div key={move.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div className="md:col-span-2">
                        <div className="font-medium text-gray-900 dark:text-white">{move.product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {move.product.default_code} • {move.uom?.name || '-'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Dipesan: {move.product_uom_qty.toLocaleString('id-ID', { maximumFractionDigits: 3 })} • 
                          Sisa: {remainingQty.toLocaleString('id-ID', { maximumFractionDigits: 3 })}
                        </div>
                      </div>
                      <div>
                        <InputLabel value="Qty Diterima *" />
                        <TextInput
                          type="number"
                          step="0.001"
                          min="0"
                          max={remainingQty}
                          value={qtyDone > 0 ? qtyDone.toString() : ''}
                          onChange={(e) => {
                            const newMoves = data.moves.map(m =>
                              m.id === move.id
                                ? { ...m, quantity_done: parseFloat(e.target.value) || 0 }
                                : m
                            );
                            setData('moves', newMoves);
                          }}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Max: {remainingQty.toLocaleString('id-ID', { maximumFractionDigits: 3 })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Terima Barang'}
              </Button>
            </div>
          </form>
        )}

        {/* Moves List (Read-only if done) */}
        {isDone && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detail Barang Diterima</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Produk</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Dipesan</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Diterima</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">UOM</th>
                  </tr>
                </thead>
                <tbody>
                  {picking.moves.map((move) => (
                    <tr key={move.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{move.product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {move.product.default_code}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                        {move.product_uom_qty.toLocaleString('id-ID', { maximumFractionDigits: 3 })}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        {move.quantity_done.toLocaleString('id-ID', { maximumFractionDigits: 3 })}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {move.uom?.name || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

