import React from 'react';
import { ColumnDef } from './types';
import { DataGridCell } from './DataGridCell';

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
  getColumnWidth
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

        return (
          <DataGridCell
            key={column.key}
            column={column}
            value={value}
            row={row}
            index={index}
            width={width}
          />
        );
      })}
    </div>
  );
}
