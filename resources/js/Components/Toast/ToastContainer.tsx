import React from 'react';
import ToastComponent, { Toast } from './Toast';

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto animate-slideDown"
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
        >
          <ToastComponent toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

