import { Link } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';
import ThemeToggle from '@/Components/ThemeToggle';
import { initTheme } from '@/utils/theme';

export default function Guest({ children }: PropsWithChildren) {
    useEffect(() => {
        initTheme();
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

            {/* Theme Toggle — top right */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="relative w-full px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo Section */}
                    <div className="mb-8 flex justify-center">
                        <Link href="/" className="group">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105 p-3 ring-1 ring-gray-200 dark:ring-gray-700">
                                    {/* Replace with your app logo */}
                                    <svg className="w-full h-full text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">App Name</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
                        <div className="px-8 py-10 sm:px-10">
                            {children}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Your Company Name. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
