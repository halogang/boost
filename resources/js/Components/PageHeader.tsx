import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
    className?: string;
}

/**
 * Page Header Component
 * Standard header for all pages with title, description, breadcrumbs, and actions
 * 
 * @example
 * <PageHeader
 *   title="Users"
 *   description="Manage all users in the system"
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Users', current: true }
 *   ]}
 *   actions={
 *     <Button>
 *       <Plus className="mr-2 h-4 w-4" />
 *       Add User
 *     </Button>
 *   }
 * />
 */
export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
            )}

            {/* Title & Actions */}
            <div className="flex flex-col gap-3 md:gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground break-words">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm md:text-base text-muted-foreground break-words">
                            {description}
                        </p>
                    )}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Simple Page Header (no breadcrumbs)
 */
export function SimplePageHeader({
    title,
    description,
    actions,
    className,
}: Omit<PageHeaderProps, 'breadcrumbs'>) {
    return (
        <div className={cn('flex flex-col gap-3 md:gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
            <div className="space-y-1 min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground break-words">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm md:text-base text-muted-foreground break-words">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}

/**
 * Compact Page Header (smaller size)
 */
export function CompactPageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Page Header with Tabs
 */
interface TabItem {
    label: string;
    href: string;
    active?: boolean;
}

interface PageHeaderWithTabsProps extends PageHeaderProps {
    tabs: TabItem[];
}

export function PageHeaderWithTabs({
    title,
    description,
    breadcrumbs,
    actions,
    tabs,
    className,
}: PageHeaderWithTabsProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-base text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map((tab, index) => (
                        <a
                            key={index}
                            href={tab.href}
                            className={cn(
                                'border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                                tab.active
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                            )}
                        >
                            {tab.label}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
