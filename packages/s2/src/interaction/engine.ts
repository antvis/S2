import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { CanvasRuntime } from '../canvas/runtime';
import type { PointerEventLike } from '../canvas/types';
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
}
