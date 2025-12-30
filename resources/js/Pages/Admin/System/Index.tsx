import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/PageHeader';

interface Settings {
    primary_color: string;
}

interface Props {
    settings: Settings;
}

export default function SystemSettings({ settings: initialSettings }: Props) {
    const { flash } = usePage().props as any;
    const [settings, setSettings] = useState<Settings>(initialSettings);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        router.post('/system', settings as any, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                // Update CSS variable for primary color dynamically
                const hexToRgb = (hex: string) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                };
                
                const rgbToHsl = (r: number, g: number, b: number) => {
                    r /= 255;
                    g /= 255;
                    b /= 255;
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    let h, s, l = (max + min) / 2;
                    
                    if (max === min) {
                        h = s = 0;
                    } else {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                            case g: h = ((b - r) / d + 2) / 6; break;
                            case b: h = ((r - g) / d + 4) / 6; break;
                        }
                    }
                    return {
                        h: Math.round((h || 0) * 360),
                        s: Math.round(s * 100),
                        l: Math.round(l * 100)
                    };
                };
                
                const rgb = hexToRgb(settings.primary_color);
                if (rgb) {
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
                    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
                }
                
                // Reload page to apply new settings globally
                window.location.reload();
            },
        });
    };

    return (
        <AdminLayout title="Pengaturan Sistem">
            <div className="space-y-6">
                {/* Page Header with Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <PageHeader
                        title="Pengaturan Sistem"
                        description="Kelola pengaturan aplikasi seperti warna primary. Tema dapat diubah melalui toggle di header."
                    />
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg shadow-sm">
                        {flash.success}
                    </div>
                )}

                {/* Settings Form with Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                    {/* Primary Color */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Warna Primary
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Pilih warna primary untuk aplikasi. Warna ini akan digunakan di tombol, link, dan elemen utama lainnya.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Warna
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        id="primary_color"
                                        value={settings.primary_color}
                                        onChange={(e) =>
                                            setSettings({ ...settings, primary_color: e.target.value })
                                        }
                                        className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.primary_color}
                                        onChange={(e) =>
                                            setSettings({ ...settings, primary_color: e.target.value })
                                        }
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:focus:border-primary"
                                        placeholder="#2563eb"
                                        pattern="^#[a-fA-F0-9]{6}$"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Format: #RRGGBB (contoh: #2563eb)
                                </p>
                            </div>
                            <div className="pt-6">
                                <div
                                    className="w-20 h-20 rounded-lg shadow-lg"
                                    style={{ backgroundColor: settings.primary_color }}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setSettings(initialSettings)}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

