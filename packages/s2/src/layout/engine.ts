import type { WorkbookModel } from '../core/model';
import type { QueryLayer } from '../query/query';
import { PrefixSumArray } from './prefix-sum';
import type { CellBox, HeaderBox, LayoutPlan, Line, Viewport, VisibleRange } from './types';

const DEFAULT_ROW_HEIGHT = 28;
const DEFAULT_COL_WIDTH = 100;
const HEADER_WIDTH = 50;
const HEADER_HEIGHT = 28;

export class LayoutEngine {
  private readonly model: WorkbookModel;
  private rowSums: PrefixSumArray;
  private colSums: PrefixSumArray;
  private scrollX = 0;
  private scrollY = 0;

  constructor(model: WorkbookModel) {
    this.model = model;
    const sheet = model.getSheet(0);
    const rowCount = this.estimateRowCount();
    const colCount = this.estimateColCount();
    this.rowSums = new PrefixSumArray(rowCount, DEFAULT_ROW_HEIGHT);
    this.colSums = new PrefixSumArray(colCount, DEFAULT_COL_WIDTH);
    this.syncDimensions();
  }

  scroll(deltaX: number, deltaY: number): void {
    this.scrollX = Math.max(0, this.scrollX + deltaX);
    this.scrollY = Math.max(0, this.scrollY + deltaY);
  }

  setScroll(x: number, y: number): void {
    this.scrollX = Math.max(0, x);
    this.scrollY = Math.max(0, y);
  }

  getVisibleRange(viewWidth: number, viewHeight: number): VisibleRange {
    const startRow = this.rowSums.findIndexAtOffset(this.scrollY);
    const endRow = this.rowSums.findIndexAtOffset(this.scrollY + viewHeight);
    const startCol = this.colSums.findIndexAtOffset(this.scrollX);
    const endCol = this.colSums.findIndexAtOffset(this.scrollX + viewWidth);
    return { startRow, endRow, startCol, endCol };
  }

  computeLayoutPlan(viewWidth: number, viewHeight: number): LayoutPlan {
    this.syncDimensions();
    const contentWidth = viewWidth - HEADER_WIDTH;
    const contentHeight = viewHeight - HEADER_HEIGHT;
    const range = this.getVisibleRange(contentWidth, contentHeight);

    const cells: CellBox[] = [];
    const gridlines: Line[] = [];
    const rowHeaders: HeaderBox[] = [];
    const colHeaders: HeaderBox[] = [];

    // Cell boxes
    for (let row = range.startRow; row <= range.endRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT;
      const height = this.rowSums.getSize(row);
      for (let col = range.startCol; col <= range.endCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH;
        const width = this.colSums.getSize(col);
        cells.push({ row, col, x, y, width, height });
      }
    }

    // Horizontal gridlines
    for (let row = range.startRow; row <= range.endRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT;
      gridlines.push({ x1: HEADER_WIDTH, y1: y, x2: viewWidth, y2: y });
    }

    // Vertical gridlines
    for (let col = range.startCol; col <= range.endCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH;
      gridlines.push({ x1: x, y1: HEADER_HEIGHT, x2: x, y2: viewHeight });
    }

    // Row headers
    for (let row = range.startRow; row <= range.endRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT;
      const height = this.rowSums.getSize(row);
      rowHeaders.push({ index: row, x: 0, y, width: HEADER_WIDTH, height, label: String(row + 1) });
    }

    // Column headers
    for (let col = range.startCol; col <= range.endCol; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH;
      const width = this.colSums.getSize(col);
      colHeaders.push({ index: col, x, y: 0, width, height: HEADER_HEIGHT, label: toColumnLabel(col) });
    }

    return {
      cells,
      rowHeaders,
      colHeaders,
      gridlines,
      viewport: { scrollX: this.scrollX, scrollY: this.scrollY, viewWidth, viewHeight },
      totalWidth: this.colSums.getTotalSize() + HEADER_WIDTH,
      totalHeight: this.rowSums.getTotalSize() + HEADER_HEIGHT,
    };
  }

  private syncDimensions(): void {
    const sheet = this.model.getSheet(0);
    if (!sheet) return;
    const rowCount = this.estimateRowCount();
    const colCount = this.estimateColCount();
    this.rowSums.setCount(rowCount);
    this.colSums.setCount(colCount);
    for (const [row, state] of sheet.rows) {
      if (state.height !== undefined) {
        this.rowSums.setSize(row, state.height);
      }
    }
    for (const [col, state] of sheet.columns) {
      if (state.width !== undefined) {
        this.colSums.setSize(col, state.width);
      }
    }
  }

  private estimateRowCount(): number {
    const sheet = this.model.getSheet(0);
    if (!sheet) return 1000;
    let maxRow = 0;
    for (const [row] of sheet.cells) {
      if (row > maxRow) maxRow = row;
    }
    // Always have enough rows to fill viewport + buffer
    return Math.max(maxRow + 100, 1000);
  }

  private estimateColCount(): number {
    const sheet = this.model.getSheet(0);
    if (!sheet) return 26;
    let maxCol = 0;
    for (const [, rowData] of sheet.cells) {
      for (const [col] of rowData) {
        if (col > maxCol) maxCol = col;
      }
    }
    return Math.max(maxCol + 10, 52);
  }
}

function toColumnLabel(col: number): string {
  let label = '';
  let n = col;
  while (n >= 0) {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}
