import { useState, useEffect } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type) => {
        if (toast.visible) {
            setToast(prev => ({ ...prev, visible: false }));
            setTimeout(() => {
                setToast({ visible: true, message, type });
            }, 500);
        } else {
            setToast({ visible: true, message, type });
        }
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(hideToast, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    return { toast, showToast, hideToast };
};