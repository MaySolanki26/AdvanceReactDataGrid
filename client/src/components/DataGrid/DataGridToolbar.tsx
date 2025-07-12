import React from 'react';
import { ColumnDef, GridOptions } from './types';
import { useExport } from './hooks/useExport';

interface DataGridToolbarProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  options?: GridOptions;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onExport: (type: 'csv' | 'json' | 'excel' | 'print') => void;
  onColumnsToggle: () => void;
  onReset: () => void;
  selectedCount: number;
}

export function DataGridToolbar<T>({
  data,
  columns,
  options,
  globalFilter,
  onGlobalFilterChange,
  onExport,
  onColumnsToggle,
  onReset,
  selectedCount
}: DataGridToolbarProps<T>) {
  const { handleExportCSV, handleExportJSON, handleExportExcel, handlePrint } = useExport({
    data,
    columns,
    filename: 'datagrid-export'
  });

  return (
    <div className="data-grid-toolbar">
      <div className="data-grid-toolbar-left">
        <div className="dropdown">
          <button className="data-grid-button" onClick={() => onExport('csv')}>
            <i className="fas fa-download"></i>
            Export
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
        
        <button className="data-grid-button" onClick={onColumnsToggle}>
          <i className="fas fa-columns"></i>
          Columns
        </button>
        
        <button className="data-grid-button" onClick={onReset}>
          <i className="fas fa-refresh"></i>
          Reset
        </button>
        
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>
      
      <div className="data-grid-toolbar-right">
        <div className="data-grid-search">
          <i className="fas fa-search data-grid-search-icon"></i>
          <input
            type="text"
            placeholder="Search across all columns..."
            className="data-grid-search-input"
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
          />
        </div>
        
        <button className="data-grid-button">
          <i className="fas fa-th-list"></i>
        </button>
        
        <button className="data-grid-button">
          <i className="fas fa-expand"></i>
        </button>
      </div>
    </div>
  );
}
