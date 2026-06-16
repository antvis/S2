import { describe, it, expect } from 'vitest';
import { createWorkbook, FilterModule, SortModule, EditModule, ConditionalFormatModule } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';

function createTestWorkbook(modules = [FilterModule, SortModule, EditModule, ConditionalFormatModule]) {
  const workbook = createWorkbook({ modules });
  const ops = [
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Sales' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 2, value: 'Revenue' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Alice' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 150 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 2, value: 450 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Bob' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 1, value: 280 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 2, value: 680 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 'Carol' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 1, value: 90 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 2, value: 220 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 4, col: 0, value: 'Dave' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 4, col: 1, value: 340 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 4, col: 2, value: 850 } },
  ];
  workbook.apply(ops);
  return workbook;
}

function getLayoutCellRows(workbook: ReturnType<typeof createWorkbook>): number[] {
  const model = workbook.__getModel();
  const layout = new LayoutEngine(model, workbook.query);
  const plan = layout.computeLayoutPlan(800, 600);
  const dataRows = new Set<number>();
  for (const cell of plan.cells) {
    dataRows.add(cell.row);
  }
  return [...dataRows].sort((a, b) => a - b);
}

describe('Cross-layer integration: Filter → Layout', () => {
  it('filter.set hides rows from layout plan cells', () => {
    const workbook = createTestWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    const visibleRows = getLayoutCellRows(workbook);
    // Row 0 (header), Row 1 (Alice 150 ≤ 200 → hidden), Row 2 (Bob 280 → visible),
    // Row 3 (Carol 90 ≤ 200 → hidden), Row 4 (Dave 340 → visible)
    expect(visibleRows).not.toContain(1);
    expect(visibleRows).not.toContain(3);
    expect(visibleRows).toContain(0);
    expect(visibleRows).toContain(2);
    expect(visibleRows).toContain(4);
  });

  it('filter.clear restores all rows in layout plan', () => {
    const workbook = createTestWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    // Verify hidden first
    let rows = getLayoutCellRows(workbook);
    expect(rows).not.toContain(1);

    // Clear filter
    workbook.apply([{ type: 'filter.clear', payload: { sheet: 0 } }]);
    rows = getLayoutCellRows(workbook);
    expect(rows).toContain(0);
    expect(rows).toContain(1);
    expect(rows).toContain(2);
    expect(rows).toContain(3);
    expect(rows).toContain(4);
  });

  it('hidden rows do not occupy layout space (no gaps)', () => {
    const workbook = createTestWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    const model = workbook.__getModel();
    const layout = new LayoutEngine(model, workbook.query);
    const plan = layout.computeLayoutPlan(800, 600);

    // Visible cells should have consecutive y positions (no empty gaps)
    const ys = plan.cells
      .filter((c) => c.col === 0)
      .map((c) => c.y)
      .sort((a, b) => a - b);

    for (let i = 1; i < ys.length; i++) {
      const gap = ys[i]! - ys[i - 1]!;
      // Gap should be exactly one row height (28px default), not double
      expect(gap).toBeLessThanOrEqual(28);
    }
  });
});

describe('Cross-layer integration: Sort + Filter', () => {
  it('sort then filter correctly hides by data row value, not visual position', () => {
    const workbook = createTestWorkbook();

    // Sort by Name descending: Dave(4), Carol(3), Bob(2), Alice(1) — visual order
    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] },
    }]);

    // Filter Sales > 200: Alice(150)=hidden, Carol(90)=hidden, Bob(280)=visible, Dave(340)=visible
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    const model = workbook.__getModel();
    const layout = new LayoutEngine(model, workbook.query);
    const plan = layout.computeLayoutPlan(800, 600);

    // Collect visible data rows from cells
    const visibleDataRows = new Set<number>();
    for (const cell of plan.cells) {
      visibleDataRows.add(cell.row);
    }

    // Bob (data row 2) and Dave (data row 4) should be visible
    // Alice (data row 1) and Carol (data row 3) should be hidden
    expect(visibleDataRows.has(2)).toBe(true);
    expect(visibleDataRows.has(4)).toBe(true);
    expect(visibleDataRows.has(1)).toBe(false);
    expect(visibleDataRows.has(3)).toBe(false);
  });
});

describe('Cross-layer integration: ConditionalFormat rule priority', () => {
  it('later rule takes priority over earlier rule on same cell', () => {
    const workbook = createTestWorkbook();

    // Rule A: Revenue > 300 → red background
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 2, endCol: 2 },
        rule: { type: 'greaterThan', value: 300 },
        style: { backgroundColor: '#ff0000', color: '#fff' },
      },
    }]);

    // Rule B: colorScale on same range
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 2, endCol: 2 },
        rule: { type: 'colorScale', min: '#ffffff', max: '#1890ff' },
      },
    }]);

    // Cell with Revenue=680 (Bob, row 2) — matches both rules, colorScale (later) should win
    const style = workbook.query.moduleQuery('conditionalFormat.getCellStyle', {
      sheet: 0, row: 2, col: 2,
    }) as { backgroundColor?: string } | null;

    expect(style).not.toBeNull();
    // colorScale returns interpolated color, not #ff0000
    expect(style!.backgroundColor).not.toBe('#ff0000');
    expect(style!.backgroundColor).toBeDefined();
  });
});

describe('Cross-layer integration: Edit copy/paste', () => {
  it('edit.copy stores correct data in clipboard state', () => {
    const workbook = createTestWorkbook();

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 0, endRow: 1, startCol: 0, endCol: 1 } },
    }]);

    const clipboard = workbook.query.moduleQuery('edit.getClipboard', {}) as {
      values: (string | number | boolean | null)[][];
      rows: number;
      cols: number;
    } | null;

    expect(clipboard).not.toBeNull();
    expect(clipboard!.rows).toBe(2);
    expect(clipboard!.cols).toBe(2);
    expect(clipboard!.values[0]).toEqual(['Name', 'Sales']);
    expect(clipboard!.values[1]).toEqual(['Alice', 150]);
  });

  it('edit.paste writes clipboard data to target location', () => {
    const workbook = createTestWorkbook();

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 1, endRow: 2, startCol: 0, endCol: 1 } },
    }]);

    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 1, col: 3 },
    }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 3 })).toBe('Alice');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 4 })).toBe(150);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 3 })).toBe('Bob');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 4 })).toBe(280);
  });

  it('edit.paste is undoable and restores original values', () => {
    const workbook = createTestWorkbook();

    workbook.apply([{
      type: 'edit.copy',
      payload: { sheet: 0, range: { startRow: 1, endRow: 1, startCol: 0, endCol: 0 } },
    }]);

    // Paste "Alice" into cell that has "Bob"
    workbook.apply([{
      type: 'edit.paste',
      payload: { sheet: 0, row: 2, col: 0 },
    }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Alice');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Bob');
  });
});

describe('Cross-layer integration: Undo/Redo with filter and sort', () => {
  it('undo filter.set restores hidden rows', () => {
    const workbook = createTestWorkbook();

    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    const isHidden = (row: number) =>
      workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row }) as boolean;

    expect(isHidden(1)).toBe(true); // Alice hidden

    workbook.undo();
    expect(isHidden(1)).toBe(false); // Alice restored
    expect(isHidden(3)).toBe(false); // Carol restored
  });

  it('undo sort.set restores original row order', () => {
    const workbook = createTestWorkbook();

    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'desc' }] },
    }]);

    const getOrder = () =>
      workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 }) as number[] | null;

    expect(getOrder()).not.toBeNull();

    workbook.undo();
    // After undo, sort state should be cleared (empty sortBy → rowOrder cleared)
    const order = getOrder();
    expect(order === null || order.length === 0).toBe(true);
  });

  it('redo filter.set re-applies the filter', () => {
    const workbook = createTestWorkbook();

    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    workbook.undo();

    const isHidden = (row: number) =>
      workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row }) as boolean;

    expect(isHidden(1)).toBe(false); // undone

    workbook.redo();
    expect(isHidden(1)).toBe(true); // re-applied
  });
});
