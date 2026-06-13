import type { Workbook } from '../workbook';
import type { LayoutPlan } from '../layout/types';
import type { Selection } from '../interaction/types';
import { LayoutEngine } from '../layout/engine';
import { renderFrame } from '../renderer/frame';
import { createCanvasRuntime } from './runtime';
import { InteractionEngine } from '../interaction/engine';

export interface CanvasHandle {
  destroy(): void;
}

export function mountCanvas(workbook: Workbook, container: HTMLElement): CanvasHandle {
  const runtime = createCanvasRuntime(container);
  const workbookModel = workbook.__getModel();
  const layout = new LayoutEngine(workbookModel);

  let currentPlan: LayoutPlan = layout.computeLayoutPlan(runtime.getWidth(), runtime.getHeight());
  let currentSelection: Selection | null = null;
  let editorEl: HTMLInputElement | null = null;

  function paint(): void {
    currentPlan = layout.computeLayoutPlan(runtime.getWidth(), runtime.getHeight());
    renderFrame(runtime.getContext(), currentPlan, workbook.query, 0, currentSelection);
  }

  // Editor overlay
  function startEdit(row: number, col: number): void {
    const box = currentPlan.cells.find((c) => c.row === row && c.col === col);
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

    const commitEdit = (): void => {
      if (!editorEl) return;
      const newValue = editorEl.value;
      editorEl.remove();
      editorEl = null;

      const parsed = Number(newValue);
      const value = newValue === '' ? null : isNaN(parsed) ? newValue : parsed;
      workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row, col, value } }]);
    };

    editorEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        commitEdit();
      } else if (e.key === 'Escape') {
        editorEl?.remove();
        editorEl = null;
        paint();
      }
    });

    editorEl.addEventListener('blur', commitEdit);
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
      startEdit(row, col);
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
