import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { CanvasRuntime } from '../canvas/runtime';
import type { PointerEventLike } from '../canvas/types';
import type { KeyboardEventLike } from '../canvas/types';
import type { Selection, InteractionState, HitResult } from './types';
import { hitTest } from './hit-test';

export interface InteractionEngineOptions {
  workbook: Workbook;
  runtime: CanvasRuntime;
  getLayoutPlan: () => LayoutPlan;
  onSelectionChange: (selection: Selection | null) => void;
  onEditStart: (row: number, col: number) => void;
}

export class InteractionEngine {
  private state: InteractionState = 'idle';
  private selection: Selection | null = null;

  private readonly workbook: Workbook;
  private readonly runtime: CanvasRuntime;
  private readonly getLayoutPlan: () => LayoutPlan;
  private readonly onSelectionChange: (selection: Selection | null) => void;
  private readonly onEditStart: (row: number, col: number) => void;

  constructor(options: InteractionEngineOptions) {
    this.workbook = options.workbook;
    this.runtime = options.runtime;
    this.getLayoutPlan = options.getLayoutPlan;
    this.onSelectionChange = options.onSelectionChange;
    this.onEditStart = options.onEditStart;

    this.runtime.onPointer((e) => this.handlePointer(e));
    this.runtime.onKeyboard((e) => this.handleKeyDown(e));
  }

  getSelection(): Selection | null {
    return this.selection;
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
      this.handlePointerDown(hit);
    } else if (e.type === 'move' && this.state === 'selecting') {
      this.handlePointerMove(hit);
    } else if (e.type === 'up') {
      this.handlePointerUp();
    }
  }

  private handleDoubleClick(hit: HitResult): void {
    if (hit.type === 'cell') {
      this.state = 'editing';
      this.onEditStart(hit.row, hit.col);
    }
  }

  private handlePointerDown(hit: HitResult): void {
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

  private handlePointerUp(): void {
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
