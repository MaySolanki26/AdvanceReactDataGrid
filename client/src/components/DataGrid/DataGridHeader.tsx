import React, { useState } from 'react';
import { ColumnDef, SortConfig, FilterConfig } from './types';
import { FilterPopover } from './components/FilterPopover';

interface DataGridHeaderProps<T> {
  columns: ColumnDef<T>[];
  columnWidths: Record<string, number>;
  sortConfig: SortConfig[];
  filterConfig: FilterConfig[];
  data: T[];
  onSort: (columnKey: string, event?: React.MouseEvent) => void;
  onFilter: (columnKey: string, value: any, operator: FilterConfig['operator']) => void;
  onResizeStart: (columnKey: string, startX: number) => void;
  onColumnDragStart: (columnKey: string, e: React.DragEvent) => void;
  onColumnDragOver: (columnKey: string, e: React.DragEvent) => void;
  onColumnDrop: (columnKey: string, e: React.DragEvent) => void;
  onColumnDragEnd: () => void;
  draggedColumn: string | null;
  dragOverColumn: string | null;
  selectable: boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: () => void;
  getColumnWidth: (column: ColumnDef<T>) => number;
}

export function DataGridHeader<T>({
  columns,
  columnWidths,
  sortConfig,
  filterConfig,
  data,
  onSort,
  onFilter,
  onResizeStart,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
  draggedColumn,
  dragOverColumn,
  selectable,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  getColumnWidth
}: DataGridHeaderProps<T>) {
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const getSortDirection = (columnKey: string) => {
    const sort = sortConfig.find(s => s.key === columnKey);
    return sort ? sort.direction : null;
  };

  const getSortIndex = (columnKey: string) => {
    const index = sortConfig.findIndex(s => s.key === columnKey);
    return index === -1 ? null : index + 1;
  };

  const getCurrentFilter = (columnKey: string) => {
    return filterConfig.find(f => f.key === columnKey) || null;
  };

  const isColumnFiltered = (columnKey: string) => {
    return filterConfig.some(f => f.key === columnKey);
  };

  const handleResizeMouseDown = (columnKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onResizeStart(columnKey, e.clientX);
  };

  const handleFilterClick = (columnKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveFilterColumn(activeFilterColumn === columnKey ? null : columnKey);
  };

  const handleFilterApply = (columnKey: string, value: any, operator: FilterConfig['operator']) => {
    onFilter(columnKey, value, operator);
    setActiveFilterColumn(null);
  };

  return (
    <div className="data-grid-header">
      {selectable && (
        <div className="data-grid-header-cell" style={{ width: 48, minWidth: 48 }}>
          <input
            type="checkbox"
            className="data-grid-checkbox"
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onChange={onSelectAll}
          />
        </div>
      )}
      
      {columns.filter(col => !col.hidden).map((column) => {
        const width = getColumnWidth(column);
        const sortDirection = getSortDirection(column.key);
        const sortIndex = getSortIndex(column.key);
        const isDragging = draggedColumn === column.key;
        const isDragOver = dragOverColumn === column.key;

        return (
          <div
            key={column.key}
            className={`data-grid-header-cell ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''} ${column.fixed ? `fixed-${column.fixed}` : ''}`}
            style={{ width, minWidth: width }}
            draggable={true}
            onDragStart={(e) => onColumnDragStart(column.key, e)}
            onDragOver={(e) => onColumnDragOver(column.key, e)}
            onDrop={(e) => onColumnDrop(column.key, e)}
            onDragEnd={onColumnDragEnd}
            onClick={(e) => column.sortable !== false && onSort(column.key, e)}
          >
            <div className="data-grid-header-content">
              <span>{column.title}</span>
              {sortIndex && sortConfig.length > 1 && (
                <span className="text-xs text-gray-500">{sortIndex}</span>
              )}
            </div>
            
            <div className="data-grid-header-actions">
              {column.sortable !== false && (
                <i
                  className={`fas ${
                    sortDirection === 'asc' ? 'fa-sort-up' : 
                    sortDirection === 'desc' ? 'fa-sort-down' : 'fa-sort'
                  } data-grid-sort-icon ${sortDirection ? 'active' : ''}`}
                />
              )}
              
              {column.filterable !== false && (
                <div className="relative">
                  <i 
                    className={`fas fa-filter data-grid-filter-icon ${
                      isColumnFiltered(column.key) ? 'active' : ''
                    }`}
                    onClick={(e) => handleFilterClick(column.key, e)}
                  />
                  <FilterPopover
                    column={column}
                    isOpen={activeFilterColumn === column.key}
                    onClose={() => setActiveFilterColumn(null)}
                    onApplyFilter={(value, operator) => handleFilterApply(column.key, value, operator)}
                    currentFilter={getCurrentFilter(column.key)}
                    data={data}
                  />
                </div>
              )}
            </div>
            
            {column.resizable !== false && (
              <div
                className="data-grid-resize-handle"
                onMouseDown={(e) => handleResizeMouseDown(column.key, e)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Auto-resize logic could go here
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
