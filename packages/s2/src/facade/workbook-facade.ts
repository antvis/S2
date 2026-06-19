import type { Workbook } from '../workbook';
import { parseRange, parseCellAddress } from './parse-range';

export class CellFacade {
  private readonly wb: Workbook;
  private readonly sheet: number;
  private readonly row: number;
  private readonly col: number;

  constructor(wb: Workbook, sheet: number, row: number, col: number) {
    this.wb = wb;
    this.sheet = sheet;
    this.row = row;
    this.col = col;
  }

  setValue(value: string | number | boolean | null): this {
    this.wb.apply([{ type: 'setCellValue', payload: { sheet: this.sheet, row: this.row, col: this.col, value } }]);
    return this;
  }

  setStyle(style: Record<string, unknown>): this {
    this.wb.apply([{ type: 'setCellStyle', payload: { sheet: this.sheet, row: this.row, col: this.col, style } }]);
    return this;
  }

  setFormula(formula: string): this {
    this.wb.apply([{ type: 'formula.setFormula', payload: { sheet: this.sheet, row: this.row, col: this.col, formula } }]);
    return this;
  }

  getValue(): unknown {
    return this.wb.query.getCellDisplayValue({ sheet: this.sheet, row: this.row, col: this.col });
  }

  clear(): this {
    this.wb.apply([{ type: 'deleteCellValue', payload: { sheet: this.sheet, row: this.row, col: this.col } }]);
    return this;
  }
}

export class RangeFacade {
  private readonly wb: Workbook;
  private readonly sheet: number;
  private readonly startRow: number;
  private readonly endRow: number;
  private readonly startCol: number;
  private readonly endCol: number;

  constructor(wb: Workbook, sheet: number, startRow: number, endRow: number, startCol: number, endCol: number) {
    this.wb = wb;
    this.sheet = sheet;
    this.startRow = startRow;
    this.endRow = endRow;
    this.startCol = startCol;
    this.endCol = endCol;
  }

  setStyle(style: Record<string, unknown>): this {
    const ops = [];
    for (let r = this.startRow; r <= this.endRow; r++) {
      for (let c = this.startCol; c <= this.endCol; c++) {
        ops.push({ type: 'setCellStyle', payload: { sheet: this.sheet, row: r, col: c, style } });
      }
    }
    if (ops.length > 0) this.wb.apply(ops);
    return this;
  }

  setValues(values: (string | number | boolean | null)[][]): this {
    const ops = [];
    for (let r = 0; r < values.length && this.startRow + r <= this.endRow; r++) {
      const row = values[r]!;
      for (let c = 0; c < row.length && this.startCol + c <= this.endCol; c++) {
        ops.push({ type: 'setCellValue', payload: { sheet: this.sheet, row: this.startRow + r, col: this.startCol + c, value: row[c] } });
      }
    }
    if (ops.length > 0) this.wb.apply(ops);
    return this;
  }

  clear(): this {
    const ops = [];
    for (let r = this.startRow; r <= this.endRow; r++) {
      for (let c = this.startCol; c <= this.endCol; c++) {
        ops.push({ type: 'deleteCellValue', payload: { sheet: this.sheet, row: r, col: c } });
      }
    }
    if (ops.length > 0) this.wb.apply(ops);
    return this;
  }

  getValues(): unknown[][] {
    return this.wb.query.queryRange({
      sheet: this.sheet,
      range: {
        startRow: this.startRow,
        endRow: this.endRow,
        startCol: this.startCol,
        endCol: this.endCol,
      },
    }) as unknown[][];
  }
}

export class SheetFacade {
  private readonly wb: Workbook;
  private readonly sheetIndex: number;

  constructor(wb: Workbook, sheetIndex: number) {
    this.wb = wb;
    this.sheetIndex = sheetIndex;
  }

  cell(row: number, col: number): CellFacade;
  cell(address: string): CellFacade;
  cell(rowOrAddr: number | string, col?: number): CellFacade {
    if (typeof rowOrAddr === 'string') {
      const { row, col } = parseCellAddress(rowOrAddr);
      return new CellFacade(this.wb, this.sheetIndex, row, col);
    }
    return new CellFacade(this.wb, this.sheetIndex, rowOrAddr, col!);
  }

  range(range: string): RangeFacade;
  range(startRow: number, startCol: number, endRow: number, endCol: number): RangeFacade;
  range(rangeOrStartRow: string | number, startCol?: number, endRow?: number, endCol?: number): RangeFacade {
    if (typeof rangeOrStartRow === 'string') {
      const r = parseRange(rangeOrStartRow);
      return new RangeFacade(this.wb, this.sheetIndex, r.startRow, r.endRow, r.startCol, r.endCol);
    }
    return new RangeFacade(this.wb, this.sheetIndex, rangeOrStartRow, endRow!, startCol!, endCol!);
  }

  rename(name: string): this {
    this.wb.apply([{ type: 'renameSheet', payload: { sheet: this.sheetIndex, name } }]);
    return this;
  }
}

export class WorkbookFacade {
  readonly workbook: Workbook;

  constructor(workbook: Workbook) {
    this.workbook = workbook;
  }

  sheet(index: number): SheetFacade {
    return new SheetFacade(this.workbook, index);
  }

  addSheet(name?: string): SheetFacade {
    this.workbook.apply([{ type: 'createSheet', payload: { name } }]);
    const count = this.workbook.__getModel().getSheetCount();
    return new SheetFacade(this.workbook, count - 1);
  }

  undo(): this {
    this.workbook.undo();
    return this;
  }

  redo(): this {
    this.workbook.redo();
    return this;
  }

  toJSON(): unknown {
    return this.workbook.toJSON();
  }

  destroy(): void {
    // placeholder for canvas cleanup if mounted
  }
}
