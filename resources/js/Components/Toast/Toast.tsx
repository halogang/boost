import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-white dark:bg-gray-800 border-l-4 border-green-500 shadow-xl backdrop-blur-sm',
  error: 'bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-xl backdrop-blur-sm',
  warning: 'bg-white dark:bg-gray-800 border-l-4 border-yellow-500 shadow-xl backdrop-blur-sm',
  info: 'bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-xl backdrop-blur-sm',
};

const iconContainerStyles: Record<ToastType, string> = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
};

const textStyles: Record<ToastType, string> = {
  success: 'text-gray-900 dark:text-gray-100',
  error: 'text-gray-900 dark:text-gray-100',
  warning: 'text-gray-900 dark:text-gray-100',
  info: 'text-gray-900 dark:text-gray-100',
};

export default function ToastComponent({ toast, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration > 0) {
      const interval = 50; // Update every 50ms for smooth animation
      const decrement = (100 / duration) * interval;
      
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - decrement;
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, interval);

      const timer = setTimeout(() => {
        onClose(toast.id);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [toast.id, duration, onClose]);

  return (
    <div
      className={cn(
        'relative flex items-start gap-4 p-5 rounded-xl border shadow-2xl min-w-[320px] max-w-md',
        'transform transition-all duration-300 ease-out',
        'hover:shadow-2xl hover:scale-[1.02]',
        toastStyles[toast.type]
      )}
      role="alert"
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-75 ease-linear',
              toast.type === 'success' && 'bg-green-500',
              toast.type === 'error' && 'bg-red-500',
              toast.type === 'warning' && 'bg-yellow-500',
              toast.type === 'info' && 'bg-blue-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Icon Container */}
      <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', iconContainerStyles[toast.type])}>
        {toastIcons[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className={cn('font-semibold text-base leading-tight', textStyles[toast.type])}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={cn('text-sm mt-1.5 leading-relaxed opacity-80', textStyles[toast.type])}>
            {toast.message}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

