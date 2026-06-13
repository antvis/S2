import type { CellState, ColumnState, MergeRange, RowState, SheetState, Sparse, WorkbookState } from './types';
import { createSparse, sparseGet, sparseSet, sparseDelete, sparseInsert, sparseRemove } from './sparse';

let sheetIdCounter = 0;

function generateSheetId(): string {
  return `sheet_${++sheetIdCounter}`;
}

export function createDefaultSheet(name: string): SheetState {
  return {
    id: generateSheetId(),
    name,
    cells: createSparse(),
    rows: createSparse(),
    columns: createSparse(),
    merges: [],
  };
}

export function createWorkbookState(): WorkbookState {
  return {
    sheets: [createDefaultSheet('Sheet1')],
    activeSheet: 0,
  };
}

export class WorkbookModel {
  public state: WorkbookState;
  public readonly dataSources = new Map<string, unknown[]>();

  constructor(state?: WorkbookState) {
    this.state = state ?? createWorkbookState();
  }

  getSheet(index: number): SheetState | undefined {
    return this.state.sheets[index];
  }

  getSheetCount(): number {
    return this.state.sheets.length;
  }

  addSheet(name?: string): number {
    const sheet = createDefaultSheet(name ?? `Sheet${this.state.sheets.length + 1}`);
    this.state.sheets.push(sheet);
    return this.state.sheets.length - 1;
  }

  removeSheet(index: number): SheetState | undefined {
    if (this.state.sheets.length <= 1) return undefined;
    const removed = this.state.sheets.splice(index, 1);
    if (this.state.activeSheet >= this.state.sheets.length) {
      this.state.activeSheet = this.state.sheets.length - 1;
    }
    return removed[0];
  }

  getCell(sheetIndex: number, row: number, col: number): CellState | undefined {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return undefined;
    const rowData = sparseGet(sheet.cells, row);
    if (!rowData) return undefined;
    return sparseGet(rowData, col);
  }

  setCell(sheetIndex: number, row: number, col: number, cell: CellState): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    let rowData = sparseGet(sheet.cells, row);
    if (!rowData) {
      rowData = createSparse();
      sparseSet(sheet.cells, row, rowData);
    }
    sparseSet(rowData, col, cell);
  }

  deleteCell(sheetIndex: number, row: number, col: number): CellState | undefined {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return undefined;
    const rowData = sparseGet(sheet.cells, row);
    if (!rowData) return undefined;
    const old = sparseGet(rowData, col);
    sparseDelete(rowData, col);
    return old;
  }

  getRow(sheetIndex: number, row: number): RowState | undefined {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return undefined;
    return sparseGet(sheet.rows, row);
  }

  setRow(sheetIndex: number, row: number, state: RowState): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    sparseSet(sheet.rows, row, state);
  }

  getColumn(sheetIndex: number, col: number): ColumnState | undefined {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return undefined;
    return sparseGet(sheet.columns, col);
  }

  setColumn(sheetIndex: number, col: number, state: ColumnState): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    sparseSet(sheet.columns, col, state);
  }

  insertRows(sheetIndex: number, index: number, count: number): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    sparseInsert(sheet.cells, index, count);
    sparseInsert(sheet.rows, index, count);
    for (const merge of sheet.merges) {
      if (merge.startRow >= index) {
        merge.startRow += count;
        merge.endRow += count;
      } else if (merge.endRow >= index) {
        merge.endRow += count;
      }
    }
  }

  deleteRows(sheetIndex: number, index: number, count: number): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    sparseRemove(sheet.cells, index, count);
    sparseRemove(sheet.rows, index, count);
    sheet.merges = sheet.merges.filter((m) => !(m.startRow >= index && m.endRow < index + count));
    for (const merge of sheet.merges) {
      if (merge.startRow >= index + count) {
        merge.startRow -= count;
        merge.endRow -= count;
      } else if (merge.endRow >= index + count) {
        merge.endRow -= count;
      }
    }
  }

  insertColumns(sheetIndex: number, index: number, count: number): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    for (const [, rowData] of sheet.cells) {
      sparseInsert(rowData, index, count);
    }
    sparseInsert(sheet.columns, index, count);
    for (const merge of sheet.merges) {
      if (merge.startCol >= index) {
        merge.startCol += count;
        merge.endCol += count;
      } else if (merge.endCol >= index) {
        merge.endCol += count;
      }
    }
  }

  deleteColumns(sheetIndex: number, index: number, count: number): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    for (const [, rowData] of sheet.cells) {
      sparseRemove(rowData, index, count);
    }
    sparseRemove(sheet.columns, index, count);
    sheet.merges = sheet.merges.filter((m) => !(m.startCol >= index && m.endCol < index + count));
    for (const merge of sheet.merges) {
      if (merge.startCol >= index + count) {
        merge.startCol -= count;
        merge.endCol -= count;
      } else if (merge.endCol >= index + count) {
        merge.endCol -= count;
      }
    }
  }

  addMerge(sheetIndex: number, merge: MergeRange): void {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return;
    sheet.merges.push(merge);
  }

  removeMerge(sheetIndex: number, startRow: number, startCol: number): MergeRange | undefined {
    const sheet = this.getSheet(sheetIndex);
    if (!sheet) return undefined;
    const idx = sheet.merges.findIndex((m) => m.startRow === startRow && m.startCol === startCol);
    if (idx === -1) return undefined;
    return sheet.merges.splice(idx, 1)[0];
  }
}
