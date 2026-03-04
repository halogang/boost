import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/Components/ThemeToggle';
import { initTheme } from '@/utils/theme';

export default function Landing() {
    useEffect(() => {
        initTheme();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' as const },
        },
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
                {/* Navbar */}
                <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">App Name</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link
                                href={route('login')}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Mulai Sekarang
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
                    {/* Background decoration */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-100 dark:bg-cyan-900/20 blur-3xl" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 mx-auto max-w-3xl text-center"
                    >
                        <motion.div variants={itemVariants}>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Open Source Boilerplate
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
                        >
                            Bangun Aplikasi{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Lebih Cepat
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400"
                        >
                            Boilerplate siap pakai dengan Laravel, Inertia.js, dan React.
                            Lengkap dengan autentikasi, manajemen role, menu dinamis, dan tema gelap.
                        </motion.p>

                        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href={route('login')}
                                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
                            >
                                Mulai Sekarang
                            </Link>
                            <a
                                href="#fitur"
                                className="group flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
                            >
                                Lihat Fitur
                                <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </a>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Tech Stack Section */}
                <section className="relative py-16 px-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="mx-auto max-w-6xl">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-10"
                        >
                            Dibangun dengan teknologi modern
                        </motion.p>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {techStack.map((tech, i) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 shadow-sm"
                                >
                                    <span className="text-xl">{tech.icon}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{tech.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{tech.version}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="fitur" className="relative py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
                    <div className="mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                                Fitur Lengkap Siap Pakai
                            </h2>
                            <p className="mx-auto mt-4 max-w-lg text-gray-600 dark:text-gray-400">
                                Fokus pada bisnis Anda — infrastruktur sudah tersedia.
                            </p>
                        </motion.div>

                        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-6">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                    </p>
                </footer>
            </div>
        </>
    );
}

const techStack = [
    { name: 'Laravel', version: 'v11', icon: '🔴' },
    { name: 'React', version: 'v19', icon: '⚛️' },
    { name: 'Inertia.js', version: 'v2', icon: '🔗' },
    { name: 'TypeScript', version: 'v5', icon: '🔷' },
    { name: 'Tailwind CSS', version: 'v3', icon: '🎨' },
    { name: 'Framer Motion', version: 'v12', icon: '🎞️' },
    { name: 'Spatie Permission', version: 'v6', icon: '🛡️' },
    { name: 'Vite', version: 'v6', icon: '⚡' },
];

const features = [
    {
        title: 'Autentikasi',
        description: 'Login, register, dan manajemen profil pengguna sudah siap digunakan.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
    {
        title: 'Role & Permission',
        description: 'Kelola hak akses pengguna dengan sistem role dan permission yang fleksibel.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        title: 'Menu Dinamis',
        description: 'Sidebar dan navigasi mobile yang otomatis menyesuaikan dengan role pengguna.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        ),
    },
    {
        title: 'Dark Mode',
        description: 'Tema gelap dan terang dengan toggle, preferensi tersimpan otomatis.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        ),
    },
    {
        title: 'DataTable',
        description: 'Komponen tabel server-side dengan pencarian, sorting, dan pagination.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: 'Notifikasi',
        description: 'Sistem notifikasi toast dan in-app notification yang sudah terintegrasi.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
    },
];

