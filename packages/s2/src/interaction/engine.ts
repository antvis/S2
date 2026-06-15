import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { LayoutEngine } from '../layout/engine';
import type { CanvasRuntime } from '../canvas/runtime';
import type { PointerEventLike, KeyboardEventLike } from '../canvas/types';
import type { Selection, InteractionState, HitResult, HoverInfo, DragInfo } from './types';
import { hitTest } from './hit-test';

export interface InteractionEngineOptions {
  workbook: Workbook;
  runtime: CanvasRuntime;
  layoutEngine: LayoutEngine;
  getLayoutPlan: () => LayoutPlan;
  onSelectionChange: (selection: Selection | null) => void;
  onHoverChange?: (hover: HoverInfo | null) => void;
  onEditStart: (row: number, col: number) => void;
  onRepaintRequest: () => void;
}

export class InteractionEngine {
  private state: InteractionState = 'idle';
  private selection: Selection | null = null;
  private hover: HoverInfo | null = null;
  private drag: DragInfo | null = null;

  private readonly workbook: Workbook;
  private readonly runtime: CanvasRuntime;
  private readonly layoutEngine: LayoutEngine;
  private readonly getLayoutPlan: () => LayoutPlan;
  private readonly onSelectionChange: (selection: Selection | null) => void;
  private readonly onHoverChange: ((hover: HoverInfo | null) => void) | null;
  private readonly onEditStart: (row: number, col: number) => void;
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
        this.updateCursor(hit);
        this.handlePointerMove(hit);
      } else {
        this.updateCursor(hit);
        this.updateHover(hit);
      }
    } else if (e.type === 'up') {
      this.handlePointerUp(e);
    }
  }

  private updateCursor(hit: HitResult): void {
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
      return;
    }
    if (this.state === 'selecting') {
      this.state = 'idle';
    }
  }

  private handleKeyDown(e: KeyboardEventLike): void {
    if (this.state === 'editing') return;

    if (!this.selection) return;

    const row = this.selection.endRow;
    const col = this.selection.endCol;

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault();
        const newRow = Math.max(0, row - 1);
        this.moveSelection(newRow, col, e.shiftKey);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.moveSelection(row + 1, col, e.shiftKey);
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
        this.moveSelection(row + 1, col, false);
        break;
      }
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
}
