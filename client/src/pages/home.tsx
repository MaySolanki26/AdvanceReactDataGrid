import React, { useState, useMemo } from 'react';
import { DataGrid, ColumnDef, GridOptions } from '@/components/DataGrid';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  joinDate: Date;
  isManager: boolean;
}

// Sample data for demonstration
const generateSampleData = (count: number): Employee[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses: Employee['status'][] = ['active', 'inactive', 'pending'];
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Wilson', 'Charlie Brown'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `USR-${String(i + 1).padStart(3, '0')}`,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `user${i + 1}@company.com`,
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    salary: Math.floor(Math.random() * 100000) + 50000,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    isManager: Math.random() > 0.8
  }));
};

export default function Home() {
  const [data] = useState<Employee[]>(() => generateSampleData(10000));
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const columns: ColumnDef<Employee>[] = useMemo(() => [
    {
      key: 'id',
      title: 'ID',
      width: 120,
      fixed: 'left',
      sortable: true,
      filterable: true
    },
    {
      key: 'name',
      title: 'Name',
      width: 200,
      sortable: true,
      filterable: true,
      editable: true,
      type: 'text'
    },
    {
      key: 'email',
      title: 'Email',
      width: 250,
      sortable: true,
      filterable: true,
      editable: true,
      type: 'email'
    },
    {
      key: 'department',
      title: 'Department',
      width: 150,
      sortable: true,
      filterable: true,
      editable: true,
      type: 'select',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Sales', label: 'Sales' },
        { value: 'HR', label: 'HR' },
        { value: 'Finance', label: 'Finance' }
      ]
    },
    {
      key: 'status',
      title: 'Status',
      width: 120,
      sortable: true,
      filterable: true,
      render: (value: Employee['status']) => (
        <span className={`data-grid-status-badge ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'salary',
      title: 'Salary',
      width: 120,
      type: 'number',
      sortable: true,
      filterable: true,
      editable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      width: 120,
      type: 'date',
      sortable: true,
      filterable: true,
      editable: true,
      render: (value: Date) => value.toLocaleDateString()
    },
    {
      key: 'isManager',
      title: 'Manager',
      width: 100,
      type: 'boolean',
      sortable: true,
      filterable: true,
      editable: true,
      render: (value: boolean) => (
        <span className={`data-grid-status-badge ${value ? 'success' : 'error'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 120,
      resizable: false,
      sortable: false,
      filterable: false,
      render: (_, row: Employee) => (
        <div className="flex items-center gap-1">
          <button className="data-grid-action-button">
            <i className="fas fa-edit"></i>
          </button>
          <button className="data-grid-action-button danger">
            <i className="fas fa-trash"></i>
          </button>
          <button className="data-grid-action-button">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
      )
    }
  ], []);

  const gridOptions: GridOptions = {
    height: 600,
    rowHeight: 48,
    selectable: true,
    multiSelect: true,
    virtualScrolling: true,
    stickyHeader: true,
    showFooter: true,
    pagination: true,
    pageSize: 50,
    density: 'standard'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Enterprise Data Grid Component
          </h1>
          <p className="text-gray-600">
            Zero-dependency React TypeScript table with Excel-like features
          </p>
        </div>

        <DataGrid
          data={data}
          columns={columns}
          options={gridOptions}
          rowKey="id"
          onSelectionChange={setSelectedEmployees}
          onRowClick={(row, index) => {
            console.log('Row clicked:', row, index);
          }}
          onRowDoubleClick={(row, index) => {
            console.log('Row double clicked:', row, index);
          }}
          className="shadow-lg"
        />

        {selectedEmployees.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Selected Employees ({selectedEmployees.length})
            </h3>
            <div className="text-sm text-blue-700">
              {selectedEmployees.map(emp => emp.name).join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
