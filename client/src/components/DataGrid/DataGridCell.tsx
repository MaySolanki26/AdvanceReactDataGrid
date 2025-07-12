import React from 'react';
import { ColumnDef } from './types';

interface DataGridCellProps<T> {
  column: ColumnDef<T>;
  value: any;
  row: T;
  index: number;
  width: number;
}

export function DataGridCell<T>({
  column,
  value,
  row,
  index,
  width
}: DataGridCellProps<T>) {
  const renderCellContent = () => {
    if (column.render) {
      return column.render(value, row, index);
    }

    if (column.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (column.type === 'date' && value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (column.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }

    return String(value || '');
  };

  return (
    <div
      className={`data-grid-cell ${column.fixed ? `fixed-${column.fixed}` : ''}`}
      style={{ width, minWidth: width }}
      title={String(value || '')}
    >
      {renderCellContent()}
    </div>
  );
}
