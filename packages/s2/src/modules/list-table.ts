import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';
import type { WorkbookModel } from '../core/model';
import type { HierarchyLayout, HierarchyTreeNode } from '../layout/types';

export interface ListColumnDef {
  field?: string;
  title?: string;
  width?: number;
  tree?: boolean;
  columns?: ListColumnDef[];
}

export interface ListTableConfig {
  sheet: number;
  dataSourceId: string;
  columns: ListColumnDef[];
  groupBy?: string[];
  transpose?: boolean;
  hierarchyExpandLevel?: number;
  /** 平铺模式的分组字段（左侧合并行头），如 ['province', 'city'] */
  gridFields?: string[];
}

interface ListFlatRow {
  index: number;
  record: Record<string, unknown>;
  depth: number;
  hasChildren: boolean;
  isCollapsed: boolean;
  nodeId: string;
}

interface ListTableState {
  configs: Map<number, ListTableConfig>;
  collapsedNodes: Map<number, Set<string>>;
  _cachedLayouts: Map<number, HierarchyLayout>;
}

interface FlattenResult {
  flatRows: ListFlatRow[];
  treeNodes: HierarchyTreeNode[];
}

function getLeafColumns(columns: ListColumnDef[]): ListColumnDef[] {
  const leaves: ListColumnDef[] = [];
  for (const col of columns) {
    if (col.columns && col.columns.length > 0) {
      leaves.push(...getLeafColumns(col.columns));
    } else {
      leaves.push(col);
    }
  }
  return leaves;
}

function getHeaderDepth(columns: ListColumnDef[]): number {
  let max = 1;
  for (const col of columns) {
    if (col.columns && col.columns.length > 0) {
      max = Math.max(max, 1 + getHeaderDepth(col.columns));
    }
  }
  return max;
}

function hasNestedColumns(columns: ListColumnDef[]): boolean {
  return columns.some(c => c.columns && c.columns.length > 0);
}

function buildColTreeFromColumns(columns: ListColumnDef[]): HierarchyTreeNode[] {
  return columns.map(col => ({
    value: col.title ?? col.field ?? '',
    field: col.field,
    children: col.columns ? buildColTreeFromColumns(col.columns) : [],
  }));
}

function flattenData(
  data: Record<string, unknown>[],
  collapsedNodes: Set<string>,
  treeField: string | null,
  depth: number = 0,
  parentId: string = '',
  flatRowsAccum: ListFlatRow[] = [],
): FlattenResult {
  const treeNodes: HierarchyTreeNode[] = [];
  for (let i = 0; i < data.length; i++) {
    const record = data[i]!;
    const nodeId = parentId ? `${parentId}/${i}` : String(i);
    const children = record.children as Record<string, unknown>[] | undefined;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isCollapsed = collapsedNodes.has(nodeId);

    flatRowsAccum.push({
      index: flatRowsAccum.length,
      record,
      depth,
      hasChildren,
      isCollapsed,
      nodeId,
    });

    const treeNode: HierarchyTreeNode = {
      value: treeField
        ? String(record[treeField] ?? '')
        : String(record[Object.keys(record)[0] ?? ''] ?? flatRowsAccum.length - 1),
      field: treeField ?? undefined,
      children: [],
      isCollapsed,
      nodeId,
    };

    if (hasChildren && !isCollapsed) {
      const childResult = flattenData(children!, collapsedNodes, treeField, depth + 1, nodeId, flatRowsAccum);
      treeNode.children = childResult.treeNodes;
    }

    treeNodes.push(treeNode);
  }
  return { flatRows: flatRowsAccum, treeNodes };
}

function groupByToTree(
  data: Record<string, unknown>[],
  groupByFields: string[],
): Record<string, unknown>[] {
  if (groupByFields.length === 0) return data;

  const field = groupByFields[0]!;
  const rest = groupByFields.slice(1);
  const groups = new Map<string, Record<string, unknown>[]>();

  for (const record of data) {
    const key = String(record[field] ?? '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(record);
  }

  const result: Record<string, unknown>[] = [];
  for (const [value, records] of groups) {
    result.push({
      [field]: value,
      children: rest.length > 0 ? groupByToTree(records, rest) : records,
    });
  }
  return result;
}

function buildGridRowTree(
  data: Record<string, unknown>[],
  gridFields: string[],
): HierarchyTreeNode[] {
  if (gridFields.length === 0) return [];
  const field = gridFields[0]!;
  const rest = gridFields.slice(1);
  const groups = new Map<string, Record<string, unknown>[]>();

  for (const record of data) {
    const key = String(record[field] ?? '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(record);
  }

  const nodes: HierarchyTreeNode[] = [];
  for (const [value, records] of groups) {
    if (rest.length > 0) {
      nodes.push({
        value,
        field,
        children: buildGridRowTree(records, rest),
      });
    } else {
      // 最后一层：每条记录一个叶节点，父节点按值合并
      for (const _record of records) {
        nodes.push({ value, field, children: [] });
      }
    }
  }
  return nodes;
}

function countLeaves(nodes: HierarchyTreeNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.children.length === 0) count++;
    else count += countLeaves(node.children);
  }
  return count;
}

function getGridLeafRecords(
  data: Record<string, unknown>[],
  gridFields: string[],
): Record<string, unknown>[] {
  if (gridFields.length === 0) return data;
  const field = gridFields[0]!;
  const rest = gridFields.slice(1);
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const record of data) {
    const key = String(record[field] ?? '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(record);
  }
  const result: Record<string, unknown>[] = [];
  for (const [, records] of groups) {
    result.push(...getGridLeafRecords(records, rest));
  }
  return result;
}

function materializeGridToModel(
  model: WorkbookModel,
  sheet: number,
  data: Record<string, unknown>[],
  gridFields: string[],
  dataCols: ListColumnDef[],
): void {
  const sheetState = model.getSheet(sheet);
  if (!sheetState) return;
  sheetState.cells.clear();
  sheetState.merges = [];

  const orderedData = getGridLeafRecords(data, gridFields);
  for (let ri = 0; ri < orderedData.length; ri++) {
    const record = orderedData[ri]!;
    for (let ci = 0; ci < dataCols.length; ci++) {
      const col = dataCols[ci]!;
      const value = record[col.field!];
      if (value !== undefined && value !== null) {
        model.setCell(sheet, ri, ci, { value: value as string | number | boolean });
      }
    }
  }
}

// PERF: 全量重写，5万行场景需优化为增量更新
function materializeListToModel(
  model: WorkbookModel,
  sheet: number,
  flatRows: ListFlatRow[],
  columns: ListColumnDef[],
  treeColIndex: number,
  transpose?: boolean,
): void {
  const sheetState = model.getSheet(sheet);
  if (!sheetState) return;
  sheetState.cells.clear();
  sheetState.merges = [];

  const dataCols = columns.filter((_, i) => i !== treeColIndex);

  if (transpose) {
    for (let ri = 0; ri < flatRows.length; ri++) {
      const row = flatRows[ri]!;
      for (let ci = 0; ci < dataCols.length; ci++) {
        const col = dataCols[ci]!;
        const value = row.record[col.field!];
        if (value !== undefined && value !== null) {
          model.setCell(sheet, ci, ri, { value: value as string | number | boolean });
        }
      }
    }
  } else {
    for (let ri = 0; ri < flatRows.length; ri++) {
      const row = flatRows[ri]!;
      for (let ci = 0; ci < dataCols.length; ci++) {
        const col = dataCols[ci]!;
        const value = row.record[col.field!];
        if (value !== undefined && value !== null) {
          model.setCell(sheet, ri, ci, { value: value as string | number | boolean });
        }
      }
    }
  }
}

function buildListHierarchyLayout(
  flatRows: ListFlatRow[],
  treeNodes: HierarchyTreeNode[],
  columns: ListColumnDef[],
  treeColIndex: number,
  transpose?: boolean,
  nestedColumns?: ListColumnDef[],
): HierarchyLayout {
  const hasTree = treeColIndex >= 0;
  const treeField = hasTree ? columns[treeColIndex]!.field! : '';

  if (hasTree) {
    const valueFields = columns
      .filter((_, i) => i !== treeColIndex)
      .map(c => c.title ?? c.field!);
    return {
      rowTree: treeNodes,
      colTree: [],
      rowFields: [treeField],
      colFields: [],
      valueFields,
      rowLeafCount: flatRows.length,
      colLeafCount: valueFields.length,
      hierarchyType: 'tree',
    };
  }

  if (transpose) {
    const fieldNames = columns.map(c => c.title ?? c.field!);
    return {
      rowTree: [],
      colTree: [],
      rowFields: fieldNames,
      colFields: [],
      valueFields: [],
      rowLeafCount: columns.length,
      colLeafCount: flatRows.length,
      hierarchyType: 'list-transpose',
    };
  }

  return {
    rowTree: treeNodes,
    colTree: nestedColumns ? buildColTreeFromColumns(nestedColumns) : [],
    rowFields: [],
    colFields: nestedColumns ? ['__multi_header__'] : [],
    valueFields: columns.map(c => c.title ?? c.field!),
    rowLeafCount: flatRows.length,
    colLeafCount: columns.length,
    hierarchyType: 'list',
  };
}

function recompute(state: ListTableState, model: WorkbookModel, sheet: number): void {
  const config = state.configs.get(sheet);
  if (!config) return;

  const data = model.dataSources.get(config.dataSourceId) as Record<string, unknown>[] | undefined;
  if (!data || data.length === 0) return;

  // Grid mode: gridFields 作为左侧合并行头，复用 pivot grid 布局路径
  if (config.gridFields && config.gridFields.length > 0) {
    const gridFields = config.gridFields;
    const gridFieldSet = new Set(gridFields);
    const dataCols = config.columns.filter(c => !gridFieldSet.has(c.field!));
    const rowTree = buildGridRowTree(data, gridFields);
    const leafCount = countLeaves(rowTree) || data.length;

    materializeGridToModel(model, sheet, data, gridFields, dataCols);

    const layout: HierarchyLayout = {
      rowTree,
      colTree: [],
      rowFields: gridFields,
      colFields: [],
      valueFields: dataCols.map(c => c.title ?? c.field!),
      rowLeafCount: leafCount,
      colLeafCount: dataCols.length,
      hierarchyType: 'grid',
    };
    state._cachedLayouts.set(sheet, layout);
    return;
  }

  const collapsed = state.collapsedNodes.get(sheet) ?? new Set();

  const nested = hasNestedColumns(config.columns);
  const leafColumns = nested ? getLeafColumns(config.columns) : config.columns;

  let processedData = data;
  let effectiveColumns = leafColumns;
  let effectiveTreeColIndex = leafColumns.findIndex(c => c.tree === true);

  if (config.groupBy && config.groupBy.length > 0 && effectiveTreeColIndex < 0) {
    processedData = groupByToTree(data, config.groupBy);
    const groupField = config.groupBy[0]!;
    effectiveTreeColIndex = effectiveColumns.findIndex(c => c.field === groupField);
    if (effectiveTreeColIndex < 0) {
      effectiveColumns = [{ field: groupField, title: groupField, tree: true }, ...effectiveColumns];
      effectiveTreeColIndex = 0;
    }
  }

  const treeField = effectiveTreeColIndex >= 0 ? effectiveColumns[effectiveTreeColIndex]!.field ?? null : null;

  const { flatRows, treeNodes } = flattenData(processedData, collapsed, treeField);

  materializeListToModel(model, sheet, flatRows, effectiveColumns, effectiveTreeColIndex, config.transpose);

  const layout = buildListHierarchyLayout(flatRows, treeNodes, effectiveColumns, effectiveTreeColIndex, config.transpose, nested ? config.columns : undefined);

  state._cachedLayouts.set(sheet, layout);
}

export const ListTableModule: ModuleDefinition = {
  name: 'list',

  state: (): ListTableState => ({
    configs: new Map(),
    collapsedNodes: new Map(),
    _cachedLayouts: new Map(),
  }),

  operations: {
    'list.setConfig': {
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Configure list table (columns, data source)',
        inputSchema: {
          type: 'object',
          properties: {
            sheet: { type: 'number' },
            dataSourceId: { type: 'string' },
            columns: { type: 'array' },
          },
          required: ['sheet', 'dataSourceId', 'columns'],
        },
      },
      execute(this: { state: ListTableState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const config = payload as unknown as ListTableConfig;
        const oldConfig = this.state.configs.get(config.sheet);
        this.state.configs.set(config.sheet, config);

        if (!this.state.collapsedNodes.has(config.sheet)) {
          this.state.collapsedNodes.set(config.sheet, new Set());
        }

        recompute(this.state, model, config.sheet);

        if (oldConfig) {
          return [{ type: 'list.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
        }
        return [{ type: 'list.clearConfig', payload: { sheet: config.sheet } }];
      },
    },

    'list.clearConfig': {
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Clear list table configuration',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' } },
          required: ['sheet'],
        },
      },
      execute(this: { state: ListTableState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet } = payload as { sheet: number };
        const oldConfig = this.state.configs.get(sheet);
        this.state.configs.delete(sheet);
        this.state.collapsedNodes.delete(sheet);
        this.state._cachedLayouts.delete(sheet);
        const sheetState = model.getSheet(sheet);
        if (sheetState) {
          sheetState.cells.clear();
          sheetState.merges = [];
        }
        if (oldConfig) {
          return [{ type: 'list.setConfig', payload: oldConfig as unknown as Record<string, unknown> }];
        }
        return [];
      },
    },

    'list.toggleCollapse': {
      meta: {
        needReCalc: true, affectLayout: true, undoable: true,
        description: 'Toggle collapse state of a list table tree node',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, nodeId: { type: 'string' } },
          required: ['sheet', 'nodeId'],
        },
      },
      execute(this: { state: ListTableState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, nodeId } = payload as { sheet: number; nodeId: string };
        const config = this.state.configs.get(sheet);
        if (!config) return [];

        const collapsed = this.state.collapsedNodes.get(sheet);
        if (!collapsed) return [];

        if (collapsed.has(nodeId)) {
          collapsed.delete(nodeId);
        } else {
          collapsed.add(nodeId);
        }

        recompute(this.state, model, sheet);

        return [{ type: 'list.toggleCollapse', payload: { sheet, nodeId } }];
      },
    },
  },

  queries: {
    'list.getConfig': (state: unknown, params: Record<string, unknown>) => {
      const s = state as ListTableState;
      const { sheet } = params as { sheet: number };
      return s.configs.get(sheet) ?? null;
    },
    'list.getLayout': (state: unknown, params: Record<string, unknown>) => {
      const s = state as ListTableState;
      const { sheet } = params as { sheet: number };
      const config = s.configs.get(sheet);
      if (!config) return null;
      return s._cachedLayouts.get(sheet) ?? null;
    },
  },

  lifecycle: {
    onOperationApplied(this: { state: ListTableState }, ops: Operation[], model: WorkbookModel) {
      for (const op of ops) {
        if (op.type === '__dataSourceUpdated') {
          const { dataSourceId } = op.payload as { dataSourceId: string };
          for (const [sheet, config] of this.state.configs) {
            if (config.dataSourceId === dataSourceId) {
              recompute(this.state, model, sheet);
            }
          }
        }
      }
    },
  },

  serialize(state: unknown): unknown {
    const s = state as ListTableState;
    const configs: Record<string, ListTableConfig> = {};
    const collapsed: Record<string, string[]> = {};
    for (const [sheet, config] of s.configs) {
      configs[String(sheet)] = config;
    }
    for (const [sheet, nodes] of s.collapsedNodes) {
      collapsed[String(sheet)] = [...nodes];
    }
    return { configs, collapsed };
  },

  deserialize(data: unknown, state: unknown): void {
    const s = state as ListTableState;
    const d = data as { configs?: Record<string, ListTableConfig>; collapsed?: Record<string, string[]> };
    if (d.configs) {
      for (const [key, config] of Object.entries(d.configs)) {
        s.configs.set(Number(key), config);
      }
    }
    if (d.collapsed) {
      for (const [key, nodes] of Object.entries(d.collapsed)) {
        s.collapsedNodes.set(Number(key), new Set(nodes));
      }
    }
  },
};
