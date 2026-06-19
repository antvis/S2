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
  drillFilters?: Record<string, string>;
  showSubTotals?: boolean;
  showGrandTotal?: boolean;
  hierarchyType?: 'grid' | 'tree' | 'grid-tree';
  expandDepth?: number;
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

interface TreeNodeWithData {
  value: string;
  field?: string;
  children: TreeNodeWithData[];
  records: Record<string, unknown>[];
}

function buildTreeWithData(data: Record<string, unknown>[], fields: string[]): TreeNodeWithData[] {
  if (fields.length === 0) return [];
  const field = fields[0]!;
  const rest = fields.slice(1);
  const groups = new Map<string, Record<string, unknown>[]>();

  for (const record of data) {
    const val = String(record[field] ?? '');
    if (!groups.has(val)) groups.set(val, []);
    groups.get(val)!.push(record);
  }

  const nodes: TreeNodeWithData[] = [];
  for (const [value, records] of groups) {
    nodes.push({
      value,
      field,
      children: buildTreeWithData(records, rest),
      records,
    });
  }
  return nodes;
}

function toHierarchyTree(nodes: TreeNodeWithData[]): PivotTreeNode[] {
  return nodes.map((n) => ({
    value: n.value,
    field: n.field,
    children: toHierarchyTree(n.children),
  }));
}

function getLeafGroups(nodes: TreeNodeWithData[], collapseMap?: Set<string>, parentId?: string): Record<string, unknown>[][] {
  const groups: Record<string, unknown>[][] = [];
  for (const node of nodes) {
    const nodeId = parentId
      ? `${parentId}/${node.field ?? ''}:${node.value}`
      : `${node.field ?? ''}:${node.value}`;
    if (node.children.length === 0 || collapseMap?.has(nodeId)) {
      groups.push(node.records);
    } else {
      groups.push(...getLeafGroups(node.children, collapseMap, nodeId));
    }
  }
  return groups;
}

function buildTree(data: Record<string, unknown>[], fields: string[]): PivotTreeNode[] {
  return toHierarchyTree(buildTreeWithData(data, fields));
}

// Tree 模式：DFS 前序遍历，为每个可见节点（包括父节点）生成一行数据
function getAllNodeGroups(nodes: TreeNodeWithData[], collapseMap?: Set<string>, parentId?: string): Record<string, unknown>[][] {
  const groups: Record<string, unknown>[][] = [];
  for (const node of nodes) {
    const nodeId = parentId
      ? `${parentId}/${node.field ?? ''}:${node.value}`
      : `${node.field ?? ''}:${node.value}`;
    // 每个节点都产生一行（父节点用自身 records 聚合）
    groups.push(node.records);
    if (node.children.length > 0 && !collapseMap?.has(nodeId)) {
      groups.push(...getAllNodeGroups(node.children, collapseMap, nodeId));
    }
  }
  return groups;
}

function getLeafPaths(tree: PivotTreeNode[], prefix: string[] = []): string[][] {
  if (tree.length === 0) return [prefix];
  const paths: string[][] = [];
  for (const node of tree) {
    const newPrefix = [...prefix, node.value];
    if (node.children.length === 0 || node.isCollapsed) {
      paths.push(newPrefix);
    } else {
      paths.push(...getLeafPaths(node.children, newPrefix));
    }
  }
  return paths;
}

function generateNodeId(node: HierarchyTreeNode, parentId: string = ''): string {
  return parentId
    ? `${parentId}/${node.field ?? ''}:${node.value}`
    : `${node.field ?? ''}:${node.value}`;
}

function findNodeById(tree: HierarchyTreeNode[], nodeId: string, parentId: string = ''): HierarchyTreeNode | null {
  for (const node of tree) {
    const id = generateNodeId(node, parentId);
    if (id === nodeId) return node;
    const found = findNodeById(node.children, nodeId, id);
    if (found) return found;
  }
  return null;
}

function collectCollapsedIds(tree: HierarchyTreeNode[], parentId: string = ''): Set<string> {
  const ids = new Set<string>();
  for (const node of tree) {
    const id = generateNodeId(node, parentId);
    if (node.isCollapsed) ids.add(id);
    collectCollapsedIds(node.children, id).forEach(i => ids.add(i));
  }
  return ids;
}

function applyExpandDepth(tree: HierarchyTreeNode[], maxDepth: number, currentDepth: number = 0): void {
  for (const node of tree) {
    if (node.children.length > 0 && currentDepth >= maxDepth) {
      node.isCollapsed = true;
    }
    applyExpandDepth(node.children, maxDepth, currentDepth + 1);
  }
}

function computePivotLayout(
  data: Record<string, unknown>[],
  config: PivotConfig,
  existingRowTree?: HierarchyTreeNode[],
): { layout: PivotLayout; values: number[][] } {
  let filteredData = data;
  if (config.drillFilters) {
    for (const [field, value] of Object.entries(config.drillFilters)) {
      filteredData = filteredData.filter((r) => String(r[field] ?? '') === value);
    }
  }

  const rowTreeData = buildTreeWithData(filteredData, config.rows);
  const rowTree = existingRowTree ?? toHierarchyTree(rowTreeData);
  const collapseMap = existingRowTree ? collectCollapsedIds(rowTree) : undefined;
  const isTree = (config.hierarchyType ?? 'grid') === 'tree';
  const rowLeafGroups = config.rows.length > 0
    ? (isTree ? getAllNodeGroups(rowTreeData, collapseMap) : getLeafGroups(rowTreeData, collapseMap))
    : [filteredData];


  const colTreeData = buildTreeWithData(filteredData, config.columns);
  const colTree = toHierarchyTree(colTreeData);
  const colLeafGroups = config.columns.length > 0 ? getLeafGroups(colTreeData) : null;

  // Build column index: for each record, map to its col leaf index
  let colIndexMap: Map<Record<string, unknown>, number> | null = null;
  let colLeafCount = 1;
  if (colLeafGroups) {
    colLeafCount = colLeafGroups.length;
    colIndexMap = new Map();
    for (let ci = 0; ci < colLeafGroups.length; ci++) {
      for (const record of colLeafGroups[ci]!) {
        colIndexMap.set(record, ci);
      }
    }
  }

  const valuesPerCol = config.values.length;
  const totalCols = colLeafCount * valuesPerCol;
  const values: number[][] = [];

  for (const rowRecords of rowLeafGroups) {
    const row = new Array<number[]>(totalCols);
    for (let i = 0; i < totalCols; i++) row[i] = [];

    for (const record of rowRecords) {
      const ci = colIndexMap ? (colIndexMap.get(record) ?? -1) : 0;
      if (ci === -1) continue;

      for (let vi = 0; vi < config.values.length; vi++) {
        const num = Number(record[config.values[vi]!]);
        if (!isNaN(num)) {
          row[ci * valuesPerCol + vi]!.push(num);
        }
      }
    }

    const aggregated: number[] = [];
    for (let i = 0; i < totalCols; i++) {
      const aggFn = config.valueAggregation[config.values[i % valuesPerCol]!] ?? 'SUM';
      aggregated.push(aggregate(row[i]!, aggFn));
    }
    values.push(aggregated);
  }

  // Subtotals
  if (config.showSubTotals && config.rows.length > 1) {
    const finalValues: number[][] = [];
    let leafIdx = 0;

    function walkForSubtotals(nodes: TreeNodeWithData[], depth: number): void {
      for (const node of nodes) {
        if (node.children.length > 0) {
          walkForSubtotals(node.children, depth + 1);
          finalValues.push(aggregateRecordGroup(node.records, colIndexMap, colLeafCount, config));
        } else {
          finalValues.push(values[leafIdx]!);
          leafIdx++;
        }
      }
    }

    walkForSubtotals(rowTreeData, 0);
    values.length = 0;
    values.push(...finalValues);
  }

  if (config.showGrandTotal) {
    values.push(aggregateRecordGroup(filteredData, colIndexMap, colLeafCount, config));
  }

  const layout: PivotLayout = {
    rowTree,
    colTree,
    rowFields: config.rows,
    colFields: config.columns,
    valueFields: config.values,
    rowLeafCount: values.length,
    colLeafCount: colLeafCount * valuesPerCol,
    hierarchyType: config.hierarchyType ?? 'grid',
  };

  return { layout, values };
}

function aggregateRecordGroup(
  records: Record<string, unknown>[],
  colIndexMap: Map<Record<string, unknown>, number> | null,
  colLeafCount: number,
  config: PivotConfig,
): number[] {
  const valuesPerCol = config.values.length;
  const totalCols = colLeafCount * valuesPerCol;
  const buckets = new Array<number[]>(totalCols);
  for (let i = 0; i < totalCols; i++) buckets[i] = [];

  for (const record of records) {
    const ci = colIndexMap ? (colIndexMap.get(record) ?? -1) : 0;
    if (ci === -1) continue;
    for (let vi = 0; vi < config.values.length; vi++) {
      const num = Number(record[config.values[vi]!]);
      if (!isNaN(num)) {
        buckets[ci * valuesPerCol + vi]!.push(num);
      }
    }
  }

  const result: number[] = [];
  for (let i = 0; i < totalCols; i++) {
    const aggFn = config.valueAggregation[config.values[i % valuesPerCol]!] ?? 'SUM';
    result.push(aggregate(buckets[i]!, aggFn));
  }
  return result;
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
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Configure pivot table (rows, columns, values, aggregation)',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, dataSourceId: { type: 'string' }, rows: { type: 'array', items: { type: 'string' } }, columns: { type: 'array', items: { type: 'string' } }, values: { type: 'array', items: { type: 'string' } }, valueAggregation: { type: 'object' }, showSubTotals: { type: 'boolean' }, showGrandTotal: { type: 'boolean' } },
          required: ['sheet', 'dataSourceId', 'rows', 'columns', 'values', 'valueAggregation'],
        },
      },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { __restoreCells, __restoreMerges, ...rest } = payload;
        const config = rest as unknown as PivotConfig;
        const oldConfig = this.state.configs.get(config.sheet);
        this.state.configs.set(config.sheet, config);

        // Compute layout
        const data = model.dataSources.get(config.dataSourceId) as Record<string, unknown>[] | undefined;
        if (data && data.length > 0) {
          const { layout, values } = computePivotLayout(data, config);
          if ((config.hierarchyType === 'tree' || config.hierarchyType === 'grid-tree') && config.expandDepth !== undefined) {
            applyExpandDepth(layout.rowTree, config.expandDepth);
            const recomputed = computePivotLayout(data, config, layout.rowTree);
            this.state.layouts.set(config.sheet, recomputed.layout);
            materializeToModel(model, config.sheet, recomputed.values);
          } else {
            this.state.layouts.set(config.sheet, layout);
            materializeToModel(model, config.sheet, values);
          }
        }

        // Restore non-pivot cells from snapshot (undo of clearConfig)
        if (__restoreCells) {
          const sheetState = model.getSheet(config.sheet);
          if (sheetState) {
            const snap = __restoreCells as Record<string, Record<string, unknown>>;
            for (const [rStr, rowData] of Object.entries(snap)) {
              const r = Number(rStr);
              for (const [cStr, cell] of Object.entries(rowData as Record<string, unknown>)) {
                const c = Number(cStr);
                if (!model.getCell(config.sheet, r, c)) {
                  model.setCell(config.sheet, r, c, cell as Parameters<WorkbookModel['setCell']>[3]);
                }
              }
            }
            if (__restoreMerges) {
              const currentMerges = sheetState.merges;
              const restored = __restoreMerges as typeof currentMerges;
              for (const m of restored) {
                if (!currentMerges.some((cm: any) => cm.startRow === m.startRow && cm.startCol === m.startCol)) {
                  currentMerges.push(m);
                }
              }
            }
          }
        }

        if (oldConfig) {
          return [{ type: 'pivot.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
        }
        return [{ type: 'pivot.clearConfig', payload: { sheet: config.sheet } }];
      },
    },
    'pivot.clearConfig': {
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Clear pivot table configuration',
        inputSchema: { type: 'object', properties: { sheet: { type: 'number' } }, required: ['sheet'] },
      },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet } = payload as { sheet: number };
        const oldConfig = this.state.configs.get(sheet);
        this.state.configs.delete(sheet);
        this.state.layouts.delete(sheet);
        const sheetState = model.getSheet(sheet);
        let cellsSnapshot: unknown = undefined;
        let mergesSnapshot: unknown = undefined;
        if (sheetState) {
          cellsSnapshot = structuredClone(Object.fromEntries([...sheetState.cells.entries()].map(([r, row]) => [r, Object.fromEntries(row.entries())])));
          mergesSnapshot = structuredClone(sheetState.merges);
          sheetState.cells.clear();
          sheetState.merges = [];
        }
        if (oldConfig) {
          return [{ type: 'pivot.setConfig', payload: { ...(oldConfig as unknown as Record<string, unknown>), __restoreCells: cellsSnapshot, __restoreMerges: mergesSnapshot } }];
        }
        return [];
      },
    },
    'pivot.drill': {
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Drill down on a pivot dimension value',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, dimension: { type: 'string' }, value: { type: 'string' } },
          required: ['sheet', 'dimension', 'value'],
        },
      },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, dimension, value } = payload as { sheet: number; dimension: string; value: string };
        const config = this.state.configs.get(sheet);
        if (!config) return [];

        const oldConfig: PivotConfig = {
          ...config,
          rows: [...config.rows],
          columns: [...config.columns],
          values: [...config.values],
          valueAggregation: { ...config.valueAggregation },
          drillFilters: config.drillFilters ? { ...config.drillFilters } : undefined,
        };

        const dimIndex = config.rows.indexOf(dimension);
        if (dimIndex === -1) return [];

        const newDrillFilters = { ...(config.drillFilters ?? {}), [dimension]: value };

        const data = model.dataSources.get(config.dataSourceId) as Record<string, unknown>[] | undefined;
        if (dimIndex > 0 && data && data.length > 0) {
          const parentDims = config.rows.slice(0, dimIndex);
          const baseData = config.drillFilters
            ? data.filter((r) => Object.entries(config.drillFilters!).every(([k, v]) => String(r[k] ?? '') === v))
            : data;
          const matching = baseData.filter((r) => String(r[dimension] ?? '') === value);
          for (const dim of parentDims) {
            const vals = new Set(matching.map((r) => String(r[dim] ?? '')));
            if (vals.size === 1) newDrillFilters[dim] = [...vals][0]!;
          }
        }
        const newRows = config.rows.slice(dimIndex + 1);

        const newConfig: PivotConfig = {
          ...config,
          rows: newRows,
          drillFilters: newDrillFilters,
        };
        this.state.configs.set(sheet, newConfig);

        const sheetState = model.getSheet(sheet);
        let cellsSnapshot: unknown = undefined;
        if (sheetState) {
          cellsSnapshot = structuredClone(Object.fromEntries([...sheetState.cells.entries()].map(([r, row]) => [r, Object.fromEntries(row.entries())])));
        }

        if (data && data.length > 0) {
          const { layout, values } = computePivotLayout(data, newConfig);
          this.state.layouts.set(sheet, layout);
          materializeToModel(model, sheet, values);
        }

        return [{ type: 'pivot.setConfig', payload: { ...(oldConfig as unknown as Record<string, unknown>), __restoreCells: cellsSnapshot } }];
      },
    },
    'pivot.toggleCollapse': {
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Toggle collapse state of a pivot tree node',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, nodeId: { type: 'string' } },
          required: ['sheet', 'nodeId'],
        },
      },
      execute(this: { state: PivotState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, nodeId } = payload as { sheet: number; nodeId: string };
        const config = this.state.configs.get(sheet);
        if (!config || (config.hierarchyType !== 'tree' && config.hierarchyType !== 'grid-tree')) return [];

        const layout = this.state.layouts.get(sheet);
        if (!layout) return [];

        const node = findNodeById(layout.rowTree, nodeId);
        if (!node || node.children.length === 0) return [];

        node.isCollapsed = !node.isCollapsed;

        const data = model.dataSources.get(config.dataSourceId) as Record<string, unknown>[] | undefined;
        if (data && data.length > 0) {
          const { layout: newLayout, values } = computePivotLayout(data, config, layout.rowTree);
          this.state.layouts.set(sheet, newLayout);
          materializeToModel(model, sheet, values);
        }

        return [{ type: 'pivot.toggleCollapse', payload: { sheet, nodeId } }];
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
                const existingLayout = this.state.layouts.get(sheet);
                const existingRowTree = (existingLayout?.hierarchyType === 'tree' || existingLayout?.hierarchyType === 'grid-tree') ? existingLayout.rowTree : undefined;
                const { layout, values } = computePivotLayout(data, config, existingRowTree);
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
