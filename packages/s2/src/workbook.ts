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
} from './operation/operations/dimension';
import { setCellStyle } from './operation/operations/style';
import { setSelection } from './operation/operations/selection';

export interface CreateWorkbookOptions {
  modules?: ModuleDefinition[];
  snapshot?: WorkbookState;
}

export interface DataSourceOptions {
  copy?: boolean;
}

type EventHandler = (ops: Operation[]) => void;

export interface Workbook {
  apply(operations: Operation[]): void;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  query: QueryLayer;
  on(event: 'operationApplied', handler: EventHandler): () => void;
  registerDataSource(id: string, data: unknown[], options?: DataSourceOptions): void;
  toJSON(): WorkbookState;
  exportCSV(sheet?: number): string;
  exportTSV(sheet?: number): string;
  getModuleRenderers(): readonly import('./module/types').CellRendererFn[];
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
  const listeners: EventHandler[] = [];

  // dataSources live on model so Modules can access them via execute(model, payload)

  const engine = new OperationEngine({
    model,
    registry: operationRegistry,
    onApplied(ops, _inverseOps) {
      // Check if any operation has needReCalc or affectLayout — if so, full invalidation
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
      for (const listener of listeners) {
        listener(ops);
      }
    },
  });

  registerCoreOperations(operationRegistry);

  if (options?.modules) {
    for (const mod of options.modules) {
      moduleRegistry.register(mod, operationRegistry, queryLayer);
    }
  }

  moduleRegistry.init();

  if (savedModuleState) {
    moduleRegistry.deserializeAll(savedModuleState);
  }

  return {
    apply(operations: Operation[]) {
      engine.apply(operations);
    },
    undo() {
      const result = engine.undo();
      if (result) {
        queryLayer.invalidateAll();
        for (const listener of listeners) {
          listener([{ type: '__undo', payload: {} }]);
        }
      }
      return result;
    },
    redo() {
      const result = engine.redo();
      if (result) {
        queryLayer.invalidateAll();
        for (const listener of listeners) {
          listener([{ type: '__redo', payload: {} }]);
        }
      }
      return result;
    },
    canUndo() {
      return engine.canUndo();
    },
    canRedo() {
      return engine.canRedo();
    },
    query: queryLayer,
    on(event: 'operationApplied', handler: EventHandler) {
      listeners.push(handler);
      return () => {
        const idx = listeners.indexOf(handler);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },
    registerDataSource(id: string, data: unknown[], opts?: DataSourceOptions) {
      const stored = opts?.copy ? structuredClone(data) : Object.freeze(data);
      model.dataSources.set(id, stored as unknown[]);
      moduleRegistry.notifyOperationApplied([
        { type: '__dataSourceUpdated', payload: { dataSourceId: id } },
      ]);
      queryLayer.invalidateAll();
      for (const listener of listeners) {
        listener([{ type: '__dataSourceUpdated', payload: { dataSourceId: id } }]);
      }
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
    getModuleRenderers() {
      return moduleRegistry.getRenderers();
    },
    __getModel() {
      return model;
    },
  };
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
  registry.register('setCellStyle', setCellStyle);
  registry.register('setSelection', setSelection);
}
