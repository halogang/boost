# DESIGN SYSTEM

**Version**: 1.0  
**Framework**: TailwindCSS + shadcn/ui

---

## 1. COLOR PALETTE

### Brand Colors (Water/Galon Theme)
```css
/* Primary - Water Blue (Deep Ocean) */
--primary: 200 95% 45%;              /* Bright water blue */
--primary-foreground: 0 0% 100%;     /* White text */

/* Secondary - Light Blue (Fresh Water) */
--secondary: 200 40% 92%;            /* Light blue background */
--secondary-foreground: 200 80% 25%; /* Dark blue text */

/* Accent - Aqua (Refreshing) */
--accent: 185 80% 50%;               /* Bright aqua/cyan */
--accent-foreground: 0 0% 100%;      /* White text */
```

### Semantic Colors
```css
/* Success - Fresh Green (Clean Water) */
--success: 145 65% 45%;              /* Green */
--success-foreground: 0 0% 100%;     /* White text */

/* Warning - Orange */
--warning: 35 90% 55%;               /* Orange */
--warning-foreground: 0 0% 100%;     /* White text */

/* Destructive/Error - Red */
--destructive: 0 75% 55%;            /* Red */
--destructive-foreground: 0 0% 100%; /* White text */

/* Info - Blue */
--info: 210 85% 55%;                 /* Blue */
--info-foreground: 0 0% 100%;        /* White text */
```

### Neutral Colors
```css
/* Background - Clean White */
--background: 210 40% 98%;           /* Off-white with blue tint */
--foreground: 210 20% 15%;           /* Dark text */

/* Card */
--card: 0 0% 100%;                   /* Pure white */
--card-foreground: 210 20% 15%;      /* Dark text */

/* Popover */
--popover: 0 0% 100%;                /* Pure white */
--popover-foreground: 210 20% 15%;   /* Dark text */

/* Muted - Subtle Gray Blue */
--muted: 210 30% 96%;                /* Light gray-blue */
--muted-foreground: 210 15% 50%;     /* Medium gray text */

/* Border */
--border: 210 25% 88%;               /* Light border */
--input: 210 25% 88%;                /* Input border */
--ring: 200 95% 45%;                 /* Focus ring (primary) */
```

### Chart Colors (Water Theme)
```css
/* Chart palette - Water & Nature theme */
--chart-1: 200 95% 45%;  /* Deep Water Blue */
--chart-2: 185 80% 50%;  /* Aqua/Cyan */
--chart-3: 145 65% 45%;  /* Fresh Green */
--chart-4: 210 85% 55%;  /* Sky Blue */
--chart-5: 170 70% 55%;  /* Teal */
```

### Dark Mode (Night Water Theme)
```css
.dark {
    /* Base Colors */
    --background: 210 30% 8%;        /* Deep dark blue */
    --foreground: 210 20% 95%;       /* Light text */
    
    /* Card Colors */
    --card: 210 25% 12%;             /* Dark card */
    --card-foreground: 210 20% 95%;  /* Light text */
    
    /* Primary - Bright Glow */
    --primary: 200 90% 55%;          /* Brighter blue for dark bg */
    --primary-foreground: 210 30% 8%; /* Dark text */
    
    /* Secondary */
    --secondary: 210 20% 18%;        /* Dark secondary */
    --secondary-foreground: 210 20% 95%; /* Light text */
    
    /* Muted */
    --muted: 210 20% 18%;            /* Dark muted */
    --muted-foreground: 210 15% 65%; /* Medium gray */
    
    /* Accent - Aqua Glow */
    --accent: 185 75% 55%;           /* Bright aqua */
    --accent-foreground: 210 30% 8%; /* Dark text */
    
    /* Semantic */
    --success: 145 60% 50%;
    --warning: 35 85% 60%;
    --destructive: 0 70% 50%;
    --info: 210 80% 60%;
    
    /* Border */
    --border: 210 20% 22%;
    --input: 210 20% 22%;
    --ring: 200 90% 55%;
}
```

### Color Usage Examples
```typescript
// Backgrounds
<div className="bg-primary">            // Water blue
<div className="bg-secondary">          // Light blue
<div className="bg-accent">             // Aqua

// Text Colors
<p className="text-primary">            // Water blue text
<p className="text-muted-foreground">   // Subtle gray

// Status Colors
<span className="text-success">        // Green (good)
<span className="text-warning">        // Orange (warning)
<span className="text-destructive">    // Red (error)
<span className="text-info">           // Blue (info)

// Borders
<div className="border-primary">       // Water blue border
<div className="border-border">        // Default border
```

---

## 2. TYPOGRAPHY

### Font Families
```css
/* Sans Serif (Default) */
font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif;

/* Monospace (Code) */
font-family: 'JetBrains Mono', ui-monospace, monospace;

/* Serif (Optional) */
font-family: 'Merriweather', ui-serif, Georgia, serif;
```

### Font Sizes
```typescript
// Tailwind classes
text-xs     // 0.75rem (12px)
text-sm     // 0.875rem (14px)
text-base   // 1rem (16px)
text-lg     // 1.125rem (18px)
text-xl     // 1.25rem (20px)
text-2xl    // 1.5rem (24px)
text-3xl    // 1.875rem (30px)
text-4xl    // 2.25rem (36px)
text-5xl    // 3rem (48px)
```

### Font Weights
```typescript
font-light      // 300
font-normal     // 400
font-medium     // 500
font-semibold   // 600
font-bold       // 700
font-extrabold  // 800
```

### Line Heights
```typescript
leading-none      // 1
leading-tight     // 1.25
leading-snug      // 1.375
leading-normal    // 1.5
leading-relaxed   // 1.625
leading-loose     // 2
```

### Text Styles (Components)
```typescript
// Heading 1
<h1 className="text-4xl font-bold tracking-tight lg:text-5xl">

// Heading 2
<h2 className="text-3xl font-semibold tracking-tight">

// Heading 3
<h3 className="text-2xl font-semibold">

// Heading 4
<h4 className="text-xl font-semibold">

// Body Large
<p className="text-lg text-muted-foreground">

// Body
<p className="text-base text-foreground">

// Body Small
<p className="text-sm text-muted-foreground">

// Caption
<span className="text-xs text-muted-foreground">

// Label
<label className="text-sm font-medium leading-none">

// Code
<code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
```

---

## 3. SPACING SCALE

### Spacing Values (Tailwind)
```typescript
0    // 0px
px   // 1px
0.5  // 0.125rem (2px)
1    // 0.25rem (4px)
1.5  // 0.375rem (6px)
2    // 0.5rem (8px)
2.5  // 0.625rem (10px)
3    // 0.75rem (12px)
4    // 1rem (16px)
5    // 1.25rem (20px)
6    // 1.5rem (24px)
8    // 2rem (32px)
10   // 2.5rem (40px)
12   // 3rem (48px)
16   // 4rem (64px)
20   // 5rem (80px)
24   // 6rem (96px)
```

### Common Spacing Patterns
```typescript
// Component padding
p-4      // Small component (16px)
p-6      // Medium component (24px)
p-8      // Large component (32px)

// Section spacing
py-12    // Section vertical (48px)
py-16    // Large section vertical (64px)
py-20    // Extra large section (80px)

// Gap between elements
gap-2    // Tight spacing (8px)
gap-4    // Normal spacing (16px)
gap-6    // Loose spacing (24px)

// Container padding
px-4     // Mobile (16px)
sm:px-6  // Tablet (24px)
lg:px-8  // Desktop (32px)
```

---

## 4. BORDER RADIUS

```typescript
// Tailwind classes
rounded-none    // 0px
rounded-sm      // 0.125rem (2px)
rounded         // 0.25rem (4px)
rounded-md      // 0.375rem (6px)
rounded-lg      // 0.5rem (8px)
rounded-xl      // 0.75rem (12px)
rounded-2xl     // 1rem (16px)
rounded-3xl     // 1.5rem (24px)
rounded-full    // 9999px (circle/pill)

// Design tokens
--radius: 0.5rem;  // Base radius (8px)
```

### Common Usage
```typescript
// Cards
className="rounded-lg border"

// Buttons
className="rounded-md"

// Inputs
className="rounded-md border"

// Badges
className="rounded-full"

// Images
className="rounded-lg overflow-hidden"
```

---

## 5. SHADOWS & ELEVATION

```css
/* Shadow levels */
shadow-sm    /* 0 1px 2px 0 rgb(0 0 0 / 0.05) */
shadow       /* 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) */
shadow-md    /* 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) */
shadow-lg    /* 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) */
shadow-xl    /* 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) */
shadow-2xl   /* 0 25px 50px -12px rgb(0 0 0 / 0.25) */
```

### Usage Guidelines
```typescript
// Cards
<div className="rounded-lg border shadow-sm">

// Dropdowns/Popovers
<div className="rounded-md border shadow-md">

// Modals
<div className="rounded-lg shadow-xl">

// Hover states
<button className="shadow-sm hover:shadow-md transition-shadow">
```

---

## 6. COMPONENT SIZING

### Button Sizes
```typescript
// Small
<Button size="sm" className="h-9 px-3">

// Default
<Button className="h-10 px-4 py-2">

// Large
<Button size="lg" className="h-11 px-8">

// Icon only
<Button size="icon" className="h-10 w-10">
```

### Input Sizes
```typescript
// Small
<Input className="h-9 text-sm">

// Default
<Input className="h-10">

// Large
<Input className="h-11 text-base">
```

### Avatar Sizes
```typescript
<Avatar className="h-8 w-8">   // Small
<Avatar className="h-10 w-10"> // Medium
<Avatar className="h-12 w-12"> // Large
<Avatar className="h-16 w-16"> // Extra large
```

---

## 7. LAYOUT GRID

### Container
```typescript
// Max width container
<div className="container mx-auto">

// With padding
<div className="container mx-auto px-4 sm:px-6 lg:px-8">

// Max width variants
max-w-sm    // 384px
max-w-md    // 448px
max-w-lg    // 512px
max-w-xl    // 576px
max-w-2xl   // 672px
max-w-4xl   // 896px
max-w-6xl   // 1152px
max-w-7xl   // 1280px
```

### Grid System
```typescript
// Auto-fit grid
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

// Responsive columns
<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">

// Auto-fill with min width
<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
```

### Flexbox Layouts
```typescript
// Center content
<div className="flex items-center justify-center">

// Space between
<div className="flex items-center justify-between">

// Column layout
<div className="flex flex-col gap-4">

// Responsive direction
<div className="flex flex-col gap-4 md:flex-row md:items-center">
```

---

## 8. BREAKPOINTS

```typescript
// Tailwind breakpoints
sm: '640px'   // Small devices (landscape phones)
md: '768px'   // Medium devices (tablets)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices (large desktops)
2xl: '1536px' // 2X large devices

// Usage
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
```

---

## 9. ANIMATION & TRANSITIONS

### Duration
```typescript
duration-75     // 75ms
duration-100    // 100ms
duration-150    // 150ms
duration-200    // 200ms
duration-300    // 300ms
duration-500    // 500ms
duration-700    // 700ms
duration-1000   // 1000ms
```

### Timing Functions
```typescript
ease-linear     // linear
ease-in         // cubic-bezier(0.4, 0, 1, 1)
ease-out        // cubic-bezier(0, 0, 0.2, 1)
ease-in-out     // cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Transitions
```typescript
// Button hover
<button className="transition-colors duration-200 hover:bg-primary/90">

// Shadow hover
<div className="transition-shadow duration-300 hover:shadow-lg">

// Transform
<div className="transition-transform duration-200 hover:scale-105">

// All properties
<div className="transition-all duration-300">
```

### Animations
```typescript
// Fade in
<div className="animate-in fade-in duration-300">

// Slide in from bottom
<div className="animate-in slide-in-from-bottom duration-500">

// Spin (loading)
<div className="animate-spin">

// Pulse (loading)
<div className="animate-pulse">

// Bounce
<div className="animate-bounce">
```

---

## 10. ICONS

### Icon Library: Lucide React
```bash
npm install lucide-react
```

### Usage
```typescript
import { 
    User, 
    Mail, 
    Lock, 
    Search,
    Plus,
    Edit,
    Trash2,
    X,
    Check,
    ChevronDown,
    Menu,
    Settings
} from 'lucide-react';

// Standard size (24px)
<User className="h-6 w-6" />

// Small (16px)
<Mail className="h-4 w-4" />

// With color
<Lock className="h-5 w-5 text-primary" />

// In button
<Button>
    <Plus className="mr-2 h-4 w-4" />
    Add User
</Button>
```

---

## 11. Z-INDEX SCALE

```typescript
// Layering system
z-0      // Base layer
z-10     // Dropdown menus
z-20     // Sticky headers
z-30     // Fixed sidebars
z-40     // Modals backdrop
z-50     // Modals content
z-[100]  // Toasts/Notifications
z-[999]  // Tooltips
```

---

## 12. FORM COMPONENTS

### Input Style
```typescript
<input
    className={cn(
        "flex h-10 w-full rounded-md border border-input",
        "bg-background px-3 py-2 text-sm",
        "ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50"
    )}
/>
```

### Button Style
```typescript
<button
    className={cn(
        "inline-flex items-center justify-center",
        "rounded-md text-sm font-medium",
        "ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "h-10 px-4 py-2"
    )}
/>
```

### Select Style
```typescript
<select
    className={cn(
        "flex h-10 w-full rounded-md border border-input",
        "bg-background px-3 py-2 text-sm",
        "ring-offset-background",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50"
    )}
/>
```

---

## 13. CARD COMPONENTS

### Basic Card
```typescript
<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-6">
        <h3 className="text-2xl font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">Card description</p>
    </div>
</div>
```

### Card with Header & Footer
```typescript
<div className="rounded-lg border bg-card shadow-sm">
    <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold">Header</h3>
    </div>
    <div className="p-6 pt-0">
        {/* Content */}
    </div>
    <div className="flex items-center p-6 pt-0">
        <Button>Action</Button>
    </div>
</div>
```

---

## 14. STATUS COLORS

```typescript
// Success
<span className="text-success bg-success/10 px-2 py-1 rounded">

// Error
<span className="text-destructive bg-destructive/10 px-2 py-1 rounded">

// Warning
<span className="text-warning bg-warning/10 px-2 py-1 rounded">

// Info
<span className="text-info bg-info/10 px-2 py-1 rounded">

// Neutral
<span className="text-muted-foreground bg-muted px-2 py-1 rounded">
```

---

## 15. CSS CUSTOM PROPERTIES

### Implementation (resources/css/app.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        /* Color System */
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        
        --primary: 222.2 47.4% 11.2%;
        --primary-foreground: 210 40% 98%;
        
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;
        
        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;
        
        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;
        
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;
        
        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
        --ring: 222.2 84% 4.9%;
        
        --radius: 0.5rem;
    }
    
    .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        
        --primary: 210 40% 98%;
        --primary-foreground: 222.2 47.4% 11.2%;
        
        --secondary: 217.2 32.6% 17.5%;
        --secondary-foreground: 210 40% 98%;
        
        --muted: 217.2 32.6% 17.5%;
        --muted-foreground: 215 20.2% 65.1%;
        
        --accent: 217.2 32.6% 17.5%;
        --accent-foreground: 210 40% 98%;
        
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 210 40% 98%;
        
        --border: 217.2 32.6% 17.5%;
        --input: 217.2 32.6% 17.5%;
        --ring: 212.7 26.8% 83.9%;
    }
}

@layer base {
    * {
        @apply border-border;
    }
    
    body {
        @apply bg-background text-foreground;
    }
}
```

---

## USAGE EXAMPLES

### Page Layout
```typescript
<div className="min-h-screen bg-background">
    <header className="border-b">
        <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
                {/* Navigation */}
            </nav>
        </div>
    </header>
    
    <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
            {/* Content */}
        </div>
    </main>
    
    <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
            {/* Footer content */}
        </div>
    </footer>
</div>
```

### Data Table
```typescript
<div className="rounded-lg border bg-card">
    <div className="p-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="text-sm text-muted-foreground">
            Manage users in your organization
        </p>
    </div>
    
    <div className="border-t">
        <table className="w-full">
            <thead className="bg-muted/50">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                        Name
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {/* Rows */}
            </tbody>
        </table>
    </div>
</div>
```

---

## CHECKLIST

Before implementing designs:

- [ ] Colors use design tokens (--primary, --background, etc.)
- [ ] Typography follows scale (text-sm, text-base, etc.)
- [ ] Spacing uses multiples of 4px (p-4, gap-6, etc.)
- [ ] Border radius consistent (rounded-md, rounded-lg)
- [ ] Shadows appropriate for elevation level
- [ ] Components responsive across breakpoints
- [ ] Dark mode colors defined
- [ ] Transitions smooth (duration-200, ease-in-out)
- [ ] Icons from lucide-react
- [ ] Accessibility colors meet WCAG AA standards
