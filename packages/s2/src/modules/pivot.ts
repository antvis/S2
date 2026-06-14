import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';
import type { HierarchyTreeNode, HierarchyLayout } from '../layout/types';

export interface PivotConfig {
  sheet: number;
  dataSourceId: string;
  rows: string[];
  columns: string[];
  values: string[];
  valueAggregation: Record<string, 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>;
}

type PivotTreeNode = HierarchyTreeNode;
type PivotLayout = HierarchyLayout;

interface PivotState {
  configs: Map<number, PivotConfig>;
  layouts: Map<number, PivotLayout>;
}

type AggFn = 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';

function aggregate(values: number[], fn: AggFn): number {
  if (values.length === 0) return 0;
  switch (fn) {
    case 'SUM': return values.reduce((a, b) => a + b, 0);
    case 'AVG': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'COUNT': return values.length;
    case 'MIN': {
      let min = values[0]!;
      for (let i = 1; i < values.length; i++) {
        if (values[i]! < min) min = values[i]!;
      }
      return min;
    }
    case 'MAX': {
      let max = values[0]!;
      for (let i = 1; i < values.length; i++) {
        if (values[i]! > max) max = values[i]!;
      }
      return max;
    }
  }
}

function buildTree(data: Record<string, unknown>[], fields: string[]): PivotTreeNode[] {
  if (fields.length === 0) return [];
  const field = fields[0]!;
  const rest = fields.slice(1);
  const groups = new Map<string, Record<string, unknown>[]>();

  for (const record of data) {
    const val = String(record[field] ?? '');
    if (!groups.has(val)) groups.set(val, []);
    groups.get(val)!.push(record);
  }

  const nodes: PivotTreeNode[] = [];
  for (const [value, records] of groups) {
    nodes.push({
      value,
      children: buildTree(records, rest),
    });
  }
  return nodes;
}

function getLeafPaths(tree: PivotTreeNode[], prefix: string[] = []): string[][] {
  if (tree.length === 0) return [prefix];
  const paths: string[][] = [];
  for (const node of tree) {
    const newPrefix = [...prefix, node.value];
    if (node.children.length === 0) {
      paths.push(newPrefix);
    } else {
      paths.push(...getLeafPaths(node.children, newPrefix));
    }
  }
  return paths;
}

function computePivotLayout(data: Record<string, unknown>[], config: PivotConfig): { layout: PivotLayout; values: number[][] } {
  const rowTree = buildTree(data, config.rows);
  const colTree = buildTree(data, config.columns);

  const rowLeafPaths = getLeafPaths(rowTree);
  const colLeafPaths = config.columns.length > 0 ? getLeafPaths(colTree) : [[]];

  const values: number[][] = [];

  for (let ri = 0; ri < rowLeafPaths.length; ri++) {
    const row: number[] = [];
    const rowPath = rowLeafPaths[ri]!;

    const rowRecords = data.filter((record) =>
      config.rows.every((field, i) => String(record[field] ?? '') === rowPath[i])
    );

    for (let ci = 0; ci < colLeafPaths.length; ci++) {
      const colPath = colLeafPaths[ci]!;

      const matchingRecords = colPath.length > 0
        ? rowRecords.filter((record) =>
            config.columns.every((field, i) => String(record[field] ?? '') === colPath[i])
          )
        : rowRecords;

      for (const vf of config.values) {
        const nums = matchingRecords.map((r) => Number(r[vf])).filter((n) => !isNaN(n));
        const aggFn = config.valueAggregation[vf] ?? 'SUM';
        row.push(aggregate(nums, aggFn));
      }
    }
    values.push(row);
  }

  const layout: PivotLayout = {
    rowTree,
    colTree,
    rowFields: config.rows,
    colFields: config.columns,
    valueFields: config.values,
    rowLeafCount: rowLeafPaths.length,
    colLeafCount: colLeafPaths.length * config.values.length,
  };

  return { layout, values };
}

function materializeToModel(model: WorkbookModel, sheet: number, values: number[][]): void {
  const sheet_ = model.getSheet(sheet);
  if (!sheet_) return;
  sheet_.cells.clear();
  sheet_.merges = [];

  for (let ri = 0; ri < values.length; ri++) {
    const rowData = values[ri]!;
    for (let ci = 0; ci < rowData.length; ci++) {
      model.setCell(sheet, ri, ci, { value: rowData[ci]! });
    }
  }
}

export const PivotModule: ModuleDefinition = {
  name: 'pivot',

  state: (): PivotState => ({ configs: new Map(), layouts: new Map() }),

  operations: {
    'pivot.setConfig': {
      meta: { needReCalc: true, affectLayout: true, undoable: true },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const config = payload as unknown as PivotConfig;
        const oldConfig = this.state.configs.get(config.sheet);
        this.state.configs.set(config.sheet, config);

        // Compute layout
        const data = model.dataSources.get(config.dataSourceId) as Record<string, unknown>[] | undefined;
        if (data && data.length > 0) {
          const { layout, values } = computePivotLayout(data, config);
          this.state.layouts.set(config.sheet, layout);
          materializeToModel(model, config.sheet, values);
        }

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
        this.state.layouts.delete(sheet);
        const sheetState = model.getSheet(sheet);
        if (sheetState) {
          sheetState.cells.clear();
          sheetState.merges = [];
        }
        if (oldConfig) {
          return [{ type: 'pivot.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
        }
        return [];
      },
    },
  },

  queries: {
    'pivot.getConfig': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const pivotState = state as PivotState;
      const { sheet } = params as { sheet: number };
      return pivotState.configs.get(sheet) ?? null;
    },
    'pivot.getLayout': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const pivotState = state as PivotState;
      const { sheet } = params as { sheet: number };
      return pivotState.layouts.get(sheet) ?? null;
    },
    'pivot.getHierarchy': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const pivotState = state as PivotState;
      const { sheet } = params as { sheet: number };
      const layout = pivotState.layouts.get(sheet);
      if (!layout) return null;
      return {
        rows: layout.rowTree,
        columns: layout.colTree,
        values: layout.valueFields,
      };
    },
  },

  serialize(state: unknown): unknown {
    const s = state as PivotState;
    const configs: Record<string, PivotConfig> = {};
    for (const [sheet, config] of s.configs) {
      configs[String(sheet)] = config;
    }
    return { configs };
  },

  deserialize(data: unknown, state: unknown): void {
    const s = state as PivotState;
    const d = data as { configs?: Record<string, PivotConfig> };
    if (d.configs) {
      for (const [key, config] of Object.entries(d.configs)) {
        s.configs.set(Number(key), config);
      }
    }
  },

  lifecycle: {
    onOperationApplied(this: { state: PivotState }, ops: Operation[], model: WorkbookModel) {
      for (const op of ops) {
        if (op.type === '__dataSourceUpdated') {
          const { dataSourceId } = op.payload as { dataSourceId: string };
          for (const [sheet, config] of this.state.configs) {
            if (config.dataSourceId === dataSourceId) {
              const data = model.dataSources.get(dataSourceId) as Record<string, unknown>[] | undefined;
              if (data && data.length > 0) {
                const { layout, values } = computePivotLayout(data, config);
                this.state.layouts.set(sheet, layout);
                materializeToModel(model, sheet, values);
              }
            }
          }
        }
      }
    },
  },
};
