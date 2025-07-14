export interface ColumnDef<T = any> {
  key: string;
  title: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean; // defaults to true
  resizable?: boolean; // defaults to true
  filterable?: boolean;
  editable?: boolean;
  fixed?: 'left' | 'right';
  hidden?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'password' | 'select' | 'multiselect' | 'custom';
  accessor?: (row: T) => any;
  groupBy?: boolean;
  options?: { value: any; label: string }[];
  validation?: (value: any) => string | null;
  format?: (value: any) => string;
}

export interface GridOptions {
  height?: number;
  width?: number;
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  overscan?: number;
  selectable?: boolean;
  multiSelect?: boolean;
  pagination?: boolean;
  pageSize?: number;
  virtualScrolling?: boolean;
  stickyHeader?: boolean;
  showFooter?: boolean;
  density?: 'compact' | 'standard' | 'comfortable';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'between';
}

export interface GroupConfig {
  key: string;
  expanded: boolean;
}

export interface SelectionState {
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

export interface VirtualScrollState {
  items: VirtualItem[];
  totalSize: number;
  startIndex: number;
  endIndex: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  options?: GridOptions;
  rowKey?: string;
  loading?: boolean;
  error?: string;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onSortChange?: (sortConfig: SortConfig[]) => void;
  onFilterChange?: (filterConfig: FilterConfig[]) => void;
  onColumnResize?: (key: string, width: number) => void;
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;
  onCellEdit?: (rowIndex: number, columnKey: string, value: any) => void;
  onDataChange?: (newData: T[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface DataGridState<T = any> {
  sortConfig: SortConfig[];
  filterConfig: FilterConfig[];
  groupConfig: GroupConfig[];
  selection: SelectionState;
  columnWidths: Record<string, number>;
  columnOrder: string[];
  visibleColumns: string[];
  currentPage: number;
  pageSize: number;
  scrollTop: number;
  scrollLeft: number;
  virtualScroll: VirtualScrollState;
}
