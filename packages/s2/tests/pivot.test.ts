import { describe, it, expect } from 'vitest';
import { createWorkbook, PivotModule } from '../src/index';

const SALES_DATA = [
  { province: '浙江', city: '杭州', type: '纸张', price: 20 },
  { province: '浙江', city: '杭州', type: '纸张', price: 30 },
  { province: '浙江', city: '杭州', type: '笔', price: 15 },
  { province: '浙江', city: '宁波', type: '纸张', price: 25 },
  { province: '浙江', city: '宁波', type: '笔', price: 10 },
  { province: '江苏', city: '南京', type: '纸张', price: 40 },
  { province: '江苏', city: '南京', type: '笔', price: 20 },
  { province: '江苏', city: '苏州', type: '纸张', price: 35 },
];

function createPivotWorkbook() {
  const workbook = createWorkbook({ modules: [PivotModule] });
  workbook.registerDataSource('sales', SALES_DATA);
  return workbook;
}

describe('PivotModule aggregation', () => {
  it('should compute SUM correctly with row and column dimensions', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: ['type'],
        values: ['price'],
        valueAggregation: { price: 'SUM' },
      },
    }]);

    // Header row: province | 纸张|price | 笔|price
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('province');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('纸张|price');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe('笔|price');

    // 浙江: 纸张 = 20+30+25=75, 笔 = 15+10=25
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('浙江');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(75);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 2 })).toBe(25);

    // 江苏: 纸张 = 40+35=75, 笔 = 20
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('江苏');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe(75);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 2 })).toBe(20);
  });

  it('should compute AVG correctly', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: [],
        values: ['price'],
        valueAggregation: { price: 'AVG' },
      },
    }]);

    // 浙江: (20+30+15+25+10)/5 = 20
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('浙江');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(20);

    // 江苏: (40+20+35)/3 = 31.666...
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('江苏');
    const jiangsuAvg = workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 }) as number;
    expect(Math.abs(jiangsuAvg - 31.6667)).toBeLessThan(0.01);
  });

  it('should compute COUNT correctly', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: [],
        values: ['price'],
        valueAggregation: { price: 'COUNT' },
      },
    }]);

    // 浙江: 5 records
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(5);
    // 江苏: 3 records
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe(3);
  });

  it('should compute MIN and MAX correctly', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: [],
        values: ['price'],
        valueAggregation: { price: 'MIN' },
      },
    }]);

    // 浙江 MIN: 10
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(10);
    // 江苏 MIN: 20
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe(20);

    // Change to MAX
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: [],
        values: ['price'],
        valueAggregation: { price: 'MAX' },
      },
    }]);

    // 浙江 MAX: 30
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(30);
    // 江苏 MAX: 40
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe(40);
  });

  it('should support multi-level row dimensions', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province', 'city'],
        columns: [],
        values: ['price'],
        valueAggregation: { price: 'SUM' },
      },
    }]);

    // Headers: province | city | price
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('province');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('city');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe('price');

    // 浙江||杭州: 20+30+15=65
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('浙江');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe('杭州');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 2 })).toBe(65);

    // 浙江||宁波: 25+10=35
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('浙江');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe('宁波');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 2 })).toBe(35);

    // 江苏||南京: 40+20=60
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('江苏');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 1 })).toBe('南京');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 2 })).toBe(60);

    // 江苏||苏州: 35
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 4, col: 0 })).toBe('江苏');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 4, col: 1 })).toBe('苏州');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 4, col: 2 })).toBe(35);
  });

  it('should undo pivot config and restore previous cells', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: [],
        values: ['price'],
        valueAggregation: { price: 'SUM' },
      },
    }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(100); // 浙江 SUM

    workbook.undo();
    // After undo, cells should be cleared (no pivot)
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(null);
  });

  it('should expose module queries via workbook.query.moduleQuery', () => {
    const workbook = createPivotWorkbook();
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'sales',
        rows: ['province'],
        columns: ['type'],
        values: ['price'],
        valueAggregation: { price: 'SUM' },
      },
    }]);

    const hierarchy = workbook.query.moduleQuery('pivot.getHierarchy', { sheet: 0 }) as { rows: unknown[]; columns: unknown[]; values: string[] };
    expect(hierarchy.rows).toEqual([{ field: 'province' }]);
    expect(hierarchy.columns).toEqual([{ field: 'type' }]);
    expect(hierarchy.values).toEqual(['price']);
  });

  it('should reject pivot operations when module not registered', () => {
    const workbook = createWorkbook();
    expect(() => {
      workbook.apply([{
        type: 'pivot.setConfig',
        payload: { sheet: 0, dataSourceId: 'x', rows: [], columns: [], values: [], valueAggregation: {} },
      }]);
    }).toThrow('Unknown operation');
  });
});
