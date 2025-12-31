import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initTheme } from './utils/theme';
import { ToastProvider } from './Contexts/ToastContext';
import { ConfirmationProvider } from './Components/ConfirmationProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Ajib Darkah';

// Initialize theme before rendering
initTheme();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <ConfirmationProvider>
                    <App {...props} />
                </ConfirmationProvider>
            </ToastProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
