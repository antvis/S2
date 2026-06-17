import { DETAIL_HEADER_WIDTH, DETAIL_HEADER_HEIGHT } from '../layout/types';
import type { CellBox, HeaderBox, LayoutPlan, Line } from '../layout/types';
import type { MergeRange, CellStyle } from '../core/types';
import type { QueryLayer } from '../query/query';
import type { Selection, HoverInfo } from '../interaction/types';
import type { CellRendererFn, CellRenderContext } from '../module/types';

const HEADER_WIDTH = DETAIL_HEADER_WIDTH;
const HEADER_HEIGHT = DETAIL_HEADER_HEIGHT;
const GRID_COLOR = '#e0e0e0';
const HEADER_BG = '#e8f0fe';
const HEADER_BORDER = '#c4d7f2';
const FONT = '13px -apple-system, BlinkMacSystemFont, sans-serif';
const HEADER_FONT = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
const TEXT_COLOR = '#333';
const HEADER_TEXT_COLOR = '#666';
const CORNER_BG = '#dce6f5';
const PIVOT_HEADER_BG_LEVELS = ['#d6e4f7', '#e0ebf9', '#e8f0fe', '#f0f5fd'];

export interface FillDragPreview {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface RenderState {
  selection?: Selection | null;
  hover?: HoverInfo | null;
  showRowHeader?: boolean;
  showColHeader?: boolean;
  moduleRenderers?: readonly CellRendererFn[];
  fillDragPreview?: FillDragPreview | null;
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  plan: LayoutPlan,
  query: QueryLayer,
  sheetIndex: number,
  state?: RenderState,
): void {
  const { viewport } = plan;

  ctx.clearRect(0, 0, viewport.viewWidth, viewport.viewHeight);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, viewport.viewWidth, viewport.viewHeight);

  const hasHierarchy = plan.hierarchyRowHeaders.length > 0 || plan.hierarchyColHeaders.length > 0;

  if (hasHierarchy) {
    renderHierarchyFrame(ctx, plan, query, sheetIndex, state?.selection, state?.hover, state?.moduleRenderers);
  } else {
    renderDetailFrame(ctx, plan, query, sheetIndex, state?.selection, state?.hover, state?.moduleRenderers, state);
  }
}

// ─── Pivot table rendering ──────────────────────────────────────────────

function renderHierarchyFrame(
  ctx: CanvasRenderingContext2D,
  plan: LayoutPlan,
  query: QueryLayer,
  sheetIndex: number,
  selection?: Selection | null,
  hover?: HoverInfo | null,
  moduleRenderers?: readonly CellRendererFn[],
): void {
  const { viewport, headerArea } = plan;

  // Clip data area to prevent overflow into headers
  ctx.save();
  ctx.beginPath();
  ctx.rect(headerArea.left, headerArea.top, viewport.viewWidth - headerArea.left, viewport.viewHeight - headerArea.top);
  ctx.clip();

  drawGridlines(ctx, plan.gridlines);

  if (hover) {
    drawHover(ctx, plan.cells, hover);
  }

  if (selection) {
    drawSelection(ctx, plan.cells, selection);
  }

  drawCells(ctx, plan.cells, query, sheetIndex, moduleRenderers);

  ctx.restore();

  drawHierarchyRowHeaders(ctx, plan);
  drawHierarchyColHeaders(ctx, plan);
  drawCornerHeaders(ctx, plan);
}

function drawHierarchyRowHeaders(ctx: CanvasRenderingContext2D, plan: LayoutPlan): void {
  ctx.font = HEADER_FONT;
  ctx.textBaseline = 'middle';

  for (let levelIdx = 0; levelIdx < plan.hierarchyRowHeaders.length; levelIdx++) {
    const headers = plan.hierarchyRowHeaders[levelIdx]!;
    const bg = PIVOT_HEADER_BG_LEVELS[Math.min(levelIdx, PIVOT_HEADER_BG_LEVELS.length - 1)]!;

    for (const h of headers) {
      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(h.x, h.y, h.width, h.height);

      // Border
      ctx.strokeStyle = HEADER_BORDER;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(h.x, h.y, h.width, h.height);

      // Text — left-aligned with padding, vertically centered in the merged area
      if (h.label) {
        ctx.fillStyle = HEADER_TEXT_COLOR;
        ctx.textAlign = 'left';

        const maxTextWidth = h.width - 12;
        let text = h.label;
        const measured = ctx.measureText(text);
        if (measured.width > maxTextWidth) {
          // Truncate with ellipsis
          while (text.length > 1 && ctx.measureText(text + '...').width > maxTextWidth) {
            text = text.slice(0, -1);
          }
          text += '...';
        }
        ctx.fillText(text, h.x + 8, h.y + h.height / 2);
      }
    }
  }

  // Row header gridlines (vertical lines between levels + horizontal lines between rows)
  ctx.strokeStyle = HEADER_BORDER;
  ctx.lineWidth = 0.5;
  const rowHeaderWidth = plan.headerArea.left;
  const colHeaderHeight = plan.headerArea.top;

  // Right border of entire row header area
  ctx.beginPath();
  ctx.moveTo(rowHeaderWidth, colHeaderHeight);
  ctx.lineTo(rowHeaderWidth, plan.viewport.viewHeight);
  ctx.stroke();
}

function drawHierarchyColHeaders(ctx: CanvasRenderingContext2D, plan: LayoutPlan): void {
  ctx.font = HEADER_FONT;
  ctx.textBaseline = 'middle';

  for (let levelIdx = 0; levelIdx < plan.hierarchyColHeaders.length; levelIdx++) {
    const headers = plan.hierarchyColHeaders[levelIdx]!;
    const bg = PIVOT_HEADER_BG_LEVELS[Math.min(levelIdx, PIVOT_HEADER_BG_LEVELS.length - 1)]!;

    for (const h of headers) {
      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(h.x, h.y, h.width, h.height);

      // Border
      ctx.strokeStyle = HEADER_BORDER;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(h.x, h.y, h.width, h.height);

      // Text — centered in the merged area
      if (h.label) {
        ctx.fillStyle = HEADER_TEXT_COLOR;
        ctx.textAlign = 'center';

        const maxTextWidth = h.width - 8;
        let text = h.label;
        const measured = ctx.measureText(text);
        if (measured.width > maxTextWidth) {
          while (text.length > 1 && ctx.measureText(text + '...').width > maxTextWidth) {
            text = text.slice(0, -1);
          }
          text += '...';
        }
        ctx.fillText(text, h.x + h.width / 2, h.y + h.height / 2);
      }
    }
  }

  // Bottom border of entire col header area
  const colHeaderHeight = plan.headerArea.top;
  ctx.strokeStyle = HEADER_BORDER;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(plan.headerArea.left, colHeaderHeight);
  ctx.lineTo(plan.viewport.viewWidth, colHeaderHeight);
  ctx.stroke();
}

function drawCornerHeaders(ctx: CanvasRenderingContext2D, plan: LayoutPlan): void {
  if (plan.cornerHeaders.length === 0) return;

  const rowHeaderWidth = plan.headerArea.left;
  const colHeaderHeight = plan.headerArea.top;

  // Corner background
  ctx.fillStyle = CORNER_BG;
  ctx.fillRect(0, 0, rowHeaderWidth, colHeaderHeight);

  // Corner border
  ctx.strokeStyle = HEADER_BORDER;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(0, 0, rowHeaderWidth, colHeaderHeight);

  // Corner header cells
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#444';

  for (const h of plan.cornerHeaders) {
    // Cell border
    ctx.strokeStyle = HEADER_BORDER;
    ctx.strokeRect(h.x, h.y, h.width, h.height);

    // Text
    if (h.label) {
      ctx.fillStyle = '#444';
      ctx.textAlign = 'left';
      ctx.fillText(h.label, h.x + 8, h.y + h.height / 2);
    }
  }
}

// ─── Detail table rendering (unchanged) ─────────────────────────────────

function renderDetailFrame(
  ctx: CanvasRenderingContext2D,
  plan: LayoutPlan,
  query: QueryLayer,
  sheetIndex: number,
  selection?: Selection | null,
  hover?: HoverInfo | null,
  moduleRenderers?: readonly CellRendererFn[],
  state?: RenderState
): void {
  const { viewport } = plan;

  // Gridlines (scrollable area)
  drawGridlines(ctx, plan.gridlines);

  // Hover highlight (below selection)
  if (hover) {
    drawHover(ctx, [...plan.cells, ...plan.frozenCells], hover);
  }

  // Selection highlight (below text, above gridlines)
  if (selection) {
    drawSelection(ctx, [...plan.cells, ...plan.frozenCells], selection);
  }

  // Cells (scrollable area)
  drawCells(ctx, plan.cells, query, sheetIndex, moduleRenderers);

  // Frozen cells (drawn on top so they overlay scrollable content)
  if (plan.frozenCells.length > 0) {
    // Frozen background
    const { frozenRowHeight, frozenColWidth } = plan;
    if (frozenRowHeight > 0) {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(HEADER_WIDTH, HEADER_HEIGHT, viewport.viewWidth - HEADER_WIDTH, frozenRowHeight);
    }
    if (frozenColWidth > 0) {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(HEADER_WIDTH, HEADER_HEIGHT, frozenColWidth, viewport.viewHeight - HEADER_HEIGHT);
    }
    drawGridlines(ctx, plan.frozenGridlines);
    drawCells(ctx, plan.frozenCells, query, sheetIndex, moduleRenderers);

    // Freeze border line
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 1.5;
    if (frozenRowHeight > 0) {
      const y = HEADER_HEIGHT + frozenRowHeight;
      ctx.beginPath();
      ctx.moveTo(HEADER_WIDTH, y);
      ctx.lineTo(viewport.viewWidth, y);
      ctx.stroke();
    }
    if (frozenColWidth > 0) {
      const x = HEADER_WIDTH + frozenColWidth;
      ctx.beginPath();
      ctx.moveTo(x, HEADER_HEIGHT);
      ctx.lineTo(x, viewport.viewHeight);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
  }

  // Fill drag preview
  if (state?.fillDragPreview) {
    drawFillDragPreview(ctx, [...plan.cells, ...plan.frozenCells], state.fillDragPreview);
  }

  // Headers
  if (state?.showRowHeader !== false) {
    drawRowHeaders(ctx, plan.rowHeaders);
  }
  if (state?.showColHeader !== false) {
    drawColHeaders(ctx, plan.colHeaders);
    // Top-left corner
    ctx.fillStyle = HEADER_BG;
    ctx.fillRect(0, 0, HEADER_WIDTH, HEADER_HEIGHT);
    ctx.strokeStyle = HEADER_BORDER;
    ctx.strokeRect(0, 0, HEADER_WIDTH, HEADER_HEIGHT);
  }
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
  sheetIndex: number,
  moduleRenderers?: readonly CellRendererFn[],
): void {
  const merges = query.getMerges(sheetIndex);
  const coveredCells = new Set<string>();
  const mergeMap = new Map<string, MergeRange>();
  for (const m of merges) {
    for (let r = m.startRow; r <= m.endRow; r++) {
      for (let c = m.startCol; c <= m.endCol; c++) {
        if (r === m.startRow && c === m.startCol) {
          mergeMap.set(`${r}:${c}`, m);
        } else {
          coveredCells.add(`${r}:${c}`);
        }
      }
    }
  }

  ctx.font = FONT;
  ctx.textBaseline = 'middle';
  for (let i = 0, len = cells.length; i < len; ++i) {
    const box = cells[i]!;
    const key = `${box.row}:${box.col}`;

    if (coveredCells.has(key)) continue;

    let drawWidth = box.width;
    let drawHeight = box.height;
    const merge = mergeMap.get(key);
    if (merge) {
      // Expand to cover merged area by finding the bottom-right cell
      for (const c2 of cells) {
        if (c2.row === merge.endRow && c2.col === merge.endCol) {
          drawWidth = (c2.x + c2.width) - box.x;
          drawHeight = (c2.y + c2.height) - box.y;
          break;
        }
      }
      // Clear merged area background
      ctx.fillStyle = '#fff';
      ctx.fillRect(box.x, box.y, drawWidth, drawHeight);
    }

    const value = query.getCellDisplayValue({ sheet: sheetIndex, row: box.row, col: box.col });

    let textColor = TEXT_COLOR;
    try {
      const cfStyle = query.moduleQuery('conditionalFormat.getCellStyle', {
        sheet: sheetIndex, row: box.row, col: box.col,
      }) as { backgroundColor?: string; color?: string } | null;
      if (cfStyle) {
        if (cfStyle.backgroundColor) {
          ctx.fillStyle = cfStyle.backgroundColor;
          ctx.fillRect(box.x, box.y, drawWidth, drawHeight);
        }
        if (cfStyle.color) {
          textColor = cfStyle.color;
        }
      }
    } catch {
      // ConditionalFormatModule not registered
    }

    // Cell style (setCellStyle)
    const cellRaw = query.getCellRawValue({ sheet: sheetIndex, row: box.row, col: box.col });
    const cellStyle = cellRaw?.style;
    if (cellStyle?.backgroundColor) {
      ctx.fillStyle = cellStyle.backgroundColor;
      ctx.fillRect(box.x, box.y, drawWidth, drawHeight);
    }
    if (cellStyle?.color) {
      textColor = cellStyle.color;
    }

    // Module renderers
    if (moduleRenderers && moduleRenderers.length > 0) {
      const renderCtx: CellRenderContext = {
        sheet: sheetIndex, row: box.row, col: box.col,
        x: box.x, y: box.y, width: drawWidth, height: drawHeight,
      };
      const queryProxy = { moduleQuery: (name: string, params: Record<string, unknown>) => query.moduleQuery(name, params) };
      for (const renderer of moduleRenderers) {
        renderer(ctx, renderCtx, queryProxy);
      }
    }

    if (value === null) continue;
    const text = String(value);
    const isNumber = typeof value === 'number';
    ctx.font = cellStyle?.bold ? `bold ${FONT}` : FONT;
    ctx.fillStyle = textColor;
    if (isNumber) {
      ctx.textAlign = 'right';
      ctx.fillText(text, box.x + drawWidth - 6, box.y + drawHeight / 2);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText(text, box.x + 6, box.y + drawHeight / 2);
    }
    if (cellStyle?.bold) ctx.font = FONT;
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
    if (h.label) {
      ctx.fillStyle = HEADER_TEXT_COLOR;
      ctx.fillText(h.label, h.x + h.width / 2, h.y + h.height / 2);
    }
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
    if (h.label) {
      ctx.fillStyle = HEADER_TEXT_COLOR;
      ctx.fillText(h.label, h.x + h.width / 2, h.y + h.height / 2);
    }
  }
}

function drawSelection(ctx: CanvasRenderingContext2D, cells: CellBox[], selection: Selection): void {
  const minRow = Math.min(selection.startRow, selection.endRow);
  const maxRow = Math.max(selection.startRow, selection.endRow);
  const minCol = Math.min(selection.startCol, selection.endCol);
  const maxCol = Math.max(selection.startCol, selection.endCol);

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

  ctx.fillStyle = 'rgba(14, 101, 235, 0.08)';
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

  ctx.strokeStyle = '#0e65eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  ctx.lineWidth = 1;

  // Fill handle (solid square at bottom-right corner, Excel-style)
  const handleSize = 8;
  ctx.fillStyle = '#0e65eb';
  ctx.fillRect(x2 - handleSize / 2, y2 - handleSize / 2, handleSize, handleSize);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(x2 - handleSize / 2, y2 - handleSize / 2, handleSize, handleSize);
}

function drawHover(ctx: CanvasRenderingContext2D, cells: CellBox[], hover: HoverInfo): void {
  for (let i = 0, len = cells.length; i < len; ++i) {
    const c = cells[i]!;
    if (c.row === hover.row && c.col === hover.col) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(c.x, c.y, c.width, c.height);
      return;
    }
  }
}

function drawFillDragPreview(ctx: CanvasRenderingContext2D, cells: CellBox[], preview: FillDragPreview): void {
  const minRow = Math.min(preview.startRow, preview.endRow);
  const maxRow = Math.max(preview.startRow, preview.endRow);
  const minCol = Math.min(preview.startCol, preview.endCol);
  const maxCol = Math.max(preview.startCol, preview.endCol);

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

  ctx.fillStyle = 'rgba(14, 101, 235, 0.05)';
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = '#0e65eb';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
}
