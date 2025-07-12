import { useState, useCallback, useMemo } from 'react';
import { SelectionState } from '../types';

interface UseSelectionProps<T> {
  data: T[];
  rowKey: string;
  multiSelect?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export function useSelection<T>({
  data,
  rowKey,
  multiSelect = true,
  onSelectionChange
}: UseSelectionProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const selectionState: SelectionState = useMemo(() => {
    const totalRows = data.length;
    const selectedCount = selectedRows.size;
    
    return {
      selectedRows,
      isAllSelected: totalRows > 0 && selectedCount === totalRows,
      isIndeterminate: selectedCount > 0 && selectedCount < totalRows
    };
  }, [data.length, selectedRows]);

  const getRowKey = useCallback((row: T): string => {
    return String((row as any)[rowKey]);
  }, [rowKey]);

  const isRowSelected = useCallback((row: T): boolean => {
    return selectedRows.has(getRowKey(row));
  }, [selectedRows, getRowKey]);

  const toggleRowSelection = useCallback((row: T, event?: React.MouseEvent) => {
    const key = getRowKey(row);
    const newSelection = new Set(selectedRows);

    if (event?.shiftKey && multiSelect) {
      // Handle shift-click for range selection
      const currentIndex = data.findIndex(r => getRowKey(r) === key);
      const lastSelectedIndex = data.findIndex(r => selectedRows.has(getRowKey(r)));
      
      if (lastSelectedIndex !== -1) {
        const start = Math.min(currentIndex, lastSelectedIndex);
        const end = Math.max(currentIndex, lastSelectedIndex);
        
        for (let i = start; i <= end; i++) {
          newSelection.add(getRowKey(data[i]));
        }
      } else {
        if (newSelection.has(key)) {
          newSelection.delete(key);
        } else {
          newSelection.add(key);
        }
      }
    } else if (event?.ctrlKey || event?.metaKey) {
      // Handle ctrl/cmd-click for individual selection
      if (newSelection.has(key)) {
        newSelection.delete(key);
      } else {
        newSelection.add(key);
      }
    } else {
      // Handle regular click
      if (multiSelect) {
        if (newSelection.has(key)) {
          newSelection.delete(key);
        } else {
          newSelection.add(key);
        }
      } else {
        // Single select mode
        if (newSelection.has(key)) {
          newSelection.clear();
        } else {
          newSelection.clear();
          newSelection.add(key);
        }
      }
    }

    setSelectedRows(newSelection);
    
    if (onSelectionChange) {
      const selectedRowData = data.filter(row => newSelection.has(getRowKey(row)));
      onSelectionChange(selectedRowData);
    }
  }, [data, selectedRows, multiSelect, getRowKey, onSelectionChange]);

  const toggleAllSelection = useCallback(() => {
    const newSelection = new Set<string>();
    
    if (!selectionState.isAllSelected) {
      data.forEach(row => {
        newSelection.add(getRowKey(row));
      });
    }
    
    setSelectedRows(newSelection);
    
    if (onSelectionChange) {
      const selectedRowData = data.filter(row => newSelection.has(getRowKey(row)));
      onSelectionChange(selectedRowData);
    }
  }, [data, selectionState.isAllSelected, getRowKey, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  const selectRows = useCallback((rows: T[]) => {
    const newSelection = new Set<string>();
    rows.forEach(row => {
      newSelection.add(getRowKey(row));
    });
    setSelectedRows(newSelection);
    
    if (onSelectionChange) {
      onSelectionChange(rows);
    }
  }, [getRowKey, onSelectionChange]);

  const getSelectedRows = useCallback((): T[] => {
    return data.filter(row => selectedRows.has(getRowKey(row)));
  }, [data, selectedRows, getRowKey]);

  return {
    selectionState,
    isRowSelected,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    selectRows,
    getSelectedRows
  };
}
