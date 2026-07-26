"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Toast, ToastMessage, ToastType } from "./Toast";

interface ToastOptions {
  badge?: string;
  duration?: number;
  details?: string;
}

interface ToastContextType {
  showToast: (
    type: ToastType,
    title: string,
    message: string,
    options?: ToastOptions
  ) => void;
  toast: {
    success: (
      title: string,
      message: string,
      options?: ToastOptions
    ) => void;
    error: (
      title: string,
      message: string,
      options?: ToastOptions
    ) => void;
    info: (
      title: string,
      message: string,
      options?: ToastOptions
    ) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message: string,
      options?: ToastOptions
    ) => {
      setToasts((prev) => {
        // Prevent duplicate toast spamming by checking if identical toast is active
        const isDuplicate = prev.some(
          (t) => t.type === type && t.title === title && t.message === message
        );
        if (isDuplicate) return prev;

        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastMessage = {
          id,
          type,
          title,
          message,
          badge: options?.badge,
          duration: options?.duration,
          details: options?.details,
        };
        return [...prev.slice(-1), newToast]; // Keep maximum 2 toasts on screen
      });
    },
    []
  );

  const toastHelpers = {
    success: (
      title: string,
      message: string,
      options?: ToastOptions
    ) => showToast("success", title, message, options),
    error: (
      title: string,
      message: string,
      options?: ToastOptions
    ) => showToast("error", title, message, options),
    info: (
      title: string,
      message: string,
      options?: ToastOptions
    ) => showToast("info", title, message, options),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast: toastHelpers }}>
      {children}
      {/* Toast Floating Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-[340px] w-full pointer-events-none px-2">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto w-full">
            <Toast toast={item} onClose={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
