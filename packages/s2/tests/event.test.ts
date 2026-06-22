import { describe, it, expect, vi } from 'vitest';
import { createWorkbook, SortModule, FilterModule, EditModule, PivotModule, allModules } from '../src/index';
import type { Operation } from '../src/index';

describe('Core events — operationApplied', () => {
  it('fires on apply with the operations', () => {
    const wb = createWorkbook();
    const handler = vi.fn();
    wb.on('operationApplied', handler);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    const ops = handler.mock.calls[0]![0] as Operation[];
    expect(ops).toHaveLength(1);
    expect(ops[0]!.type).toBe('setCellValue');
  });

  it('fires on undo with the actual inverse ops, not __undo synthetic', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    const handler = vi.fn();
    wb.on('operationApplied', handler);
    wb.undo();
    expect(handler).toHaveBeenCalledTimes(1);
    const ops = handler.mock.calls[0]![0] as Operation[];
    expect(ops[0]!.type).not.toBe('__undo');
    // setCellValue 的 inverse 把 cell 还原到之前的状态(deleteCellValue 或 setCellValue)
    expect(['deleteCellValue', 'setCellValue']).toContain(ops[0]!.type);
  });

  it('fires on redo with the original ops', () => {
    const wb = createWorkbook();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    wb.undo();
    const handler = vi.fn();
    wb.on('operationApplied', handler);
    wb.redo();
    expect(handler).toHaveBeenCalledTimes(1);
    const ops = handler.mock.calls[0]![0] as Operation[];
    expect(ops[0]!.type).toBe('setCellValue');
    expect(ops[0]!.payload.value).toBe(1);
  });

  it('on returns a disposer that unsubscribes', () => {
    const wb = createWorkbook();
    const handler = vi.fn();
    const off = wb.on('operationApplied', handler);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    off();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 2 } }]);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('Core events — selectionChanged', () => {
  it('fires after setSelection operation', () => {
    const wb = createWorkbook();
    const handler = vi.fn();
    wb.on('selectionChanged', handler);
    wb.apply([{ type: 'setSelection', payload: { selection: { sheet: 0, startRow: 0, startCol: 0, endRow: 1, endCol: 1 } } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    const p = handler.mock.calls[0]![0];
    expect(p.selection).toEqual({ sheet: 0, startRow: 0, startCol: 0, endRow: 1, endCol: 1 });
  });

  it('fires with null when selection cleared', () => {
    const wb = createWorkbook();
    const handler = vi.fn();
    wb.on('selectionChanged', handler);
    wb.apply([{ type: 'setSelection', payload: { selection: null } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]![0].selection).toBe(null);
  });
});

describe('Core events — sorted/filtered', () => {
  it('sorted fires after sort.set operation', () => {
    const wb = createWorkbook({ modules: [SortModule] });
    const handler = vi.fn();
    wb.on('sorted', handler);
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]![0].sortBy).toEqual([{ col: 0, order: 'asc' }]);
  });

  it('sorted fires with empty sortBy on sort.clear', () => {
    const wb = createWorkbook({ modules: [SortModule] });
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    const handler = vi.fn();
    wb.on('sorted', handler);
    wb.apply([{ type: 'sort.clear', payload: { sheet: 0 } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]![0].sortBy).toEqual([]);
  });

  it('filtered fires after filter.set operation', () => {
    const wb = createWorkbook({ modules: [FilterModule] });
    const handler = vi.fn();
    wb.on('filtered', handler);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 0, condition: { type: 'include', values: ['a'] } } }]);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('Core events — edit lifecycle', () => {
  it('editStart / editEnd / editCancel emit on respective ops', () => {
    const wb = createWorkbook({ modules: [EditModule] });
    const start = vi.fn();
    const end = vi.fn();
    const cancel = vi.fn();
    wb.on('editStart', start);
    wb.on('editEnd', end);
    wb.on('editCancel', cancel);

    wb.apply([{ type: 'edit.start', payload: { sheet: 0, row: 1, col: 2 } }]);
    expect(start).toHaveBeenCalledWith({ sheet: 0, row: 1, col: 2 });

    wb.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 1, col: 2, value: 'hi' } }]);
    expect(end).toHaveBeenCalledWith({ sheet: 0, row: 1, col: 2, value: 'hi' });

    wb.apply([{ type: 'edit.start', payload: { sheet: 0, row: 3, col: 4 } }]);
    wb.apply([{ type: 'edit.cancel', payload: {} }]);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('copied / pasted emit on respective ops', () => {
    const wb = createWorkbook({ modules: [EditModule] });
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    const copied = vi.fn();
    const pasted = vi.fn();
    wb.on('copied', copied);
    wb.on('pasted', pasted);

    wb.apply([{ type: 'edit.copy', payload: { sheet: 0, range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 } } }]);
    expect(copied).toHaveBeenCalledTimes(1);
    expect(copied.mock.calls[0]![0].range).toEqual({ startRow: 0, endRow: 0, startCol: 0, endCol: 0 });

    wb.apply([{ type: 'edit.paste', payload: { sheet: 0, row: 5, col: 5 } }]);
    expect(pasted).toHaveBeenCalledTimes(1);
    expect(pasted.mock.calls[0]![0]).toEqual({ sheet: 0, row: 5, col: 5 });
  });
});

describe('Core events — collapse', () => {
  it('emits on pivot.toggleCollapse', () => {
    const wb = createWorkbook({ modules: allModules });
    wb.registerDataSource('sales', [
      { province: '浙江', city: '杭州', price: 10 },
      { province: '浙江', city: '宁波', price: 20 },
    ]);
    wb.apply([{
      type: 'pivot.setConfig',
      payload: { sheet: 0, dataSourceId: 'sales', rows: ['province', 'city'], columns: [], values: ['price'], valueAggregation: { price: 'SUM' } },
    }]);
    const handler = vi.fn();
    wb.on('collapse', handler);
    wb.apply([{ type: 'pivot.toggleCollapse', payload: { sheet: 0, nodeId: 'province=浙江' } }]);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]![0].nodeId).toBe('province=浙江');
  });
});

describe('Module response order vs event dispatch', () => {
  it('module onOperationApplied fires before listener (model already mutated)', () => {
    const order: string[] = [];
    const wb = createWorkbook({
      modules: [
        {
          name: 'tracker',
          state: () => ({}),
          lifecycle: {
            onOperationApplied() {
              order.push('module');
            },
          },
        },
      ],
    });
    wb.on('operationApplied', () => order.push('listener'));
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(order).toEqual(['module', 'listener']);
  });
});

describe('TypedEmitter foundation', () => {
  it('multiple listeners on same event all fire', () => {
    const wb = createWorkbook();
    const a = vi.fn();
    const b = vi.fn();
    wb.on('operationApplied', a);
    wb.on('operationApplied', b);
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('disposer for one listener does not affect another', () => {
    const wb = createWorkbook();
    const a = vi.fn();
    const b = vi.fn();
    const offA = wb.on('operationApplied', a);
    wb.on('operationApplied', b);
    offA();
    wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 1 } }]);
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});
