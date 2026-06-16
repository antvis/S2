import { describe, it, expect } from 'vitest';
import { createWorkbook, FilterModule, SortModule, FreezeModule, EditModule, ConditionalFormatModule, FormulaModule, PivotModule } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';

// ─── Helpers ───────────────────────────────────────────────────────────

function createDetailWorkbook() {
  const workbook = createWorkbook({ modules: [FilterModule, SortModule, FreezeModule, EditModule, ConditionalFormatModule, FormulaModule] });
  workbook.apply([
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
  ]);
  return workbook;
}

function getLayoutPlan(workbook: ReturnType<typeof createWorkbook>, freeze?: { frozenRows: number; frozenCols: number } | null) {
  const model = workbook.__getModel();
  const layout = new LayoutEngine(model, workbook.query);
  return layout.computeLayoutPlan(800, 600, freeze);
}

// ─── Snapshot / Serialize round-trip ──────────────────────────────────

describe('Stability: Snapshot round-trip', () => {
  it('toJSON + createWorkbook restores cell data', () => {
    const wb1 = createDetailWorkbook();
    const json = wb1.toJSON();
    const wb2 = createWorkbook({ snapshot: json, modules: [FilterModule, SortModule] });

    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('Alice');
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 4, col: 1 })).toBe(340);
  });

  it('toJSON + createWorkbook restores conditional format rules', () => {
    const wb1 = createDetailWorkbook();
    wb1.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 1, endRow: 4, startCol: 1, endCol: 1 },
        rule: { type: 'greaterThan', value: 200 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ snapshot: json, modules: [ConditionalFormatModule] });

    const rules = wb2.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rules.length).toBe(1);
  });

  it('snapshot does not include undo stack', () => {
    const wb1 = createDetailWorkbook();
    wb1.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Changed' } }]);
    expect(wb1.canUndo()).toBe(true);

    const json = wb1.toJSON();
    const wb2 = createWorkbook({ snapshot: json });
    expect(wb2.canUndo()).toBe(false);
  });
});

// ─── Multi-operation atomicity ───────────────────────────────────────

describe('Stability: Operation atomicity', () => {
  it('batch apply is one undo step', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'X' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Y' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 3, col: 0, value: 'Z' } },
    ]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('X');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Y');

    workbook.undo(); // single undo reverses all 3

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('Alice');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Bob');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('Carol');
  });

  it('failed operation rolls back all previous ops in batch', () => {
    const workbook = createDetailWorkbook();
    const before = workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 });

    expect(() => {
      workbook.apply([
        { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Changed' } },
        { type: 'nonexistent.operation', payload: {} },
      ]);
    }).toThrow();

    // First op should have been rolled back
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(before);
  });
});

// ─── Import/Export round-trip ────────────────────────────────────────

describe('Stability: CSV Import', () => {
  it('importCSV parses and populates cells', () => {
    const workbook = createWorkbook();
    workbook.importCSV('Name,Score\nAlice,100\nBob,200');

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('Name');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('Score');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('Alice');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(100);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe(200);
  });

  it('importCSV handles quoted fields with commas and quotes', () => {
    const workbook = createWorkbook();
    workbook.importCSV('A,B\n"has, comma","has ""quotes"""');

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('has, comma');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe('has "quotes"');
  });

  it('exportCSV → importCSV round-trip preserves data', () => {
    const wb1 = createDetailWorkbook();
    const csv = wb1.exportCSV();

    const wb2 = createWorkbook();
    wb2.importCSV(csv);

    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('Name');
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('Alice');
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(150);
    expect(wb2.query.getCellDisplayValue({ sheet: 0, row: 4, col: 1 })).toBe(340);
  });

  it('importCSV is undoable as one batch', () => {
    const workbook = createWorkbook();
    workbook.importCSV('A,B\n1,2');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('A');

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });
});

// ─── Formula edge cases ──────────────────────────────────────────────

describe('Stability: Formula edge cases', () => {
  it('setCellValue on a formula cell clears the formula', () => {
    const workbook = createWorkbook({ modules: [FormulaModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);

    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 999 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(999);

    // Formula should be gone
    const formula = workbook.query.moduleQuery('formula.getFormula', { sheet: 0, row: 1, col: 0 });
    expect(formula).toBeNull();
  });

  it('formula referencing empty cell treats it as 0', () => {
    const workbook = createWorkbook({ modules: [FormulaModule] });
    workbook.apply([
      { type: 'formula.setFormula', payload: { sheet: 0, row: 0, col: 0, formula: '=A2+10' } },
    ]);
    // A2 is empty → should be treated as 0 → result = 10
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
  });

  it('chained formulas compute correctly', () => {
    const workbook = createWorkbook({ modules: [FormulaModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 5 } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 1, col: 0, formula: '=A1*2' } },
      { type: 'formula.setFormula', payload: { sheet: 0, row: 2, col: 0, formula: '=A2+3' } },
    ]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(10);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(13);

    // Change source → both should update
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 10 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(23);
  });
});

// ─── Export correctness ──────────────────────────────────────────────

describe('Stability: Export', () => {
  it('exportCSV includes all data with correct escaping', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Note' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 0, value: 'Alice' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 1, col: 1, value: 'has, comma' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 0, value: 'Bob' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 2, col: 1, value: 'has "quotes"' } },
    ]);

    const csv = workbook.exportCSV();
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Name,Note');
    expect(lines[1]).toBe('Alice,"has, comma"');
    expect(lines[2]).toBe('Bob,"has ""quotes"""');
  });

  it('exportTSV uses tab delimiter', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'A' } },
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'B' } },
    ]);
    const tsv = workbook.exportTSV();
    expect(tsv).toBe('A\tB');
  });
});

// ─── QueryLayer cache invalidation ──────────────────────────────────

describe('Stability: QueryLayer cache', () => {
  it('getCellDisplayValue reflects latest value after apply', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'v1' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('v1');

    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'v2' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('v2');
  });

  it('queryRange returns correct rectangle of values', () => {
    const workbook = createDetailWorkbook();
    const range = workbook.query.queryRange({
      sheet: 0,
      range: { startRow: 0, endRow: 1, startCol: 0, endCol: 2 },
    });
    expect(range).toEqual([
      ['Name', 'Sales', 'Revenue'],
      ['Alice', 150, 450],
    ]);
  });

  it('deleteCellValue makes getCellDisplayValue return null', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'hello' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('hello');

    workbook.apply([{ type: 'deleteCellValue', payload: { sheet: 0, row: 0, col: 0 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });
});

// ─── Dimension operations ────────────────────────────────────────────

describe('Stability: Row/Column operations', () => {
  it('setRowHeight persists and affects layout', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'setRowHeight', payload: { sheet: 0, row: 1, height: 60 } }]);

    const plan = getLayoutPlan(workbook);
    const row1Cells = plan.cells.filter((c) => c.row === 1);
    if (row1Cells.length > 0) {
      expect(row1Cells[0]!.height).toBe(60);
    }
  });

  it('setColumnWidth persists and affects layout', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'setColumnWidth', payload: { sheet: 0, col: 0, width: 200 } }]);

    const plan = getLayoutPlan(workbook);
    const col0Cells = plan.cells.filter((c) => c.col === 0);
    if (col0Cells.length > 0) {
      expect(col0Cells[0]!.width).toBe(200);
    }
  });

  it('undo setRowHeight restores default', () => {
    const workbook = createDetailWorkbook();
    const planBefore = getLayoutPlan(workbook);
    const heightBefore = planBefore.cells.find((c) => c.row === 1)?.height;

    workbook.apply([{ type: 'setRowHeight', payload: { sheet: 0, row: 1, height: 100 } }]);
    workbook.undo();

    const planAfter = getLayoutPlan(workbook);
    const heightAfter = planAfter.cells.find((c) => c.row === 1)?.height;
    expect(heightAfter).toBe(heightBefore);
  });

  it('insertRows shifts data down', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'insertRows', payload: { sheet: 0, index: 2, count: 1 } }]);

    // Bob was at row 2, now should be at row 3
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('Bob');
    // Row 2 should be empty
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBeNull();
  });

  it('deleteRows removes data and shifts up', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'deleteRows', payload: { sheet: 0, index: 2, count: 1 } }]);

    // Carol was at row 3, now at row 2
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Carol');
  });

  it('undo deleteRows restores data', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'deleteRows', payload: { sheet: 0, index: 2, count: 1 } }]);
    workbook.undo();

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('Bob');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('Carol');
  });
});

// ─── Pivot data source update ────────────────────────────────────────

describe('Stability: Pivot data source', () => {
  it('registerDataSource triggers pivot recalc', () => {
    const workbook = createWorkbook({ modules: [PivotModule] });
    workbook.registerDataSource('test', [
      { region: 'East', revenue: 100 },
      { region: 'West', revenue: 200 },
    ]);
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'test',
        rows: ['region'], columns: [],
        values: ['revenue'], valueAggregation: { revenue: 'SUM' },
      },
    }]);

    const v0 = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(v0).toBe(100); // East

    // Update data source
    workbook.registerDataSource('test', [
      { region: 'East', revenue: 500 },
      { region: 'West', revenue: 200 },
    ]);

    const v0After = workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(v0After).toBe(500);
  });

  it('pivot.clearConfig removes all cells', () => {
    const workbook = createWorkbook({ modules: [PivotModule] });
    workbook.registerDataSource('test', [
      { region: 'East', revenue: 100 },
    ]);
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'test',
        rows: ['region'], columns: [],
        values: ['revenue'], valueAggregation: { revenue: 'SUM' },
      },
    }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).not.toBeNull();

    workbook.apply([{ type: 'pivot.clearConfig', payload: { sheet: 0 } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBeNull();
  });
});

// ─── Sheet operations ────────────────────────────────────────────────

describe('Stability: Sheet operations', () => {
  it('createSheet + write data to new sheet', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'createSheet', payload: { name: 'Sheet2' } }]);
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 'New' } }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 1, row: 0, col: 0 })).toBe('New');
  });

  it('deleteSheet + undo restores sheet data', () => {
    const workbook = createWorkbook();
    workbook.apply([{ type: 'createSheet', payload: { name: 'Sheet2' } }]);
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 1, row: 0, col: 0, value: 'Data' } }]);
    workbook.apply([{ type: 'deleteSheet', payload: { sheet: 1 } }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 1, row: 0, col: 0 })).toBeNull();

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 1, row: 0, col: 0 })).toBe('Data');
  });

  it('renameSheet is undoable', () => {
    const workbook = createWorkbook();
    const model = workbook.__getModel();
    const sheet = model.getSheet(0);
    const oldName = sheet?.name;

    workbook.apply([{ type: 'renameSheet', payload: { sheet: 0, name: 'MySheet' } }]);
    expect(model.getSheet(0)?.name).toBe('MySheet');

    workbook.undo();
    expect(model.getSheet(0)?.name).toBe(oldName);
  });
});

// ─── Filter condition types ─────────────────────────────────────────

describe('Stability: Filter condition coverage', () => {
  it('lessThan condition', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'lessThan', value: 150 } },
    }]);
    // Carol(90) < 150 → visible, others hidden
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 3 })).toBe(false);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(true);
  });

  it('between condition', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'between', min: 100, max: 200 } },
    }]);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 1 })).toBe(false); // Alice 150
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(true);  // Bob 280
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 3 })).toBe(true);  // Carol 90 < 100
  });

  it('contains condition', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 0, condition: { type: 'contains', text: 'ob' } },
    }]);
    // Bob contains "ob", others don't
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 1 })).toBe(true);  // Alice
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(false); // Bob
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 3 })).toBe(true);  // Carol
  });

  it('multiple filter rules on different columns (AND logic)', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 1, condition: { type: 'greaterThan', value: 100 } },
    }]);
    workbook.apply([{
      type: 'filter.set',
      payload: { sheet: 0, col: 2, condition: { type: 'lessThan', value: 700 } },
    }]);
    // Alice: Sales 150>100 ✓, Revenue 450<700 ✓ → visible
    // Bob: Sales 280>100 ✓, Revenue 680<700 ✓ → visible
    // Carol: Sales 90>100 ✗ → hidden
    // Dave: Sales 340>100 ✓, Revenue 850<700 ✗ → hidden
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 1 })).toBe(false);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 2 })).toBe(false);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 3 })).toBe(true);
    expect(workbook.query.moduleQuery('filter.isRowHidden', { sheet: 0, row: 4 })).toBe(true);
  });
});

// ─── Conditional format edge cases ──────────────────────────────────

describe('Stability: ConditionalFormat edge cases', () => {
  it('colorScale on single value returns min color', () => {
    const workbook = createWorkbook({ modules: [ConditionalFormatModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 42 } },
    ]);
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 },
        rule: { type: 'colorScale', min: '#ffffff', max: '#0000ff' },
      },
    }]);

    const style = workbook.query.moduleQuery('conditionalFormat.getCellStyle', {
      sheet: 0, row: 0, col: 0,
    }) as { backgroundColor?: string } | null;
    // Single value → min === max → returns min color
    expect(style).not.toBeNull();
    expect(style!.backgroundColor).toBe('#ffffff');
  });

  it('rule on non-numeric cell with greaterThan does not match', () => {
    const workbook = createWorkbook({ modules: [ConditionalFormatModule] });
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'text' } },
    ]);
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 0, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 100 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    const style = workbook.query.moduleQuery('conditionalFormat.getCellStyle', {
      sheet: 0, row: 0, col: 0,
    });
    expect(style).toBeNull();
  });
});

// ─── Style operations ────────────────────────────────────────────────

describe('Stability: Cell style', () => {
  it('setCellStyle persists and is undoable', () => {
    const workbook = createWorkbook();
    workbook.apply([
      { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Styled' } },
      { type: 'setCellStyle', payload: { sheet: 0, row: 0, col: 0, style: { bold: true, color: '#ff0000' } } },
    ]);

    const cell = workbook.query.getCellRawValue({ sheet: 0, row: 0, col: 0 });
    expect(cell?.style?.bold).toBe(true);

    workbook.undo(); // undo style
    const cellAfter = workbook.query.getCellRawValue({ sheet: 0, row: 0, col: 0 });
    expect(cellAfter?.style?.bold).toBeUndefined();
  });
});

// ─── Hide Rows/Columns ──────────────────────────────────────────────

describe('Stability: Hide rows/columns', () => {
  it('hideRows sets height to 0, showRows restores', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'hideRows', payload: { sheet: 0, rows: [2, 3] } }]);

    const model = workbook.__getModel();
    expect(model.getRow(0, 2)?.height).toBe(0);
    expect(model.getRow(0, 3)?.height).toBe(0);

    workbook.undo();
    expect(model.getRow(0, 2)?.height).toBe(28);
    expect(model.getRow(0, 3)?.height).toBe(28);
  });

  it('hideColumns sets width to 0, undo restores', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'hideColumns', payload: { sheet: 0, cols: [1] } }]);

    const model = workbook.__getModel();
    expect(model.getColumn(0, 1)?.width).toBe(0);

    workbook.undo();
    expect(model.getColumn(0, 1)?.width).toBe(100);
  });

  it('hidden rows excluded from layout cells', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'hideRows', payload: { sheet: 0, rows: [2] } }]);

    const plan = getLayoutPlan(workbook);
    const row2Cells = plan.cells.filter((c) => c.row === 2);
    expect(row2Cells.length).toBe(0);
  });
});

// ─── Merge cells rendering ──────────────────────────────────────────

describe('Stability: Merge cells', () => {
  it('merge + query still returns value at top-left', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'mergeCells', payload: { sheet: 0, startRow: 0, endRow: 0, startCol: 0, endCol: 1 } }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('Name');
    expect(workbook.query.getMerges(0).length).toBe(1);
  });

  it('undo merge removes merge', () => {
    const workbook = createDetailWorkbook();
    workbook.apply([{ type: 'mergeCells', payload: { sheet: 0, startRow: 0, endRow: 0, startCol: 0, endCol: 1 } }]);
    workbook.undo();
    expect(workbook.query.getMerges(0).length).toBe(0);
  });
});

// ─── Custom Module renderer ─────────────────────────────────────────

describe('Stability: Custom module renderer', () => {
  it('custom renderer function is collected and accessible', () => {
    let rendererCalled = false;
    const CustomModule: import('../src/module/types').ModuleDefinition = {
      name: 'custom',
      state: () => ({}),
      operations: {},
      queries: {},
      renderers: {
        'custom.highlight': (_ctx, _box, _query) => {
          rendererCalled = true;
        },
      },
    };

    const workbook = createWorkbook({ modules: [CustomModule] });
    const renderers = workbook.getModuleRenderers();
    expect(renderers.length).toBe(1);

    // Simulate calling the renderer
    renderers[0]!(null as any, { sheet: 0, row: 0, col: 0, x: 0, y: 0, width: 100, height: 28 }, { moduleQuery: () => null });
    expect(rendererCalled).toBe(true);
  });
});
