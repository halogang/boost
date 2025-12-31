import { useState, useCallback } from 'react';

export interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((opts: ConfirmationOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!options) return;

    try {
      setIsLoading(true);
      await options.onConfirm();
      setIsOpen(false);
      setOptions(null);
    } catch (error) {
      // Error handling is done by the caller
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const handleCancel = useCallback(() => {
    if (options?.onCancel) {
      options.onCancel();
    }
    setIsOpen(false);
    setOptions(null);
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  return {
    isOpen,
    isLoading,
    options,
    confirm,
    handleConfirm,
    handleCancel,
    close,
  };
}

