import React from 'react';
import { ColumnDef } from './types';
import { EditableCell } from './components/EditableCell';

interface DataGridRowProps<T> {
  row: T;
  index: number;
  columns: ColumnDef<T>[];
  rowHeight: number;
  columnWidths: Record<string, number>;
  isSelected: boolean;
  selectable?: boolean;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onRowSelect: (row: T, event?: React.MouseEvent) => void;
  getColumnWidth: (column: ColumnDef<T>) => number;
  editingCell: { rowIndex: number; columnKey: string } | null;
  editingValue: any;
  onStartEdit: (rowIndex: number, columnKey: string, value: any) => void;
  onValueChange: (value: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function DataGridRow<T>({
  row,
  index,
  columns,
  rowHeight,
  columnWidths,
  isSelected,
  selectable,
  onRowClick,
  onRowDoubleClick,
  onRowSelect,
  getColumnWidth,
  editingCell,
  editingValue,
  onStartEdit,
  onValueChange,
  onSaveEdit,
  onCancelEdit
}: DataGridRowProps<T>) {
  const handleClick = (e: React.MouseEvent) => {
    if (selectable) {
      onRowSelect(row, e);
    }
    onRowClick?.(row, index);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    onRowDoubleClick?.(row, index);
  };

  return (
    <div
      className={`data-grid-row ${isSelected ? 'selected' : ''}`}
      style={{ height: rowHeight }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {selectable && (
        <div className="data-grid-cell" style={{ width: 48, minWidth: 48 }}>
          <input
            type="checkbox"
            className="data-grid-checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onRowSelect(row, e);
            }}
          />
        </div>
      )}
      
      {columns.map((column) => {
        const width = getColumnWidth(column);
        const value = column.accessor ? column.accessor(row) : (row as any)[column.key];
        const isEditing = editingCell?.rowIndex === index && editingCell?.columnKey === column.key;

        return (
          <EditableCell
            key={column.key}
            column={column}
            value={value}
            row={row}
            index={index}
            width={width}
            isEditing={isEditing}
            editingValue={editingValue}
            onStartEdit={(value) => onStartEdit(index, column.key, value)}
            onValueChange={onValueChange}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        );
      })}
    </div>
  );
}
