import React from 'react';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
}

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    outline:
      'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary',
    ghost:
      'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-primary',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:ring-red-500',
    link: 'text-primary underline-offset-4 hover:underline focus:ring-primary bg-transparent shadow-none',
  },
  size: {
    sm: 'h-8 px-3 text-xs',
    default: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10 p-0',
  },
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variant !== 'link' && 'shadow-sm',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className={cn('h-4 w-4 animate-spin', children && 'mr-2')}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;

