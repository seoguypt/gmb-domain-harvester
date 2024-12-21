import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSort<T>(items: T[], defaultKey: string = '') {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey,
    direction: 'asc'
  });

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a: any, b: any) => {
      // Handle nested properties using dot notation (e.g., "listing.businessName")
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      // Handle null/undefined values
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      // Compare values
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    items: sortedItems,
    sortConfig,
    requestSort
  };
}
