import React from 'react';
import { GridOptions } from './types';

interface DataGridFooterProps {
  totalRows: number;
  visibleRows: number;
  selectedCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  options: GridOptions;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DataGridFooter({
  totalRows,
  visibleRows,
  selectedCount,
  currentPage,
  pageSize,
  totalPages,
  options,
  onPageChange,
  onPageSizeChange
}: DataGridFooterProps) {
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    const halfButtons = Math.floor(maxButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfButtons);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        className="data-grid-pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          className="data-grid-pagination-button"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1">...</span>);
      }
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`data-grid-pagination-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2">...</span>);
      }
      
      buttons.push(
        <button
          key={totalPages}
          className="data-grid-pagination-button"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className="data-grid-pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );

    return buttons;
  };

  return (
    <div className="data-grid-footer">
      <div className="data-grid-footer-left">
        <span className="text-sm text-gray-600">
          Showing <span className="font-medium">{startRow}-{endRow}</span> of{' '}
          <span className="font-medium">{totalRows}</span> rows
        </span>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            className="data-grid-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      <div className="data-grid-footer-right">
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
          </span>
        )}
        
        {options.pagination && (
          <div className="data-grid-pagination">
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
}
