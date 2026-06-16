import type { WorkbookModel } from '../../core/model';
import type { CellState, RowState, ColumnState, MergeRange } from '../../core/types';
import type { Operation, OperationDefinition } from '../types';
import { sparseGet } from '../../core/sparse';

interface RowSnapshot {
  cells: Map<number, CellState>;
  rowState?: RowState;
}

interface ColSnapshot {
  cells: Map<number, CellState>;
  colState?: ColumnState;
}

export const insertRows: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count, restoreData } = payload as {
      sheet: number; index: number; count: number;
      restoreData?: RowSnapshot[];
    };
    model.insertRows(sheet, index, count);

    if (restoreData) {
      const sheetState = model.getSheet(sheet);
      if (sheetState) {
        for (let i = 0; i < restoreData.length; i++) {
          const snap = restoreData[i]!;
          const row = index + i;
          if (snap.rowState) model.setRow(sheet, row, snap.rowState);
          for (const [col, cell] of snap.cells) {
            model.setCell(sheet, row, col, cell);
          }
        }
      }
    }

    return [{ type: 'deleteRows', payload: { sheet, index, count } }];
  },
};

export const deleteRows: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count } = payload as { sheet: number; index: number; count: number };
    const sheetState = model.getSheet(sheet);

    const restoreData: RowSnapshot[] = [];
    if (sheetState) {
      for (let r = index; r < index + count; r++) {
        const cells = new Map<number, CellState>();
        const rowData = sparseGet(sheetState.cells, r);
        if (rowData) {
          for (const [col, cell] of rowData) {
            cells.set(col, structuredClone(cell));
          }
        }
        const rowState = sparseGet(sheetState.rows, r);
        restoreData.push({ cells, rowState: rowState ? structuredClone(rowState) : undefined });
      }
    }

    model.deleteRows(sheet, index, count);
    return [{ type: 'insertRows', payload: { sheet, index, count, restoreData } }];
  },
};

export const insertColumns: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count, restoreData } = payload as {
      sheet: number; index: number; count: number;
      restoreData?: ColSnapshot[];
    };
    model.insertColumns(sheet, index, count);

    if (restoreData) {
      const sheetState = model.getSheet(sheet);
      if (sheetState) {
        for (let i = 0; i < restoreData.length; i++) {
          const snap = restoreData[i]!;
          const col = index + i;
          if (snap.colState) model.setColumn(sheet, col, snap.colState);
          for (const [row, cell] of snap.cells) {
            model.setCell(sheet, row, col, cell);
          }
        }
      }
    }

    return [{ type: 'deleteColumns', payload: { sheet, index, count } }];
  },
};

export const deleteColumns: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, index, count } = payload as { sheet: number; index: number; count: number };
    const sheetState = model.getSheet(sheet);

    const restoreData: ColSnapshot[] = [];
    if (sheetState) {
      for (let c = index; c < index + count; c++) {
        const cells = new Map<number, CellState>();
        for (const [row, rowData] of sheetState.cells) {
          const cell = sparseGet(rowData, c);
          if (cell) cells.set(row, structuredClone(cell));
        }
        const colState = sparseGet(sheetState.columns, c);
        restoreData.push({ cells, colState: colState ? structuredClone(colState) : undefined });
      }
    }

    model.deleteColumns(sheet, index, count);
    return [{ type: 'insertColumns', payload: { sheet, index, count, restoreData } }];
  },
};

export const setRowHeight: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, height } = payload as { sheet: number; row: number; height: number };
    const old = model.getRow(sheet, row);
    const oldHeight = old?.height ?? 28;
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

export const hideRows: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, rows } = payload as { sheet: number; rows: number[] };
    const oldHeights: { row: number; height: number }[] = [];
    for (const row of rows) {
      const old = model.getRow(sheet, row);
      oldHeights.push({ row, height: old?.height ?? 28 });
      model.setRow(sheet, row, { ...old, height: 0 });
    }
    return [{ type: 'showRows', payload: { sheet, rows: oldHeights } }];
  },
};

export const showRows: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, rows } = payload as { sheet: number; rows: { row: number; height: number }[] };
    const hideList: number[] = [];
    for (const { row, height } of rows) {
      hideList.push(row);
      const old = model.getRow(sheet, row);
      model.setRow(sheet, row, { ...old, height });
    }
    return [{ type: 'hideRows', payload: { sheet, rows: hideList } }];
  },
};

export const hideColumns: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, cols } = payload as { sheet: number; cols: number[] };
    const oldWidths: { col: number; width: number }[] = [];
    for (const col of cols) {
      const old = model.getColumn(sheet, col);
      oldWidths.push({ col, width: old?.width ?? 100 });
      model.setColumn(sheet, col, { ...old, width: 0 });
    }
    return [{ type: 'showColumns', payload: { sheet, cols: oldWidths } }];
  },
};

export const showColumns: OperationDefinition = {
  meta: { affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, cols } = payload as { sheet: number; cols: { col: number; width: number }[] };
    const hideList: number[] = [];
    for (const { col, width } of cols) {
      hideList.push(col);
      const old = model.getColumn(sheet, col);
      model.setColumn(sheet, col, { ...old, width });
    }
    return [{ type: 'hideColumns', payload: { sheet, cols: hideList } }];
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
