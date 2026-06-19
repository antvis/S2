import { describe, it, expect } from 'vitest';
import { createWorkbook, SortModule, FilterModule } from '../src/index';

function createTestWorkbook() {
  const wb = createWorkbook({ modules: [SortModule, FilterModule] });
  // Header row
  wb.apply([
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 0, value: 'Name' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 1, value: 'Sales' } },
    { type: 'setCellValue', payload: { sheet: 0, row: 0, col: 2, value: 'Region' } },
  ]);
  // Data rows
  const data = [
    ['Alice', 150, 'East'],
    ['Bob', 280, 'West'],
    ['Carol', 90, 'East'],
    ['Dave', 340, 'North'],
    ['Eve', 200, 'West'],
  ];
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r]!.length; c++) {
      wb.apply([{ type: 'setCellValue', payload: { sheet: 0, row: r + 1, col: c, value: data[r]![c] } }]);
    }
  }
  return wb;
}

function getVisibleRows(wb: ReturnType<typeof createWorkbook>, sheet: number): number[] {
  let rowOrder: number[] | null = null;
  let hiddenRows: Set<number> | null = null;
  try { rowOrder = wb.query.moduleQuery('sort.getRowOrder', { sheet }) as number[] | null; } catch {}
  try { hiddenRows = wb.query.moduleQuery('filter.getHiddenRows', { sheet }) as Set<number> | null; } catch {}

  const sheetState = wb.__getModel().getSheet(sheet);
  if (!sheetState) return [0];

  let maxRow = 0;
  for (const [row] of sheetState.cells) {
    if (row > maxRow) maxRow = row;
  }

  const dataRows = rowOrder ?? Array.from({ length: maxRow }, (_, i) => i + 1);
  const visible = [0];
  for (const r of dataRows) {
    if (!hiddenRows?.has(r)) visible.push(r);
  }
  return visible;
}

function queryVisibleRange(wb: ReturnType<typeof createWorkbook>, sheet: number, startRow: number, endRow: number, startCol: number, endCol: number) {
  const visible = getVisibleRows(wb, sheet);
  const result: (string | number | boolean | null)[][] = [];
  for (let vi = startRow; vi <= endRow && vi < visible.length; vi++) {
    const modelRow = visible[vi]!;
    const rowData: (string | number | boolean | null)[] = [];
    for (let col = startCol; col <= endCol; col++) {
      rowData.push(wb.query.getCellDisplayValue({ sheet, row: modelRow, col }));
    }
    result.push(rowData);
  }
  return result;
}

describe('MCP visible row mapping', () => {
  it('no sort/filter — same as raw queryRange', () => {
    const wb = createTestWorkbook();
    const raw = wb.query.queryRange({ sheet: 0, range: { startRow: 0, endRow: 5, startCol: 0, endCol: 0 } });
    const mapped = queryVisibleRange(wb, 0, 0, 5, 0, 0);
    expect(mapped).toEqual(raw);
  });

  it('sort desc by Sales — visible rows reordered', () => {
    const wb = createTestWorkbook();
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] } }]);

    const names = queryVisibleRange(wb, 0, 1, 5, 0, 0).map(r => r[0]);
    // Dave(340) > Bob(280) > Eve(200) > Alice(150) > Carol(90)
    expect(names).toEqual(['Dave', 'Bob', 'Eve', 'Alice', 'Carol']);
  });

  it('filter East — hidden rows skipped', () => {
    const wb = createTestWorkbook();
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 2, condition: { type: 'include', values: ['East'] } } }]);

    const visible = getVisibleRows(wb, 0);
    expect(visible.length - 1).toBe(2); // Alice + Carol

    const names = queryVisibleRange(wb, 0, 1, 2, 0, 0).map(r => r[0]);
    expect(names).toEqual(['Alice', 'Carol']);
  });

  it('sort + filter combo', () => {
    const wb = createTestWorkbook();
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] } }]);
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 2, condition: { type: 'include', values: ['East'] } } }]);

    const names = queryVisibleRange(wb, 0, 1, 2, 0, 0).map(r => r[0]);
    // Alice(150, East) and Carol(90, East), sorted desc: Alice > Carol
    expect(names).toEqual(['Alice', 'Carol']);
  });

  it('undo filter — rows restored', () => {
    const wb = createTestWorkbook();
    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 2, condition: { type: 'include', values: ['East'] } } }]);

    let visible = getVisibleRows(wb, 0);
    expect(visible.length - 1).toBe(2);

    wb.undo();

    visible = getVisibleRows(wb, 0);
    expect(visible.length - 1).toBe(5);
  });

  it('undo sort — order restored', () => {
    const wb = createTestWorkbook();
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] } }]);

    let names = queryVisibleRange(wb, 0, 1, 5, 0, 0).map(r => r[0]);
    expect(names[0]).toBe('Dave');

    wb.undo();

    names = queryVisibleRange(wb, 0, 1, 5, 0, 0).map(r => r[0]);
    expect(names[0]).toBe('Alice');
  });

  it('getRowCount reflects filter', () => {
    const wb = createTestWorkbook();
    expect(getVisibleRows(wb, 0).length - 1).toBe(5);

    wb.apply([{ type: 'filter.set', payload: { sheet: 0, col: 2, condition: { type: 'include', values: ['East'] } } }]);
    expect(getVisibleRows(wb, 0).length - 1).toBe(2);
  });

  it('reverse mapping — visible row index resolves to model row', () => {
    const wb = createTestWorkbook();
    wb.apply([{ type: 'sort.set', payload: { sheet: 0, sortBy: [{ col: 1, order: 'desc' }] } }]);

    const visible = getVisibleRows(wb, 0);
    // visible[1] should be model row 4 (Dave, highest Sales)
    const modelRow = visible[1]!;
    const name = wb.query.getCellDisplayValue({ sheet: 0, row: modelRow, col: 0 });
    expect(name).toBe('Dave');
  });
});
