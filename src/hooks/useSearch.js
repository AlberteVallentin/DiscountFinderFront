import { useState, useMemo, useCallback } from 'react';

export const useSearch = (items = [], searchConfig = {}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getNestedValue = useCallback((obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }, []);

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) {
            return items;
        }

        const searchTermLower = searchTerm.toLowerCase();
        return items.filter((item) => {
            if (searchConfig.keys && searchConfig.keys.length > 0) {
                return searchConfig.keys.some((key) => {
                    const value = getNestedValue(item, key);
                    return value && value.toString().toLowerCase().includes(searchTermLower);
                });
            }

            return Object.keys(item).some((key) => {
                const value = item[key];
                return (
                    (typeof value === 'string' || typeof value === 'number') &&
                    value.toString().toLowerCase().includes(searchTermLower)
                );
            });
        });
    }, [items, searchTerm, searchConfig.keys, getNestedValue]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(typeof term === 'string' ? term : term.target.value);
    }, []);

    return {
        searchTerm,
        filteredItems,
        handleSearch
    };
};