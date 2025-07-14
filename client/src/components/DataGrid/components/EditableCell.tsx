import React, { useState, useRef, useEffect } from 'react';
import { ColumnDef } from '../types';

interface EditableCellProps<T> {
  column: ColumnDef<T>;
  value: any;
  row: T;
  index: number;
  width: number;
  isEditing: boolean;
  editingValue: any;
  onStartEdit: (value: any) => void;
  onValueChange: (value: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function EditableCell<T>({
  column,
  value,
  row,
  index,
  width,
  isEditing,
  editingValue,
  onStartEdit,
  onValueChange,
  onSaveEdit,
  onCancelEdit
}: EditableCellProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing) {
      // Focus the input when editing starts
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      } else if (textareaRef.current) {
        textareaRef.current.focus();
      } else if (selectRef.current) {
        selectRef.current.focus();
      }
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (column.type === 'textarea' && !e.shiftKey) {
        e.preventDefault();
        onSaveEdit();
      } else if (column.type !== 'textarea') {
        e.preventDefault();
        onSaveEdit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit();
    }
  };

  const handleDoubleClick = () => {
    if (column.editable !== false) {
      onStartEdit(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let newValue = e.target.value;
    
    // Type conversion based on column type
    if (column.type === 'number') {
      newValue = parseFloat(newValue) || 0;
    } else if (column.type === 'boolean') {
      newValue = e.target.checked;
    } else if (column.type === 'date') {
      newValue = new Date(newValue);
    }
    
    onValueChange(newValue);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.checked);
  };

  const renderEditInput = () => {
    switch (column.type) {
      case 'number':
        return (
          <input
            ref={inputRef}
            type="number"
            value={editingValue || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8 }}
          />
        );
      
      case 'boolean':
        return (
          <input
            ref={inputRef}
            type="checkbox"
            checked={editingValue || false}
            onChange={handleCheckboxChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-4 h-4"
          />
        );
      
      case 'date':
        return (
          <input
            ref={inputRef}
            type="date"
            value={editingValue ? new Date(editingValue).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8 }}
          />
        );
      
      case 'select':
        return (
          <select
            ref={selectRef}
            value={editingValue || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8 }}
          >
            <option value="">Select...</option>
            {column.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <select
            ref={selectRef}
            multiple
            value={Array.isArray(editingValue) ? editingValue : []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              onValueChange(values);
            }}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8, height: 'auto' }}
          >
            {column.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            ref={textareaRef}
            value={editingValue || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm resize-none"
            style={{ width: width - 8, height: 'auto' }}
            rows={3}
          />
        );
      
      case 'email':
        return (
          <input
            ref={inputRef}
            type="email"
            value={editingValue || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8 }}
          />
        );
      
      case 'password':
        return (
          <input
            ref={inputRef}
            type="password"
            value={editingValue || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8 }}
          />
        );
      
      default:
        return (
          <input
            ref={inputRef}
            type="text"
            value={editingValue || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onSaveEdit}
            className="w-full px-2 py-1 border rounded text-sm"
            style={{ width: width - 8 }}
          />
        );
    }
  };

  const renderDisplayValue = () => {
    if (column.render) {
      return column.render(value, row, index);
    }
    
    if (column.format) {
      return column.format(value);
    }
    
    switch (column.type) {
      case 'boolean':
        return value ? '✓' : '✗';
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      case 'multiselect':
        return Array.isArray(value) ? value.join(', ') : '';
      default:
        return value || '';
    }
  };

  return (
    <div
      className="data-grid-cell"
      style={{
        width,
        minWidth: column.minWidth || 50,
        maxWidth: column.maxWidth || 500,
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderRight: '1px solid #e5e7eb',
        backgroundColor: isEditing ? '#f9fafb' : 'transparent',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? renderEditInput() : renderDisplayValue()}
    </div>
  );
}