// Types for Admin → Menus pages
// Canonical source: import from '@/types/admin/menus'

export interface MenuPosition {
  id: number;
  menu_id: number;
  device: 'desktop' | 'mobile';
  position: 'sidebar' | 'bottom' | 'drawer';
}

export interface MenuRole {
  id: number;
  name: string;
}

export interface MenuParent {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  icon?: string | null;
  route?: string | null;
  permission?: string | null;
  parent_id?: number | null;
  order?: number;
  active?: boolean;
  children?: MenuItem[];
  parent?: MenuParent | null;
  positions?: MenuPosition[];
  roles?: MenuRole[];
}

export type MenuFormData = {
  name: string;
  icon: string;
  route: string;
  permission: string;
  parent_id: number | null;
  order: number;
  active: boolean;
  positions: {
    desktop_sidebar: boolean;
    mobile_drawer: boolean;
    mobile_bottom: boolean;
  };
  roles: number[];
};
