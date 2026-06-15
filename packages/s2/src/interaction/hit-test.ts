import type { LayoutPlan } from '../layout/types';
import type { HitResult } from './types';

const BORDER_THRESHOLD = 4;

export function hitTest(x: number, y: number, plan: LayoutPlan): HitResult {
  const { left: hw, top: hh } = plan.headerArea;

  // Corner area
  if (x < hw && y < hh) {
    return { type: 'empty', row: -1, col: -1 };
  }

  // Row header area — check border first (bottom edge of each header)
  if (x < hw && y >= hh) {
    for (const h of plan.rowHeaders) {
      const bottomEdge = h.y + h.height;
      if (Math.abs(y - bottomEdge) <= BORDER_THRESHOLD && x < hw) {
        return { type: 'rowHeaderBorder', row: h.index, col: -1 };
      }
    }
    const row = findRowAt(y, plan);
    if (row >= 0) return { type: 'rowHeader', row, col: -1 };
    return { type: 'empty', row: -1, col: -1 };
  }

  // Col header area — check border first (right edge of each header)
  if (y < hh && x >= hw) {
    for (const h of plan.colHeaders) {
      const rightEdge = h.x + h.width;
      if (Math.abs(x - rightEdge) <= BORDER_THRESHOLD && y < hh) {
        return { type: 'colHeaderBorder', row: -1, col: h.index };
      }
    }
    const col = findColAt(x, plan);
    if (col >= 0) return { type: 'colHeader', row: -1, col };
    return { type: 'empty', row: -1, col: -1 };
  }

  // Data cell area
  if (x >= hw && y >= hh) {
    const allCells = plan.frozenCells.length > 0
      ? [...plan.frozenCells, ...plan.cells]
      : plan.cells;
    for (const c of allCells) {
      if (x >= c.x && x < c.x + c.width && y >= c.y && y < c.y + c.height) {
        return { type: 'cell', row: c.row, col: c.col };
      }
    }
  }

  return { type: 'empty', row: -1, col: -1 };
}

function findRowAt(y: number, plan: LayoutPlan): number {
  if (plan.rowHeaders.length > 0) {
    let lo = 0;
    let hi = plan.rowHeaders.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const h = plan.rowHeaders[mid]!;
      if (y < h.y) hi = mid - 1;
      else if (y >= h.y + h.height) lo = mid + 1;
      else return h.index;
    }
    return -1;
  }
  for (const c of plan.cells) {
    if (y >= c.y && y < c.y + c.height) return c.row;
  }
  return -1;
}

function findColAt(x: number, plan: LayoutPlan): number {
  if (plan.colHeaders.length > 0) {
    let lo = 0;
    let hi = plan.colHeaders.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const h = plan.colHeaders[mid]!;
      if (x < h.x) hi = mid - 1;
      else if (x >= h.x + h.width) lo = mid + 1;
      else return h.index;
    }
    return -1;
  }
  for (const c of plan.cells) {
    if (x >= c.x && x < c.x + c.width) return c.col;
  }
  return -1;
}
