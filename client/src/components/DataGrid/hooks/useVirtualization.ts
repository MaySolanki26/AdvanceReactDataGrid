import { useState, useEffect, useMemo, useRef } from 'react';
import { VirtualScrollState, VirtualItem } from '../types';
import { DEFAULT_ROW_HEIGHT } from '../utils';

interface UseVirtualizationProps {
  totalCount: number;
  containerHeight: number;
  itemHeight: number;
  overscan?: number;
  scrollTop: number;
}

export function useVirtualization({
  totalCount,
  containerHeight,
  itemHeight = DEFAULT_ROW_HEIGHT,
  overscan = 5,
  scrollTop
}: UseVirtualizationProps): VirtualScrollState {
  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (let i = 0; i < totalCount; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight
      });
    }
    return items;
  }, [totalCount, itemHeight]);

  const totalSize = totalCount * itemHeight;
  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight),
    totalCount - 1
  );

  const startIndex = Math.max(0, visibleStartIndex - overscan);
  const endIndex = Math.min(totalCount - 1, visibleEndIndex + overscan);

  const visibleItems = virtualItems.slice(startIndex, endIndex + 1);

  return {
    items: visibleItems,
    totalSize,
    startIndex,
    endIndex,
    visibleStartIndex,
    visibleEndIndex
  };
}

export function useColumnVirtualization({
  columns,
  containerWidth,
  scrollLeft,
  overscan = 2
}: {
  columns: { key: string; width: number }[];
  containerWidth: number;
  scrollLeft: number;
  overscan?: number;
}) {
  const columnOffsets = useMemo(() => {
    const offsets: number[] = [];
    let currentOffset = 0;
    
    columns.forEach((column, index) => {
      offsets[index] = currentOffset;
      currentOffset += column.width;
    });
    
    return offsets;
  }, [columns]);

  const totalWidth = columnOffsets[columnOffsets.length - 1] + columns[columns.length - 1]?.width || 0;

  const visibleStartIndex = columnOffsets.findIndex(offset => offset + columns[columnOffsets.indexOf(offset)]?.width > scrollLeft);
  const visibleEndIndex = columnOffsets.findLastIndex(offset => offset < scrollLeft + containerWidth);

  const startIndex = Math.max(0, visibleStartIndex - overscan);
  const endIndex = Math.min(columns.length - 1, visibleEndIndex + overscan);

  const visibleColumns = columns.slice(startIndex, endIndex + 1);

  return {
    visibleColumns,
    totalWidth,
    startIndex,
    endIndex,
    visibleStartIndex,
    visibleEndIndex,
    columnOffsets
  };
}
