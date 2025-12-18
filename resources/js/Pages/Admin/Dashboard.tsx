import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'master-data',
    title: 'Master Data',
    description: 'Kelola data produk, kategori, dan harga',
    icon: 'database',
    disabled: true,
  },
  {
    id: 'users',
    title: 'Kelola User',
    description: 'Manajemen pengguna dan akun sistem',
    icon: 'users',
    href: '/admin/users',
  },
  {
    id: 'permissions',
    title: 'Permission',
    description: 'Atur hak akses berdasarkan role',
    icon: 'shield',
    href: '/admin/permissions',
  },
  {
    id: 'products',
    title: 'Produk',
    description: 'Kelola stok dan informasi produk',
    icon: 'package',
    disabled: true,
  },
  {
    id: 'attendance',
    title: 'Absensi',
    description: 'Absensi pegawai dengan QR code dan GPS',
    icon: 'qrcode',
    disabled: true,
  },
  {
    id: 'settings',
    title: 'Pengaturan',
    description: 'Konfigurasi aplikasi dan toko',
    icon: 'cog',
    disabled: true,
  },
];

const iconMap: Record<string, React.ReactNode> = {
  database: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 18c-4.41 0-8-1.79-8-4v-2.55c1.92 1.3 5.68 2.05 8 2.05s6.08-.75 8-2.05V16c0 2.21-3.59 4-8 4zm0-9c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4z" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  ),
  package: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  ),
  qrcode: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h1v4h-1zm0 5h2v2h-2z" />
    </svg>
  ),
  cog: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.14,12.94c0.04,-0.3 0.06,-0.61 0.06,-0.94c0,-0.32 -0.02,-0.64 -0.07,-0.94l2.03,-1.58c0.18,-0.14 0.23,-0.41 0.12,-0.64l-1.92,-3.32c-0.12,-0.22 -0.37,-0.29 -0.59,-0.22l-2.39,0.96c-0.5,-0.38 -1.03,-0.7 -1.62,-0.94L14.4,2.81c-0.04,-0.24 -0.24,-0.41 -0.48,-0.41h-3.84c-0.24,0 -0.43,0.17 -0.47,0.41L9.25,5.35C8.66,5.59 8.12,5.92 7.63,6.29L5.24,5.33c-0.22,-0.08 -0.47,0 -0.59,0.22L2.74,8.87C2.62,9.08 2.66,9.34 2.86,9.48l2.03,1.58C4.84,11.36 4.8,11.69 4.8,12s0.02,0.64 0.07,0.94l-2.03,1.58c-0.18,0.14 -0.23,0.41 -0.12,0.64l1.92,3.32c0.12,0.22 0.37,0.29 0.59,0.22l2.39,-0.96c0.5,0.38 1.03,0.7 1.62,0.94l0.36,2.54c0.05,0.24 0.24,0.41 0.48,0.41h3.84c0.24,0 0.44,-0.17 0.47,-0.41l0.36,-2.54c0.59,-0.24 1.13,-0.56 1.62,-0.94l2.39,0.96c0.22,0.08 0.47,0 0.59,-0.22l1.92,-3.32c0.12,-0.22 0.07,-0.5 -0.12,-0.64L19.14,12.94zM12,15.6c-1.98,0 -3.6,-1.62 -3.6,-3.6s1.62,-3.6 3.6,-3.6s3.6,1.62 3.6,3.6S13.98,15.6 12,15.6z" />
    </svg>
  ),
};

interface AdminIconProps {
  icon: string;
  disabled?: boolean;
}

function AdminIcon({ icon, disabled }: AdminIconProps) {
  const baseClass = `${disabled ? 'text-gray-300' : 'text-blue-600'}`;
  return <div className={baseClass}>{iconMap[icon]}</div>;
}

export default function Dashboard() {
  return (
    <AdminLayout title="Admin Panel">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const content = (
            <div className={`p-6 rounded-xl border-2 transition-all ${
              item.disabled 
                ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <AdminIcon icon={item.icon} disabled={item.disabled} />
                </div>
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${item.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                {item.title}
              </h3>

              <p className={`text-sm mb-4 ${item.disabled ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.description}
              </p>

              <div className="flex items-center gap-2">
                {!item.disabled && (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {item.disabled && (
                  <span className="text-xs text-gray-400">Segera hadir</span>
                )}
              </div>
            </div>
          );

          if (item.disabled) {
            return (
              <div key={item.id}>
                {content}
              </div>
            );
          }

          return (
            <Link key={item.id} href={item.href || '#'}>
              {content}
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}
