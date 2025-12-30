import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:opacity-80 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
