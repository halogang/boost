import React from 'react';
import { ConfirmationModal } from '@/Components/ConfirmationModal';
import { useConfirmation } from '@/hooks/useConfirmation';

interface ConfirmationContextType {
  confirm: (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger' | 'warning';
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  }) => void;
}

const ConfirmationContext = React.createContext<ConfirmationContextType | null>(null);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const confirmation = useConfirmation();

  return (
    <ConfirmationContext.Provider value={{ confirm: confirmation.confirm }}>
      {children}
      {confirmation.options && (
        <ConfirmationModal
          show={confirmation.isOpen}
          onClose={confirmation.handleCancel}
          onConfirm={confirmation.handleConfirm}
          title={confirmation.options.title || 'Konfirmasi'}
          message={confirmation.options.message}
          confirmText={confirmation.options.confirmText}
          cancelText={confirmation.options.cancelText}
          variant={confirmation.options.variant}
          isLoading={confirmation.isLoading}
        />
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmationModal() {
  const context = React.useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmationModal must be used within ConfirmationProvider');
  }
  return context;
}

