import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

/**
 * Breadcrumb Component
 * Navigation component showing current page location in hierarchy
 * 
 * @example
 * <Breadcrumb items={[
 *   { label: 'Dashboard', href: '/dashboard' },
 *   { label: 'Users', href: '/admin/users' },
 *   { label: 'Create', current: true }
 * ]} />
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center space-x-1 text-sm', className)}
        >
            {/* Home Icon */}
            <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">Dashboard</span>
            </Link>

            {/* Breadcrumb Items */}
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    {item.current ? (
                        <span className="font-medium text-foreground">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.href!}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}

/**
 * Simple Breadcrumb (no icons)
 */
export function SimpleBreadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('text-sm text-muted-foreground', className)}
        >
            {items.map((item, index) => (
                <span key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.current ? (
                        <span className="font-medium text-foreground">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.href!}
                            className="transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
