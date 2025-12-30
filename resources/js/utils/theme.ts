/**
 * Theme utility for managing dark/light mode using localStorage
 */

const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME = 'light';

export type Theme = 'light' | 'dark';

/**
 * Get current theme from localStorage or default
 */
export function getTheme(): Theme {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return stored === 'dark' || stored === 'light' ? stored : DEFAULT_THEME;
}

/**
 * Set theme to localStorage and apply to document
 */
export function setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
}

/**
 * Apply theme to document element
 */
export function applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme;
}

/**
 * Initialize theme on page load
 */
export function initTheme(): void {
    if (typeof window === 'undefined') return;
    
    const theme = getTheme();
    applyTheme(theme);
}

