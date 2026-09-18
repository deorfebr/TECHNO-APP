import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="orbit-toast"
      className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border text-sm font-medium animate-slideUp"
      style={{
        backgroundColor: 'var(--orbit-surface)',
        borderColor: 'var(--orbit-border)',
        color: 'var(--orbit-text)',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ color: 'var(--orbit-mint)' }}
      >
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span>{message}</span>
    </div>
  );
};
