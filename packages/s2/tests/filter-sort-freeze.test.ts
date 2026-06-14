import { describe, it, expect } from 'vitest';
import { createWorkbook, FilterModule, SortModule, FreezeModule } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';

describe('FilterModule', () => {
  it('should filter rows by include condition', () => {
    const workbook = createWorkbook({ modules: [FilterModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Type' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Alice' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Bob' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 1, value: 'B' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 'Carol' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 1, value: 'A' } },
    ]);

    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'include', values: ['A'] } },
    }]);

    const isHidden = (row: number) =>
      workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row }) as boolean;

    expect(isHidden(0)).toBe(false); // header
    expect(isHidden(1)).toBe(false); // Alice, A — visible
    expect(isHidden(2)).toBe(true);  // Bob, B — hidden
    expect(isHidden(3)).toBe(false); // Carol, A — visible
  });

  it('should filter by greaterThan', () => {
    const workbook = createWorkbook({ modules: [FilterModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Score' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 80 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 50 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 90 } },
    ]);

    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 0, condition: { type: 'greaterThan', value: 70 } },
    }]);

    const isHidden = (row: number) =>
      workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row }) as boolean;

    expect(isHidden(1)).toBe(false); // 80 > 70
    expect(isHidden(2)).toBe(true);  // 50 <= 70
    expect(isHidden(3)).toBe(false); // 90 > 70
  });

  it('should clear filter', () => {
    const workbook = createWorkbook({ modules: [FilterModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'keep' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'hide' } },
    ]);

    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 0, condition: { type: 'include', values: ['keep'] } },
    }]);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(true);

    workbook.apply([{ type: 'filter.clear', payload: { sheet: 0, col: 0 } }]);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(false);
  });

  it('should undo filter', () => {
    const workbook = createWorkbook({ modules: [FilterModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'H' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'B' } },
    ]);

    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 0, condition: { type: 'include', values: ['A'] } },
    }]);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(true);

    workbook.undo();
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(false);
  });
});

describe('SortModule', () => {
  it('should sort rows ascending by number', () => {
    const workbook = createWorkbook({ modules: [SortModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Score' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 30 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 20 } },
    ]);

    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] },
    }]);

    const order = workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 }) as number[];
    // rows 1,2,3 sorted by value: 10(row2), 20(row3), 30(row1)
    expect(order).toEqual([2, 3, 1]);
  });

  it('should sort rows descending', () => {
    const workbook = createWorkbook({ modules: [SortModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Score' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 30 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 20 } },
    ]);

    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] },
    }]);

    const order = workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 }) as number[];
    expect(order).toEqual([1, 3, 2]);
  });

  it('should sort by string', () => {
    const workbook = createWorkbook({ modules: [SortModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Charlie' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Alice' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 'Bob' } },
    ]);

    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] },
    }]);

    const order = workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 }) as number[];
    expect(order).toEqual([2, 3, 1]); // Alice(2), Bob(3), Charlie(1)
  });

  it('should clear sort', () => {
    const workbook = createWorkbook({ modules: [SortModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 2 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 1 } },
    ]);

    workbook.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    expect(workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 })).toEqual([2, 1]);

    workbook.apply([{ type: 'sort.clear', payload: { sheet: 0 } }]);
    expect(workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 })).toBe(null);
  });
});

describe('FreezeModule', () => {
  it('should set and get freeze config', () => {
    const workbook = createWorkbook({ modules: [FreezeModule] });

    workbook.apply([{
      type: 'freeze.set',
      payload: { sheet: 0, frozenRows: 2, frozenCols: 1 },
    }]);

    const config = workbook.query.moduleQuery('freeze.getConfig', { sheet: 0 }) as { frozenRows: number; frozenCols: number };
    expect(config).toEqual({ frozenRows: 2, frozenCols: 1 });
  });

  it('should clear freeze', () => {
    const workbook = createWorkbook({ modules: [FreezeModule] });
    workbook.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 3, frozenCols: 2 } }]);
    workbook.apply([{ type: 'freeze.clear', payload: { sheet: 0 } }]);
    expect(workbook.query.moduleQuery('freeze.getConfig', { sheet: 0 })).toBe(null);
  });

  it('should undo freeze', () => {
    const workbook = createWorkbook({ modules: [FreezeModule] });
    workbook.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 2, frozenCols: 1 } }]);
    expect(workbook.query.moduleQuery('freeze.getConfig', { sheet: 0 })).not.toBe(null);

    workbook.undo();
    expect(workbook.query.moduleQuery('freeze.getConfig', { sheet: 0 })).toBe(null);
  });
});

describe('Sort + Layout Integration', () => {
  it('should remap CellBox rows according to sort order', () => {
    const workbook = createWorkbook({ modules: [SortModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Charlie' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Alice' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 'Bob' } },
    ]);

    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] },
    }]);

    const layout = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = layout.computeLayoutPlan(800, 400);

    // Header row (visual row 0) → data row 0
    const headerCells = plan.cells.filter((c) => c.row === 0);
    expect(headerCells.length).toBeGreaterThan(0);

    // Visual row 1 should show Alice (data row 2)
    // Visual row 2 should show Bob (data row 3)
    // Visual row 3 should show Charlie (data row 1)
    const dataRows = plan.cells
      .filter((c) => c.col === 0 && c.row !== 0)
      .sort((a, b) => a.y - b.y)
      .map((c) => c.row);

    expect(dataRows[0]).toBe(2); // Alice
    expect(dataRows[1]).toBe(3); // Bob
    expect(dataRows[2]).toBe(1); // Charlie
  });
});
