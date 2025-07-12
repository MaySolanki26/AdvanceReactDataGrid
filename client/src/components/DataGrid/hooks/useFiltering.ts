import { useState, useCallback } from 'react';
import { FilterConfig } from '../types';

interface UseFilteringProps {
  onFilterChange?: (filterConfig: FilterConfig[]) => void;
}

export function useFiltering({ onFilterChange }: UseFilteringProps) {
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const handleFilter = useCallback((columnKey: string, value: any, operator: FilterConfig['operator'] = 'contains') => {
    const existingFilterIndex = filterConfig.findIndex(filter => filter.key === columnKey);
    let newFilterConfig: FilterConfig[];

    if (value === null || value === undefined || value === '') {
      // Remove filter
      newFilterConfig = filterConfig.filter(filter => filter.key !== columnKey);
    } else {
      const newFilter: FilterConfig = { key: columnKey, value, operator };
      
      if (existingFilterIndex !== -1) {
        // Update existing filter
        newFilterConfig = [...filterConfig];
        newFilterConfig[existingFilterIndex] = newFilter;
      } else {
        // Add new filter
        newFilterConfig = [...filterConfig, newFilter];
      }
    }

    setFilterConfig(newFilterConfig);
    onFilterChange?.(newFilterConfig);
  }, [filterConfig, onFilterChange]);

  const getFilterValue = useCallback((columnKey: string): any => {
    const filter = filterConfig.find(filter => filter.key === columnKey);
    return filter ? filter.value : null;
  }, [filterConfig]);

  const clearFilter = useCallback((columnKey?: string) => {
    if (columnKey) {
      const newFilterConfig = filterConfig.filter(filter => filter.key !== columnKey);
      setFilterConfig(newFilterConfig);
      onFilterChange?.(newFilterConfig);
    } else {
      setFilterConfig([]);
      onFilterChange?.([]);
    }
  }, [filterConfig, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    setFilterConfig([]);
    setGlobalFilter('');
    onFilterChange?.([]);
  }, [onFilterChange]);

  const handleGlobalFilter = useCallback((value: string) => {
    setGlobalFilter(value);
  }, []);

  const isColumnFiltered = useCallback((columnKey: string): boolean => {
    return filterConfig.some(filter => filter.key === columnKey);
  }, [filterConfig]);

  const getActiveFiltersCount = useCallback((): number => {
    return filterConfig.length + (globalFilter ? 1 : 0);
  }, [filterConfig, globalFilter]);

  return {
    filterConfig,
    globalFilter,
    handleFilter,
    getFilterValue,
    clearFilter,
    clearAllFilters,
    handleGlobalFilter,
    isColumnFiltered,
    getActiveFiltersCount
  };
}
