import React, { useState, useRef, useEffect } from 'react';
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
  const [operator, setOperator] = useState<FilterConfig['operator']>(currentFilter?.operator || 'contains');
  const [value, setValue] = useState<string>(currentFilter?.value || '');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleApply = () => {
    onApplyFilter(value, operator);
    onClose();
  };

  const handleClear = () => {
    setValue('');
    onApplyFilter('', operator);
    onClose();
  };

  if (!isOpen) return null;

  // Get unique values for select columns
  const uniqueValues = column.type === 'select' || column.type === 'boolean' ? 
    [...new Set(data.map(row => {
      const val = column.accessor ? column.accessor(row) : (row as any)[column.key];
      return val;
    }).filter(v => v !== null && v !== undefined))] : [];

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[200px]"
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by
          </label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as FilterConfig['operator'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts with</option>
            <option value="endsWith">Ends with</option>
            {column.type === 'number' && (
              <>
                <option value="gt">Greater than</option>
                <option value="lt">Less than</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          {column.type === 'select' ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {uniqueValues.map((val) => (
                <option key={String(val)} value={String(val)}>
                  {String(val)}
                </option>
              ))}
            </select>
          ) : column.type === 'boolean' ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : column.type === 'date' ? (
            <input
              type="date"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : column.type === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number..."
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter value..."
            />
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleApply}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}