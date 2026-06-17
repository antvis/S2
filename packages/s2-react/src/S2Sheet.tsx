import React, { useEffect, useRef, useMemo } from 'react';
import {
  createWorkbook,
  mountCanvas,
  type Workbook,
  type ModuleDefinition,
  type Operation,
} from '@antv/s2';

export interface S2SheetProps {
  modules?: ModuleDefinition[];
  data?: Record<string, unknown>[];
  dataSourceId?: string;
  pivotConfig?: {
    rows: string[];
    columns?: string[];
    values: string[];
    valueAggregation?: Record<string, 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>;
  };
  width?: number;
  height?: number;
  showRowHeader?: boolean;
  showColHeader?: boolean;
  readOnly?: boolean;
  onWorkbookCreated?: (workbook: Workbook) => void;
  onOperationApplied?: (ops: Operation[]) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function S2Sheet(props: S2SheetProps) {
  const {
    modules,
    data,
    dataSourceId = 'default',
    pivotConfig,
    width,
    height,
    showRowHeader,
    showColHeader,
    readOnly,
    onWorkbookCreated,
    onOperationApplied,
    style,
    className,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const workbookRef = useRef<Workbook | null>(null);

  const modulesKey = modules?.map((m) => m.name).join(',') ?? '';
  const workbook = useMemo(() => {
    const wb = createWorkbook({ modules });
    workbookRef.current = wb;
    return wb;
  }, [modulesKey]);

  useEffect(() => {
    onWorkbookCreated?.(workbook);
  }, [workbook, onWorkbookCreated]);

  useEffect(() => {
    if (onOperationApplied) {
      return workbook.on('operationApplied', onOperationApplied);
    }
  }, [workbook, onOperationApplied]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handle = mountCanvas(workbook, container, {
      width, height, showRowHeader, showColHeader, readOnly,
    });
    return () => handle.destroy();
  }, [workbook, width, height, showRowHeader, showColHeader, readOnly]);

  const prevDataRef = useRef<Record<string, unknown>[] | undefined>(undefined);
  const prevPivotRef = useRef<typeof pivotConfig>(undefined);

  useEffect(() => {
    if (!data) return;

    const dataChanged = data !== prevDataRef.current;
    const pivotChanged = pivotConfig !== prevPivotRef.current;

    if (dataChanged) {
      workbook.registerDataSource(dataSourceId, data);
      prevDataRef.current = data;
    }

    if ((dataChanged || pivotChanged) && pivotConfig) {
      workbook.apply([{
        type: 'pivot.setConfig',
        payload: {
          sheet: 0,
          dataSourceId,
          rows: pivotConfig.rows,
          columns: pivotConfig.columns ?? [],
          values: pivotConfig.values,
          valueAggregation: pivotConfig.valueAggregation ?? Object.fromEntries(
            pivotConfig.values.map((v) => [v, 'SUM' as const])
          ),
        },
      }]);
      prevPivotRef.current = pivotConfig;
    }
  }, [data, pivotConfig, dataSourceId, workbook]);

  return (
    <div
      ref={containerRef}
      style={{ width: width ?? '100%', height: height ?? '100%', ...style }}
      className={className}
    />
  );
}
