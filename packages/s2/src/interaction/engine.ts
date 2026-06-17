import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { LayoutEngine } from '../layout/engine';
import type { CanvasRuntime } from '../canvas/runtime';
import type { PointerEventLike, KeyboardEventLike } from '../canvas/types';
import type { Selection, InteractionState, HitResult, HoverInfo, DragInfo, FillDragInfo } from './types';
import { hitTest } from './hit-test';

function detectSeries(values: (number | string | boolean | null)[]): ((index: number) => number) | null {
  if (values.length < 2) return null;
  const nums: number[] = [];
  for (const v of values) {
    if (typeof v !== 'number') return null;
    nums.push(v);
  }
  const step = nums[1]! - nums[0]!;
  for (let i = 2; i < nums.length; i++) {
    if (nums[i]! - nums[i - 1]! !== step) return null;
  }
  return (idx: number) => nums[0]! + step * idx;
}

export interface InteractionEngineOptions {
  workbook: Workbook;
  runtime: CanvasRuntime;
  layoutEngine: LayoutEngine;
  getLayoutPlan: () => LayoutPlan;
  onSelectionChange: (selection: Selection | null) => void;
  onHoverChange?: (hover: HoverInfo | null) => void;
  onEditStart: (row: number, col: number, initialValue?: string) => void;
  readOnly?: boolean;
  onRepaintRequest: () => void;
}

export class InteractionEngine {
  private state: InteractionState = 'idle';
  private selection: Selection | null = null;
  private hover: HoverInfo | null = null;
  private drag: DragInfo | null = null;
  private fillDrag: FillDragInfo | null = null;

  private readonly workbook: Workbook;
  private readonly runtime: CanvasRuntime;
  private readonly layoutEngine: LayoutEngine;
  private readonly getLayoutPlan: () => LayoutPlan;
  private readonly onSelectionChange: (selection: Selection | null) => void;
  private readonly onHoverChange: ((hover: HoverInfo | null) => void) | null;
  private readonly onEditStart: (row: number, col: number, initialValue?: string) => void;
  private readonly readOnly: boolean;
  private readonly onRepaintRequest: () => void;

  constructor(options: InteractionEngineOptions) {
    this.workbook = options.workbook;
    this.runtime = options.runtime;
    this.layoutEngine = options.layoutEngine;
    this.getLayoutPlan = options.getLayoutPlan;
    this.onSelectionChange = options.onSelectionChange;
    this.onHoverChange = options.onHoverChange ?? null;
    this.onEditStart = options.onEditStart;
    this.onRepaintRequest = options.onRepaintRequest;
    this.readOnly = options.readOnly ?? false;

    this.runtime.onPointer((e) => this.handlePointer(e));
    this.runtime.onKeyboard((e) => this.handleKeyDown(e));
  }

  getSelection(): Selection | null {
    return this.selection;
  }

  getHover(): HoverInfo | null {
    return this.hover;
  }

  getState(): InteractionState {
    return this.state;
  }

  private handlePointer(e: PointerEventLike): void {
    const plan = this.getLayoutPlan();
    const hit = hitTest(e.x, e.y, plan);

    if (e.type === 'dblclick') {
      this.handleDoubleClick(hit);
    } else if (e.type === 'down') {
      this.handlePointerDown(hit, e);
    } else if (e.type === 'move') {
      if (this.state === 'dragging') {
        this.handleDragMove(e);
      } else if (this.state === 'selecting') {
        this.updateCursor(hit, e);
        this.handlePointerMove(hit);
      } else {
        this.updateCursor(hit, e);
        this.updateHover(hit);
      }
    } else if (e.type === 'up') {
      this.handlePointerUp(e);
    }
  }

  getFillDrag(): FillDragInfo | null {
    return this.fillDrag;
  }

  private updateCursor(hit: HitResult, e: PointerEventLike): void {
    if (hit.type === 'cell' && this.isNearFillHandle(e)) {
      this.runtime.setCursor('crosshair');
      return;
    }
    switch (hit.type) {
      case 'cell':
        this.runtime.setCursor('cell');
        break;
      case 'rowHeaderBorder':
        this.runtime.setCursor('row-resize');
        break;
      case 'colHeaderBorder':
        this.runtime.setCursor('col-resize');
        break;
      case 'rowHeader':
      case 'colHeader':
        this.runtime.setCursor('pointer');
        break;
      default:
        this.runtime.setCursor('default');
        break;
    }
  }

  private isNearFillHandle(e: PointerEventLike): boolean {
    if (!this.selection) return false;
    const sel = this.selection;
    const maxRow = Math.max(sel.startRow, sel.endRow);
    const maxCol = Math.max(sel.startCol, sel.endCol);
    const plan = this.getLayoutPlan();
    const box = plan.cells.find((c) => c.row === maxRow && c.col === maxCol)
      ?? plan.frozenCells.find((c) => c.row === maxRow && c.col === maxCol);
    if (!box) return false;
    const handleX = box.x + box.width;
    const handleY = box.y + box.height;
    return Math.abs(e.x - handleX) < 6 && Math.abs(e.y - handleY) < 6;
  }

  private updateHover(hit: HitResult): void {
    if (hit.type === 'cell') {
      const newHover: HoverInfo = { row: hit.row, col: hit.col };
      if (!this.hover || this.hover.row !== newHover.row || this.hover.col !== newHover.col) {
        this.hover = newHover;
        this.state = 'hovering';
        this.onHoverChange?.(this.hover);
      }
    } else {
      if (this.hover !== null) {
        this.hover = null;
        this.state = 'idle';
        this.onHoverChange?.(null);
      }
    }
  }

  private handleDoubleClick(hit: HitResult): void {
    if (this.readOnly) return;
    if (hit.type === 'cell') {
      this.state = 'editing';
      this.onEditStart(hit.row, hit.col);
    }
  }

  private handlePointerDown(hit: HitResult, e: PointerEventLike): void {
    if (hit.type === 'rowHeaderBorder') {
      const plan = this.getLayoutPlan();
      const header = plan.rowHeaders.find((h) => h.index === hit.row);
      if (header) {
        this.state = 'dragging';
        this.drag = { type: 'row', index: hit.row, startPos: e.y, startSize: header.height };
      }
      return;
    }

    if (hit.type === 'colHeaderBorder') {
      const plan = this.getLayoutPlan();
      const header = plan.colHeaders.find((h) => h.index === hit.col);
      if (header) {
        this.state = 'dragging';
        this.drag = { type: 'col', index: hit.col, startPos: e.x, startSize: header.width };
      }
      return;
    }

    if (this.selection && this.isNearFillHandle(e)) {
      const sel = this.selection;
      const maxRow = Math.max(sel.startRow, sel.endRow);
      const maxCol = Math.max(sel.startCol, sel.endCol);
      this.state = 'dragging';
      this.fillDrag = { sourceRange: { ...sel }, startX: e.x, startY: e.y, direction: 'none', currentRow: maxRow, currentCol: maxCol };
      return;
    }

    if (hit.type === 'cell') {
      this.state = 'selecting';
      this.selection = {
        sheet: 0,
        startRow: hit.row,
        startCol: hit.col,
        endRow: hit.row,
        endCol: hit.col,
      };
      this.onSelectionChange(this.selection);
    } else if (hit.type === 'rowHeader') {
      this.state = 'idle';
      this.selection = {
        sheet: 0,
        startRow: hit.row,
        startCol: 0,
        endRow: hit.row,
        endCol: 999,
      };
      this.onSelectionChange(this.selection);
    } else if (hit.type === 'colHeader') {
      this.state = 'idle';
      this.selection = {
        sheet: 0,
        startRow: 0,
        startCol: hit.col,
        endRow: 999,
        endCol: hit.col,
      };
      this.onSelectionChange(this.selection);
    }
  }

  private handlePointerMove(hit: HitResult): void {
    if (hit.type === 'cell' && this.selection) {
      this.selection = {
        ...this.selection,
        endRow: hit.row,
        endCol: hit.col,
      };
      this.onSelectionChange(this.selection);
    }
  }

  private handleDragMove(e: PointerEventLike): void {
    if (this.fillDrag) {
      const fd = this.fillDrag;
      if (fd.direction === 'none') {
        const dx = Math.abs(e.x - fd.startX);
        const dy = Math.abs(e.y - fd.startY);
        if (dx > 4 || dy > 4) {
          fd.direction = dx > dy ? 'col' : 'row';
        } else {
          return;
        }
      }
      const plan = this.getLayoutPlan();
      const hit = hitTest(e.x, e.y, plan);
      if (hit.type === 'cell') {
        const sMaxR = Math.max(fd.sourceRange.startRow, fd.sourceRange.endRow);
        const sMaxC = Math.max(fd.sourceRange.startCol, fd.sourceRange.endCol);
        if (fd.direction === 'row') {
          fd.currentRow = hit.row;
          fd.currentCol = sMaxC;
        } else {
          fd.currentRow = sMaxR;
          fd.currentCol = hit.col;
        }
        this.onRepaintRequest();
      }
      return;
    }

    if (!this.drag) return;

    const MIN_SIZE = 20;

    if (this.drag.type === 'row') {
      const delta = e.y - this.drag.startPos;
      const newHeight = Math.max(MIN_SIZE, this.drag.startSize + delta);
      this.layoutEngine.setTemporaryRowHeight(this.drag.index, newHeight);
    } else {
      const delta = e.x - this.drag.startPos;
      const newWidth = Math.max(MIN_SIZE, this.drag.startSize + delta);
      this.layoutEngine.setTemporaryColWidth(this.drag.index, newWidth);
    }

    this.onRepaintRequest();
  }

  private handlePointerUp(e: PointerEventLike): void {
    if (this.state === 'dragging' && this.fillDrag) {
      this.applyFill(this.fillDrag);
      this.fillDrag = null;
      this.state = 'idle';
      return;
    }

    if (this.state === 'dragging' && this.drag) {
      const MIN_SIZE = 20;
      if (this.drag.type === 'row') {
        const delta = e.y - this.drag.startPos;
        const newHeight = Math.max(MIN_SIZE, this.drag.startSize + delta);
        this.workbook.apply([{
          type: 'setRowHeight',
          payload: { sheet: 0, row: this.drag.index, height: newHeight },
        }]);
      } else {
        const delta = e.x - this.drag.startPos;
        const newWidth = Math.max(MIN_SIZE, this.drag.startSize + delta);
        this.workbook.apply([{
          type: 'setColumnWidth',
          payload: { sheet: 0, col: this.drag.index, width: newWidth },
        }]);
      }
      this.drag = null;
      this.state = 'idle';
      this.layoutEngine.clearTemporary();
      return;
    }
    if (this.state === 'selecting') {
      this.state = 'idle';
    }
  }

  private handleKeyDown(e: KeyboardEventLike): void {
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (mod && key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.workbook.undo();
      return;
    }
    if (mod && (key === 'y' || (e.shiftKey && key === 'z'))) {
      e.preventDefault();
      this.workbook.redo();
      return;
    }

    if (this.state === 'editing') return;

    if (mod && key === 'c' && this.selection) {
      e.preventDefault();
      const sel = this.selection;
      const minRow = Math.min(sel.startRow, sel.endRow);
      const maxRow = Math.max(sel.startRow, sel.endRow);
      const minCol = Math.min(sel.startCol, sel.endCol);
      const maxCol = Math.max(sel.startCol, sel.endCol);
      try {
        this.workbook.apply([{
          type: 'edit.copy',
          payload: { sheet: 0, range: { startRow: minRow, endRow: maxRow, startCol: minCol, endCol: maxCol } },
        }]);
      } catch {
        // EditModule not registered
      }
      return;
    }

    if (mod && key === 'v' && this.selection) {
      if (this.readOnly) return;
      e.preventDefault();
      try {
        this.workbook.apply([{
          type: 'edit.paste',
          payload: { sheet: 0, row: Math.min(this.selection.startRow, this.selection.endRow), col: Math.min(this.selection.startCol, this.selection.endCol) },
        }]);
      } catch {
        // EditModule not registered
      }
      return;
    }

    if (!this.selection) return;

    if (e.key === 'F2' && !this.readOnly) {
      e.preventDefault();
      this.state = 'editing';
      this.onEditStart(this.selection.endRow, this.selection.endCol);
      return;
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && !this.readOnly) {
      e.preventDefault();
      const sel = this.selection;
      const minRow = Math.min(sel.startRow, sel.endRow);
      const maxRow = Math.max(sel.startRow, sel.endRow);
      const minCol = Math.min(sel.startCol, sel.endCol);
      const maxCol = Math.max(sel.startCol, sel.endCol);
      const ops: { type: string; payload: Record<string, unknown> }[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          ops.push({ type: 'deleteCellValue', payload: { sheet: 0, row: r, col: c } });
        }
      }
      if (ops.length > 0) this.workbook.apply(ops);
      return;
    }

    const row = this.selection.endRow;
    const col = this.selection.endCol;

    const visualNav = (modelR: number, dir: 1 | -1): number => {
      const vr = this.layoutEngine.modelToVisualRow(modelR);
      const nextVr = vr + dir;
      if (nextVr < 0) return modelR;
      return this.layoutEngine.visualToModelRow(nextVr);
    };

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault();
        this.moveSelection(visualNav(row, -1), col, e.shiftKey);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.moveSelection(visualNav(row, 1), col, e.shiftKey);
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const newCol = Math.max(0, col - 1);
        this.moveSelection(row, newCol, e.shiftKey);
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        this.moveSelection(row, col + 1, e.shiftKey);
        break;
      }
      case 'Tab': {
        e.preventDefault();
        if (e.shiftKey) {
          this.moveSelection(row, Math.max(0, col - 1), false);
        } else {
          this.moveSelection(row, col + 1, false);
        }
        break;
      }
      case 'Enter': {
        e.preventDefault();
        this.moveSelection(visualNav(row, 1), col, false);
        break;
      }
    }

    if (!this.readOnly && !mod && !e.altKey && e.key.length === 1) {
      e.preventDefault();
      this.state = 'editing';
      this.onEditStart(this.selection.endRow, this.selection.endCol, e.key);
    }
  }

  private moveSelection(row: number, col: number, extend: boolean): void {
    if (extend && this.selection) {
      this.selection = {
        ...this.selection,
        endRow: row,
        endCol: col,
      };
    } else {
      this.selection = {
        sheet: 0,
        startRow: row,
        startCol: col,
        endRow: row,
        endCol: col,
      };
    }
    this.onSelectionChange(this.selection);
  }

  private applyFill(fill: FillDragInfo): void {
    const src = fill.sourceRange;
    const srcMinR = Math.min(src.startRow, src.endRow);
    const srcMaxR = Math.max(src.startRow, src.endRow);
    const srcMinC = Math.min(src.startCol, src.endCol);
    const srcMaxC = Math.max(src.startCol, src.endCol);
    const srcRows = srcMaxR - srcMinR + 1;
    const srcCols = srcMaxC - srcMinC + 1;

    const ops: { type: string; payload: Record<string, unknown> }[] = [];

    if (fill.currentRow > srcMaxR) {
      // Fill downward
      for (let c = srcMinC; c <= srcMaxC; c++) {
        const colValues = this.getSourceColumn(srcMinR, srcMaxR, c);
        const series = detectSeries(colValues);
        for (let r = srcMaxR + 1; r <= fill.currentRow; r++) {
          const idx = r - srcMinR;
          const value = series ? series(idx) : colValues[idx % srcRows];
          if (value !== null) ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: c, value } });
        }
      }
    } else if (fill.currentRow < srcMinR) {
      // Fill upward
      for (let c = srcMinC; c <= srcMaxC; c++) {
        const colValues = this.getSourceColumn(srcMinR, srcMaxR, c);
        const series = detectSeries(colValues);
        for (let r = srcMinR - 1; r >= fill.currentRow; r--) {
          const idx = r - srcMinR; // negative
          const value = series ? series(idx) : colValues[((idx % srcRows) + srcRows) % srcRows];
          if (value !== null) ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: c, value } });
        }
      }
    } else if (fill.currentCol > srcMaxC) {
      // Fill rightward
      for (let r = srcMinR; r <= srcMaxR; r++) {
        const rowValues = this.getSourceRow(r, srcMinC, srcMaxC);
        const series = detectSeries(rowValues);
        for (let c = srcMaxC + 1; c <= fill.currentCol; c++) {
          const idx = c - srcMinC;
          const value = series ? series(idx) : rowValues[idx % srcCols];
          if (value !== null) ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: c, value } });
        }
      }
    } else if (fill.currentCol < srcMinC) {
      // Fill leftward
      for (let r = srcMinR; r <= srcMaxR; r++) {
        const rowValues = this.getSourceRow(r, srcMinC, srcMaxC);
        const series = detectSeries(rowValues);
        for (let c = srcMinC - 1; c >= fill.currentCol; c--) {
          const idx = c - srcMinC;
          const value = series ? series(idx) : rowValues[((idx % srcCols) + srcCols) % srcCols];
          if (value !== null) ops.push({ type: 'setCellValue', payload: { sheet: 0, row: r, col: c, value } });
        }
      }
    }

    if (ops.length > 0) this.workbook.apply(ops);
  }

  private getSourceColumn(minR: number, maxR: number, col: number): (number | string | boolean | null)[] {
    const values: (number | string | boolean | null)[] = [];
    for (let r = minR; r <= maxR; r++) values.push(this.workbook.query.getCellDisplayValue({ sheet: 0, row: r, col }));
    return values;
  }

  private getSourceRow(row: number, minC: number, maxC: number): (number | string | boolean | null)[] {
    const values: (number | string | boolean | null)[] = [];
    for (let c = minC; c <= maxC; c++) values.push(this.workbook.query.getCellDisplayValue({ sheet: 0, row, col: c }));
    return values;
  }
}
