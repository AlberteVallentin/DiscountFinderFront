import { useState, useCallback, useEffect } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        let timer;
        if (toast.visible) {
            timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000); // Toast vises i 3 sekunder
        }
        return () => clearTimeout(timer);
    }, [toast.visible]);

    const showToast = useCallback((message, type = 'success') => {
        setToast({
            visible: false,
            message: '',
            type: 'success'
        });

        // Lille forsinkelse for at sikre at tidligere toast er væk
        setTimeout(() => {
            setToast({
                visible: true,
                message,
                type
            });
        }, 100);
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    return {
        toast,
        showToast,
        hideToast
    };
};