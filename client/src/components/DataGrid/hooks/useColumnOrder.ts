import { useState, useCallback } from 'react';
import { ColumnDef } from '../types';

interface UseColumnOrderProps {
  columns: ColumnDef[];
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;
}

export function useColumnOrder({ columns, onColumnReorder }: UseColumnOrderProps) {
  const [columnOrder, setColumnOrder] = useState<string[]>(() => 
    columns.map(col => col.key)
  );
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const orderedColumns = columnOrder
    .map(key => columns.find(col => col.key === key))
    .filter(Boolean) as ColumnDef[];

  const handleDragStart = useCallback((columnKey: string, e: React.DragEvent) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnKey);
  }, []);

  const handleDragOver = useCallback((columnKey: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnKey);
  }, []);

  const handleDragEnter = useCallback((columnKey: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((columnKey: string, e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === columnKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const fromIndex = columnOrder.indexOf(draggedColumn);
    const toIndex = columnOrder.indexOf(columnKey);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newOrder = [...columnOrder];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      
      setColumnOrder(newOrder);
      
      if (onColumnReorder) {
        onColumnReorder(fromIndex, toIndex);
      }
    }

    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [columnOrder, draggedColumn, onColumnReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, []);

  const moveColumn = useCallback((fromIndex: number, toIndex: number) => {
    const newOrder = [...columnOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setColumnOrder(newOrder);
  }, [columnOrder]);

  const resetOrder = useCallback(() => {
    setColumnOrder(columns.map(col => col.key));
  }, [columns]);

  return {
    columnOrder,
    orderedColumns,
    draggedColumn,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    moveColumn,
    resetOrder,
    setColumnOrder
  };
}
