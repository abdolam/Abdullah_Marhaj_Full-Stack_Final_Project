import { useCallback, useMemo, useState } from "react";

import { ToastContext } from "../context/ToastContext";

function ToastItem({ toast, onClose }) {
  const isError = toast.type === "error";

  return (
    <div
      className={[
        "min-w-65 max-w-09 rounded-xl border px-4 py-3 text-sm shadow",
        isError
          ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
          : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
      ].join(" ")}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold">{toast.message}</div>
        <button
          type="button"
          className="rounded-lg px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => onClose(toast.id)}
          aria-label="סגור הודעה"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const toast = { id, message, type };
      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Bottom-left */}
      <div className="fixed bottom-8 left-4 z-50 space-y-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
