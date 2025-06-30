"use client";
import { createContext, useContext } from 'react';
export const ToastContext = createContext(undefined);
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
    // STATUS CHECK: useToast hook is defined but does not appear to be called anywhere in the project. Thus, showToast is not being used.
};
