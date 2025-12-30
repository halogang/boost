import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
            
            <div className="relative w-full px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo Section */}
                    <div className="mb-8 flex justify-center">
                        <Link href="/" className="group">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg transition-transform duration-300 group-hover:scale-105 p-2">
                                    <img
                                        src="/AJIB-DARKAH-INDONESIA.png"
                                        alt="Ajib Darkah Indonesia"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold text-gray-800">Ajib Darkah</h1>
                                    <p className="text-sm text-gray-600">ERP Management System</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5">
                        <div className="px-8 py-10 sm:px-10">
                            {children}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} Ajib Darkah Indonesia. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
