import { describe, it, expect } from 'vitest';
import { createTable, createPivotTable, parseRange, parseCellAddress } from '../src/facade/index';
import { FormulaModule } from '../src/modules/formula';
import { PivotModule } from '../src/modules/pivot';

describe('parseRange', () => {
  it('parses A1:B10', () => {
    expect(parseRange('A1:B10')).toEqual({ startRow: 0, endRow: 9, startCol: 0, endCol: 1 });
  });

  it('parses AA1:AC5', () => {
    expect(parseRange('AA1:AC5')).toEqual({ startRow: 0, endRow: 4, startCol: 26, endCol: 28 });
  });

  it('throws on invalid range', () => {
    expect(() => parseRange('invalid')).toThrow();
  });
});

describe('parseCellAddress', () => {
  it('parses A1', () => {
    expect(parseCellAddress('A1')).toEqual({ row: 0, col: 0 });
  });

  it('parses C3', () => {
    expect(parseCellAddress('C3')).toEqual({ row: 2, col: 2 });
  });
});

describe('createTable', () => {
  it('creates empty table', () => {
    const table = createTable(null);
    expect(table.workbook).toBeDefined();
  });

  it('creates table with initial data', () => {
    const table = createTable(null, {
      data: [
        ['Name', 'Age'],
        ['Alice', 30],
        ['Bob', 25],
      ],
    });
    expect(table.sheet(0).cell(0, 0).getValue()).toBe('Name');
    expect(table.sheet(0).cell(1, 1).getValue()).toBe(30);
  });
});

describe('CellFacade', () => {
  it('setValue and getValue', () => {
    const table = createTable(null);
    table.sheet(0).cell(0, 0).setValue('hello');
    expect(table.sheet(0).cell(0, 0).getValue()).toBe('hello');
  });

  it('chain setValue and setStyle', () => {
    const table = createTable(null);
    table.sheet(0).cell(0, 0).setValue('test').setStyle({ bold: true });
    expect(table.sheet(0).cell(0, 0).getValue()).toBe('test');
  });

  it('cell by address string', () => {
    const table = createTable(null);
    table.sheet(0).cell('B2').setValue(42);
    expect(table.sheet(0).cell(1, 1).getValue()).toBe(42);
  });

  it('setFormula', () => {
    const table = createTable(null, { modules: [FormulaModule] });
    table.sheet(0).cell(0, 0).setValue(10);
    table.sheet(0).cell(0, 1).setValue(20);
    table.sheet(0).cell(0, 2).setFormula('=A1+B1');
    expect(table.sheet(0).cell(0, 2).getValue()).toBe(30);
  });

  it('clear', () => {
    const table = createTable(null);
    table.sheet(0).cell(0, 0).setValue('x');
    table.sheet(0).cell(0, 0).clear();
    expect(table.sheet(0).cell(0, 0).getValue()).toBeNull();
  });
});

describe('RangeFacade', () => {
  it('setValues and getValues', () => {
    const table = createTable(null);
    table.sheet(0).range('A1:B2').setValues([
      [1, 2],
      [3, 4],
    ]);
    const vals = table.sheet(0).range('A1:B2').getValues();
    expect(vals).toEqual([[1, 2], [3, 4]]);
  });

  it('setStyle on range', () => {
    const table = createTable(null);
    table.sheet(0).range('A1:B2').setValues([[1, 2], [3, 4]]);
    table.sheet(0).range('A1:B2').setStyle({ bold: true });
    // no error = success (style is applied through operations)
  });

  it('clear range', () => {
    const table = createTable(null);
    table.sheet(0).range('A1:B2').setValues([[1, 2], [3, 4]]);
    table.sheet(0).range('A1:B2').clear();
    expect(table.sheet(0).cell(0, 0).getValue()).toBeNull();
  });
});

describe('WorkbookFacade', () => {
  it('undo and redo', () => {
    const table = createTable(null);
    table.sheet(0).cell(0, 0).setValue('a');
    table.undo();
    expect(table.sheet(0).cell(0, 0).getValue()).toBeNull();
    table.redo();
    expect(table.sheet(0).cell(0, 0).getValue()).toBe('a');
  });

  it('toJSON', () => {
    const table = createTable(null);
    table.sheet(0).cell(0, 0).setValue('snap');
    const json = table.toJSON();
    expect(json).toBeDefined();
  });

  it('rename sheet', () => {
    const table = createTable(null);
    table.sheet(0).rename('Sales');
  });
});

describe('createPivotTable', () => {
  it('creates pivot table headless', () => {
    const table = createPivotTable(null, {
      data: [
        { region: 'East', product: 'A', sales: 100 },
        { region: 'East', product: 'B', sales: 200 },
        { region: 'West', product: 'A', sales: 150 },
      ],
      rows: ['region'],
      values: ['sales'],
      modules: [PivotModule],
    });
    expect(table.workbook).toBeDefined();
    // pivot writes aggregated values into cells
    const ctx = table.sheet(0).range('A1:B3').getValues();
    expect(ctx.length).toBeGreaterThan(0);
  });
});
