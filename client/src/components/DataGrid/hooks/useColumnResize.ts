import { useState, useCallback, useRef } from 'react';
import { ColumnDef } from '../types';
import { clampColumnWidth } from '../utils';

interface UseColumnResizeProps {
  columns: ColumnDef[];
  onColumnResize?: (key: string, width: number) => void;
}

export function useColumnResize({ columns, onColumnResize }: UseColumnResizeProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  const getColumnWidth = useCallback((column: ColumnDef): number => {
    return columnWidths[column.key] || column.width || 150;
  }, [columnWidths]);

  const handleResizeStart = useCallback((columnKey: string, startX: number) => {
    const currentWidth = getColumnWidth(columns.find(col => col.key === columnKey)!);
    
    setIsResizing(true);
    setResizingColumn(columnKey);
    resizeStartRef.current = { x: startX, width: currentWidth };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;
      
      const deltaX = e.clientX - resizeStartRef.current.x;
      const newWidth = clampColumnWidth(resizeStartRef.current.width + deltaX);
      
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    };

    const handleMouseUp = () => {
      if (!resizeStartRef.current) return;
      
      const finalWidth = columnWidths[columnKey];
      if (finalWidth && onColumnResize) {
        onColumnResize(columnKey, finalWidth);
      }
      
      setIsResizing(false);
      setResizingColumn(null);
      resizeStartRef.current = null;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columns, columnWidths, getColumnWidth, onColumnResize]);

  const handleResizeDoubleClick = useCallback((columnKey: string) => {
    // Auto-resize to content (simplified implementation)
    const newWidth = 200; // This would be calculated based on content
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: newWidth
    }));
    
    if (onColumnResize) {
      onColumnResize(columnKey, newWidth);
    }
  }, [onColumnResize]);

  return {
    columnWidths,
    isResizing,
    resizingColumn,
    getColumnWidth,
    handleResizeStart,
    handleResizeDoubleClick,
    setColumnWidths
  };
}
