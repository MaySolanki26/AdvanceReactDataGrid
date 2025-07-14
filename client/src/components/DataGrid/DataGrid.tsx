import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { DataGridProps, DataGridState, SortConfig, FilterConfig } from './types';
import { DataGridToolbar } from './DataGridToolbar';
import { DataGridHeader } from './DataGridHeader';
import { DataGridBody } from './DataGridBody';
import { DataGridFooter } from './DataGridFooter';
import { useColumnResize } from './hooks/useColumnResize';
import { useColumnOrder } from './hooks/useColumnOrder';
import { useSelection } from './hooks/useSelection';
import { useSorting } from './hooks/useSorting';
import { useFiltering } from './hooks/useFiltering';
import { useExport } from './hooks/useExport';
import { useEditing } from './hooks/useEditing';
import { sortData, filterData, debounce } from './utils';
import './DataGrid.css';

export function DataGrid<T = any>({
  data,
  columns,
  options = {},
  rowKey = 'id',
  loading = false,
  error,
  onRowClick,
  onRowDoubleClick,
  onSelectionChange,
  onSortChange,
  onFilterChange,
  onColumnResize,
  onColumnReorder,
  onCellEdit,
  onDataChange,
  className = '',
  style = {}
}: DataGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);

  // Custom hooks
  const { 
    columnWidths, 
    getColumnWidth, 
    handleResizeStart,
    setColumnWidths
  } = useColumnResize({ columns, onColumnResize });

  const {
    orderedColumns,
    draggedColumn,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useColumnOrder({ columns, onColumnReorder });

  const {
    selectionState,
    isRowSelected,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    getSelectedRows
  } = useSelection({ data, rowKey, multiSelect: options.multiSelect, onSelectionChange });

  const {
    sortConfig,
    handleSort,
    clearSort
  } = useSorting({ multiSort: true, onSortChange });

  const {
    filterConfig,
    globalFilter,
    handleFilter,
    handleGlobalFilter,
    clearAllFilters,
    getActiveFiltersCount
  } = useFiltering({ onFilterChange });

  const { 
    editingCell, 
    editingValue, 
    setEditingValue, 
    startEditing, 
    saveEdit, 
    cancelEdit 
  } = useEditing({ 
    data, 
    onCellEdit: onCellEdit || undefined, 
    onDataChange: onDataChange || undefined 
  });

  const { handleExportCSV, handleExportJSON, handleExportExcel, handlePrint } = useExport({
    data,
    columns: orderedColumns,
    filename: 'datagrid-export'
  });

  // Processed data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply global filter
    if (globalFilter) {
      result = result.filter(row => {
        return orderedColumns.some(column => {
          const value = column.accessor ? column.accessor(row) : (row as any)[column.key];
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        });
      });
    }
    
    // Apply column filters
    result = filterData(result, filterConfig, orderedColumns);
    
    // Apply sorting
    result = sortData(result, sortConfig, orderedColumns);
    
    return result;
  }, [data, globalFilter, filterConfig, sortConfig, orderedColumns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!options.pagination) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, pageSize, options.pagination]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Event handlers
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
  }, []);

  const debouncedGlobalFilter = useMemo(
    () => debounce(handleGlobalFilter, 300),
    [handleGlobalFilter]
  );

  const handleExport = useCallback((type: 'csv' | 'json' | 'excel' | 'print') => {
    switch (type) {
      case 'csv':
        handleExportCSV();
        break;
      case 'json':
        handleExportJSON();
        break;
      case 'excel':
        handleExportExcel();
        break;
      case 'print':
        handlePrint();
        break;
    }
  }, [handleExportCSV, handleExportJSON, handleExportExcel, handlePrint]);

  const handleReset = useCallback(() => {
    clearSort();
    clearAllFilters();
    clearSelection();
    setCurrentPage(1);
    setScrollTop(0);
    setScrollLeft(0);
  }, [clearSort, clearAllFilters, clearSelection]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setContainerHeight(height - (options.headerHeight || 56) - (options.footerHeight || 64));
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [options.headerHeight, options.footerHeight]);

  // Render loading state
  if (loading) {
    return (
      <div className={`data-grid ${className}`} style={style}>
        <div className="data-grid-loading">
          <i className="fas fa-spinner data-grid-loading-spinner"></i>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`data-grid ${className}`} style={style}>
        <div className="data-grid-error">
          <i className="fas fa-exclamation-triangle data-grid-error-icon"></i>
          <p>Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const displayData = options.pagination ? paginatedData : processedData;

  return (
    <div className={`data-grid ${className}`} style={style} ref={containerRef}>
      <DataGridToolbar
        data={displayData}
        columns={orderedColumns}
        options={options}
        globalFilter={globalFilter}
        onGlobalFilterChange={debouncedGlobalFilter}
        onExport={handleExport}
        onColumnsToggle={() => {/* TODO: Implement column chooser */}}
        onReset={handleReset}
        selectedCount={selectionState.selectedRows.size}
      />
      
      <div className="data-grid-container" style={{ height: options.height || 600 }}>
        <div 
          className="data-grid-header-container"
          style={{ transform: `translateX(-${scrollLeft}px)` }}
        >
          <DataGridHeader
            columns={orderedColumns}
            columnWidths={columnWidths}
            sortConfig={sortConfig}
            filterConfig={filterConfig}
            data={displayData}
            onSort={handleSort}
            onFilter={handleFilter}
            onResizeStart={handleResizeStart}
            onColumnDragStart={handleDragStart}
            onColumnDragOver={handleDragOver}
            onColumnDrop={handleDrop}
            onColumnDragEnd={handleDragEnd}
            draggedColumn={draggedColumn}
            dragOverColumn={dragOverColumn}
            selectable={options.selectable || false}
            isAllSelected={selectionState.isAllSelected}
            isIndeterminate={selectionState.isIndeterminate}
            onSelectAll={toggleAllSelection}
            getColumnWidth={getColumnWidth}
          />
        </div>
        
        <div
          className="data-grid-body"
          style={{ height: containerHeight, overflowX: 'auto' }}
          onScroll={handleScroll}
          ref={bodyRef}
        >
          <DataGridBody
            data={displayData}
            columns={orderedColumns}
            options={options}
            containerHeight={containerHeight}
            scrollTop={scrollTop}
            columnWidths={columnWidths}
            selectedRows={selectionState.selectedRows}
            rowKey={rowKey}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            onRowSelect={toggleRowSelection}
            getColumnWidth={getColumnWidth}
            getRowKey={(row: T) => String((row as any)[rowKey])}
            editingCell={editingCell}
            editingValue={editingValue}
            onStartEdit={startEditing}
            onValueChange={setEditingValue}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
          />
        </div>
      </div>
      
      {(options.showFooter !== false || options.pagination) && (
        <DataGridFooter
          totalRows={processedData.length}
          visibleRows={displayData.length}
          selectedCount={selectionState.selectedRows.size}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          options={options}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
