import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: toast.type || 'info',
            title: toast.title,
            message: toast.message,
            duration: toast.duration || 4000,
        };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, newToast.duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, title) => {
        return addToast({ type: 'success', message, title });
    }, [addToast]);

    const showError = useCallback((message, title) => {
        return addToast({ type: 'error', message, title });
    }, [addToast]);

    const showWarning = useCallback((message, title) => {
        return addToast({ type: 'warning', message, title });
    }, [addToast]);

    const showInfo = useCallback((message, title) => {
        return addToast({ type: 'info', message, title });
    }, [addToast]);

    return (
        <ToastContext.Provider
            value={{
                toasts,
                addToast,
                removeToast,
                showSuccess,
                showError,
                showWarning,
                showInfo,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};

export default ToastContext;
