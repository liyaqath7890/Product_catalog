import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-[0_18px_40px_rgba(16,185,129,0.12)]',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
  },
  info: {
    wrapper: 'border-[var(--table-grid)] bg-white text-[var(--color-gray-900)] shadow-[0_18px_40px_rgba(16,42,67,0.10)]',
    icon: Info,
    iconClass: 'text-[var(--color-primary)]',
  },
  warning: {
    wrapper: 'border-amber-200 bg-amber-50 text-amber-900 shadow-[0_18px_40px_rgba(245,158,11,0.12)]',
    icon: AlertCircle,
    iconClass: 'text-amber-600',
  },
  error: {
    wrapper: 'border-rose-200 bg-rose-50 text-rose-900 shadow-[0_18px_40px_rgba(244,63,94,0.12)]',
    icon: AlertCircle,
    iconClass: 'text-rose-600',
  },
};

const ToastItem = ({ toast, onDismiss }) => {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const Icon = style.icon;

  return (
    <div className={`pointer-events-auto flex items-start gap-3 rounded-[1.25rem] border px-4 py-3 backdrop-blur-sm ${style.wrapper}`}>
      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 ${style.iconClass}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{toast.title}</p>
        {toast.message ? <p className="mt-1 text-sm leading-5 opacity-90">{toast.message}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-lg p-1 text-current/60 transition-standard hover:bg-black/5 hover:text-current"
        aria-label="Dismiss toast"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    ({ title, message = '', type = 'info', duration = 3800 }) => {
      const id = ++idRef.current;
      const toast = { id, title, message, type };

      setToasts((current) => [toast, ...current].slice(0, 4));

      const timer = setTimeout(() => removeToast(id), duration);
      timersRef.current.set(id, timer);
    },
    [removeToast],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast: pushToast,
      success: (title, message = '') => pushToast({ title, message, type: 'success' }),
      info: (title, message = '') => pushToast({ title, message, type: 'info' }),
      warning: (title, message = '') => pushToast({ title, message, type: 'warning' }),
      error: (title, message = '') => pushToast({ title, message, type: 'error' }),
      dismissToast: removeToast,
    }),
    [pushToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-[380px] flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
