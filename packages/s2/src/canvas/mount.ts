import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { Selection } from '../interaction/types';
import type { HoverInfo } from '../interaction/types';
import type { Operation } from '../operation/types';
import { LayoutEngine } from '../layout/engine';
import { renderFrame } from '../renderer/frame';
import { createCanvasRuntime } from './runtime';
import { InteractionEngine } from '../interaction/engine';

export interface MountCanvasOptions {
  width?: number;
  height?: number;
  showRowHeader?: boolean;
  showColHeader?: boolean;
  readOnly?: boolean;
}

export interface CanvasHandle {
  destroy(): void;
}

function writeClipboard(workbook: Workbook): void {
  const clipboard = workbook.query.tryModuleQuery('edit.getClipboard', {}) as { values: (string | number | boolean | null)[][] } | null;
  if (!clipboard) return;
  const tsv = clipboard.values.map((row) => row.map((v) => v ?? '').join('\t')).join('\n');
  navigator.clipboard.writeText(tsv).catch(() => {});
}

export function mountCanvas(workbook: Workbook, container: HTMLElement, options?: MountCanvasOptions): CanvasHandle {
  if (options?.width) container.style.width = `${options.width}px`;
  if (options?.height) container.style.height = `${options.height}px`;

  const runtime = createCanvasRuntime(container);
  const workbookModel = workbook.__getModel();
  const layout = new LayoutEngine(workbookModel, workbook.query);
  const autoFit = !!(options?.width && options?.height);

  const initialWidth = runtime.getWidth();
  const initialHeight = runtime.getHeight();

  if (!autoFit) {
    const probe = layout.computeLayoutPlan(initialWidth, initialHeight, undefined, false);
    const fitW = Math.min(probe.totalWidth, initialWidth);
    const fitH = Math.min(probe.totalHeight, initialHeight);
    container.style.width = `${fitW}px`;
    container.style.height = `${fitH}px`;
    runtime.resize(fitW, fitH);
  }

  let currentPlan: LayoutPlan = layout.computeLayoutPlan(runtime.getWidth(), runtime.getHeight(), undefined, autoFit);
  let currentSelection: Selection | null = null;
  let currentHover: HoverInfo | null = null;
  let editorEl: HTMLInputElement | null = null;
  let tooltipEl: HTMLDivElement | null = null;
  let tooltipTimer: ReturnType<typeof setTimeout> | null = null;

  function getFreezeConfig() {
    return (workbook.query.tryModuleQuery('freeze.getConfig', { sheet: 0 }) ?? null) as { frozenRows: number; frozenCols: number } | null;
  }

  const showRowHeader = options?.showRowHeader !== false;
  const showColHeader = options?.showColHeader !== false;

  function paint(): void {
    const freeze = getFreezeConfig();

    if (!autoFit) {
      const probe = layout.computeLayoutPlan(initialWidth, initialHeight, freeze, false);
      const fitW = Math.min(probe.totalWidth, initialWidth);
      const fitH = Math.min(probe.totalHeight, initialHeight);
      if (Math.abs(fitW - runtime.getWidth()) > 1 || Math.abs(fitH - runtime.getHeight()) > 1) {
        container.style.width = `${fitW}px`;
        container.style.height = `${fitH}px`;
        runtime.resize(fitW, fitH);
      }
    }

    currentPlan = layout.computeLayoutPlan(runtime.getWidth(), runtime.getHeight(), freeze, autoFit);

    let fillDragPreview = null;
    const fd = interaction.getFillDrag();
    if (fd && fd.direction !== 'none') {
      const src = fd.sourceRange;
      const srcMinR = Math.min(src.startRow, src.endRow);
      const srcMaxR = Math.max(src.startRow, src.endRow);
      const srcMinC = Math.min(src.startCol, src.endCol);
      const srcMaxC = Math.max(src.startCol, src.endCol);
      fillDragPreview = {
        startRow: Math.min(srcMinR, fd.currentRow),
        startCol: Math.min(srcMinC, fd.currentCol),
        endRow: Math.max(srcMaxR, fd.currentRow),
        endCol: Math.max(srcMaxC, fd.currentCol),
      };
    }

    renderFrame(runtime.getContext(), currentPlan, workbook.query, 0, {
      selection: currentSelection,
      hover: currentHover,
      showRowHeader,
      showColHeader,
      moduleRenderers: workbook.getModuleRenderers(),
      fillDragPreview,
    });
  }

  function hasEditModule(): boolean {
    return workbook.query.tryModuleQuery('edit.getEditing', {}) !== undefined;
  }

  function showEditor(row: number, col: number, initialValue?: string): void {
    const box = currentPlan.cells.find((c) => c.row === row && c.col === col)
      ?? currentPlan.frozenCells.find((c) => c.row === row && c.col === col);
    if (!box) return;

    editorEl = document.createElement('input');
    editorEl.style.position = 'absolute';
    editorEl.style.left = `${box.x}px`;
    editorEl.style.top = `${box.y}px`;
    editorEl.style.width = `${box.width}px`;
    editorEl.style.height = `${box.height}px`;
    editorEl.style.border = '2px solid #0e65eb';
    editorEl.style.outline = 'none';
    editorEl.style.padding = '0 5px';
    editorEl.style.fontSize = '13px';
    editorEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
    editorEl.style.boxSizing = 'border-box';
    editorEl.style.zIndex = '10';

    if (initialValue !== undefined) {
      editorEl.value = initialValue;
    } else {
      const currentValue = workbook.query.getCellDisplayValue({ sheet: 0, row, col });
      editorEl.value = currentValue !== null ? String(currentValue) : '';
    }

    container.style.position = 'relative';
    container.appendChild(editorEl);
    editorEl.focus();
    if (initialValue === undefined) {
      editorEl.select();
    }

    editorEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        commitEditor(row, col);
      } else if (e.key === 'Escape') {
        cancelEditor();
      }
    });

    editorEl.addEventListener('blur', () => commitEditor(row, col));
  }

  function commitEditor(row: number, col: number): void {
    if (!editorEl) return;
    const newValue = editorEl.value;
    editorEl.remove();
    editorEl = null;

    const parsed = Number(newValue);
    const value = newValue === '' ? null : isNaN(parsed) ? newValue : parsed;

    if (hasEditModule()) {
      workbook.apply([{ type: 'edit.commit', payload: { sheet: 0, row, col, value } }]);
    } else {
      workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row, col, value } }]);
    }
  }

  function cancelEditor(): void {
    if (!editorEl) return;
    editorEl.remove();
    editorEl = null;

    if (hasEditModule()) {
      workbook.apply([{ type: 'edit.cancel', payload: {} }]);
    }

    paint();
  }

  function showTooltip(row: number, col: number): void {
    const box = currentPlan.cells.find((c) => c.row === row && c.col === col)
      ?? currentPlan.frozenCells.find((c) => c.row === row && c.col === col);
    if (!box) return;

    const value = workbook.query.getCellDisplayValue({ sheet: 0, row, col });
    if (value === null) return;

    hideTooltip();

    tooltipEl = document.createElement('div');
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = `${box.x + box.width / 2}px`;
    tooltipEl.style.top = `${box.y - 4}px`;
    tooltipEl.style.transform = 'translate(-50%, -100%)';
    tooltipEl.style.padding = '4px 8px';
    tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    tooltipEl.style.color = '#fff';
    tooltipEl.style.fontSize = '12px';
    tooltipEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
    tooltipEl.style.borderRadius = '4px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.zIndex = '20';
    tooltipEl.style.whiteSpace = 'nowrap';
    tooltipEl.textContent = String(value);

    container.style.position = 'relative';
    container.appendChild(tooltipEl);
  }

  function hideTooltip(): void {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      tooltipTimer = null;
    }
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  }

  // Interaction engine
  const interaction = new InteractionEngine({
    workbook,
    runtime,
    layoutEngine: layout,
    getLayoutPlan: () => currentPlan,
    readOnly: options?.readOnly,
    onSelectionChange(selection) {
      currentSelection = selection;
      workbook.apply([{ type: 'setSelection', payload: { selection } }]);
      if (selection) {
        layout.ensureCellVisible(selection.endRow, selection.endCol, runtime.getWidth(), runtime.getHeight());
      }
      runtime.markDirty();
      runtime.requestRepaint(paint);
    },
    onHoverChange(hover) {
      currentHover = hover;
      hideTooltip();

      if (hover) {
        tooltipTimer = setTimeout(() => {
          showTooltip(hover.row, hover.col);
        }, 500);
      }

      runtime.markDirty();
      runtime.requestRepaint(paint);
    },
    onRepaintRequest() {
      runtime.markDirty();
      runtime.requestRepaint(paint);
    },
    onEditStart(row, col, initialValue) {
      if (hasEditModule()) {
        workbook.apply([{ type: 'edit.start', payload: { sheet: 0, row, col } }]);
      }
      showEditor(row, col, initialValue);
    },
  });

  // Initial paint
  paint();

  // Repaint on data change
  const unsub = workbook.on('operationApplied', (ops) => {
    for (const op of ops) {
      if (op.type === 'edit.copy') {
        writeClipboard(workbook);
      }
    }
    runtime.markDirty();
    runtime.requestRepaint(paint);
  });

  // Listen for browser paste events to support cross-app paste
  const pasteHandler = (e: ClipboardEvent) => {
    if (editorEl) return;
    const text = e.clipboardData?.getData('text/plain');
    if (!text || !currentSelection) return;
    e.preventDefault();

    const rows = text.split('\n').filter((r) => r.length > 0).map((r) => r.split('\t'));
    const startRow = Math.min(currentSelection.startRow, currentSelection.endRow);
    const startCol = Math.min(currentSelection.startCol, currentSelection.endCol);
    const ops: { type: string; payload: Record<string, unknown> }[] = [];
    for (let r = 0; r < rows.length; r++) {
      const rowData = rows[r]!;
      for (let c = 0; c < rowData.length; c++) {
        const raw = rowData[c]!;
        const parsed = Number(raw);
        const value = raw === '' ? null : isNaN(parsed) ? raw : parsed;
        ops.push({ type: 'setCellValue', payload: { sheet: 0, row: startRow + r, col: startCol + c, value } });
      }
    }
    if (ops.length > 0) workbook.apply(ops);
  };
  container.addEventListener('paste', pasteHandler);

  // Scroll
  runtime.onWheel((e) => {
    if (editorEl) {
      cancelEditor();
    }
    hideTooltip();
    layout.scroll(e.deltaX, e.deltaY);
    runtime.markDirty();
    runtime.requestRepaint(paint);
  });

  // Resize observer
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      runtime.resize(width, height);
      runtime.requestRepaint(paint);
    }
  });
  resizeObserver.observe(container);

  return {
    destroy() {
      unsub();
      container.removeEventListener('paste', pasteHandler);
      resizeObserver.disconnect();
      editorEl?.remove();
      hideTooltip();
      runtime.destroy();
    },
  };
}
