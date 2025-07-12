import { useState, useCallback } from 'react';
import { SortConfig } from '../types';

interface UseSortingProps {
  multiSort?: boolean;
  onSortChange?: (sortConfig: SortConfig[]) => void;
}

export function useSorting({ multiSort = true, onSortChange }: UseSortingProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);

  const handleSort = useCallback((columnKey: string, event?: React.MouseEvent) => {
    const existingSort = sortConfig.find(sort => sort.key === columnKey);
    let newSortConfig: SortConfig[];

    if (existingSort) {
      if (existingSort.direction === 'asc') {
        // Change to descending
        newSortConfig = sortConfig.map(sort =>
          sort.key === columnKey ? { ...sort, direction: 'desc' as const } : sort
        );
      } else {
        // Remove sort
        newSortConfig = sortConfig.filter(sort => sort.key !== columnKey);
      }
    } else {
      // Add new sort
      const newSort: SortConfig = { key: columnKey, direction: 'asc' };
      
      if (multiSort && (event?.shiftKey || event?.ctrlKey || event?.metaKey)) {
        newSortConfig = [...sortConfig, newSort];
      } else {
        newSortConfig = [newSort];
      }
    }

    setSortConfig(newSortConfig);
    onSortChange?.(newSortConfig);
  }, [sortConfig, multiSort, onSortChange]);

  const getSortDirection = useCallback((columnKey: string): 'asc' | 'desc' | null => {
    const sort = sortConfig.find(sort => sort.key === columnKey);
    return sort ? sort.direction : null;
  }, [sortConfig]);

  const getSortIndex = useCallback((columnKey: string): number => {
    const index = sortConfig.findIndex(sort => sort.key === columnKey);
    return index === -1 ? -1 : index + 1;
  }, [sortConfig]);

  const clearSort = useCallback(() => {
    setSortConfig([]);
    onSortChange?.([]);
  }, [onSortChange]);

  const setSortColumns = useCallback((columns: SortConfig[]) => {
    setSortConfig(columns);
    onSortChange?.(columns);
  }, [onSortChange]);

  return {
    sortConfig,
    handleSort,
    getSortDirection,
    getSortIndex,
    clearSort,
    setSortColumns
  };
}
