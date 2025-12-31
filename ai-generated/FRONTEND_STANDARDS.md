# FRONTEND CODING STANDARDS

**Version**: 1.0  
**Stack**: React + TypeScript + Inertia.js + TailwindCSS + shadcn/ui

---

## 1. PROJECT STRUCTURE

```
resources/js/
├── Components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── shared/         # Shared business components
├── Layouts/            # Page layouts
│   ├── AuthenticatedLayout.tsx
│   └── GuestLayout.tsx
├── Pages/              # Inertia pages (match Laravel routes)
│   ├── Auth/
│   ├── Admin/
│   └── Dashboard.tsx
├── lib/                # Utilities
│   ├── utils.ts        # Helper functions
│   ├── api.ts          # API utilities
│   └── constants.ts    # Constants
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   └── usePermission.ts
├── types/              # TypeScript types
│   ├── index.d.ts      # Global types
│   ├── models.ts       # Model interfaces
│   └── inertia.d.ts    # Inertia types
└── app.tsx             # Entry point
```

---

## 2. NAMING CONVENTIONS

### Files & Components
```typescript
// Components: PascalCase
UserCard.tsx
ProductList.tsx
DataTable.tsx

// Pages: Match route structure
Pages/Admin/Users/Index.tsx      // /admin/users
Pages/Admin/Users/Create.tsx     // /admin/users/create
Pages/Admin/Users/Edit.tsx       // /admin/users/{id}/edit

// Hooks: camelCase with 'use' prefix
useAuth.ts
usePermission.ts
useDebounce.ts

// Utils: camelCase
utils.ts
formatters.ts
validators.ts

// Types: PascalCase
User.ts
Product.ts
models.ts
```

### Variables & Functions
```typescript
// Variables: camelCase
const userName = 'John';
const userList = [];
const isLoading = false;

// Functions: camelCase, verb prefix
function getUserById(id: number) {}
function handleSubmit(data: FormData) {}
function validateEmail(email: string): boolean {}

// Event handlers: handle prefix
const handleClick = () => {};
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};
const handleSubmit = async (e: FormEvent) => {};

// Boolean variables: is/has/can prefix
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

---

## 3. COMPONENT STRUCTURE

### Functional Component Template
```typescript
import { FC } from 'react';
import { cn } from '@/lib/utils';

// 1. Props interface
interface UserCardProps {
    user: User;
    onEdit?: (user: User) => void;
    className?: string;
}

// 2. Component
export const UserCard: FC<UserCardProps> = ({ 
    user, 
    onEdit, 
    className 
}) => {
    // 3. Hooks (top of component)
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: user.name,
        email: user.email,
    });

    // 4. Event handlers
    const handleEdit = () => {
        onEdit?.(user);
    };

    // 5. Render
    return (
        <div className={cn('rounded-lg border p-4', className)}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            {onEdit && (
                <button onClick={handleEdit}>Edit</button>
            )}
        </div>
    );
};
```

### Page Component Template (Inertia)
```typescript
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

// 1. Page data interface
interface UserIndexPageProps extends PageProps {
    users: {
        data: User[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
}

// 2. Page component
export default function Index({ auth, users }: UserIndexPageProps) {
    // 3. Hooks & state
    const [search, setSearch] = useState('');

    // 4. Event handlers
    const handleSearch = (value: string) => {
        router.get(route('admin.users.index'), { search: value });
    };

    // 5. Render
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Users" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Content */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

---

## 4. TYPESCRIPT CONVENTIONS

### Type Definitions
```typescript
// Interfaces for objects (prefer interface over type)
interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: string;
}

// Type aliases for unions/primitives
type UserRole = 'admin' | 'user' | 'guest';
type Status = 'active' | 'inactive' | 'pending';

// Enums for fixed sets
enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Failed = 'failed',
}

// Generic types
interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

// Utility types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
```

### Props Types
```typescript
// Basic props
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
}

// Props with HTML attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

// Props with generics
interface SelectProps<T> {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    getLabel: (option: T) => string;
    getValue: (option: T) => string | number;
}
```

---

## 5. HOOKS USAGE

### Built-in Hooks
```typescript
// useState: for local state
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useEffect: for side effects
useEffect(() => {
    // Effect logic
    return () => {
        // Cleanup
    };
}, [dependencies]);

// useMemo: for expensive computations
const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.includes(search));
}, [users, search]);

// useCallback: for memoized callbacks
const handleClick = useCallback(() => {
    console.log('clicked');
}, []);
```

### Inertia Hooks
```typescript
// useForm: for forms
const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    email: '',
});

// router: for navigation
import { router } from '@inertiajs/react';

router.visit('/admin/users');
router.get('/admin/users', { search: 'john' });
router.post('/admin/users', userData);
router.put(`/admin/users/${id}`, userData);
router.delete(`/admin/users/${id}`);

// usePage: for page props
const { props } = usePage<PageProps>();
const { auth, flash } = props;
```

### Custom Hooks
```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// Usage
const debouncedSearch = useDebounce(search, 500);
```

---

## 6. FORM HANDLING

### Inertia Form
```typescript
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user' as UserRole,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <form onSubmit={submit}>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            <button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}
```

---

## 7. STYLING WITH TAILWIND

### Best Practices
```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<button
    className={cn(
        'rounded-md px-4 py-2 font-medium',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'bg-secondary text-gray-900',
        disabled && 'cursor-not-allowed opacity-50'
    )}
/>

// Use design tokens from theme
<div className="bg-background text-foreground">
    <h1 className="text-primary">Title</h1>
    <p className="text-muted-foreground">Description</p>
</div>

// Responsive design
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {/* Content */}
</div>

// Dark mode support
<div className="bg-white dark:bg-gray-900">
    <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

### Component Variants Pattern
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input bg-background hover:bg-accent',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

interface ButtonProps extends 
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: FC<ButtonProps> = ({ 
    className, 
    variant, 
    size, 
    ...props 
}) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
};
```

---

## 8. STATE MANAGEMENT

### Local State (useState)
```typescript
// For component-specific state
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<number | null>(null);
```

### Inertia Shared Data
```typescript
// In Laravel: Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
        ],
    ];
}

// In React: Access via usePage
const { auth, flash } = usePage<PageProps>().props;
```

### Context API (for larger state)
```typescript
// contexts/ThemeContext.tsx
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
```

---

## 9. ERROR HANDLING

### API Errors
```typescript
// Inertia automatically handles validation errors
const { errors } = useForm();

// Display errors
{errors.email && (
    <p className="text-sm text-destructive">{errors.email}</p>
)}

// Global error handling
router.post('/api/users', data, {
    onError: (errors) => {
        toast.error('Failed to create user');
    },
    onSuccess: () => {
        toast.success('User created successfully');
    },
});
```

### Try-Catch for Async Operations
```typescript
const fetchData = async () => {
    try {
        setLoading(true);
        const response = await fetch('/api/data');
        const data = await response.json();
        setData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
    } finally {
        setLoading(false);
    }
};
```

---

## 10. PERFORMANCE OPTIMIZATION

### Code Splitting
```typescript
// Lazy load pages
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Pages/Dashboard'));

<Suspense fallback={<Loading />}>
    <Dashboard />
</Suspense>
```

### Memoization
```typescript
// useMemo for expensive calculations
const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// useCallback for functions passed as props
const handleDelete = useCallback((id: number) => {
    router.delete(route('users.destroy', id));
}, []);

// React.memo for components
export const UserCard = memo(({ user }: UserCardProps) => {
    return <div>{user.name}</div>;
});
```

---

## 11. TESTING CONVENTIONS

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('UserCard', () => {
    it('renders user information', () => {
        const user = { id: 1, name: 'John', email: 'john@example.com' };
        render(<UserCard user={user} />);
        
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', async () => {
        const user = { id: 1, name: 'John', email: 'john@example.com' };
        const onEdit = jest.fn();
        
        render(<UserCard user={user} onEdit={onEdit} />);
        
        await userEvent.click(screen.getByRole('button', { name: /edit/i }));
        expect(onEdit).toHaveBeenCalledWith(user);
    });
});
```

---

## 12. ACCESSIBILITY

### ARIA Attributes
```typescript
// Buttons
<button
    aria-label="Close dialog"
    aria-pressed={isActive}
    aria-disabled={disabled}
>
    <XIcon />
</button>

// Forms
<label htmlFor="email">Email</label>
<input
    id="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
    <p id="email-error" role="alert">{errors.email}</p>
)}

// Modals
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Confirm Action</h2>
</div>
```

### Keyboard Navigation
```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
        onClose();
    }
    if (e.key === 'Enter') {
        onSubmit();
    }
};

<div onKeyDown={handleKeyDown} tabIndex={0}>
    {/* Content */}
</div>
```

---

## 13. CODE QUALITY RULES

### ESLint Rules (eslint.config.js)
```javascript
export default [
    {
        rules: {
            // React
            'react/prop-types': 'off', // Using TypeScript
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            
            // TypeScript
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            
            // General
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prefer-const': 'error',
        },
    },
];
```

### File Organization
```typescript
// Order of imports
// 1. External libraries
import { FC, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

// 2. Internal modules
import { Button } from '@/Components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 3. Types
import type { User } from '@/types/models';

// 4. Styles (if any)
import './styles.css';
```

---

## 14. COMMENTS & DOCUMENTATION

### JSDoc Comments
```typescript
/**
 * Formats a date string to a readable format
 * @param date - ISO date string
 * @param format - Format pattern (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string, format = 'MMM dd, yyyy'): string {
    // Implementation
}

/**
 * User card component displaying user information
 * @component
 * @example
 * ```tsx
 * <UserCard 
 *   user={user} 
 *   onEdit={(user) => console.log(user)} 
 * />
 * ```
 */
export const UserCard: FC<UserCardProps> = ({ user, onEdit }) => {
    // Implementation
};
```

### Inline Comments
```typescript
// Good: Explain WHY, not WHAT
// Calculate discount based on user tier and purchase amount
const discount = calculateDiscount(user.tier, amount);

// Bad: Stating the obvious
// Set the name variable to user.name
const name = user.name;
```

---

## 15. COMMON PATTERNS

### Data Fetching with Inertia
```typescript
// Index page with filters
const [filters, setFilters] = useState({
    search: '',
    role: '',
});

const handleFilter = () => {
    router.get(route('users.index'), filters, {
        preserveState: true,
        preserveScroll: true,
    });
};

// Load more pagination
const loadMore = () => {
    router.visit(users.links.next, {
        preserveState: true,
        preserveScroll: true,
    });
};
```

### Modal Pattern
```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);

const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
};

return (
    <>
        <UserList users={users} onEdit={handleEdit} />
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                {selectedUser && <UserForm user={selectedUser} />}
            </DialogContent>
        </Dialog>
    </>
);
```

### Toast Notifications
```typescript
import { toast } from 'sonner';

// Success
router.post('/users', data, {
    onSuccess: () => {
        toast.success('User created successfully');
    },
});

// Error
router.delete(`/users/${id}`, {
    onError: () => {
        toast.error('Failed to delete user');
    },
});

// Promise
toast.promise(
    fetch('/api/data'),
    {
        loading: 'Loading...',
        success: 'Data loaded',
        error: 'Failed to load',
    }
);
```

---

## CHECKLIST

Before committing frontend code:

- [ ] Component follows naming conventions (PascalCase)
- [ ] TypeScript interfaces defined for all props
- [ ] No unused imports or variables
- [ ] Proper error handling for forms
- [ ] Accessibility attributes added (ARIA, semantic HTML)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Dark mode support (if applicable)
- [ ] Loading states handled
- [ ] Error states displayed
- [ ] Success messages shown
- [ ] Code formatted with Prettier
- [ ] No console.logs in production code
- [ ] Comments added for complex logic
