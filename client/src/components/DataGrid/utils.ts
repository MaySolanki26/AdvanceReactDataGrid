import { ColumnDef, SortConfig, FilterConfig } from './types';

export const DEFAULT_ROW_HEIGHT = 48;
export const DEFAULT_HEADER_HEIGHT = 56;
export const DEFAULT_FOOTER_HEIGHT = 64;
export const DEFAULT_COLUMN_WIDTH = 150;
export const MIN_COLUMN_WIDTH = 50;
export const MAX_COLUMN_WIDTH = 500;

export function getColumnWidth(column: ColumnDef): number {
  return column.width || DEFAULT_COLUMN_WIDTH;
}

export function clampColumnWidth(width: number): number {
  return Math.max(MIN_COLUMN_WIDTH, Math.min(MAX_COLUMN_WIDTH, width));
}

export function sortData<T>(data: T[], sortConfig: SortConfig[], columns: ColumnDef<T>[]): T[] {
  if (!sortConfig.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sortConfig) {
      const column = columns.find(col => col.key === sort.key);
      if (!column) continue;

      const aValue = column.accessor ? column.accessor(a) : (a as any)[sort.key];
      const bValue = column.accessor ? column.accessor(b) : (b as any)[sort.key];

      let comparison = 0;
      
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;

      if (comparison !== 0) {
        return sort.direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

export function filterData<T>(data: T[], filterConfig: FilterConfig[], columns: ColumnDef<T>[]): T[] {
  if (!filterConfig.length) return data;

  return data.filter(row => {
    return filterConfig.every(filter => {
      const column = columns.find(col => col.key === filter.key);
      if (!column) return true;

      const value = column.accessor ? column.accessor(row) : (row as any)[filter.key];
      const filterValue = filter.value;

      if (filterValue === null || filterValue === undefined || filterValue === '') {
        return true;
      }

      const stringValue = String(value).toLowerCase();
      const stringFilterValue = String(filterValue).toLowerCase();

      switch (filter.operator) {
        case 'equals':
          return stringValue === stringFilterValue;
        case 'contains':
          return stringValue.includes(stringFilterValue);
        case 'startsWith':
          return stringValue.startsWith(stringFilterValue);
        case 'endsWith':
          return stringValue.endsWith(stringFilterValue);
        case 'gt':
          return Number(value) > Number(filterValue);
        case 'lt':
          return Number(value) < Number(filterValue);
        case 'between':
          const [min, max] = filterValue;
          return Number(value) >= Number(min) && Number(value) <= Number(max);
        default:
          return true;
      }
    });
  });
}

export function exportToCSV<T>(data: T[], columns: ColumnDef<T>[], filename: string = 'data.csv'): void {
  const visibleColumns = columns.filter(col => !col.hidden);
  
  const headers = visibleColumns.map(col => col.title).join(',');
  const rows = data.map(row => 
    visibleColumns.map(col => {
      const value = col.accessor ? col.accessor(row) : (row as any)[col.key];
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToJSON<T>(data: T[], columns: ColumnDef<T>[], filename: string = 'data.json'): void {
  const visibleColumns = columns.filter(col => !col.hidden);
  
  const exportData = data.map(row => {
    const exportRow: any = {};
    visibleColumns.forEach(col => {
      exportRow[col.key] = col.accessor ? col.accessor(row) : (row as any)[col.key];
    });
    return exportRow;
  });

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}
