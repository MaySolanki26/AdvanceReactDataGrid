import { useState, useCallback } from 'react';

interface EditingState {
  rowIndex: number;
  columnKey: string;
}

interface UseEditingProps<T> {
  data: T[];
  onCellEdit?: (rowIndex: number, columnKey: string, value: any) => void;
  onDataChange?: (newData: T[]) => void;
}

export function useEditing<T>({ data, onCellEdit, onDataChange }: UseEditingProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingState | null>(null);
  const [editingValue, setEditingValue] = useState<any>(null);

  const startEditing = useCallback((rowIndex: number, columnKey: string, value: any) => {
    setEditingCell({ rowIndex, columnKey });
    setEditingValue(value);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingCell && onCellEdit) {
      onCellEdit(editingCell.rowIndex, editingCell.columnKey, editingValue);
    }
    
    if (editingCell && onDataChange) {
      const newData = [...data];
      (newData[editingCell.rowIndex] as any)[editingCell.columnKey] = editingValue;
      onDataChange(newData);
    }
    
    setEditingCell(null);
    setEditingValue(null);
  }, [editingCell, editingValue, data, onCellEdit, onDataChange]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditingValue(null);
  }, []);

  return {
    editingCell,
    editingValue,
    setEditingValue,
    startEditing,
    saveEdit,
    cancelEdit
  };
}