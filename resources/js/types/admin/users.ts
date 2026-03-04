// Types for Admin → Users pages
// Canonical source: import from '@/types/admin/users'

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  roles: Array<{ id: number; name: string }>;
  created_at?: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export type UserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles: string[];
};
