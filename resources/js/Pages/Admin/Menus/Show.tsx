import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Show({ menu }: any) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Detail Menu</h1>
        <Link href={route('menus.index')} className="text-sm text-gray-600">Kembali</Link>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-3">
        <div><strong>Nama:</strong> {menu.name}</div>
        <div><strong>Route:</strong> {menu.route || '—'}</div>
        <div><strong>Permission:</strong> {menu.permission || '—'}</div>
        <div><strong>Parent:</strong> {menu.parent ? menu.parent.name : '—'}</div>
        <div><strong>Order:</strong> {menu.order}</div>
        <div><strong>Active:</strong> {menu.active ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}
