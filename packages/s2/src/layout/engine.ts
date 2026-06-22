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

  getScrollOffset(): { x: number; y: number } {
    return { x: this.scrollX, y: this.scrollY };
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

  computeLayoutPlan(viewWidth: number, viewHeight: number, freeze?: FreezeConfig | null, autoFit?: boolean): LayoutPlan {
    this.syncDimensions();

    const pivotLayout = this.getHierarchyLayout();

    if (pivotLayout) {
      return this.computeHierarchyLayoutPlan(viewWidth, viewHeight, pivotLayout, freeze, autoFit);
    }

    return this.computeDetailLayoutPlan(viewWidth, viewHeight, freeze);
  }

  private getRowOrder(): number[] | null {
    if (!this.queryLayer) return null;
    return (this.queryLayer.tryModuleQuery('sort.getRowOrder', { sheet: 0 }) ?? null) as number[] | null;
  }

  private getHierarchyLayout(): HierarchyLayout | null {
    if (!this.queryLayer) return null;
    return (this.queryLayer.tryModuleQuery('pivot.getLayout', { sheet: 0 })
      ?? this.queryLayer.tryModuleQuery('list.getLayout', { sheet: 0 })
      ?? null) as HierarchyLayout | null;
  }

  private getHiddenRows(): Set<number> | null {
    if (!this.queryLayer) return null;
    return (this.queryLayer.tryModuleQuery('filter.getHiddenRows', { sheet: 0 }) ?? null) as Set<number> | null;
  }

  // ─── Pivot table layout ───────────────────────────────────────────────

  private computeHierarchyLayoutPlan(
    viewWidth: number, viewHeight: number, pivot: HierarchyLayout, freeze?: FreezeConfig | null, autoFit?: boolean,
  ): LayoutPlan {
    if (pivot.hierarchyType === 'tree') {
      return this.computeTreeModeLayoutPlan(viewWidth, viewHeight, pivot, freeze, autoFit);
    }
    if (pivot.hierarchyType === 'grid-tree') {
      return this.computeGridTreeModeLayoutPlan(viewWidth, viewHeight, pivot, freeze, autoFit);
    }
    if (pivot.hierarchyType === 'list') {
      return this.computeListLayoutPlan(viewWidth, viewHeight, pivot, freeze, autoFit);
    }
    if (pivot.hierarchyType === 'list-transpose') {
      return this.computeListTransposeLayoutPlan(viewWidth, viewHeight, pivot, freeze, autoFit);
    }

    const rowDepth = pivot.rowFields.length;
    const colDepth = pivot.colFields.length;
    const hasValues = pivot.valueFields.length > 0;

    const rowHeaderWidth = rowDepth * PIVOT_LEVEL_WIDTH;
    const colHeaderLevels = colDepth + (hasValues ? 1 : 0);

    // Auto-fit: set counts then stretch columns/rows to fill the canvas
    this.rowSums.setCount(Math.max(pivot.rowLeafCount, 1));
    this.colSums.setCount(Math.max(pivot.colLeafCount, 1));

    const dataAreaWidth = viewWidth - rowHeaderWidth;

    let fitColWidth = DEFAULT_COL_WIDTH;
    let fitRowHeight = PIVOT_LEVEL_HEIGHT;

    if (autoFit) {
      // Column auto-fit — distribute remainder to last column
      if (pivot.colLeafCount > 0) {
        fitColWidth = Math.max(Math.floor(dataAreaWidth / pivot.colLeafCount), DEFAULT_COL_WIDTH);
        for (let c = 0; c < pivot.colLeafCount; c++) {
          this.colSums.setSize(c, fitColWidth);
        }
        const colRemainder = dataAreaWidth - fitColWidth * pivot.colLeafCount;
        if (colRemainder > 0) {
          this.colSums.setSize(pivot.colLeafCount - 1, fitColWidth + colRemainder);
        }
      }
    }

    const colHeaderHeight = colHeaderLevels * fitRowHeight;

    // Clamp scroll to content bounds before building any positioned elements
    const dataAreaHeight = viewHeight - colHeaderHeight;
    const maxScrollX = Math.max(0, this.colSums.getTotalSize() - dataAreaWidth);
    const maxScrollY = Math.max(0, this.rowSums.getTotalSize() - dataAreaHeight);
    this.scrollX = Math.min(this.scrollX, maxScrollX);
    this.scrollY = Math.min(this.scrollY, maxScrollY);

    // Build row headers
    const pivotRowHeaders: HeaderBox[][] = [];
    for (let l = 0; l < rowDepth; l++) {
      pivotRowHeaders.push([]);
    }
    let rowLeafIndex = 0;
    this.flattenRowTree(pivot.rowTree, 0, rowDepth, pivotRowHeaders, rowHeaderWidth, colHeaderHeight, () => rowLeafIndex, (v) => { rowLeafIndex = v; });

    // Build col headers — use colSums for positioning
    const pivotColHeaders: HeaderBox[][] = [];
    for (let l = 0; l < colDepth; l++) {
      pivotColHeaders.push([]);
    }
    let colLeafIndex = 0;
    this.flattenColTree(pivot.colTree, 0, colDepth, pivotColHeaders, rowHeaderWidth, pivot.valueFields.length, () => colLeafIndex, (v) => { colLeafIndex = v; }, fitRowHeight);

    // Value field label row (bottom row of col headers)
    if (hasValues && colDepth > 0) {
      const valueRow: HeaderBox[] = [];
      const colLeafPaths = this.getColLeafCount(pivot.colTree);
      for (let ci = 0; ci < colLeafPaths; ci++) {
        for (let vi = 0; vi < pivot.valueFields.length; vi++) {
          const idx = ci * pivot.valueFields.length + vi;
          valueRow.push({
            index: idx,
            x: rowHeaderWidth + this.colSums.getOffset(idx) - this.scrollX,
            y: colDepth * fitRowHeight,
            width: this.colSums.getSize(idx),
            height: fitRowHeight,
            label: pivot.valueFields[vi]!,
            level: colDepth,
            depth: colDepth + 1,
            span: 1,
          });
        }
      }
      pivotColHeaders.push(valueRow);
    } else if (hasValues && colDepth === 0) {
      const valueRow: HeaderBox[] = [];
      for (let vi = 0; vi < pivot.valueFields.length; vi++) {
        valueRow.push({
          index: vi,
          x: rowHeaderWidth + this.colSums.getOffset(vi) - this.scrollX,
          y: 0,
          width: this.colSums.getSize(vi),
          height: fitRowHeight,
          label: pivot.valueFields[vi]!,
          level: 0,
          depth: 1,
          span: 1,
        });
      }
      pivotColHeaders.push(valueRow);
    }

    // Corner headers
    const cornerHeaders: HeaderBox[] = [];
    for (let l = 0; l < rowDepth; l++) {
      cornerHeaders.push({
        index: l,
        x: l * PIVOT_LEVEL_WIDTH,
        y: colHeaderHeight - fitRowHeight,
        width: PIVOT_LEVEL_WIDTH,
        height: fitRowHeight,
        label: pivot.rowFields[l]!,
        level: l,
        depth: rowDepth,
      });
    }
    for (let l = 0; l < colDepth; l++) {
      cornerHeaders.push({
        index: rowDepth + l,
        x: (rowDepth - 1) * PIVOT_LEVEL_WIDTH,
        y: l * fitRowHeight,
        width: PIVOT_LEVEL_WIDTH,
        height: fitRowHeight,
        label: pivot.colFields[l]!,
        level: l,
        depth: colDepth,
      });
    }

    const cells: CellBox[] = [];
    const gridlines: Line[] = [];

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

    // Gridlines for data area — clamp to actual data bounds
    const dataRight = Math.min(
      this.colSums.getOffset(pivot.colLeafCount) - this.scrollX + rowHeaderWidth,
      viewWidth,
    );
    const dataBottom = Math.min(
      this.rowSums.getOffset(pivot.rowLeafCount) - this.scrollY + colHeaderHeight,
      viewHeight,
    );
    for (let row = scrollStartRow; row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      gridlines.push({ x1: rowHeaderWidth, y1: y, x2: dataRight, y2: y });
    }
    for (let col = scrollStartCol; col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + rowHeaderWidth;
      gridlines.push({ x1: x, y1: colHeaderHeight, x2: x, y2: dataBottom });
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
      dataBounds: { right: dataRight, bottom: dataBottom },
    };
  }

  // ─── List table layout ────────────────────────────────────────────────

  private computeListLayoutPlan(
    viewWidth: number, viewHeight: number,
    list: HierarchyLayout,
    freeze?: FreezeConfig | null, autoFit?: boolean,
  ): LayoutPlan {
    const colCount = list.colLeafCount;
    const rowCount = list.rowLeafCount;
    const hasMultiLevelHeaders = list.colTree.length > 0;
    const headerDepth = hasMultiLevelHeaders ? this.getColTreeDepth(list.colTree) : 1;
    const colHeaderHeight = headerDepth * DEFAULT_ROW_HEIGHT;

    this.rowSums.setCount(Math.max(rowCount, 1));
    this.colSums.setCount(Math.max(colCount, 1));

    if (autoFit && colCount > 0) {
      const fitColWidth = Math.max(Math.floor(viewWidth / colCount), DEFAULT_COL_WIDTH);
      for (let c = 0; c < colCount; c++) {
        this.colSums.setSize(c, fitColWidth);
      }
      const remainder = viewWidth - fitColWidth * colCount;
      if (remainder > 0) {
        this.colSums.setSize(colCount - 1, fitColWidth + remainder);
      }
    }

    const dataAreaHeight = viewHeight - colHeaderHeight;
    const maxScrollX = Math.max(0, this.colSums.getTotalSize() - viewWidth);
    const maxScrollY = Math.max(0, this.rowSums.getTotalSize() - dataAreaHeight);
    this.scrollX = Math.min(this.scrollX, maxScrollX);
    this.scrollY = Math.min(this.scrollY, maxScrollY);

    const scrollStartRow = this.rowSums.findIndexAtOffset(this.scrollY);
    const scrollEndRow = Math.min(
      this.rowSums.findIndexAtOffset(this.scrollY + dataAreaHeight),
      rowCount - 1,
    );
    const scrollStartCol = this.colSums.findIndexAtOffset(this.scrollX);
    const scrollEndCol = Math.min(
      this.colSums.findIndexAtOffset(this.scrollX + viewWidth),
      colCount - 1,
    );

    const cells: CellBox[] = [];
    for (let row = scrollStartRow; row <= scrollEndRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      const height = this.rowSums.getSize(row);
      for (let col = scrollStartCol; col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX;
        const width = this.colSums.getSize(col);
        cells.push({ row, col, x, y, width, height });
      }
    }

    const colHeaders: HeaderBox[] = [];
    let hierarchyColHeaders: HeaderBox[][] = [];

    if (hasMultiLevelHeaders) {
      for (let l = 0; l < headerDepth; l++) {
        hierarchyColHeaders.push([]);
      }
      let colLeafIndex = 0;
      this.flattenListColTree(list.colTree, 0, headerDepth, hierarchyColHeaders, 0, () => colLeafIndex, (v) => { colLeafIndex = v; }, DEFAULT_ROW_HEIGHT);
      hierarchyColHeaders = hierarchyColHeaders.map(level =>
        level.filter(h => h.x + h.width > 0 && h.x < viewWidth)
      );
    } else {
      for (let col = scrollStartCol; col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX;
        const width = this.colSums.getSize(col);
        colHeaders.push({
          index: col,
          x,
          y: 0,
          width,
          height: colHeaderHeight,
          label: list.valueFields[col] ?? '',
          level: 0,
          depth: 1,
          span: 1,
        });
      }
    }

    const gridlines: Line[] = [];
    const dataRight = Math.min(
      this.colSums.getOffset(colCount) - this.scrollX,
      viewWidth,
    );
    const dataBottom = Math.min(
      this.rowSums.getOffset(rowCount) - this.scrollY + colHeaderHeight,
      viewHeight,
    );

    for (let row = scrollStartRow; row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      if (y > dataBottom) break;
      gridlines.push({ x1: 0, y1: y, x2: dataRight, y2: y });
    }
    for (let col = scrollStartCol; col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX;
      if (x > dataRight) break;
      gridlines.push({ x1: x, y1: colHeaderHeight, x2: x, y2: dataBottom });
    }
    gridlines.push({ x1: 0, y1: colHeaderHeight, x2: dataRight, y2: colHeaderHeight });

    return {
      cells,
      frozenCells: [],
      rowHeaders: [],
      colHeaders: hasMultiLevelHeaders ? [] : colHeaders,
      gridlines,
      frozenGridlines: [],
      viewport: { scrollX: this.scrollX, scrollY: this.scrollY, viewWidth, viewHeight },
      totalWidth: this.colSums.getTotalSize(),
      totalHeight: this.rowSums.getTotalSize() + colHeaderHeight,
      freeze: freeze ?? null,
      frozenRowHeight: 0,
      frozenColWidth: 0,
      headerArea: { left: 0, top: colHeaderHeight },
      hierarchyRowHeaders: [],
      hierarchyColHeaders,
      cornerHeaders: [],
      dataBounds: { right: dataRight, bottom: dataBottom },
    };
  }

  // ─── List table transpose layout ─────────────────────────────────────

  private static readonly LIST_TRANSPOSE_ROW_HEADER_WIDTH = 120;

  private computeListTransposeLayoutPlan(
    viewWidth: number, viewHeight: number,
    list: HierarchyLayout,
    freeze?: FreezeConfig | null, autoFit?: boolean,
  ): LayoutPlan {
    const ROW_HEADER_WIDTH = LayoutEngine.LIST_TRANSPOSE_ROW_HEADER_WIDTH;
    const rowCount = list.rowLeafCount;   // = columns.length (fields)
    const colCount = list.colLeafCount;   // = data.length (records)
    const colHeaderHeight = 0;

    this.rowSums.setCount(Math.max(rowCount, 1));
    this.colSums.setCount(Math.max(colCount, 1));

    const dataAreaWidth = viewWidth - ROW_HEADER_WIDTH;

    if (autoFit && colCount > 0) {
      const fitColWidth = Math.max(Math.floor(dataAreaWidth / colCount), DEFAULT_COL_WIDTH);
      for (let c = 0; c < colCount; c++) {
        this.colSums.setSize(c, fitColWidth);
      }
      const remainder = dataAreaWidth - fitColWidth * colCount;
      if (remainder > 0) {
        this.colSums.setSize(colCount - 1, fitColWidth + remainder);
      }
    }

    const dataAreaHeight = viewHeight - colHeaderHeight;
    const maxScrollX = Math.max(0, this.colSums.getTotalSize() - dataAreaWidth);
    const maxScrollY = Math.max(0, this.rowSums.getTotalSize() - dataAreaHeight);
    this.scrollX = Math.min(this.scrollX, maxScrollX);
    this.scrollY = Math.min(this.scrollY, maxScrollY);

    const scrollStartRow = this.rowSums.findIndexAtOffset(this.scrollY);
    const scrollEndRow = Math.min(
      this.rowSums.findIndexAtOffset(this.scrollY + dataAreaHeight),
      rowCount - 1,
    );
    const scrollStartCol = this.colSums.findIndexAtOffset(this.scrollX);
    const scrollEndCol = Math.min(
      this.colSums.findIndexAtOffset(this.scrollX + dataAreaWidth),
      colCount - 1,
    );

    const cells: CellBox[] = [];
    for (let row = scrollStartRow; row <= scrollEndRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      const height = this.rowSums.getSize(row);
      for (let col = scrollStartCol; col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX + ROW_HEADER_WIDTH;
        const width = this.colSums.getSize(col);
        cells.push({ row, col, x, y, width, height });
      }
    }

    // Row headers: field names on the left
    const rowHeaders: HeaderBox[] = [];
    for (let row = scrollStartRow; row <= scrollEndRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      const height = this.rowSums.getSize(row);
      rowHeaders.push({
        index: row,
        x: 0,
        y,
        width: ROW_HEADER_WIDTH,
        height,
        label: list.rowFields[row] ?? '',
        level: 0,
        depth: 1,
        span: 1,
      });
    }

    const colHeaders: HeaderBox[] = [];

    const gridlines: Line[] = [];
    const dataRight = Math.min(
      this.colSums.getOffset(colCount) - this.scrollX + ROW_HEADER_WIDTH,
      viewWidth,
    );
    const dataBottom = Math.min(
      this.rowSums.getOffset(rowCount) - this.scrollY + colHeaderHeight,
      viewHeight,
    );

    for (let row = scrollStartRow; row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      if (y > dataBottom) break;
      gridlines.push({ x1: ROW_HEADER_WIDTH, y1: y, x2: dataRight, y2: y });
    }
    for (let col = scrollStartCol; col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + ROW_HEADER_WIDTH;
      if (x > dataRight) break;
      gridlines.push({ x1: x, y1: colHeaderHeight, x2: x, y2: dataBottom });
    }
    gridlines.push({ x1: ROW_HEADER_WIDTH, y1: colHeaderHeight, x2: dataRight, y2: colHeaderHeight });

    const cornerHeaders: HeaderBox[] = [];

    return {
      cells,
      frozenCells: [],
      rowHeaders: [],
      colHeaders,
      gridlines,
      frozenGridlines: [],
      viewport: { scrollX: this.scrollX, scrollY: this.scrollY, viewWidth, viewHeight },
      totalWidth: this.colSums.getTotalSize() + ROW_HEADER_WIDTH,
      totalHeight: this.rowSums.getTotalSize() + colHeaderHeight,
      freeze: freeze ?? null,
      frozenRowHeight: 0,
      frozenColWidth: 0,
      headerArea: { left: ROW_HEADER_WIDTH, top: colHeaderHeight },
      hierarchyRowHeaders: [rowHeaders],
      hierarchyColHeaders: [],
      cornerHeaders,
      dataBounds: { right: dataRight, bottom: dataBottom },
    };
  }

  // ─── Grid-tree mode layout ─────────────────────────────────────────

  private computeGridTreeModeLayoutPlan(
    viewWidth: number, viewHeight: number, pivot: HierarchyLayout, freeze?: FreezeConfig | null, autoFit?: boolean,
  ): LayoutPlan {
    const rowDepth = pivot.rowFields.length;
    const colDepth = pivot.colFields.length;
    const hasValues = pivot.valueFields.length > 0;
    const colHeaderLevels = colDepth + (hasValues ? 1 : 0);
    const fitRowHeight = PIVOT_LEVEL_HEIGHT;
    const colHeaderHeight = colHeaderLevels * fitRowHeight;

    this.rowSums.setCount(Math.max(pivot.rowLeafCount, 1));
    this.colSums.setCount(Math.max(pivot.colLeafCount, 1));

    // Phase 1: build row headers with full rowDepth to determine visible levels
    const fullRowHeaderWidth = rowDepth * PIVOT_LEVEL_WIDTH;
    const pivotRowHeaders: HeaderBox[][] = [];
    for (let l = 0; l < rowDepth; l++) {
      pivotRowHeaders.push([]);
    }
    let rowLeafIndex = 0;
    this.flattenRowTreeForGridTree(pivot.rowTree, 0, rowDepth, pivotRowHeaders, fullRowHeaderWidth, colHeaderHeight, () => rowLeafIndex, (v) => { rowLeafIndex = v; });

    // Phase 2: compute effective row header width based on visible levels
    const visibleRowDepth = pivotRowHeaders.filter(level => level.length > 0).length;
    const rowHeaderWidth = visibleRowDepth * PIVOT_LEVEL_WIDTH;

    // If collapsed levels shrunk the header, shift row header x coords to pack left
    if (visibleRowDepth < rowDepth) {
      let targetLevel = 0;
      for (let l = 0; l < rowDepth; l++) {
        for (const h of pivotRowHeaders[l]!) {
          h.x = targetLevel * PIVOT_LEVEL_WIDTH;
          // Collapsed nodes that span remaining levels: clamp width to effective header width
          if (h.isCollapsed && h.width > PIVOT_LEVEL_WIDTH) {
            h.width = rowHeaderWidth - targetLevel * PIVOT_LEVEL_WIDTH;
          }
        }
        if (pivotRowHeaders[l]!.length > 0) targetLevel++;
      }
    }

    // Phase 3: layout columns and data using effective rowHeaderWidth
    const dataAreaWidth = viewWidth - rowHeaderWidth;
    let fitColWidth = DEFAULT_COL_WIDTH;

    if (autoFit && pivot.colLeafCount > 0) {
      fitColWidth = Math.max(Math.floor(dataAreaWidth / pivot.colLeafCount), DEFAULT_COL_WIDTH);
      for (let c = 0; c < pivot.colLeafCount; c++) {
        this.colSums.setSize(c, fitColWidth);
      }
      const colRemainder = dataAreaWidth - fitColWidth * pivot.colLeafCount;
      if (colRemainder > 0) {
        this.colSums.setSize(pivot.colLeafCount - 1, fitColWidth + colRemainder);
      }
    }

    const dataAreaHeight = viewHeight - colHeaderHeight;
    const maxScrollX = Math.max(0, this.colSums.getTotalSize() - dataAreaWidth);
    const maxScrollY = Math.max(0, this.rowSums.getTotalSize() - dataAreaHeight);
    this.scrollX = Math.min(this.scrollX, maxScrollX);
    this.scrollY = Math.min(this.scrollY, maxScrollY);

    // Col headers
    const pivotColHeaders: HeaderBox[][] = [];
    for (let l = 0; l < colDepth; l++) {
      pivotColHeaders.push([]);
    }
    let colLeafIndex = 0;
    this.flattenColTree(pivot.colTree, 0, colDepth, pivotColHeaders, rowHeaderWidth, pivot.valueFields.length, () => colLeafIndex, (v) => { colLeafIndex = v; }, fitRowHeight);

    if (hasValues && colDepth > 0) {
      const valueRow: HeaderBox[] = [];
      const colLeafPaths = this.getColLeafCount(pivot.colTree);
      for (let ci = 0; ci < colLeafPaths; ci++) {
        for (let vi = 0; vi < pivot.valueFields.length; vi++) {
          const idx = ci * pivot.valueFields.length + vi;
          valueRow.push({
            index: idx,
            x: rowHeaderWidth + this.colSums.getOffset(idx) - this.scrollX,
            y: colDepth * fitRowHeight,
            width: this.colSums.getSize(idx),
            height: fitRowHeight,
            label: pivot.valueFields[vi]!,
            level: colDepth, depth: colDepth + 1, span: 1,
          });
        }
      }
      pivotColHeaders.push(valueRow);
    } else if (hasValues && colDepth === 0) {
      const valueRow: HeaderBox[] = [];
      for (let vi = 0; vi < pivot.valueFields.length; vi++) {
        valueRow.push({
          index: vi,
          x: rowHeaderWidth + this.colSums.getOffset(vi) - this.scrollX,
          y: 0,
          width: this.colSums.getSize(vi),
          height: fitRowHeight,
          label: pivot.valueFields[vi]!,
          level: 0, depth: 1, span: 1,
        });
      }
      pivotColHeaders.push(valueRow);
    }

    // Corner headers — only for visible row levels
    const cornerHeaders: HeaderBox[] = [];
    let cornerIdx = 0;
    for (let l = 0; l < rowDepth; l++) {
      if (pivotRowHeaders[l]!.length === 0) continue;
      cornerHeaders.push({
        index: cornerIdx,
        x: cornerIdx * PIVOT_LEVEL_WIDTH,
        y: colHeaderHeight - fitRowHeight,
        width: PIVOT_LEVEL_WIDTH,
        height: fitRowHeight,
        label: pivot.rowFields[l]!,
        level: cornerIdx,
        depth: visibleRowDepth,
      });
      cornerIdx++;
    }
    for (let l = 0; l < colDepth; l++) {
      cornerHeaders.push({
        index: cornerIdx + l,
        x: (visibleRowDepth - 1) * PIVOT_LEVEL_WIDTH,
        y: l * fitRowHeight,
        width: PIVOT_LEVEL_WIDTH,
        height: fitRowHeight,
        label: pivot.colFields[l]!,
        level: l,
        depth: colDepth,
      });
    }

    // Data cells
    const cells: CellBox[] = [];
    const gridlines: Line[] = [];

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

    const dataRight = Math.min(
      this.colSums.getOffset(pivot.colLeafCount) - this.scrollX + rowHeaderWidth,
      viewWidth,
    );
    const dataBottom = Math.min(
      this.rowSums.getOffset(pivot.rowLeafCount) - this.scrollY + colHeaderHeight,
      viewHeight,
    );
    for (let row = scrollStartRow; row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      gridlines.push({ x1: rowHeaderWidth, y1: y, x2: dataRight, y2: y });
    }
    for (let col = scrollStartCol; col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + rowHeaderWidth;
      gridlines.push({ x1: x, y1: colHeaderHeight, x2: x, y2: dataBottom });
    }

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
      dataBounds: { right: dataRight, bottom: dataBottom },
    };
  }

  private flattenRowTreeForGridTree(
    nodes: HierarchyTreeNode[], level: number, depth: number,
    result: HeaderBox[][], rowHeaderWidth: number, colHeaderHeight: number,
    getLeafIndex: () => number, setLeafIndex: (v: number) => void,
    parentId: string = '',
  ): void {
    for (const node of nodes) {
      const nodeId = node.nodeId ?? (parentId
        ? `${parentId}/${node.field ?? ''}:${node.value}`
        : `${node.field ?? ''}:${node.value}`);
      const startLeaf = getLeafIndex();
      const hasChildren = node.children.length > 0 || (node.isCollapsed ?? false);
      const isCollapsed = node.isCollapsed ?? false;

      if (isCollapsed || node.children.length === 0) {
        // Leaf or collapsed: occupy 1 row
        setLeafIndex(startLeaf + 1);
        const y = colHeaderHeight + this.rowSums.getOffset(startLeaf) - this.scrollY;
        const height = this.rowSums.getSize(startLeaf);
        // Collapsed node spans from its level column to the rightmost level column
        const width = isCollapsed && hasChildren
          ? rowHeaderWidth - level * PIVOT_LEVEL_WIDTH
          : PIVOT_LEVEL_WIDTH;
        result[level]!.push({
          index: startLeaf,
          x: level * PIVOT_LEVEL_WIDTH,
          y,
          width,
          height,
          label: node.value,
          span: 1,
          level,
          depth,
          nodeId,
          hasChildren,
          isCollapsed,
        });
      } else {
        // Expanded parent: recurse children first to compute span
        this.flattenRowTreeForGridTree(node.children, level + 1, depth, result, rowHeaderWidth, colHeaderHeight, getLeafIndex, setLeafIndex, nodeId);
        const endLeaf = getLeafIndex();
        const span = endLeaf - startLeaf;
        const y = colHeaderHeight + this.rowSums.getOffset(startLeaf) - this.scrollY;
        const height = this.rowSums.getOffset(endLeaf) - this.rowSums.getOffset(startLeaf);
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
          nodeId,
          hasChildren: true,
          isCollapsed: false,
        });
      }
    }
  }

  // ─── Tree mode layout ──────────────────────────────────────────────

  private static readonly TREE_COL_WIDTH = 200;
  private static readonly TREE_INDENT = 20;

  private computeTreeModeLayoutPlan(
    viewWidth: number, viewHeight: number, pivot: HierarchyLayout, freeze?: FreezeConfig | null, autoFit?: boolean,
  ): LayoutPlan {
    const TREE_COL_WIDTH = LayoutEngine.TREE_COL_WIDTH;
    const colDepth = pivot.colFields.length;
    const hasValues = pivot.valueFields.length > 0;
    const colHeaderLevels = colDepth + (hasValues ? 1 : 0);

    this.rowSums.setCount(Math.max(pivot.rowLeafCount, 1));
    this.colSums.setCount(Math.max(pivot.colLeafCount, 1));

    const dataAreaWidth = viewWidth - TREE_COL_WIDTH;
    let fitColWidth = DEFAULT_COL_WIDTH;
    let fitRowHeight = PIVOT_LEVEL_HEIGHT;

    if (autoFit) {
      if (pivot.colLeafCount > 0) {
        fitColWidth = Math.max(Math.floor(dataAreaWidth / pivot.colLeafCount), DEFAULT_COL_WIDTH);
        for (let c = 0; c < pivot.colLeafCount; c++) {
          this.colSums.setSize(c, fitColWidth);
        }
        const colRemainder = dataAreaWidth - fitColWidth * pivot.colLeafCount;
        if (colRemainder > 0) {
          this.colSums.setSize(pivot.colLeafCount - 1, fitColWidth + colRemainder);
        }
      }
    }

    const colHeaderHeight = colHeaderLevels * fitRowHeight;
    const dataAreaHeight = viewHeight - colHeaderHeight;
    const maxScrollX = Math.max(0, this.colSums.getTotalSize() - dataAreaWidth);
    const maxScrollY = Math.max(0, this.rowSums.getTotalSize() - dataAreaHeight);
    this.scrollX = Math.min(this.scrollX, maxScrollX);
    this.scrollY = Math.min(this.scrollY, maxScrollY);

    // Build tree row headers — single level, with nodeId/collapse info
    const treeRowHeaders: HeaderBox[] = [];
    let treeLeafIdx = 0;
    this.flattenTreeRowHeaders(
      pivot.rowTree, 0, '', treeRowHeaders,
      TREE_COL_WIDTH, colHeaderHeight,
      () => treeLeafIdx, (v) => { treeLeafIdx = v; },
    );

    // Col headers — reuse grid mode logic
    const pivotColHeaders: HeaderBox[][] = [];
    for (let l = 0; l < colDepth; l++) {
      pivotColHeaders.push([]);
    }
    let colLeafIndex = 0;
    this.flattenColTree(pivot.colTree, 0, colDepth, pivotColHeaders, TREE_COL_WIDTH, pivot.valueFields.length, () => colLeafIndex, (v) => { colLeafIndex = v; }, fitRowHeight);

    if (hasValues && colDepth > 0) {
      const valueRow: HeaderBox[] = [];
      const colLeafPaths = this.getColLeafCount(pivot.colTree);
      for (let ci = 0; ci < colLeafPaths; ci++) {
        for (let vi = 0; vi < pivot.valueFields.length; vi++) {
          const idx = ci * pivot.valueFields.length + vi;
          valueRow.push({
            index: idx,
            x: TREE_COL_WIDTH + this.colSums.getOffset(idx) - this.scrollX,
            y: colDepth * fitRowHeight,
            width: this.colSums.getSize(idx),
            height: fitRowHeight,
            label: pivot.valueFields[vi]!,
            level: colDepth, depth: colDepth + 1, span: 1,
          });
        }
      }
      pivotColHeaders.push(valueRow);
    } else if (hasValues && colDepth === 0) {
      const valueRow: HeaderBox[] = [];
      for (let vi = 0; vi < pivot.valueFields.length; vi++) {
        valueRow.push({
          index: vi,
          x: TREE_COL_WIDTH + this.colSums.getOffset(vi) - this.scrollX,
          y: 0,
          width: this.colSums.getSize(vi),
          height: fitRowHeight,
          label: pivot.valueFields[vi]!,
          level: 0, depth: 1, span: 1,
        });
      }
      pivotColHeaders.push(valueRow);
    }

    // Corner: colField labels on upper rows, rowFields combined on the bottom row
    const cornerHeaders: HeaderBox[] = [];
    for (let l = 0; l < colDepth; l++) {
      cornerHeaders.push({
        index: l,
        x: 0,
        y: l * fitRowHeight,
        width: TREE_COL_WIDTH,
        height: fitRowHeight,
        label: pivot.colFields[l]!,
        level: l,
        depth: colDepth,
      });
    }
    cornerHeaders.push({
      index: colDepth,
      x: 0,
      y: colHeaderHeight - fitRowHeight,
      width: TREE_COL_WIDTH,
      height: fitRowHeight,
      label: pivot.rowFields.join(' / '),
      level: 0, depth: 1,
    });

    // Data cells
    const cells: CellBox[] = [];
    const gridlines: Line[] = [];

    const scrollStartRow = this.rowSums.findIndexAtOffset(this.scrollY);
    const scrollEndRow = Math.min(this.rowSums.findIndexAtOffset(this.scrollY + dataAreaHeight), pivot.rowLeafCount - 1);
    const scrollStartCol = this.colSums.findIndexAtOffset(this.scrollX);
    const scrollEndCol = Math.min(this.colSums.findIndexAtOffset(this.scrollX + dataAreaWidth), pivot.colLeafCount - 1);

    for (let row = scrollStartRow; row <= scrollEndRow; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      const height = this.rowSums.getSize(row);
      for (let col = scrollStartCol; col <= scrollEndCol; col++) {
        const x = this.colSums.getOffset(col) - this.scrollX + TREE_COL_WIDTH;
        const width = this.colSums.getSize(col);
        cells.push({ row, col, x, y, width, height });
      }
    }

    const dataRight = Math.min(this.colSums.getOffset(pivot.colLeafCount) - this.scrollX + TREE_COL_WIDTH, viewWidth);
    const dataBottom = Math.min(this.rowSums.getOffset(pivot.rowLeafCount) - this.scrollY + colHeaderHeight, viewHeight);
    for (let row = scrollStartRow; row <= scrollEndRow + 1; row++) {
      const y = this.rowSums.getOffset(row) - this.scrollY + colHeaderHeight;
      gridlines.push({ x1: TREE_COL_WIDTH, y1: y, x2: dataRight, y2: y });
    }
    for (let col = scrollStartCol; col <= scrollEndCol + 1; col++) {
      const x = this.colSums.getOffset(col) - this.scrollX + TREE_COL_WIDTH;
      gridlines.push({ x1: x, y1: colHeaderHeight, x2: x, y2: dataBottom });
    }

    const visibleTreeHeaders = treeRowHeaders.filter((h) => h.y + h.height > colHeaderHeight && h.y < viewHeight);
    const visibleColHeaders = pivotColHeaders.map((level) => level.filter((h) => h.x + h.width > TREE_COL_WIDTH && h.x < viewWidth));

    return {
      cells,
      frozenCells: [],
      rowHeaders: [],
      colHeaders: [],
      gridlines,
      frozenGridlines: [],
      viewport: { scrollX: this.scrollX, scrollY: this.scrollY, viewWidth, viewHeight },
      totalWidth: this.colSums.getTotalSize() + TREE_COL_WIDTH,
      totalHeight: this.rowSums.getTotalSize() + colHeaderHeight,
      freeze: freeze ?? null,
      frozenRowHeight: 0,
      frozenColWidth: 0,
      headerArea: { left: TREE_COL_WIDTH, top: colHeaderHeight },
      hierarchyRowHeaders: [visibleTreeHeaders],
      hierarchyColHeaders: visibleColHeaders,
      cornerHeaders,
      dataBounds: { right: dataRight, bottom: dataBottom },
    };
  }

  private flattenTreeRowHeaders(
    nodes: HierarchyTreeNode[], depth: number, parentId: string,
    result: HeaderBox[],
    treeColWidth: number, colHeaderHeight: number,
    getLeafIndex: () => number, setLeafIndex: (v: number) => void,
  ): void {
    for (const node of nodes) {
      const nodeId = node.nodeId
        ?? (parentId
          ? `${parentId}/${node.field ?? ''}:${node.value}`
          : `${node.field ?? ''}:${node.value}`);
      const leafIdx = getLeafIndex();
      const y = colHeaderHeight + this.rowSums.getOffset(leafIdx) - this.scrollY;
      const height = this.rowSums.getSize(leafIdx);

      result.push({
        index: leafIdx,
        x: 0,
        y,
        width: treeColWidth,
        height,
        label: node.value,
        level: depth,
        depth: -1,
        span: 1,
        nodeId,
        hasChildren: node.children.length > 0 || (node.isCollapsed ?? false),
        isCollapsed: node.isCollapsed ?? false,
      });

      setLeafIndex(leafIdx + 1);

      if (!node.isCollapsed && node.children.length > 0) {
        this.flattenTreeRowHeaders(node.children, depth + 1, nodeId, result, treeColWidth, colHeaderHeight, getLeafIndex, setLeafIndex);
      }
    }
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
      const y = colHeaderHeight + this.rowSums.getOffset(startLeaf) - this.scrollY;
      const height = this.rowSums.getOffset(endLeaf) - this.rowSums.getOffset(startLeaf);
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
    levelHeight: number,
  ): void {
    const valuesPerLeaf = Math.max(valueFieldCount, 1);
    for (const node of nodes) {
      const startLeaf = getLeafIndex();
      if (node.children.length > 0) {
        this.flattenColTree(node.children, level + 1, depth, result, rowHeaderWidth, valueFieldCount, getLeafIndex, setLeafIndex, levelHeight);
      } else {
        setLeafIndex(startLeaf + 1);
      }
      const endLeaf = getLeafIndex();
      const leafSpan = endLeaf - startLeaf;
      const colSpan = leafSpan * valuesPerLeaf;
      const startColIdx = startLeaf * valuesPerLeaf;
      const endColIdx = startColIdx + colSpan;
      const x = rowHeaderWidth + this.colSums.getOffset(startColIdx) - this.scrollX;
      const width = this.colSums.getOffset(endColIdx) - this.colSums.getOffset(startColIdx);
      result[level]!.push({
        index: startLeaf,
        x,
        y: level * levelHeight,
        width,
        height: levelHeight,
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

  private getColTreeDepth(nodes: HierarchyTreeNode[]): number {
    let max = 1;
    for (const node of nodes) {
      if (node.children.length > 0) {
        max = Math.max(max, 1 + this.getColTreeDepth(node.children));
      }
    }
    return max;
  }

  private flattenListColTree(
    nodes: HierarchyTreeNode[], level: number, depth: number,
    result: HeaderBox[][], rowHeaderWidth: number,
    getLeafIndex: () => number, setLeafIndex: (v: number) => void,
    levelHeight: number,
  ): void {
    for (const node of nodes) {
      const startLeaf = getLeafIndex();
      if (node.children.length > 0) {
        this.flattenListColTree(node.children, level + 1, depth, result, rowHeaderWidth, getLeafIndex, setLeafIndex, levelHeight);
      } else {
        setLeafIndex(startLeaf + 1);
      }
      const endLeaf = getLeafIndex();
      const span = endLeaf - startLeaf;
      const x = rowHeaderWidth + this.colSums.getOffset(startLeaf) - this.scrollX;
      const endX = rowHeaderWidth + this.colSums.getOffset(endLeaf) - this.scrollX;
      const width = endX - x;
      const isLeaf = node.children.length === 0;
      const cellHeight = isLeaf ? (depth - level) * levelHeight : levelHeight;
      result[level]!.push({
        index: startLeaf,
        x,
        y: level * levelHeight,
        width,
        height: cellHeight,
        label: node.value,
        span,
        level,
        depth,
      });
    }
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
      dataBounds: null,
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
