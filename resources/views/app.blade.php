<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Ajib Darkah') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/AJIB-DARKAH-INDONESIA.png" />
        <link rel="apple-touch-icon" href="/AJIB-DARKAH-INDONESIA.png" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Dynamic CSS Variables for Settings -->
        <style>
            :root {
                --primary-color: {{ $settings['primary_color'] ?? '#2563eb' }};
            }
        </style>
        
        <script>
            // Convert hex to HSL and set as CSS variable for Tailwind compatibility
            (function() {
                function hexToRgb(hex) {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }
                
                function rgbToHsl(r, g, b) {
                    r /= 255;
                    g /= 255;
                    b /= 255;
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    let h, s, l = (max + min) / 2;
                    
                    if (max === min) {
                        h = s = 0;
                    } else {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                            case g: h = ((b - r) / d + 2) / 6; break;
                            case b: h = ((r - g) / d + 4) / 6; break;
                        }
                    }
                    return {
                        h: Math.round(h * 360),
                        s: Math.round(s * 100),
                        l: Math.round(l * 100)
                    };
                }
                
                const primaryColor = '{{ $settings['primary_color'] ?? '#2563eb' }}';
                const rgb = hexToRgb(primaryColor);
                if (rgb) {
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
                    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
                }
            })();
        </script>

        <!-- Initialize Theme (run before React to prevent flash) -->
        <script>
            (function() {
                const theme = localStorage.getItem('app-theme') || 'light';
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
