import type { CellBox, HeaderBox, LayoutPlan, Line } from '../layout/types';
import type { QueryLayer } from '../query/query';
import type { Selection } from '../interaction/types';

const GRID_COLOR = '#e0e0e0';
const HEADER_BG = '#f5f5f5';
const HEADER_BORDER = '#d0d0d0';
const FONT = '13px -apple-system, BlinkMacSystemFont, sans-serif';
const HEADER_FONT = '12px -apple-system, BlinkMacSystemFont, sans-serif';
const TEXT_COLOR = '#333';
const HEADER_TEXT_COLOR = '#666';

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  plan: LayoutPlan,
  query: QueryLayer,
  sheetIndex: number,
  selection?: Selection | null
): void {
  const { viewport } = plan;

  // Clear
  ctx.clearRect(0, 0, viewport.viewWidth, viewport.viewHeight);

  // Background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, viewport.viewWidth, viewport.viewHeight);

  // Gridlines
  drawGridlines(ctx, plan.gridlines);

  // Selection highlight (below text, above gridlines)
  if (selection) {
    drawSelection(ctx, plan.cells, selection);
  }

  // Cells
  drawCells(ctx, plan.cells, query, sheetIndex);

  // Headers
  drawRowHeaders(ctx, plan.rowHeaders);
  drawColHeaders(ctx, plan.colHeaders);

  // Top-left corner
  ctx.fillStyle = HEADER_BG;
  ctx.fillRect(0, 0, 50, 28);
  ctx.strokeStyle = HEADER_BORDER;
  ctx.strokeRect(0, 0, 50, 28);
}

function drawGridlines(ctx: CanvasRenderingContext2D, lines: Line[]): void {
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 0, len = lines.length; i < len; ++i) {
    const l = lines[i]!;
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
  }
  ctx.stroke();
}

function drawCells(
  ctx: CanvasRenderingContext2D,
  cells: CellBox[],
  query: QueryLayer,
  sheetIndex: number
): void {
  ctx.font = FONT;
  ctx.fillStyle = TEXT_COLOR;
  ctx.textBaseline = 'middle';
  for (let i = 0, len = cells.length; i < len; ++i) {
    const box = cells[i]!;
    const value = query.getCellDisplayValue({ sheet: sheetIndex, row: box.row, col: box.col });
    if (value === null) continue;
    const text = String(value);
    const isNumber = typeof value === 'number';
    if (isNumber) {
      ctx.textAlign = 'right';
      ctx.fillText(text, box.x + box.width - 6, box.y + box.height / 2);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText(text, box.x + 6, box.y + box.height / 2);
    }
  }
}

function drawRowHeaders(ctx: CanvasRenderingContext2D, headers: HeaderBox[]): void {
  ctx.font = HEADER_FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (let i = 0, len = headers.length; i < len; ++i) {
    const h = headers[i]!;
    ctx.fillStyle = HEADER_BG;
    ctx.fillRect(h.x, h.y, h.width, h.height);
    ctx.strokeStyle = HEADER_BORDER;
    ctx.strokeRect(h.x, h.y, h.width, h.height);
    ctx.fillStyle = HEADER_TEXT_COLOR;
    ctx.fillText(h.label, h.x + h.width / 2, h.y + h.height / 2);
  }
}

function drawColHeaders(ctx: CanvasRenderingContext2D, headers: HeaderBox[]): void {
  ctx.font = HEADER_FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (let i = 0, len = headers.length; i < len; ++i) {
    const h = headers[i]!;
    ctx.fillStyle = HEADER_BG;
    ctx.fillRect(h.x, h.y, h.width, h.height);
    ctx.strokeStyle = HEADER_BORDER;
    ctx.strokeRect(h.x, h.y, h.width, h.height);
    ctx.fillStyle = HEADER_TEXT_COLOR;
    ctx.fillText(h.label, h.x + h.width / 2, h.y + h.height / 2);
  }
}

function drawSelection(ctx: CanvasRenderingContext2D, cells: CellBox[], selection: Selection): void {
  const minRow = Math.min(selection.startRow, selection.endRow);
  const maxRow = Math.max(selection.startRow, selection.endRow);
  const minCol = Math.min(selection.startCol, selection.endCol);
  const maxCol = Math.max(selection.startCol, selection.endCol);

  // Find bounding box from visible cells
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (let i = 0, len = cells.length; i < len; ++i) {
    const c = cells[i]!;
    if (c.row >= minRow && c.row <= maxRow && c.col >= minCol && c.col <= maxCol) {
      if (c.x < x1) x1 = c.x;
      if (c.y < y1) y1 = c.y;
      if (c.x + c.width > x2) x2 = c.x + c.width;
      if (c.y + c.height > y2) y2 = c.y + c.height;
    }
  }

  if (x1 === Infinity) return;

  // Fill
  ctx.fillStyle = 'rgba(14, 101, 235, 0.08)';
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

  // Border
  ctx.strokeStyle = '#0e65eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  ctx.lineWidth = 1;
}
