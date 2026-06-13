import type { LayoutPlan } from '../layout/types';
import type { HitResult } from './types';

const HEADER_WIDTH = 50;
const HEADER_HEIGHT = 28;

export function hitTest(x: number, y: number, plan: LayoutPlan): HitResult {
  // Row header area
  if (x < HEADER_WIDTH && y >= HEADER_HEIGHT) {
    const row = findRowAtY(y, plan);
    if (row >= 0) return { type: 'rowHeader', row, col: -1 };
    return { type: 'empty', row: -1, col: -1 };
  }

  // Col header area
  if (y < HEADER_HEIGHT && x >= HEADER_WIDTH) {
    const col = findColAtX(x, plan);
    if (col >= 0) return { type: 'colHeader', row: -1, col };
    return { type: 'empty', row: -1, col: -1 };
  }

  // Cell area — use binary search on sorted cells by row/col position
  if (x >= HEADER_WIDTH && y >= HEADER_HEIGHT) {
    const row = findRowAtY(y, plan);
    const col = findColAtX(x, plan);
    if (row >= 0 && col >= 0) return { type: 'cell', row, col };
  }

  return { type: 'empty', row: -1, col: -1 };
}

function findRowAtY(y: number, plan: LayoutPlan): number {
  // Row headers are sorted by y position — binary search
  const headers = plan.rowHeaders;
  let lo = 0;
  let hi = headers.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const h = headers[mid]!;
    if (y < h.y) {
      hi = mid - 1;
    } else if (y >= h.y + h.height) {
      lo = mid + 1;
    } else {
      return h.index;
    }
  }
  return -1;
}

function findColAtX(x: number, plan: LayoutPlan): number {
  // Col headers are sorted by x position — binary search
  const headers = plan.colHeaders;
  let lo = 0;
  let hi = headers.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const h = headers[mid]!;
    if (x < h.x) {
      hi = mid - 1;
    } else if (x >= h.x + h.width) {
      lo = mid + 1;
    } else {
      return h.index;
    }
  }
  return -1;
}
