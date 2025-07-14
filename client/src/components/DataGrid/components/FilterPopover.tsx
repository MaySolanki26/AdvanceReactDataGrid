import React, { useState, useEffect } from 'react';
import { ColumnDef, FilterConfig } from '../types';

interface FilterPopoverProps<T> {
  column: ColumnDef<T>;
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (value: any, operator: FilterConfig['operator']) => void;
  currentFilter: FilterConfig | null;
  data: T[];
}

export function FilterPopover<T>({
  column,
  isOpen,
  onClose,
  onApplyFilter,
  currentFilter,
  data
}: FilterPopoverProps<T>) {
  const [filterValue, setFilterValue] = useState(currentFilter?.value || '');
  const [operator, setOperator] = useState<FilterConfig['operator']>(currentFilter?.operator || 'contains');

  useEffect(() => {
    if (isOpen) {
      setFilterValue(currentFilter?.value || '');
      setOperator(currentFilter?.operator || 'contains');
    }
  }, [isOpen, currentFilter]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilter(filterValue, operator);
    onClose();
  };

  const handleClear = () => {
    onApplyFilter(null, 'contains');
    onClose();
  };

  const getUniqueValues = () => {
    const values = new Set();
    data.forEach(row => {
      const value = column.accessor ? column.accessor(row) : (row as any)[column.key];
      if (value !== null && value !== undefined) {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  };

  const renderFilterInput = () => {
    switch (column.type) {
      case 'number':
        return (
          <input
            type="number"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Enter number..."
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={filterValue ? new Date(filterValue).toISOString().split('T')[0] : ''}
            onChange={(e) => setFilterValue(e.target.value ? new Date(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        );
      
      case 'boolean':
        return (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value === 'true' ? true : e.target.value === 'false' ? false : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      
      case 'select':
        const uniqueValues = getUniqueValues();
        return (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All</option>
            {uniqueValues.map((value: any) => (
              <option key={value} value={value}>
                {String(value)}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Enter text..."
          />
        );
    }
  };

  const getOperatorOptions = () => {
    switch (column.type) {
      case 'number':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'gt', label: 'Greater than' },
          { value: 'lt', label: 'Less than' },
          { value: 'between', label: 'Between' }
        ];
      case 'date':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'gt', label: 'After' },
          { value: 'lt', label: 'Before' }
        ];
      case 'boolean':
      case 'select':
        return [
          { value: 'equals', label: 'Equals' }
        ];
      default:
        return [
          { value: 'contains', label: 'Contains' },
          { value: 'equals', label: 'Equals' },
          { value: 'startsWith', label: 'Starts with' },
          { value: 'endsWith', label: 'Ends with' }
        ];
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by {column.title}
          </label>
          {renderFilterInput()}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as FilterConfig['operator'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {getOperatorOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}