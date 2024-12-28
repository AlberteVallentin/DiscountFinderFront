import { useState, useMemo, useCallback } from 'react';
import { useSearch } from './useSearch';

export const useProductFilters = (initialProducts = []) => {
    // Søgning
    const {
        searchTerm,
        filteredItems: searchFilteredProducts,
        handleSearch
    } = useSearch(initialProducts, {
        keys: ['productName', 'categories.nameDa']
    });

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [sortOption, setSortOption] = useState(null);
    const [priceRange, setPriceRange] = useState(null);

    // Get unique categories
    const categories = useMemo(() => {
        const categorySet = new Set();
        searchFilteredProducts.forEach((product) => {
            product.categories.forEach((category) => {
                categorySet.add(category.nameDa);
            });
        });
        return Array.from(categorySet).sort();
    }, [searchFilteredProducts]);

    // Handle category toggle
    const handleCategoryToggle = useCallback((category) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    }, []);

    // Apply filters and sorting
    const filteredProducts = useMemo(() => {
        let filtered = [...searchFilteredProducts];

        // Category filter
        if (selectedCategories.size > 0) {
            filtered = filtered.filter((product) =>
                product.categories.some((cat) => selectedCategories.has(cat.nameDa))
            );
        }

        // Price filter
        if (priceRange) {
            filtered = filtered.filter(
                (product) =>
                    product.price.newPrice >= priceRange.min &&
                    (priceRange.max === Infinity || product.price.newPrice <= priceRange.max)
            );
        }

        // Sorting
        if (sortOption) {
            filtered.sort((a, b) => {
                switch (sortOption) {
                    case 'price-asc':
                        return a.price.newPrice - b.price.newPrice;
                    case 'price-desc':
                        return b.price.newPrice - a.price.newPrice;
                    case 'discount':
                        return b.price.percentDiscount - a.price.percentDiscount;
                    case 'expiry':
                        return new Date(a.timing.endTime) - new Date(b.timing.endTime);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [searchFilteredProducts, selectedCategories, priceRange, sortOption]);

    return {
        // Search
        searchTerm,
        handleSearch,
        // Categories
        categories,
        selectedCategories,
        handleCategoryToggle,
        // Sorting
        sortOption,
        setSortOption,
        // Price
        priceRange,
        setPriceRange,
        // Results
        filteredProducts
    };
};