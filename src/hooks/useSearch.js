import { useState, useCallback, useEffect } from 'react';

export const useSearch = (initialItems = [], searchConfig = {}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState(initialItems);
    const [filteredItems, setFilteredItems] = useState(initialItems);

    // Helper function for getting nested values
    const getNestedValue = useCallback((obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }, []);

    // Search function
    const performSearch = useCallback((term, itemsToSearch) => {
        if (!term.trim()) {
            return itemsToSearch;
        }

        const searchTermLower = term.toLowerCase();
        return itemsToSearch.filter((item) => {
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
    }, [searchConfig.keys, getNestedValue]);

    // Update filtered items when search term or items change
    useEffect(() => {
        setFilteredItems(performSearch(searchTerm, items));
    }, [searchTerm, items, performSearch]);

    // Update items only when initialItems changes
    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    return {
        searchTerm,
        filteredItems,
        handleSearch,
        setItems
    };
};