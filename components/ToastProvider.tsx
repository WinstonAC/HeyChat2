"use client";

import React, { useState, useCallback, ReactNode } from 'react';
import Toast, { ToastMessage, ToastType } from './Toast';
import { ToastContext } from '@/hooks/useToast';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, message, type, duration },
      ]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 w-full max-w-xs sm:max-w-sm">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}; 