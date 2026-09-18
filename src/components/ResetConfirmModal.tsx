import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="reset-confirm-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reset-confirm-title"
      aria-describedby="reset-confirm-desc"
    >
      <div
        id="reset-confirm-dialog"
        className="w-full max-w-sm rounded-2xl p-6 transition-all shadow-2xl animate-scaleUp text-center"
        style={{
          backgroundColor: 'var(--orbit-surface)',
          border: '1px solid var(--orbit-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <h3
          id="reset-confirm-title"
          className="text-lg font-bold tracking-tight mb-2"
          style={{ color: 'var(--orbit-text)' }}
        >
          Reset Entire Orbit?
        </h3>

        <p
          id="reset-confirm-desc"
          className="text-sm font-medium mb-6"
          style={{ color: 'var(--orbit-text-muted)' }}
        >
          This will permanently wipe all habits and historical completion records, returning you to a clean fresh Orbit.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{
              backgroundColor: 'var(--orbit-surface-subtle)',
              border: '1px solid var(--orbit-border)',
              color: 'var(--orbit-text)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-reset-orbit-button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md active:scale-95"
          >
            Reset Orbit
          </button>
        </div>
      </div>
    </div>
  );
};
