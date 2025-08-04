'use client';
import React, {ReactNode, useState, useEffect, createContext, useContext, useRef } from 'react';
// --- Toast Notification Service ---
const ToastContext = createContext<{ showToast: (message: string, type?: string, duration?: number) => void }>({ showToast: () => {} });

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);
  const toastIdCounter = useRef(0);

  const showToast = (message: string, type: string = 'info', duration: number = 2000) => {
    const id = toastIdCounter.current++;
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastContainer = ({ toasts }: { toasts: Array<{ id: number; message: string; type: string }> }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium
            ${toast.type === 'success' ? 'bg-green-500' :
             toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
            transition-all duration-300 ease-out transform translate-x-0 opacity-100
            `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
// --- End Toast Notification Service ---
