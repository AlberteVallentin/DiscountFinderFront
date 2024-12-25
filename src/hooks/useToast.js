import { useState, useEffect } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type) => {
        // Hvis der allerede er en toast, fjern den først
        if (toast.visible) {
            setToast(prev => ({ ...prev, visible: false }));
            setTimeout(() => {
                setToast({ visible: true, message, type });
            }, 100);
        } else {
            setToast({ visible: true, message, type });
        }
    };

    const hideToast = () => {
        setToast({ visible: false, message: '', type: '' });
    };

    // Auto-hide efter 3 sekunder
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(hideToast, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    return { toast, showToast, hideToast };
};