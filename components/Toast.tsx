"use client";

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps extends ToastMessage {
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out animation before calling onDismiss
      setTimeout(() => onDismiss(id), 300); // Corresponds to fade-out duration
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onDismiss]);

  const baseClasses = "p-4 rounded-md shadow-lg text-white transition-all duration-300 ease-in-out transform";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-gray-800", // Yellow needs darker text for contrast
    info: "bg-blue-500",
  };

  const visibilityClasses = isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full";

  if (!message) return null; // Don\'t render if message is somehow empty

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses} mb-2 max-w-sm w-full`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(id), 300);
          }}
          className="ml-2 text-xl font-semibold leading-none hover:opacity-75"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast; 