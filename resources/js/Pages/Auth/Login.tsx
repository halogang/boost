import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Selamat Datang</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Masuk ke akun Anda untuk melanjutkan
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800 ring-1 ring-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email" className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300" />

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                />
                            </svg>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-lg border-gray-300 pl-10 pr-3 text-sm transition-colors focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel htmlFor="password" value="Password" className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300" />

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full rounded-lg border-gray-300 pl-10 pr-3 text-sm transition-colors focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <svg
                                    className="mr-2 h-4 w-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : (
                            'Masuk'
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
