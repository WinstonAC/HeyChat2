"use client";

import { createContext, useContext } from 'react';
import { ToastType } from '@/components/Toast'; // Assuming Toast.tsx is in components folder

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
  // STATUS CHECK: useToast hook is defined but does not appear to be called anywhere in the project. Thus, showToast is not being used.
}; 