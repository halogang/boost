import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{ id: number; name: string }>;
  created_at: string;
}

interface PaginatedResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface Props {
  users: PaginatedResponse;
}

export default function Index({ users }: Props) {
  const { flash } = usePage().props as any;

  return (
    <AdminLayout title="Kelola User">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-600">Manajemen pengguna dan akun sistem</p>
        </div>
        <Link
          href="/admin/users/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah User
        </Link>
      </div>

      {/* Success Message */}
      {flash?.success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {flash.success}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dibuat</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.data.length > 0 ? (
              users.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.roles.map((role) => (
                      <span key={role.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 transition text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
                            // Delete action will be added with form submission
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada user yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {users.data.length} dari {users.total} user
          </p>
          <div className="flex gap-2">
            {/* Previous */}
            {users.current_page > 1 && (
              <Link
                href={`/admin/users?page=${users.current_page - 1}`}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Sebelumnya
              </Link>
            )}

            {/* Page Numbers */}
            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/admin/users?page=${page}`}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  page === users.current_page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </Link>
            ))}

            {/* Next */}
            {users.current_page < users.last_page && (
              <Link
                href={`/admin/users?page=${users.current_page + 1}`}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Berikutnya
              </Link>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
