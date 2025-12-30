import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface Props {
  user: User;
}

export default function Profile({ user }: Props) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const page = usePage<any>();
  const flashMessage = page.props.flash?.success;

  // Profile form
  const profileForm = useForm({
    name: user.name,
    email: user.email,
  });

  // Password form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.put('/settings/profile', {
      preserveScroll: true,
    });
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put('/settings/password', {
      preserveScroll: true,
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Profil" />
      
      <div className="space-y-6">
        {/* Header Card with Gradient */}
        <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-primary dark:via-primary/95 dark:to-primary/90 rounded-xl shadow-lg overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center gap-6">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-white/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <div className="flex items-center gap-2 text-white/90 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 shadow-sm"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message with Animation */}
        {flashMessage && (
          <div className="animate-in slide-in-from-top-5 duration-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 text-green-800 dark:text-green-200 px-5 py-4 rounded-lg shadow-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{flashMessage}</span>
          </div>
        )}

        {/* Tabs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`relative flex items-center gap-3 py-4 text-sm font-semibold transition-all duration-200 flex-1 ${
                  activeTab === 'profile'
                    ? 'text-white bg-primary pl-6 pr-6'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 px-6'
                }`}
              >
                {activeTab === 'profile' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                )}
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profil Saya</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`relative flex items-center gap-3 py-4 text-sm font-semibold transition-all duration-200 flex-1 ${
                  activeTab === 'security'
                    ? 'text-white bg-primary pl-6 pr-6'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 px-6'
                }`}
              >
                {activeTab === 'security' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                )}
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Keamanan</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={submitProfile} className="space-y-6 animate-in fade-in duration-200">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    Informasi Profil
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                    Perbarui informasi profil dan email Anda. Perubahan akan diterapkan secara instan.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="group">
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="mb-2" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <TextInput
                        id="name"
                        type="text"
                        className="pl-10 block w-full"
                        value={profileForm.data.name}
                        onChange={(e) => profileForm.setData('name', e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <InputError className="mt-2" message={profileForm.errors.name} />
                  </div>

                  <div className="group">
                    <InputLabel htmlFor="email" value="Alamat Email" className="mb-2" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <TextInput
                        id="email"
                        type="email"
                        className="pl-10 block w-full"
                        value={profileForm.data.email}
                        onChange={(e) => profileForm.setData('email', e.target.value)}
                        required
                      />
                    </div>
                    <InputError className="mt-2" message={profileForm.errors.email} />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    disabled={profileForm.processing}
                    className="min-w-[140px]"
                  >
                    {profileForm.processing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan Perubahan
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={submitPassword} className="space-y-6 animate-in fade-in duration-200">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    Keamanan Akun
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                    Pastikan akun Anda menggunakan kata sandi yang kuat dan unik. Kami merekomendasikan kombinasi huruf, angka, dan simbol.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="group">
                    <InputLabel htmlFor="current_password" value="Password Saat Ini" className="mb-2" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <TextInput
                        id="current_password"
                        type="password"
                        className="pl-10 block w-full"
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <InputError className="mt-2" message={passwordForm.errors.current_password} />
                  </div>

                  <div className="group">
                    <InputLabel htmlFor="password" value="Password Baru" className="mb-2" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <TextInput
                        id="password"
                        type="password"
                        className="pl-10 block w-full"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        required
                      />
                    </div>
                    <InputError className="mt-2" message={passwordForm.errors.password} />
                  </div>

                  <div className="group">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="mb-2" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <TextInput
                        id="password_confirmation"
                        type="password"
                        className="pl-10 block w-full"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        required
                      />
                    </div>
                    <InputError className="mt-2" message={passwordForm.errors.password_confirmation} />
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {passwordForm.data.password && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">Tips Password yang Kuat:</p>
                        <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                          <li>• Minimal 8 karakter</li>
                          <li>• Kombinasi huruf besar dan kecil</li>
                          <li>• Menggunakan angka dan simbol</li>
                          <li>• Hindari informasi personal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    disabled={passwordForm.processing}
                    className="min-w-[140px]"
                  >
                    {passwordForm.processing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Password
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

