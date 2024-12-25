import { useState, useEffect } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type) => {
        console.log('showToast called with:', message, type); // Debugging
        setToast({ visible: true, message, type });
    };

    const hideToast = () => {
        console.log('hideToast called'); // Debugging
        setToast({ visible: false, message: '', type: '' });
    };

    return { toast, showToast, hideToast };
};
