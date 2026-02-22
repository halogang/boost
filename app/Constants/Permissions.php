<?php

namespace App\Constants;

class Permissions
{
    // Dashboard
    public const READ_DASHBOARD = 'read dashboard';

    // Users
    public const CREATE_USERS = 'create users';
    public const READ_USERS = 'read users';
    public const UPDATE_USERS = 'update users';
    public const DELETE_USERS = 'delete users';

    // Roles
    public const CREATE_ROLES = 'create roles';
    public const READ_ROLES = 'read roles';
    public const UPDATE_ROLES = 'update roles';
    public const DELETE_ROLES = 'delete roles';

    // Settings
    public const READ_SETTINGS = 'read settings';
    public const UPDATE_SETTINGS = 'update settings';

    // Menus
    public const CREATE_MENUS = 'create menus';
    public const READ_MENUS = 'read menus';
    public const UPDATE_MENUS = 'update menus';
    public const DELETE_MENUS = 'delete menus';

    // Menu Role Positions
    public const READ_MENU_ROLE_POSITIONS = 'read menu-role-positions';
    public const UPDATE_MENU_ROLE_POSITIONS = 'update menu-role-positions';

    // Permissions
    public const READ_PERMISSIONS = 'read permissions';

    // Preferences
    public const READ_PREFERENCES = 'read preferences';
    public const UPDATE_PREFERENCES = 'update preferences';

    /**
     * Get all core permissions.
     */
    public static function all(): array
    {
        return [
            // Dashboard
            self::READ_DASHBOARD,

            // Users
            self::CREATE_USERS,
            self::READ_USERS,
            self::UPDATE_USERS,
            self::DELETE_USERS,

            // Roles
            self::CREATE_ROLES,
            self::READ_ROLES,
            self::UPDATE_ROLES,
            self::DELETE_ROLES,

            // Settings
            self::READ_SETTINGS,
            self::UPDATE_SETTINGS,

            // Menus
            self::CREATE_MENUS,
            self::READ_MENUS,
            self::UPDATE_MENUS,
            self::DELETE_MENUS,

            // Menu Role Positions
            self::READ_MENU_ROLE_POSITIONS,
            self::UPDATE_MENU_ROLE_POSITIONS,

            // Permissions
            self::READ_PERMISSIONS,

            // Preferences
            self::READ_PREFERENCES,
            self::UPDATE_PREFERENCES,
        ];
    }
}
