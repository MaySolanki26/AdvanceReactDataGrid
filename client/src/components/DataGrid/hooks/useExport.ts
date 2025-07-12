import { useCallback } from 'react';
import { ColumnDef } from '../types';
import { exportToCSV, exportToJSON } from '../utils';

interface UseExportProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filename?: string;
}

export function useExport<T>({ data, columns, filename = 'export' }: UseExportProps<T>) {
  const handleExportCSV = useCallback(() => {
    exportToCSV(data, columns, `${filename}.csv`);
  }, [data, columns, filename]);

  const handleExportJSON = useCallback(() => {
    exportToJSON(data, columns, `${filename}.json`);
  }, [data, columns, filename]);

  const handleExportExcel = useCallback(() => {
    // For now, export as CSV since we don't have external dependencies
    exportToCSV(data, columns, `${filename}.csv`);
  }, [data, columns, filename]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const visibleColumns = columns.filter(col => !col.hidden);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Grid Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>Data Grid Export</h1>
        <table>
          <thead>
            <tr>
              ${visibleColumns.map(col => `<th>${col.title}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${visibleColumns.map(col => {
                  const value = col.accessor ? col.accessor(row) : (row as any)[col.key];
                  return `<td>${String(value)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }, [data, columns]);

  return {
    handleExportCSV,
    handleExportJSON,
    handleExportExcel,
    handlePrint
  };
}
