import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface HintItem {
  number: number;
  title: string;
  description: string;
}

interface HintGuideProps {
  title: string;
  items: HintItem[];
  tips?: string;
  className?: string;
}

export function HintGuide({ title, items, tips, className }: HintGuideProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all"
        title="Buka Panduan"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={cn('bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-lg p-4 md:p-6 text-white shadow-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold">{title}</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-500/30 rounded-lg transition-colors"
          title="Tutup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
        {items.map((item) => (
          <div key={item.number} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center font-bold text-sm">
              {item.number}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm md:text-base mb-1">{item.title}</h4>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      {tips && (
        <div className="border-t border-blue-500/30 pt-4 mt-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-200 font-semibold text-sm">Tips:</span>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed flex-1">{tips}</p>
          </div>
        </div>
      )}
    </div>
  );
}

