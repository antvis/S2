import type { WorkbookModel } from '../core/model';
import type { QueryLayer } from '../query/query';
import { PrefixSumArray } from './prefix-sum';
import {
  DETAIL_HEADER_WIDTH, DETAIL_HEADER_HEIGHT,
  PIVOT_LEVEL_WIDTH, PIVOT_LEVEL_HEIGHT,
  DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH,
} from './types';
import type { CellBox, FreezeConfig, HeaderBox, HierarchyLayout, HierarchyTreeNode, LayoutPlan, Line, Viewport, VisibleRange } from './types';

const HEADER_WIDTH = DETAIL_HEADER_WIDTH;
const HEADER_HEIGHT = DETAIL_HEADER_HEIGHT;

export class LayoutEngine {
  private readonly model: WorkbookModel;
  private readonly queryLayer: QueryLayer | null;
  private rowSums: PrefixSumArray;
  private colSums: PrefixSumArray;
  private scrollX = 0;
  private scrollY = 0;
  private temporaryRowHeights = new Map<number, number>();
  private temporaryColWidths = new Map<number, number>();

  constructor(model: WorkbookModel, queryLayer?: QueryLayer) {
    this.model = model;
    this.queryLayer = queryLayer ?? null;
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

  ensureCellVisible(modelRow: number, col: number, viewWidth: number, viewHeight: number): boolean {
    const visualRow = this.modelToVisualRow(modelRow);
    const cellY = this.rowSums.getOffset(visualRow);
    const cellH = this.rowSums.getSize(visualRow);
    const cellX = this.colSums.getOffset(col);
    const cellW = this.colSums.getSize(col);
    const contentTop = HEADER_HEIGHT;
    const contentLeft = HEADER_WIDTH;
    let changed = false;
    if (cellY < this.scrollY) {
      this.scrollY = cellY;
      changed = true;
    } else if (cellY + cellH > this.scrollY + viewHeight - contentTop) {
      this.scrollY = cellY + cellH - (viewHeight - contentTop);
      changed = true;
    }
    if (cellX < this.scrollX) {
      this.scrollX = cellX;
      changed = true;
    } else if (cellX + cellW > this.scrollX + viewWidth - contentLeft) {
      this.scrollX = cellX + cellW - (viewWidth - contentLeft);
      changed = true;
    }
    return changed;
  }

  setTemporaryRowHeight(row: number, height: number): void {
    this.temporaryRowHeights.set(row, height);
  }

  setTemporaryColWidth(col: number, width: number): void {
    this.temporaryColWidths.set(col, width);
  }

  clearTemporary(): void {
    this.temporaryRowHeights.clear();
    this.temporaryColWidths.clear();
  }

  getVisibleRange(viewWidth: number, viewHeight: number): VisibleRange {
    const startRow = this.rowSums.findIndexAtOffset(this.scrollY);
    const endRow = this.rowSums.findIndexAtOffset(this.scrollY + viewHeight);
    const startCol = this.colSums.findIndexAtOffset(this.scrollX);
    const endCol = this.colSums.findIndexAtOffset(this.scrollX + viewWidth);
    return { startRow, endRow, startCol, endCol };
  }

  modelToVisualRow(modelRow: number): number {
    const order = this.getRowOrder();
    if (!order || modelRow === 0) return modelRow;
    const idx = order.indexOf(modelRow);
    if (idx >= 0) return idx + 1;
    return modelRow;
  }

  visualToModelRow(visualRow: number): number {
    const order = this.getRowOrder();
    if (!order || visualRow === 0) return visualRow;
    const sortedIdx = visualRow - 1;
    if (sortedIdx >= 0 && sortedIdx < order.length) return order[sortedIdx]!;
    return visualRow;
  }

  computeLayoutPlan(viewWidth: number, viewHeight: number, freeze?: FreezeConfig | null): LayoutPlan {
    this.syncDimensions();

    const pivotLayout = this.getHierarchyLayout();

    if (pivotLayout) {
      return this.computeHierarchyLayoutPlan(viewWidth, viewHeight, pivotLayout, freeze);
    }

    return this.computeDetailLayoutPlan(viewWidth, viewHeight, freeze);
  }

  private getRowOrder(): number[] | null {
    if (!this.queryLayer) return null;
    try {
      return this.queryLayer.moduleQuery('sort.getRowOrder', { sheet: 0 }) as number[] | null;
    } catch {
      return null;
    }
  }

  private getHierarchyLayout(): HierarchyLayout | null {
    if (!this.queryLayer) return null;
    try {
      return this.queryLayer.moduleQuery('pivot.getLayout', { sheet: 0 }) as HierarchyLayout | null;
    } catch {
      return null;
    }
  }

  private getHiddenRows(): Set<number> | null {
    if (!this.queryLayer) return null;
    try {
      return this.queryLayer.moduleQuery('filter.getHiddenRows', { sheet: 0 }) as Set<number> | null;
    } catch {
      return null;
    }
  }

  // ─── Pivot table layout ───────────────────────────────────────────────

  private computeHierarchyLayoutPlan(
    viewWidth: number, viewHeight: number, pivot: HierarchyLayout, freeze?: FreezeConfig | null,
  ): LayoutPlan {
    const rowDepth = pivot.rowFields.length;
    const colDepth = pivot.colFields.length;
    const hasValues = pivot.valueFields.length > 0;

    const rowHeaderWidth = rowDepth * PIVOT_LEVEL_WIDTH;
    // colFields levels + 1 value field label row (if values exist)
    const colHeaderLevels = colDepth + (hasValues ? 1 : 0);
    const colHeaderHeight = colHeaderLevels * PIVOT_LEVEL_HEIGHT;

    // Build row headers
    const pivotRowHeaders: HeaderBox[][] = [];
    for (let l = 0; l < rowDepth; l++) {
      pivotRowHeaders.push([]);
    }
    let rowLeafIndex = 0;
    this.flattenRowTree(pivot.rowTree, 0, rowDepth, pivotRowHeaders, rowHeaderWidth, colHeaderHeight, () => rowLeafIndex, (v) => { rowLeafIndex = v; });

    // Build col headers
    const pivotColHeaders: HeaderBox[][] = [];
    for (let l = 0; l < colDepth; l++) {
      pivotColHeaders.push([]);
    }
    let colLeafIndex = 0;
    this.flattenColTree(pivot.colTree, 0, colDepth, pivotColHeaders, rowHeaderWidth, pivot.valueFields.length, () => colLeafIndex, (v) => { colLeafIndex = v; });

    // Value field label row (bottom row of col headers)
    if (hasValues && colDepth > 0) {
      const valueRow: HeaderBox[] = [];
      const colLeafPaths = this.getColLeafCount(pivot.colTree);
      for (let ci = 0; ci < colLeafPaths; ci++) {
        for (let vi = 0; vi < pivot.valueFields.length; vi++) {
          const idx = ci * pivot.valueFields.length + vi;
          valueRow.push({
            index: idx,
            x: rowHeaderWidth + idx * DEFAULT_COL_WIDTH - this.scrollX,
            y: colDepth * PIVOT_LEVEL_HEIGHT,
            width: DEFAULT_COL_WIDTH,
            height: PIVOT_LEVEL_HEIGHT,
            label: pivot.valueFields[vi]!,
            level: colDepth,
            depth: colDepth + 1,
            span: 1,
          });
        }
      }
      pivotColHeaders.push(valueRow);
    } else if (hasValues && colDepth === 0) {
      // No column dimensions, but have value fields — each value field is a col header
      const valueRow: HeaderBox[] = [];
      for (let vi = 0; vi < pivot.valueFields.length; vi++) {
        valueRow.push({
          index: vi,
          x: rowHeaderWidth + vi * DEFAULT_COL_WIDTH - this.scrollX,
          y: 0,
          width: DEFAULT_COL_WIDTH,
          height: PIVOT_LEVEL_HEIGHT,
          label: pivot.valueFields[vi]!,
          level: 0,
          depth: 1,
          span: 1,
        });
      }
      pivotColHeaders.push(valueRow);
    }

    // Corner headers: row dimension names along bottom row, col dimension names along right column
    const cornerHeaders: HeaderBox[] = [];
    // Row field names — one per level, on the bottom row of the corner area
    for (let l = 0; l < rowDepth; l++) {
      cornerHeaders.push({
        index: l,
        x: l * PIVOT_LEVEL_WIDTH,
        y: colHeaderHeight - PIVOT_LEVEL_HEIGHT,
        width: PIVOT_LEVEL_WIDTH,
        height: PIVOT_LEVEL_HEIGHT,
        label: pivot.rowFields[l]!,
        level: l,
        depth: rowDepth,
      });
    }
    // Col field names — one per level, in the rightmost column of the corner area
    for (let l = 0; l < colDepth; l++) {
      cornerHeaders.push({
        index: rowDepth + l,
        x: (rowDepth - 1) * PIVOT_LEVEL_WIDTH,
        y: l * PIVOT_LEVEL_HEIGHT,
        width: PIVOT_LEVEL_WIDTH,
        height: PIVOT_LEVEL_HEIGHT,
        label: pivot.colFields[l]!,
        level: l,
        depth: colDepth,
      });
    }

    // Data cells — adjust prefix sums to pivot's leaf counts
    this.rowSums.setCount(Math.max(pivot.rowLeafCount, 1));
    this.colSums.setCount(Math.max(pivot.colLeafCount, 1));

    const cells: CellBox[] = [];
    const gridlines: Line[] = [];

    // Scrollable data area
    const dataAreaWidth = viewWidth - rowHeaderWidth;
    const dataAreaHeight = viewHeight - colHeaderHeight;

    const scrollStartRow = this.rowSums.findIndexAtOffset(this.scrollY);
    const scrollEndRow = Math.min(
      this.rowSums.findIndexAtOffset(this.scrollY + dataAreaHeight),
      pivot.rowLeafCount - 1,
    );
    const scrollStartCol = this.colSums.findIndexAtOffset(this.scrollX);
    const scrollEndCol = Math.min(
      this.colSums.findIndexAtOffset(this.scrollX + dataAreaWidth),
      pivot.colLeafCount - 1,
    );

    for (let row = scrollStartRow; row <= scrollEndRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      const height = this.rowSums.getSize(row);
      for (let col = scrollStartCol; col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX + rowHeaderWidth;
        const width = this.colSums.getSize(col);
        cells.push({ row, col, x, y, width, height });
      }
    }

    // Gridlines for data area
    for (let row = scrollStartRow; row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      gridlines.push({ x1: rowHeaderWidth, y1: y, x2: viewWidth, y2: y });
    }
    for (let col = scrollStartCol; col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + rowHeaderWidth;
      gridlines.push({ x1: x, y1: colHeaderHeight, x2: x, y2: viewHeight });
    }

    // Filter headers to visible viewport
    const visibleRowHeaders = pivotRowHeaders.map((level) =>
      level.filter((h) => h.y + h.height > colHeaderHeight && h.y < viewHeight)
    );
    const visibleColHeaders = pivotColHeaders.map((level) =>
      level.filter((h) => h.x + h.width > rowHeaderWidth && h.x < viewWidth)
    );

    return {
      cells,
      frozenCells: [],
      rowHeaders: [],
      colHeaders: [],
      gridlines,
      frozenGridlines: [],
      viewport: { scrollX: this.scrollX, scrollY: this.scrollY, viewWidth, viewHeight },
      totalWidth: this.colSums.getTotalSize() + rowHeaderWidth,
      totalHeight: this.rowSums.getTotalSize() + colHeaderHeight,
      freeze: freeze ?? null,
      frozenRowHeight: 0,
      frozenColWidth: 0,
      headerArea: { left: rowHeaderWidth, top: colHeaderHeight },
      hierarchyRowHeaders: visibleRowHeaders,
      hierarchyColHeaders: visibleColHeaders,
      cornerHeaders,
    };
  }

  private flattenRowTree(
    nodes: HierarchyTreeNode[], level: number, depth: number,
    result: HeaderBox[][], rowHeaderWidth: number, colHeaderHeight: number,
    getLeafIndex: () => number, setLeafIndex: (v: number) => void,
  ): void {
    for (const node of nodes) {
      const startLeaf = getLeafIndex();
      if (node.children.length > 0) {
        this.flattenRowTree(node.children, level + 1, depth, result, rowHeaderWidth, colHeaderHeight, getLeafIndex, setLeafIndex);
      } else {
        setLeafIndex(startLeaf + 1);
      }
      const endLeaf = getLeafIndex();
      const span = endLeaf - startLeaf;
      const y = colHeaderHeight + startLeaf * DEFAULT_ROW_HEIGHT - this.scrollY;
      const height = span * DEFAULT_ROW_HEIGHT;
      result[level]!.push({
        index: startLeaf,
        x: level * PIVOT_LEVEL_WIDTH,
        y,
        width: PIVOT_LEVEL_WIDTH,
        height,
        label: node.value,
        span,
        level,
        depth,
      });
    }
  }

  private flattenColTree(
    nodes: HierarchyTreeNode[], level: number, depth: number,
    result: HeaderBox[][], rowHeaderWidth: number, valueFieldCount: number,
    getLeafIndex: () => number, setLeafIndex: (v: number) => void,
  ): void {
    const valuesPerLeaf = Math.max(valueFieldCount, 1);
    for (const node of nodes) {
      const startLeaf = getLeafIndex();
      if (node.children.length > 0) {
        this.flattenColTree(node.children, level + 1, depth, result, rowHeaderWidth, valueFieldCount, getLeafIndex, setLeafIndex);
      } else {
        setLeafIndex(startLeaf + 1);
      }
      const endLeaf = getLeafIndex();
      const leafSpan = endLeaf - startLeaf;
      const colSpan = leafSpan * valuesPerLeaf;
      const x = rowHeaderWidth + startLeaf * valuesPerLeaf * DEFAULT_COL_WIDTH - this.scrollX;
      const width = colSpan * DEFAULT_COL_WIDTH;
      result[level]!.push({
        index: startLeaf,
        x,
        y: level * PIVOT_LEVEL_HEIGHT,
        width,
        height: PIVOT_LEVEL_HEIGHT,
        label: node.value,
        span: colSpan,
        level,
        depth,
      });
    }
  }

  private getColLeafCount(nodes: HierarchyTreeNode[]): number {
    let count = 0;
    for (const node of nodes) {
      if (node.children.length === 0) {
        count++;
      } else {
        count += this.getColLeafCount(node.children);
      }
    }
    return count;
  }

  // ─── Detail table layout (unchanged) ──────────────────────────────────

  private computeDetailLayoutPlan(viewWidth: number, viewHeight: number, freeze?: FreezeConfig | null): LayoutPlan {
    const rowOrder = this.getRowOrder();
    const hiddenDataRows = this.getHiddenRows();
    const mapRow = (visualRow: number): number => {
      if (!rowOrder) return visualRow;
      if (visualRow === 0) return 0;
      const sortedIdx = visualRow - 1;
      if (sortedIdx >= 0 && sortedIdx < rowOrder.length) return rowOrder[sortedIdx]!;
      return visualRow;
    };
    const isRowHidden = (visualRow: number): boolean => {
      if (this.rowSums.getSize(visualRow) === 0) return true;
      if (!hiddenDataRows) return false;
      return hiddenDataRows.has(mapRow(visualRow));
    };

    // Apply filter to PrefixSumArray so hidden rows don't consume layout space
    if (hiddenDataRows && hiddenDataRows.size > 0) {
      const rowCount = this.rowSums.getCount();
      for (let vr = 0; vr < rowCount; vr++) {
        if (isRowHidden(vr)) {
          this.rowSums.setSize(vr, 0);
        }
      }
    }

    const frozenRows = freeze?.frozenRows ?? 0;
    const frozenCols = freeze?.frozenCols ?? 0;
    const frozenRowHeight = frozenRows > 0 ? this.rowSums.getOffset(frozenRows) : 0;
    const frozenColWidth = frozenCols > 0 ? this.colSums.getOffset(frozenCols) : 0;

    const contentWidth = viewWidth - HEADER_WIDTH - frozenColWidth;
    const contentHeight = viewHeight - HEADER_HEIGHT - frozenRowHeight;

    // Scrollable visible range starts after frozen area
    const scrollStartRow = frozenRows > 0
      ? this.rowSums.findIndexAtOffset(this.scrollY + frozenRowHeight)
      : this.rowSums.findIndexAtOffset(this.scrollY);
    const scrollEndRow = this.rowSums.findIndexAtOffset(this.scrollY + frozenRowHeight + contentHeight);
    const scrollStartCol = frozenCols > 0
      ? this.colSums.findIndexAtOffset(this.scrollX + frozenColWidth)
      : this.colSums.findIndexAtOffset(this.scrollX);
    const scrollEndCol = this.colSums.findIndexAtOffset(this.scrollX + frozenColWidth + contentWidth);

    const cells: CellBox[] = [];
    const frozenCells: CellBox[] = [];
    const gridlines: Line[] = [];
    const frozenGridlines: Line[] = [];
    const rowHeaders: HeaderBox[] = [];
    const colHeaders: HeaderBox[] = [];

    // --- Frozen rows × frozen cols (top-left corner, never scrolls) ---
    for (let row = 0; row < frozenRows; row++) {
      const y = this.rowSums.getOffset(row) + HEADER_HEIGHT;
      const height = this.rowSums.getSize(row);
      for (let col = 0; col < frozenCols; col++) {
        const x = this.colSums.getOffset(col) + HEADER_WIDTH;
        const width = this.colSums.getSize(col);
        frozenCells.push({ row: mapRow(row), col, x, y, width, height });
      }
    }

    // --- Frozen rows × scrollable cols (top strip, scrolls horizontally) ---
    for (let row = 0; row < frozenRows; row++) {
      const y = this.rowSums.getOffset(row) + HEADER_HEIGHT;
      const height = this.rowSums.getSize(row);
      for (let col = Math.max(scrollStartCol, frozenCols); col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH + frozenColWidth;
        const width = this.colSums.getSize(col);
        frozenCells.push({ row: mapRow(row), col, x, y, width, height });
      }
    }

    // --- Scrollable rows × frozen cols (left strip, scrolls vertically) ---
    for (let row = Math.max(scrollStartRow, frozenRows); row <= scrollEndRow; row++) {
      if (isRowHidden(row)) continue;
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT + frozenRowHeight;
      const height = this.rowSums.getSize(row);
      for (let col = 0; col < frozenCols; col++) {
        const x = this.colSums.getOffset(col) + HEADER_WIDTH;
        const width = this.colSums.getSize(col);
        frozenCells.push({ row: mapRow(row), col, x, y, width, height });
      }
    }

    // --- Scrollable area ---
    for (let row = Math.max(scrollStartRow, frozenRows); row <= scrollEndRow; row++) {
      if (isRowHidden(row)) continue;
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT + frozenRowHeight;
      const height = this.rowSums.getSize(row);
      for (let col = Math.max(scrollStartCol, frozenCols); col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH + frozenColWidth;
        const width = this.colSums.getSize(col);
        cells.push({ row: mapRow(row), col, x, y, width, height });
      }
    }

    // --- Gridlines (scrollable area) ---
    for (let row = Math.max(scrollStartRow, frozenRows); row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT + frozenRowHeight;
      gridlines.push({ x1: HEADER_WIDTH + frozenColWidth, y1: y, x2: viewWidth, y2: y });
    }
    for (let col = Math.max(scrollStartCol, frozenCols); col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH + frozenColWidth;
      gridlines.push({ x1: x, y1: HEADER_HEIGHT + frozenRowHeight, x2: x, y2: viewHeight });
    }

    // --- Frozen gridlines ---
    if (frozenRows > 0) {
      for (let row = 0; row <= frozenRows; row++) {
        const y = this.rowSums.getOffset(row) + HEADER_HEIGHT;
        frozenGridlines.push({ x1: HEADER_WIDTH, y1: y, x2: viewWidth, y2: y });
      }
    }
    if (frozenCols > 0) {
      for (let col = 0; col <= frozenCols; col++) {
        const x = this.colSums.getOffset(col) + HEADER_WIDTH;
        frozenGridlines.push({ x1: x, y1: HEADER_HEIGHT, x2: x, y2: viewHeight });
      }
    }

    // --- Row headers ---
    for (let row = 0; row < frozenRows; row++) {
      const y = this.rowSums.getOffset(row) + HEADER_HEIGHT;
      const height = this.rowSums.getSize(row);
      rowHeaders.push({ index: row, x: 0, y, width: HEADER_WIDTH, height, label: String(row + 1) });
    }
    for (let row = Math.max(scrollStartRow, frozenRows); row <= scrollEndRow; row++) {
      if (isRowHidden(row)) continue;
      const y = this.rowSums.getOffset(row) - this.scrollY + HEADER_HEIGHT + frozenRowHeight;
      const height = this.rowSums.getSize(row);
      rowHeaders.push({ index: row, x: 0, y, width: HEADER_WIDTH, height, label: String(row + 1) });
    }

    // --- Column headers ---
    for (let col = 0; col < frozenCols; col++) {
      const x = this.colSums.getOffset(col) + HEADER_WIDTH;
      const width = this.colSums.getSize(col);
      colHeaders.push({ index: col, x, y: 0, width, height: HEADER_HEIGHT, label: toColumnLabel(col) });
    }
    for (let col = Math.max(scrollStartCol, frozenCols); col <= scrollEndCol; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + HEADER_WIDTH + frozenColWidth;
      const width = this.colSums.getSize(col);
      colHeaders.push({ index: col, x, y: 0, width, height: HEADER_HEIGHT, label: toColumnLabel(col) });
    }

    return {
      cells,
      frozenCells,
      rowHeaders,
      colHeaders,
      gridlines,
      frozenGridlines,
      viewport: { scrollX: this.scrollX, scrollY: this.scrollY, viewWidth, viewHeight },
      totalWidth: this.colSums.getTotalSize() + HEADER_WIDTH,
      totalHeight: this.rowSums.getTotalSize() + HEADER_HEIGHT,
      freeze: freeze ?? null,
      frozenRowHeight,
      frozenColWidth,
      headerArea: { left: HEADER_WIDTH, top: HEADER_HEIGHT },
      hierarchyRowHeaders: [],
      hierarchyColHeaders: [],
      cornerHeaders: [],
    };
  }

  private syncDimensions(): void {
    const sheet = this.model.getSheet(0);
    if (!sheet) return;
    const rowCount = this.estimateRowCount();
    const colCount = this.estimateColCount();
    this.rowSums = new PrefixSumArray(rowCount, DEFAULT_ROW_HEIGHT);
    this.colSums = new PrefixSumArray(colCount, DEFAULT_COL_WIDTH);
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

    for (const [row, height] of this.temporaryRowHeights) {
      this.rowSums.setSize(row, height);
    }
    for (const [col, width] of this.temporaryColWidths) {
      this.colSums.setSize(col, width);
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
