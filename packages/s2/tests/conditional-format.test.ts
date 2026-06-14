import { describe, it, expect } from 'vitest';
import { createWorkbook, ConditionalFormatModule } from '../src/index';

function createCFWorkbook() {
  const workbook = createWorkbook({ modules: [ConditionalFormatModule] });
  for (let row = 0; row < 5; row++) {
    workbook.apply([{ type: 'setCellValue', payload: { sheet: 0, row, col: 0, value: (row + 1) * 50 } }]);
  }
  return workbook;
}

describe('ConditionalFormatModule', () => {
  it('should apply greaterThan rule', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 100 },
        style: { backgroundColor: '#ff4d4f', color: '#fff' },
      },
    }]);

    // row 0: value=50, no match
    const s0 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 });
    expect(s0).toBeNull();

    // row 2: value=150, match
    const s2 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 2, col: 0 });
    expect(s2).toEqual({ backgroundColor: '#ff4d4f', color: '#fff' });
  });

  it('should apply lessThan rule', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'lessThan', value: 100 },
        style: { backgroundColor: '#52c41a' },
      },
    }]);

    const s0 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 });
    expect(s0).toEqual({ backgroundColor: '#52c41a' });

    const s2 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 2, col: 0 });
    expect(s2).toBeNull();
  });

  it('should apply between rule', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'between', min: 100, max: 200 },
        style: { backgroundColor: '#faad14' },
      },
    }]);

    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 })).toBeNull();
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 1, col: 0 })).toEqual({ backgroundColor: '#faad14' });
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 2, col: 0 })).toEqual({ backgroundColor: '#faad14' });
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 3, col: 0 })).toEqual({ backgroundColor: '#faad14' });
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 4, col: 0 })).toBeNull();
  });

  it('should apply equal rule with number', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'equal', value: 150 },
        style: { color: '#0000ff' },
      },
    }]);

    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 2, col: 0 })).toEqual({ color: '#0000ff' });
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 })).toBeNull();
  });

  it('should apply colorScale rule with actual data range', () => {
    const workbook = createCFWorkbook();
    // data: row0=50, row1=100, row2=150, row3=200, row4=250
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'colorScale', min: '#ffffff', max: '#1890ff' },
      },
    }]);

    // row0 (50) is min, should be close to #ffffff
    const s0 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 }) as { backgroundColor: string };
    expect(s0).not.toBeNull();
    expect(s0.backgroundColor).toBe('#ffffff');

    // row4 (250) is max, should be #1890ff
    const s4 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 4, col: 0 }) as { backgroundColor: string };
    expect(s4.backgroundColor).toBe('#1890ff');

    // row2 (150) is midpoint, should be between
    const s2 = workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 2, col: 0 }) as { backgroundColor: string };
    expect(s2.backgroundColor).toMatch(/^#[0-9a-f]{6}$/);
    expect(s2.backgroundColor).not.toBe('#ffffff');
    expect(s2.backgroundColor).not.toBe('#1890ff');
  });

  it('should not match cells outside range', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 2, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 0 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 1, col: 0 })).toEqual({ backgroundColor: '#ff0000' });
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 3, col: 0 })).toBeNull();
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 1 })).toBeNull();
  });

  it('should undo addRule', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 0 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 })).not.toBeNull();

    workbook.undo();
    expect(workbook.query.moduleQuery('conditionalFormat.getCellStyle', { sheet: 0, row: 0, col: 0 })).toBeNull();
  });

  it('should remove a specific rule', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 0 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);

    const rules = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as { id: string }[];
    expect(rules).toHaveLength(1);

    workbook.apply([{
      type: 'conditionalFormat.removeRule',
      payload: { sheet: 0, ruleId: rules[0]!.id },
    }]);

    const rulesAfter = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rulesAfter).toHaveLength(0);
  });

  it('should clear all rules', () => {
    const workbook = createCFWorkbook();
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'greaterThan', value: 0 },
        style: { backgroundColor: '#ff0000' },
      },
    }]);
    workbook.apply([{
      type: 'conditionalFormat.addRule',
      payload: {
        sheet: 0,
        range: { startRow: 0, endRow: 4, startCol: 0, endCol: 0 },
        rule: { type: 'lessThan', value: 300 },
        style: { backgroundColor: '#00ff00' },
      },
    }]);

    const rules = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rules).toHaveLength(2);

    workbook.apply([{ type: 'conditionalFormat.clearRules', payload: { sheet: 0 } }]);

    const rulesAfter = workbook.query.moduleQuery('conditionalFormat.getRules', { sheet: 0 }) as unknown[];
    expect(rulesAfter).toHaveLength(0);
  });
});
