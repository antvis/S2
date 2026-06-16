import { describe, it, expect } from 'vitest';
import { createWorkbook, FilterModule, SortModule, FreezeModule, EditModule, ConditionalFormatModule, FormulaModule, PivotModule } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';

// ─── Helpers ───────────────────────────────────────────────────────────

function createDetailWorkbook() {
  const workbook = createWorkbook({ modules: [FilterModule, SortModule, FreezeModule, EditModule, ConditionalFormatModule, FormulaModule] });
  workbook.apply([
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Sales' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Alice' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 150 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Bob' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 1, value: 280 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 'Carol' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 1, value: 90 } },
    { type: 'setCellValue', payload: { sheet: 0, row: 4, col: 0, value: 'Dave' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 4, col: 1, value: 340 } },
  ]);
  return workbook;
}

function createPivotWorkbook() {
  const workbook = createWorkbook({ modules: [PivotModule] });
  const data = [
    { region: 'East', product: 'A', revenue: 100 },
    { region: 'East', product: 'B', revenue: 200 },
    { region: 'West', product: 'A', revenue: 150 },
    { region: 'West', product: 'B', revenue: 250 },
  ];
  workbook.registerDataSource('test', data);
  workbook.apply([{
    type: 'pivot.setConfig',
    payload: {
      sheet: 0, dataSourceId: 'test',
      rows: ['region'], columns: ['product'],
      values: ['revenue'], valueAggregation: { revenue: 'SUM' },
    },
  }]);
  return workbook;
}

function getLayoutPlan(workbook: ReturnType<typeof createWorkbook>, freeze?: { frozenRows: number; frozenCols: number } | null) {
  const model = workbook.__getModel();
  const layout = new LayoutEngine(model, workbook.query);
  return layout.computeLayoutPlan(800, 600, freeze);
}

function getCellDataRows(workbook: ReturnType<typeof createWorkbook>, freeze?: { frozenRows: number; frozenCols: number } | null): Set<number> {
  const plan = getLayoutPlan(workbook, freeze);
  const rows = new Set<number>();
  for (const c of plan.cells) rows.add(c.row);
  for (const c of plan.frozenCells) rows.add(c.row);
  return rows;
}

// ─── 1. Undo/Redo completeness ────────────────────────────────────────

describe('Stability: Undo/Redo completeness', () => {
  it('undo pivot.drill restores original pivot config', () => {
    const workbook = createPivotWorkbook();
    const configBefore = workbook.query.moduleQuery('pivot.getConfig', { sheet: 0 }) as { rows: string[] };
    expect(configBefore.rows).toEqual(['region']);

    workbook.apply([{
      type: 'pivot.drill',
      payload: { sheet: 0, dimension: 'region', value: 'East' },
    }]);
    const configDrilled = workbook.query.moduleQuery('pivot.getConfig', { sheet: 0 }) as { rows: string[] };
    expect(configDrilled.rows).not.toContain('region');

    workbook.undo();
    const configRestored = workbook.query.moduleQuery('pivot.getConfig', { sheet: 0 }) as { rows: string[] };
    expect(configRestored.rows).toEqual(['region']);
  });

  it('undo pivot.drill restores cell values', () => {
    const workbook = createPivotWorkbook();
    const valueBefore = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });

    workbook.apply([{
      type: 'pivot.drill',
      payload: { sheet: 0, dimension: 'region', value: 'East' },
    }]);

    workbook.undo();
    const valueAfter = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(valueAfter).toBe(valueBefore);
  });

  it('undo conditionalFormat.addRule removes the rule', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 1, endCol: 1 },
        rule: { type: 'greaterThan', value: 200 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    const rules = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rules.length).toBe(1);

    workbook.undo();
    const rulesAfter = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rulesAfter.length).toBe(0);
  });

  it('redo conditionalFormat.addRule re-adds the rule', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 1, endCol: 1 },
        rule: { type: 'greaterThan', value: 200 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);
    workbook.undo();
    workbook.redo();

    const rules = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rules.length).toBe(1);
  });

  it('undo clearRules restores all rules', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 1, endCol: 1 },
        rule: { type: 'greaterThan', value: 200 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 1, endCol: 1 },
        rule: { type: 'colorScale', min: '#fff', max: '#00f' },
      },
    }]);

    workbook.apply([{ type: 'conditionalFormat.clearRules', payload: { sheet: 0 } }]);
    expect((workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[]).length).toBe(0);

    workbook.undo();
    expect((workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[]).length).toBe(2);
  });
});

// ─── 2. Freeze + Filter/Sort combination ──────────────────────────────

describe('Stability: Freeze + Filter/Sort', () => {
  it('freeze + filter: frozen rows still visible, filtered rows hidden', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 0 } }]);
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    const rows = getCellDataRows(workbook, { frozenRows: 1, frozenCols: 0 });
    expect(rows.has(0)).toBe(true);  // header frozen, always visible
    expect(rows.has(2)).toBe(true);  // Bob 280 > 200
    expect(rows.has(4)).toBe(true);  // Dave 340 > 200
    expect(rows.has(1)).toBe(false); // Alice 150 ≤ 200
    expect(rows.has(3)).toBe(false); // Carol 90 ≤ 200
  });

  it('freeze + sort: frozen header stays at top, data rows sorted', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 0 } }]);
    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] },
    }]);

    const plan = getLayoutPlan(workbook, { frozenRows: 1, frozenCols: 0 });

    // Frozen row 0 should still be header
    const frozenRow0 = plan.frozenCells.filter((c) => c.col === 0);
    expect(frozenRow0.length).toBeGreaterThan(0);
    expect(frozenRow0[0]!.row).toBe(0); // mapRow(0) = 0 for header

    // First scrollable data cell col=1 should have highest value (Dave 340)
    const dataCells = plan.cells.filter((c) => c.col === 1);
    if (dataCells.length > 0) {
      const firstDataRow = dataCells[0]!.row;
      const val = workbook.query.getCellDisplayValue({ sheet: 0, row: firstDataRow, col: 1 });
      expect(val).toBe(340); // Dave has highest sales
    }
  });
});

// ─── 3. Pivot mode interaction ────────────────────────────────────────

describe('Stability: Pivot layout correctness', () => {
  it('pivot layout has correct headerArea dimensions', () => {
    const workbook = createPivotWorkbook();
    const plan = getLayoutPlan(workbook);

    expect(plan.headerArea.left).toBeGreaterThan(0);  // row headers exist
    expect(plan.headerArea.top).toBeGreaterThan(0);    // col headers exist
    expect(plan.hierarchyRowHeaders.length).toBeGreaterThan(0);
    expect(plan.hierarchyColHeaders.length).toBeGreaterThan(0);
  });

  it('pivot cells contain aggregated values', () => {
    const workbook = createPivotWorkbook();
    // East-A=100, East-B=200, West-A=150, West-B=250
    // 2 row leaves (East, West), 2 col leaves × 1 value = 2 data cols
    const plan = getLayoutPlan(workbook);
    expect(plan.cells.length).toBeGreaterThan(0);

    // Check that values are in the model
    const v00 = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    const v01 = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 });
    expect(v00).not.toBeNull();
    expect(v01).not.toBeNull();
  });

  it('pivot cornerHeaders show field names', () => {
    const workbook = createPivotWorkbook();
    const plan = getLayoutPlan(workbook);

    const labels = plan.cornerHeaders.map((h) => h.label);
    expect(labels).toContain('region');
    expect(labels).toContain('product');
  });
});

// ─── 4. Formula recalc after edit ─────────────────────────────────────

describe('Stability: Formula recalc after edit', () => {
  it('editing a cell referenced by formula triggers recalc', () => {
    const workbook = createWorkbook({ modules: [FormulaModule, EditModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 20 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=A1+A2' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(30);

    // Edit A1 via EditModule
    workbook.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 0, col: 0, value: 50 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(70);
  });

  it('undo edit.commit restores formula result', () => {
    const workbook = createWorkbook({ modules: [FormulaModule, EditModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);

    workbook.apply([{ type: 'edit.commit', payload: { sheet: 0, row: 0, col: 0, value: 100 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(200);

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);
  });
});

// ─── 5. Edge cases ────────────────────────────────────────────────────

describe('Stability: Edge cases', () => {
  it('empty workbook produces valid layout plan', () => {
    const workbook = createWorkbook({ modules: [FilterModule, SortModule] });
    const plan = getLayoutPlan(workbook);
    expect(plan.viewport.viewWidth).toBe(800);
    expect(plan.viewport.viewHeight).toBe(600);
    expect(plan.cells.length).toBeGreaterThanOrEqual(0);
  });

  it('filter that hides all data rows excludes them from cells', () => {
    const workbook = createDetailWorkbook();
    // All Sales < 1000, so greaterThan 1000 hides everything (rows 1-4)
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 1000 } },
    }]);

    const plan = getLayoutPlan(workbook);
    const dataRows = new Set<number>();
    for (const c of plan.cells) {
      if (c.row >= 1 && c.row <= 4) dataRows.add(c.row);
    }
    // All data rows (1-4) should be hidden
    expect(dataRows.size).toBe(0);
  });

  it('single row workbook with filter does not crash', () => {
    const workbook = createWorkbook({ modules: [FilterModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Only' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 42 } },
    ]);

    // Filter should not crash on single-row data (row 0 is header, no data rows to hide)
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 100 } },
    }]);

    const plan = getLayoutPlan(workbook);
    expect(plan).toBeDefined();
  });

  it('sort on empty workbook does not crash', () => {
    const workbook = createWorkbook({ modules: [SortModule] });
    workbook.apply([{
      type: 'sort.set',
      payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] },
    }]);

    const order = workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 }) as number[] | null;
    expect(order).toBeDefined();
  });

  it('filter + sort + freeze + conditionalFormat all together', () => {
    const workbook = createDetailWorkbook();

    workbook.apply([{ type: 'freeze.set', payload: { sheet: 0, frozenRows: 1, frozenCols: 1 } }]);
    workbook.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 100 } },
    }]);
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 1, endCol: 1 },
        rule: { type: 'greaterThan', value: 200 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    // Should not crash, layout plan should be valid
    const plan = getLayoutPlan(workbook, { frozenRows: 1, frozenCols: 1 });
    expect(plan).toBeDefined();
    expect(plan.frozenCells.length).toBeGreaterThan(0);

    // Carol (90 ≤ 100) should be hidden
    const rows = getCellDataRows(workbook, { frozenRows: 1, frozenCols: 1 });
    expect(rows.has(3)).toBe(false); // Carol data row
  });

  it('undo everything back to initial state', () => {
    const workbook = createDetailWorkbook();
    const initialValue = workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 });

    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Changed' } }]);
    workbook.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 0, order: 'asc' }] } }]);
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 200 } },
    }]);

    workbook.undo(); // undo filter
    workbook.undo(); // undo sort
    workbook.undo(); // undo setCellValue

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(initialValue);
    expect(workbook.query.moduleQuery('sort.getRowOrder', { sheet: 0 })).toBeNull();
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 1 })).toBe(false);
  });
});
