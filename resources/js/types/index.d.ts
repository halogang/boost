export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles?: Array<{ id: number; name: string }> | string[];
    permissions?: string[];
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface NavigationMenuItem {
    id: number;
    name: string;
    icon?: string | null;
    route?: string | null;
    permission?: string | null;
    parent_id?: number | null;
    order?: number;
    active?: boolean;
    children?: NavigationMenuItem[];
}

export interface NavigationProps {
    sidebar: NavigationMenuItem[];
    bottom: NavigationMenuItem[];
    drawer: NavigationMenuItem[];
}

export interface SystemSettings {
    primary_color?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: FlashMessages;
    notifications?: {
        unread_count: number;
    };
    navigation?: NavigationProps;
    settings?: SystemSettings;
};
