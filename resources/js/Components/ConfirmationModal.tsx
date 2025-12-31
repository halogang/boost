import React from 'react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/Button';
import { cn } from '@/lib/utils';

export interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'default',
  isLoading = false,
  icon,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    default: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmButton: 'bg-primary text-primary-foreground hover:opacity-90',
    },
    danger: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmButton: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
    },
    warning: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      confirmButton: 'bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
    },
  };

  const styles = variantStyles[variant];

  const defaultIcon = (
    <div className={cn('mx-auto flex h-12 w-12 items-center justify-center rounded-full', styles.iconBg)}>
      {variant === 'danger' ? (
        <svg
          className={cn('h-6 w-6', styles.iconColor)}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ) : variant === 'warning' ? (
        <svg
          className={cn('h-6 w-6', styles.iconColor)}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ) : (
        <svg
          className={cn('h-6 w-6', styles.iconColor)}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </div>
  );

  return (
    <Modal show={show} onClose={onClose}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          {icon || defaultIcon}
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            className={cn('w-full sm:w-auto', styles.confirmButton)}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

