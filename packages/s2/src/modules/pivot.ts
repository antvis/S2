import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

export interface PivotConfig {
  sheet: number;
  dataSourceId: string;
  rows: string[];
  columns: string[];
  values: string[];
  valueAggregation: Record<string, 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>;
}

interface PivotState {
  configs: Map<number, PivotConfig>;
}

type AggFn = 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';

function aggregate(values: number[], fn: AggFn): number {
  if (values.length === 0) return 0;
  switch (fn) {
    case 'SUM': return values.reduce((a, b) => a + b, 0);
    case 'AVG': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'COUNT': return values.length;
    case 'MIN': return Math.min(...values);
    case 'MAX': return Math.max(...values);
  }
}

function materializePivot(model: WorkbookModel, config: PivotConfig): void {
  const data = model.dataSources.get(config.dataSourceId) as Record<string, unknown>[] | undefined;
  if (!data || data.length === 0) return;

  // Collect unique row keys and column keys
  const rowKeys = new Map<string, Record<string, unknown>[]>();
  const colKeySet = new Set<string>();

  for (const record of data) {
    const rowKey = config.rows.map((r) => String(record[r] ?? '')).join('||');
    const colKey = config.columns.length > 0
      ? config.columns.map((c) => String(record[c] ?? '')).join('||')
      : '__value__';

    if (!rowKeys.has(rowKey)) rowKeys.set(rowKey, []);
    rowKeys.get(rowKey)!.push(record);
    colKeySet.add(colKey);
  }

  const rowKeyList = [...rowKeys.keys()];
  const colKeyList = [...colKeySet];

  // Header row: row dimension names + col keys × value fields
  let col = 0;
  for (const rowDim of config.rows) {
    model.setCell(config.sheet, 0, col, { value: rowDim });
    col++;
  }
  for (const colKey of colKeyList) {
    for (const valField of config.values) {
      const header = config.columns.length > 0 ? `${colKey}|${valField}` : valField;
      model.setCell(config.sheet, 0, col, { value: header });
      col++;
    }
  }

  // Data rows
  let row = 1;
  for (const [rowKey, records] of rowKeys) {
    const rowParts = rowKey.split('||');
    col = 0;
    for (const part of rowParts) {
      model.setCell(config.sheet, row, col, { value: part });
      col++;
    }

    for (const colKey of colKeyList) {
      const matchingRecords = records.filter((r) => {
        if (config.columns.length === 0) return true;
        const rColKey = config.columns.map((c) => String(r[c] ?? '')).join('||');
        return rColKey === colKey;
      });

      for (const valField of config.values) {
        const nums = matchingRecords
          .map((r) => Number(r[valField]))
          .filter((n) => !isNaN(n));
        const aggFn = config.valueAggregation[valField] ?? 'SUM';
        const result = aggregate(nums, aggFn);
        model.setCell(config.sheet, row, col, { value: result });
        col++;
      }
    }
    row++;
  }
}

function clearPivotCells(model: WorkbookModel, sheetIndex: number): void {
  const sheet = model.getSheet(sheetIndex);
  if (!sheet) return;
  sheet.cells.clear();
}

export const PivotModule: ModuleDefinition = {
  name: 'pivot',

  state: (): PivotState => ({ configs: new Map() }),

  operations: {
    'pivot.setConfig': {
      meta: { needReCalc: true, affectLayout: true, undoable: true },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const config = payload as unknown as PivotConfig;
        const oldConfig = this.state.configs.get(config.sheet);
        this.state.configs.set(config.sheet, config);

        // Clear old cells and re-materialize
        clearPivotCells(model, config.sheet);
        materializePivot(model, config);

        if (oldConfig) {
          return [{ type: 'pivot.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
        }
        return [{ type: 'pivot.clearConfig', payload: { sheet: config.sheet } }];
      },
    },
    'pivot.clearConfig': {
      meta: { needReCalc: true, affectLayout: true, undoable: true },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet } = payload as { sheet: number };
        const oldConfig = this.state.configs.get(sheet);
        this.state.configs.delete(sheet);
        clearPivotCells(model, sheet);
        if (oldConfig) {
          return [{ type: 'pivot.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
        }
        return [];
      },
    },
    'pivot.drill': {
      meta: { needReCalc: true, affectLayout: true, undoable: true },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, dimension } = payload as { sheet: number; dimension: string; value: string };
        const config = this.state.configs.get(sheet);
        if (!config) return [];
        const oldConfig: PivotConfig = { ...config, rows: [...config.rows], columns: [...config.columns], values: [...config.values], valueAggregation: { ...config.valueAggregation } };
        const dimIndex = config.rows.indexOf(dimension);
        if (dimIndex === -1) return [];
        // Drill = keep only from this dimension down
        const newConfig: PivotConfig = { ...config, rows: config.rows.slice(dimIndex) };
        this.state.configs.set(sheet, newConfig);
        clearPivotCells(model, sheet);
        materializePivot(model, newConfig);
        return [{ type: 'pivot.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
      },
    },
  },

  queries: {
    'pivot.getConfig': (state: unknown, params: Record<string, unknown>) => {
      const pivotState = state as PivotState;
      const { sheet } = params as { sheet: number };
      return pivotState.configs.get(sheet) ?? null;
    },
    'pivot.getHierarchy': (state: unknown, params: Record<string, unknown>) => {
      const pivotState = state as PivotState;
      const { sheet } = params as { sheet: number };
      const config = pivotState.configs.get(sheet);
      if (!config) return null;
      return {
        rows: config.rows.map((field) => ({ field })),
        columns: config.columns.map((field) => ({ field })),
        values: config.values,
      };
    },
  },

  lifecycle: {
    onInit() {},
    onOperationApplied(this: { state: PivotState }, ops: Operation[], model: WorkbookModel) {
      for (const op of ops) {
        if (op.type === '__dataSourceUpdated') {
          const { dataSourceId } = op.payload as { dataSourceId: string };
          // Re-materialize any pivot that uses this data source
          for (const [sheet, config] of this.state.configs) {
            if (config.dataSourceId === dataSourceId) {
              clearPivotCells(model, sheet);
              materializePivot(model, config);
            }
          }
        }
      }
    },
  },
};
