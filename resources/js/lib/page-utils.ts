/**
 * BREADCRUMB & PAGE HEADER UTILITIES
 * Helper functions for building breadcrumbs and page headers
 */

import { BreadcrumbItem } from '@/Components/Breadcrumb';

// ============================================
// BREADCRUMB UTILITIES
// ============================================

/**
 * Build breadcrumb from route segments
 * @param pathname - Current pathname (e.g., '/admin/users/create')
 * @param labels - Custom labels for segments
 * @returns Breadcrumb items array
 */
export function buildBreadcrumbFromPath(
    pathname: string,
    labels?: Record<string, string>
): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let path = '';
    segments.forEach((segment, index) => {
        path += `/${segment}`;
        const isLast = index === segments.length - 1;

        // Get label from custom labels or capitalize segment
        const label = labels?.[segment] || capitalize(segment);

        breadcrumbs.push({
            label,
            href: isLast ? undefined : path,
            current: isLast,
        });
    });

    return breadcrumbs;
}

/**
 * Build breadcrumb for admin routes
 * @param module - Module name (e.g., 'users', 'products')
 * @param action - Action name (e.g., 'create', 'edit')
 * @param customLabels - Custom labels
 * @returns Breadcrumb items array
 */
export function buildAdminBreadcrumb(
    module: string,
    action?: string,
    customLabels?: Record<string, string>
): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        {
            label: customLabels?.[module] || capitalize(module),
            href: action ? `/admin/${module}` : undefined,
            current: !action,
        },
    ];

    if (action) {
        breadcrumbs.push({
            label: customLabels?.[action] || capitalize(action),
            current: true,
        });
    }

    return breadcrumbs;
}

/**
 * Common breadcrumb presets
 */
export const breadcrumbPresets = {
    // Dashboard
    dashboard: (): BreadcrumbItem[] => [
        { label: 'Dashboard', current: true },
    ],

    // Admin Users
    adminUsers: (): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Users', current: true },
    ],
    adminUsersCreate: (): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Create', current: true },
    ],
    adminUsersEdit: (userName?: string): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: userName || 'Edit', current: true },
    ],

    // Admin Products
    adminProducts: (): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', current: true },
    ],
    adminProductsCreate: (): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Create', current: true },
    ],
    adminProductsEdit: (productName?: string): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/admin/products' },
        { label: productName || 'Edit', current: true },
    ],

    // Settings
    settings: (): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', current: true },
    ],
    settingsProfile: (): BreadcrumbItem[] => [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', href: '/settings' },
        { label: 'Profile', current: true },
    ],
};

// ============================================
// PAGE TITLE UTILITIES
// ============================================

/**
 * Generate page title from route
 * @param module - Module name
 * @param action - Action name
 * @param itemName - Optional item name
 * @returns Formatted title
 */
export function generatePageTitle(
    module: string,
    action?: string,
    itemName?: string
): string {
    const moduleName = capitalize(module);

    if (!action) {
        return moduleName;
    }

    const actionMap: Record<string, string> = {
        index: moduleName,
        create: `Create ${moduleName}`,
        edit: itemName ? `Edit ${itemName}` : `Edit ${moduleName}`,
        show: itemName || `${moduleName} Detail`,
    };

    return actionMap[action] || `${capitalize(action)} ${moduleName}`;
}

/**
 * Generate page description
 * @param module - Module name
 * @param action - Action name
 * @returns Description text
 */
export function generatePageDescription(
    module: string,
    action?: string
): string {
    const moduleName = module.toLowerCase();

    const descriptionMap: Record<string, string> = {
        index: `Manage all ${moduleName} in the system`,
        create: `Create a new ${moduleName}`,
        edit: `Edit ${moduleName} information`,
        show: `View ${moduleName} details`,
    };

    return action ? descriptionMap[action] || '' : descriptionMap.index;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
function capitalize(str: string): string {
    // Convert kebab-case to Title Case
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ============================================
// ROUTE INFO EXTRACTOR
// ============================================

/**
 * Extract route information
 * @param routeName - Laravel route name (e.g., 'admin.users.create')
 * @returns Route info object
 */
export function extractRouteInfo(routeName: string): {
    area?: string;
    module?: string;
    action?: string;
} {
    const parts = routeName.split('.');

    return {
        area: parts.length > 2 ? parts[0] : undefined,
        module: parts.length > 1 ? parts[parts.length - 2] : parts[0],
        action: parts[parts.length - 1],
    };
}

/**
 * Build breadcrumb from route name
 * @param routeName - Laravel route name
 * @param currentLabel - Label for current page
 * @returns Breadcrumb items
 */
export function breadcrumbFromRoute(
    routeName: string,
    currentLabel?: string
): BreadcrumbItem[] {
    const { area, module, action } = extractRouteInfo(routeName);
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/dashboard' },
    ];

    if (area && module) {
        // Has area (e.g., admin.users.create)
        breadcrumbs.push({
            label: capitalize(module),
            href: action !== 'index' ? `/${area}/${module}` : undefined,
            current: action === 'index',
        });

        if (action && action !== 'index') {
            breadcrumbs.push({
                label: currentLabel || capitalize(action),
                current: true,
            });
        }
    } else if (module) {
        // No area (e.g., settings.profile)
        breadcrumbs.push({
            label: currentLabel || capitalize(module),
            current: true,
        });
    }

    return breadcrumbs;
}

// ============================================
// TRANSLATION MAPS
// ============================================

/**
 * Common translations for breadcrumbs (Indonesian)
 */
export const breadcrumbTranslations: Record<string, string> = {
    // Common
    dashboard: 'Dashboard',
    home: 'Beranda',
    settings: 'Pengaturan',
    profile: 'Profil',

    // Actions
    create: 'Tambah',
    edit: 'Edit',
    detail: 'Detail',
    show: 'Detail',
    list: 'Daftar',

    // Modules
    users: 'Pengguna',
    products: 'Produk',
    categories: 'Kategori',
    orders: 'Pesanan',
    customers: 'Pelanggan',
    reports: 'Laporan',
    transactions: 'Transaksi',

    // Admin
    admin: 'Admin',
    management: 'Manajemen',
};

/**
 * Get translated label
 * @param key - Translation key
 * @returns Translated string or original key
 */
export function translate(key: string): string {
    return breadcrumbTranslations[key.toLowerCase()] || capitalize(key);
}
