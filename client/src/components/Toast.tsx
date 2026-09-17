import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { ToastNotice } from '../types/game';

interface ToastProps {
  toasts: ToastNotice[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 animate-pop-in border ${
              isError
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : 'bg-slate-900/90 border-slate-700 text-slate-100'
            }`}
          >
            {isError && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {!isError && !isSuccess && !isWarning && (
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
