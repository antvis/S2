import { createWorkbook } from '../workbook';
import { mountCanvas, type MountCanvasOptions, type CanvasHandle } from '../canvas/mount';
import { PivotModule } from '../modules/pivot';
import { FormulaModule } from '../modules/formula';
import { FilterModule } from '../modules/filter';
import { SortModule } from '../modules/sort';
import { FreezeModule } from '../modules/freeze';
import { EditModule } from '../modules/edit';
import { ConditionalFormatModule } from '../modules/conditional-format';
import type { ModuleDefinition } from '../module/types';
import { WorkbookFacade } from './workbook-facade';

export { WorkbookFacade, SheetFacade, CellFacade, RangeFacade } from './workbook-facade';
export { parseRange, parseCellAddress } from './parse-range';

const defaultModules: ModuleDefinition[] = [
  PivotModule, FormulaModule, FilterModule, SortModule, FreezeModule, EditModule, ConditionalFormatModule,
];

export interface PivotTableConfig {
  data: Record<string, unknown>[];
  rows: string[];
  columns?: string[];
  values: string[];
  valueAggregation?: Record<string, 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>;
  dataSourceId?: string;
  modules?: ModuleDefinition[];
}

export interface TableConfig {
  data?: (string | number | boolean | null)[][];
  modules?: ModuleDefinition[];
}

export function createPivotTable(
  container: HTMLElement | null,
  config: PivotTableConfig,
  canvasOptions?: MountCanvasOptions,
): WorkbookFacade {
  const modules = config.modules ?? defaultModules;
  const workbook = createWorkbook({ modules });
  const dsId = config.dataSourceId ?? 'default';

  workbook.registerDataSource(dsId, config.data);
  workbook.apply([{
    type: 'pivot.setConfig',
    payload: {
      sheet: 0,
      dataSourceId: dsId,
      rows: config.rows,
      columns: config.columns ?? [],
      values: config.values,
      valueAggregation: config.valueAggregation ?? Object.fromEntries(
        config.values.map((v) => [v, 'SUM' as const])
      ),
    },
  }]);

  const facade = new WorkbookFacade(workbook);

  if (container) {
    const handle = mountCanvas(workbook, container, canvasOptions);
    facade.destroy = () => handle.destroy();
  }

  return facade;
}

export function createTable(
  container: HTMLElement | null,
  config?: TableConfig,
  canvasOptions?: MountCanvasOptions,
): WorkbookFacade {
  const modules = config?.modules ?? defaultModules;
  const workbook = createWorkbook({ modules });

  if (config?.data) {
    const ops = [];
    for (let r = 0; r < config.data.length; r++) {
      const row = config.data[r]!;
      for (let c = 0; c < row.length; c++) {
        if (row[c] != null) {
          ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: c, value: row[c] } });
        }
      }
    }
    if (ops.length > 0) workbook.apply(ops);
  }

  const facade = new WorkbookFacade(workbook);

  if (container) {
    const handle = mountCanvas(workbook, container, canvasOptions);
    facade.destroy = () => handle.destroy();
  }

  return facade;
}
