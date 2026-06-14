import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { Selection } from '../interaction/types';
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
}

export interface CanvasHandle {
  destroy(): void;
}

export function mountCanvas(workbook: Workbook, container: HTMLElement, options?: MountCanvasOptions): CanvasHandle {
  if (options?.width) container.style.width = `${options.width}px`;
  if (options?.height) container.style.height = `${options.height}px`;

  const runtime = createCanvasRuntime(container);
  const workbookModel = workbook.__getModel();
  const layout = new LayoutEngine(workbookModel, workbook.query);

  let currentPlan: LayoutPlan = layout.computeLayoutPlan(runtime.getWidth(), runtime.getHeight());
  let currentSelection: Selection | null = null;
  let editorEl: HTMLInputElement | null = null;

  function getFreezeConfig() {
    try {
      return workbook.query.moduleQuery('freeze.getConfig', { sheet: 0 }) as { frozenRows: number; frozenCols: number } | null;
    } catch {
      return null;
    }
  }

  const showRowHeader = options?.showRowHeader !== false;
  const showColHeader = options?.showColHeader !== false;

  function paint(): void {
    const freeze = getFreezeConfig();
    currentPlan = layout.computeLayoutPlan(runtime.getWidth(), runtime.getHeight(), freeze);
    renderFrame(runtime.getContext(), currentPlan, workbook.query, 0, currentSelection, {
      showRowHeader,
      showColHeader,
    });
  }

  function hasEditModule(): boolean {
    try {
      workbook.query.moduleQuery('edit.getEditing', {});
      return true;
    } catch {
      return false;
    }
  }

  function showEditor(row: number, col: number): void {
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

    const currentValue = workbook.query.getCellDisplayValue({ sheet: 0, row, col });
    editorEl.value = currentValue !== null ? String(currentValue) : '';

    container.style.position = 'relative';
    container.appendChild(editorEl);
    editorEl.focus();
    editorEl.select();

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

  // Interaction engine
  const interaction = new InteractionEngine({
    workbook,
    runtime,
    getLayoutPlan: () => currentPlan,
    onSelectionChange(selection) {
      currentSelection = selection;
      runtime.markDirty();
      runtime.requestRepaint(paint);
    },
    onEditStart(row, col) {
      if (hasEditModule()) {
        workbook.apply([{ type: 'edit.start', payload: { sheet: 0, row, col } }]);
      }
      showEditor(row, col);
    },
  });

  // Initial paint
  paint();

  // Repaint on data change
  const unsub = workbook.on('operationApplied', () => {
    runtime.markDirty();
    runtime.requestRepaint(paint);
  });

  // Scroll
  runtime.onWheel((e) => {
    if (editorEl) {
      cancelEditor();
    }
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
      resizeObserver.disconnect();
      editorEl?.remove();
      runtime.destroy();
    },
  };
}
