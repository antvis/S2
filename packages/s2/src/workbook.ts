import { WorkbookModel } from './core/model';
import type { WorkbookState } from './core/types';
import { OperationEngine } from './operation/engine';
import { OperationRegistry } from './operation/registry';
import type { Operation } from './operation/types';
import { QueryLayer } from './query/query';
import { ModuleRegistry } from './module/registry';
import type { ModuleDefinition } from './module/types';
import { setCellValue, deleteCellValue, restoreCell } from './operation/operations/cell';
import { createSheet, deleteSheet, renameSheet } from './operation/operations/sheet';
import {
  insertRows, deleteRows, insertColumns, deleteColumns,
  setRowHeight, setColumnWidth, mergeCells, unmergeCells,
  hideRows, showRows, hideColumns, showColumns,
} from './operation/operations/dimension';
import { setCellStyle } from './operation/operations/style';
import { setSelection } from './operation/operations/selection';
import type { AgentContext, MCPToolSchema, FormulaTrace, AuditEntry } from './modules/agent';
import { TypedEmitter } from './common/emitter';
import type { CoreEventMap } from './core/events';
import type { Selection } from './interaction/types';

export interface AgentAPI {
  getContext(sheet?: number): AgentContext;
  getMCPTools(): MCPToolSchema[];
  callTool(name: string, params: Record<string, unknown>): { success: boolean; undoable: boolean };
  traceFormula(params: { sheet: number; row: number; col: number }): FormulaTrace | null;
  getAuditLog(limit?: number): AuditEntry[];
}

export interface CreateWorkbookOptions {
  modules?: ModuleDefinition[];
  snapshot?: WorkbookState;
}

export interface DataSourceOptions {
  copy?: boolean;
}

export interface Workbook {
  apply(operations: Operation[]): void;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  query: QueryLayer;
  on<K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void): () => void;
  registerDataSource(id: string, data: unknown[], options?: DataSourceOptions): void;
  toJSON(): WorkbookState;
  exportCSV(sheet?: number): string;
  exportTSV(sheet?: number): string;
  importCSV(csv: string, sheet?: number): void;
  getSelection(): { sheet: number; startRow: number; startCol: number; endRow: number; endCol: number } | null;
  getModuleRenderers(): readonly import('./module/types').CellRendererFn[];
  agent?: AgentAPI;
  /** @internal — used by mountCanvas, not part of public API */
  __getModel(): WorkbookModel;
}

export function createWorkbook(options?: CreateWorkbookOptions): Workbook {
  let snapshotData = options?.snapshot ? structuredClone(options.snapshot) : undefined;
  let savedModuleState: Record<string, unknown> | undefined;

  if (snapshotData) {
    const raw = snapshotData as unknown as Record<string, unknown>;
    if (raw.__moduleState) {
      savedModuleState = raw.__moduleState as Record<string, unknown>;
      delete raw.__moduleState;
      snapshotData = raw as unknown as WorkbookState;
    }
  }

  const model = new WorkbookModel(snapshotData);
  const operationRegistry = new OperationRegistry();
  const moduleRegistry = new ModuleRegistry();
  const queryLayer = new QueryLayer(model);
  const emitter = new TypedEmitter<CoreEventMap>();
  let currentSelection: { sheet: number; startRow: number; startCol: number; endRow: number; endCol: number } | null = null;

  // dataSources live on model so Modules can access them via execute(model, payload)

  const engine = new OperationEngine({
    model,
    registry: operationRegistry,
    onApplied(ops, _inverseOps) {
      for (const op of ops) {
        if (op.type === 'setSelection') {
          const p = op.payload as Record<string, unknown>;
          currentSelection = p.selection ? p.selection as typeof currentSelection : null;
        }
      }

      let fullInvalidate = false;
      for (const op of ops) {
        const def = operationRegistry.get(op.type);
        if (def?.meta.needReCalc || def?.meta.affectLayout || def?.meta.indexChanged) {
          fullInvalidate = true;
          break;
        }
      }

      if (fullInvalidate) {
        queryLayer.invalidateAll();
      } else {
        for (const op of ops) {
          const payload = op.payload as Record<string, unknown>;
          if ('row' in payload && 'col' in payload && 'sheet' in payload) {
            queryLayer.markDirty(payload.sheet as number, payload.row as number, payload.col as number);
          }
        }
      }

      moduleRegistry.notifyOperationApplied(ops, model);
      dispatchCoreEvents(ops);
      emitter.emit('operationApplied', ops);
    },
  });

  registerCoreOperations(operationRegistry);

  if (options?.modules) {
    for (const mod of options.modules) {
      moduleRegistry.register(mod, operationRegistry, queryLayer);
    }
  }

  const agentState = moduleRegistry.getModuleState('agent') as { _operationRegistry: unknown; _engine: unknown; _queryLayer: unknown } | null;
  if (agentState) {
    agentState._operationRegistry = operationRegistry;
    agentState._engine = engine;
    agentState._queryLayer = queryLayer;
  }

  moduleRegistry.init(model);

  if (savedModuleState) {
    moduleRegistry.deserializeAll(savedModuleState);
  }

  function dispatchCoreEvents(ops: Operation[]): void {
    for (const op of ops) {
      const payload = op.payload as Record<string, unknown>;
      const sheet = (payload.sheet as number | undefined) ?? 0;

      switch (op.type) {
        case 'setSelection':
          emitter.emit('selectionChanged', {
            sheet,
            selection: (payload.selection as Selection | null | undefined) ?? null,
          });
          break;

        case 'sort.set':
          emitter.emit('sorted', {
            sheet,
            sortBy: (payload.sortBy as { col: number; order: 'asc' | 'desc' }[] | undefined) ?? [],
          });
          break;

        case 'sort.clear':
          emitter.emit('sorted', { sheet, sortBy: [] });
          break;

        case 'filter.set':
        case 'filter.clear':
          emitter.emit('filtered', { sheet });
          break;

        case 'list.toggleCollapse':
        case 'pivot.toggleCollapse': {
          const nodeId = (payload.nodeId as string | undefined) ?? '';
          // isCollapsed 当前 op 不会回传新状态;消费方如需精确状态可 query
          emitter.emit('collapse', { sheet, nodeId, isCollapsed: true });
          break;
        }

        case 'edit.start':
          emitter.emit('editStart', {
            sheet,
            row: (payload.row as number | undefined) ?? 0,
            col: (payload.col as number | undefined) ?? 0,
          });
          break;

        case 'edit.commit':
          emitter.emit('editEnd', {
            sheet,
            row: (payload.row as number | undefined) ?? 0,
            col: (payload.col as number | undefined) ?? 0,
            value: payload.value,
          });
          break;

        case 'edit.cancel':
          emitter.emit('editCancel', {
            sheet,
            row: (payload.row as number | undefined) ?? 0,
            col: (payload.col as number | undefined) ?? 0,
          });
          break;

        case 'edit.copy':
          emitter.emit('copied', {
            sheet,
            range: payload.range as { startRow: number; endRow: number; startCol: number; endCol: number },
          });
          break;

        case 'edit.paste':
          emitter.emit('pasted', {
            sheet,
            row: (payload.row as number | undefined) ?? 0,
            col: (payload.col as number | undefined) ?? 0,
          });
          break;
      }
    }
  }

  return {
    apply(operations: Operation[]) {
      engine.apply(operations);
    },
    undo() {
      return engine.undo();
    },
    redo() {
      return engine.redo();
    },
    canUndo() {
      return engine.canUndo();
    },
    canRedo() {
      return engine.canRedo();
    },
    query: queryLayer,
    on<K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void) {
      return emitter.on(event, handler);
    },
    registerDataSource(id: string, data: unknown[], opts?: DataSourceOptions) {
      const stored = opts?.copy ? structuredClone(data) : Object.freeze(data);
      model.dataSources.set(id, stored as unknown[]);
      const op: Operation = { type: '__dataSourceUpdated', payload: { dataSourceId: id } };
      moduleRegistry.notifyOperationApplied([op], model);
      queryLayer.invalidateAll();
      emitter.emit('operationApplied', [op]);
    },
    toJSON() {
      const state = structuredClone(model.state) as unknown as Record<string, unknown>;
      const moduleState = moduleRegistry.serializeAll();
      if (Object.keys(moduleState).length > 0) {
        state.__moduleState = moduleState;
      }
      return state as unknown as WorkbookState;
    },
    exportCSV(sheet = 0) {
      return exportDelimited(model, queryLayer, sheet, ',');
    },
    exportTSV(sheet = 0) {
      return exportDelimited(model, queryLayer, sheet, '\t');
    },
    importCSV(csv: string, sheet = 0) {
      const rows = parseCSV(csv);
      const ops: Operation[] = [];
      const sheetState = model.getSheet(sheet);
      if (sheetState) {
        for (const [row, rowData] of sheetState.cells) {
          for (const [col] of rowData) {
            ops.push({ type: 'deleteCellValue', payload: { sheet, row, col } });
          }
        }
      }
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[r]!.length; c++) {
          const raw = rows[r]![c]!;
          const num = Number(raw);
          const value = raw === '' ? null : isNaN(num) ? raw : num;
          if (value !== null) {
            ops.push({ type: 'setCellValue', payload: { sheet, row: r, col: c, value } });
          }
        }
      }
      if (ops.length > 0) engine.apply(ops);
    },
    getSelection() {
      return currentSelection;
    },
    getModuleRenderers() {
      return moduleRegistry.getRenderers();
    },
    __getModel() {
      return model;
    },
    ...(hasAgent() ? { agent: buildAgentAPI() } : {}),
  };

  function hasAgent(): boolean {
    return !!(options?.modules?.some((m) => m.name === 'agent'));
  }

  function buildAgentAPI(): AgentAPI {
    return {
      getContext(sheet?: number) {
        return queryLayer.moduleQuery('agent.getContext', sheet !== undefined ? { sheet } : {}) as AgentContext;
      },
      getMCPTools() {
        return queryLayer.moduleQuery('agent.getMCPTools', {}) as MCPToolSchema[];
      },
      callTool(name: string, params: Record<string, unknown>) {
        const sizeBefore = engine.getUndoStackSize();
        engine.apply([{ type: name, payload: params, source: 'agent' }]);
        return { success: true, undoable: engine.getUndoStackSize() > sizeBefore };
      },
      traceFormula(params: { sheet: number; row: number; col: number }) {
        try {
          return queryLayer.moduleQuery('agent.traceFormula', params) as FormulaTrace | null;
        } catch { return null; }
      },
      getAuditLog(limit?: number) {
        return queryLayer.moduleQuery('agent.getAuditLog', { limit }) as AuditEntry[];
      },
    };
  }
}

function exportDelimited(model: WorkbookModel, query: QueryLayer, sheetIndex: number, delimiter: string): string {
  const sheet = model.getSheet(sheetIndex);
  if (!sheet) return '';

  let maxRow = 0;
  let maxCol = 0;
  for (const [row, rowData] of sheet.cells) {
    if (row > maxRow) maxRow = row;
    for (const [col] of rowData) {
      if (col > maxCol) maxCol = col;
    }
  }

  const lines: string[] = [];
  for (let r = 0; r <= maxRow; r++) {
    const cells: string[] = [];
    for (let c = 0; c <= maxCol; c++) {
      const value = query.getCellDisplayValue({ sheet: sheetIndex, row: r, col: c });
      if (value === null) {
        cells.push('');
      } else {
        let text = String(value);
        if (text.includes(delimiter) || text.includes('"') || text.includes('\n')) {
          text = '"' + text.replace(/"/g, '""') + '"';
        }
        cells.push(text);
      }
    }
    lines.push(cells.join(delimiter));
  }
  return lines.join('\n');
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const len = csv.length;

  while (i < len) {
    const row: string[] = [];
    while (i < len) {
      if (csv[i] === '"') {
        i++;
        let val = '';
        while (i < len) {
          if (csv[i] === '"') {
            if (i + 1 < len && csv[i + 1] === '"') {
              val += '"';
              i += 2;
            } else {
              i++;
              break;
            }
          } else {
            val += csv[i]!;
            i++;
          }
        }
        row.push(val);
      } else {
        let val = '';
        while (i < len && csv[i] !== ',' && csv[i] !== '\n' && csv[i] !== '\r') {
          val += csv[i]!;
          i++;
        }
        row.push(val);
      }
      if (i < len && csv[i] === ',') { i++; continue; }
      break;
    }
    rows.push(row);
    if (i < len && csv[i] === '\r') i++;
    if (i < len && csv[i] === '\n') i++;
  }
  return rows;
}

function registerCoreOperations(registry: OperationRegistry): void {
  registry.register('setCellValue', setCellValue);
  registry.register('deleteCellValue', deleteCellValue);
  registry.register('restoreCell', restoreCell);
  registry.register('createSheet', createSheet);
  registry.register('deleteSheet', deleteSheet);
  registry.register('renameSheet', renameSheet);
  registry.register('insertRows', insertRows);
  registry.register('deleteRows', deleteRows);
  registry.register('insertColumns', insertColumns);
  registry.register('deleteColumns', deleteColumns);
  registry.register('setRowHeight', setRowHeight);
  registry.register('setColumnWidth', setColumnWidth);
  registry.register('mergeCells', mergeCells);
  registry.register('unmergeCells', unmergeCells);
  registry.register('hideRows', hideRows);
  registry.register('showRows', showRows);
  registry.register('hideColumns', hideColumns);
  registry.register('showColumns', showColumns);
  registry.register('setCellStyle', setCellStyle);
  registry.register('setSelection', setSelection);
}
