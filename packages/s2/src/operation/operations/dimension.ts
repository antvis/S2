import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const insertRows: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count } = payload as { sheet: number; index: number; count: number };
    model.insertRows(sheet, index, count);
    return [{ type: 'deleteRows', payload: { sheet, index, count } }];
  },
};

export const deleteRows: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count } = payload as { sheet: number; index: number; count: number };
    model.deleteRows(sheet, index, count);
    return [{ type: 'insertRows', payload: { sheet, index, count } }];
  },
};

export const insertColumns: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count } = payload as { sheet: number; index: number; count: number };
    model.insertColumns(sheet, index, count);
    return [{ type: 'deleteColumns', payload: { sheet, index, count } }];
  },
};

export const deleteColumns: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count } = payload as { sheet: number; index: number; count: number };
    model.deleteColumns(sheet, index, count);
    return [{ type: 'insertColumns', payload: { sheet, index, count } }];
  },
};

export const setRowHeight: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, height } = payload as { sheet: number; row: number; height: number };
    const old = model.getRow(sheet, row);
    const oldHeight = old?.height ?? 25;
    model.setRow(sheet, row, { ...old, height });
    return [{ type: 'setRowHeight', payload: { sheet, row, height: oldHeight } }];
  },
};

export const setColumnWidth: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, col, width } = payload as { sheet: number; col: number; width: number };
    const old = model.getColumn(sheet, col);
    const oldWidth = old?.width ?? 100;
    model.setColumn(sheet, col, { ...old, width });
    return [{ type: 'setColumnWidth', payload: { sheet, col, width: oldWidth } }];
  },
};

export const mergeCells: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, startRow, endRow, startCol, endCol } = payload as {
      sheet: number; startRow: number; endRow: number; startCol: number; endCol: number;
    };
    model.addMerge(sheet, { startRow, endRow, startCol, endCol });
    return [{ type: 'unmergeCells', payload: { sheet, startRow, startCol } }];
  },
};

export const unmergeCells: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, startRow, startCol } = payload as { sheet: number; startRow: number; startCol: number };
    const removed = model.removeMerge(sheet, startRow, startCol);
    if (!removed) return [];
    return [{ type: 'mergeCells', payload: { sheet, ...removed } }];
  },
};
