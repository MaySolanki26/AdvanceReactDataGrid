import React, { useMemo } from 'react';
import { ColumnDef, VirtualScrollState, GridOptions } from './types';
import { DataGridRow } from './DataGridRow';
import { useVirtualization } from './hooks/useVirtualization';

interface DataGridBodyProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  options: GridOptions;
  containerHeight: number;
  scrollTop: number;
  columnWidths: Record<string, number>;
  selectedRows: Set<string>;
  rowKey: string;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onRowSelect: (row: T, event?: React.MouseEvent) => void;
  getColumnWidth: (column: ColumnDef<T>) => number;
  getRowKey: (row: T) => string;
  editingCell: { rowIndex: number; columnKey: string } | null;
  editingValue: any;
  onStartEdit: (rowIndex: number, columnKey: string, value: any) => void;
  onValueChange: (value: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function DataGridBody<T>({
  data,
  columns,
  options,
  containerHeight,
  scrollTop,
  columnWidths,
  selectedRows,
  rowKey,
  onRowClick,
  onRowDoubleClick,
  onRowSelect,
  getColumnWidth,
  getRowKey,
  editingCell,
  editingValue,
  onStartEdit,
  onValueChange,
  onSaveEdit,
  onCancelEdit
}: DataGridBodyProps<T>) {
  const rowHeight = options.rowHeight || 48;
  const virtualScrolling = options.virtualScrolling !== false;

  const virtualState = useVirtualization({
    totalCount: data.length,
    containerHeight,
    itemHeight: rowHeight,
    overscan: options.overscan || 5,
    scrollTop
  });

  const visibleData = useMemo(() => {
    if (!virtualScrolling) return data;
    return data.slice(virtualState.startIndex, virtualState.endIndex + 1);
  }, [data, virtualState.startIndex, virtualState.endIndex, virtualScrolling]);

  const visibleColumns = columns.filter(col => !col.hidden);

  if (data.length === 0) {
    return (
      <div className="data-grid-empty">
        <i className="fas fa-table data-grid-empty-icon"></i>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="data-grid-body">
      <div 
        className="data-grid-virtual-container"
        style={{ 
          height: virtualScrolling ? virtualState.totalSize : 'auto',
          paddingTop: virtualScrolling ? virtualState.startIndex * rowHeight : 0
        }}
      >
        {visibleData.map((row, index) => {
          const actualIndex = virtualScrolling ? virtualState.startIndex + index : index;
          const key = getRowKey(row);
          const isSelected = selectedRows.has(key);

          return (
            <DataGridRow
              key={key}
              row={row}
              index={actualIndex}
              columns={visibleColumns}
              rowHeight={rowHeight}
              columnWidths={columnWidths}
              isSelected={isSelected}
              selectable={options.selectable}
              onRowClick={onRowClick}
              onRowDoubleClick={onRowDoubleClick}
              onRowSelect={onRowSelect}
              getColumnWidth={getColumnWidth}
              editingCell={editingCell}
              editingValue={editingValue}
              onStartEdit={onStartEdit}
              onValueChange={onValueChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          );
        })}
      </div>
    </div>
  );
}
