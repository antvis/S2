import { describe, it, expect } from 'vitest';
import { createWorkbook, PivotModule } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';
import type { HeaderBox } from '../src/layout/types';

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

describe('PivotModule', () => {
  it('should compute SUM with row and column dimensions', () => {
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

    // dataMatrix: rows=[浙江, 江苏], cols=[纸张, 笔] (each × 1 value field)
    // 浙江: 纸张=75, 笔=25
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(75);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(25);
    // 江苏: 纸张=75, 笔=20
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(75);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(20);
  });

  it('should expose pivot layout via query', () => {
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

    const layout = workbook.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as {
      rowTree: { value: string; children: unknown[] }[];
      colTree: { value: string; children: unknown[] }[];
      rowLeafCount: number;
      colLeafCount: number;
    };

    expect(layout.rowTree).toHaveLength(2); // 浙江, 江苏
    expect(layout.rowTree[0]!.value).toBe('浙江');
    expect(layout.rowTree[1]!.value).toBe('江苏');
    expect(layout.colTree).toHaveLength(2); // 纸张, 笔
    expect(layout.colTree[0]!.value).toBe('纸张');
    expect(layout.colTree[1]!.value).toBe('笔');
    expect(layout.rowLeafCount).toBe(2);
    expect(layout.colLeafCount).toBe(2); // 2 col leaves × 1 value field
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
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(20);
    // 江苏: (40+20+35)/3 ≈ 31.667
    const v = workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 }) as number;
    expect(Math.abs(v - 31.6667)).toBeLessThan(0.01);
  });

  it('should compute COUNT', () => {
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

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(5);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(3);
  });

  it('should compute MIN and MAX', () => {
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
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(10);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(20);

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
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(30);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(40);
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

    // Row leaves: 浙江-杭州, 浙江-宁波, 江苏-南京, 江苏-苏州
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(65); // 杭州
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(35); // 宁波
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(60); // 南京
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(35); // 苏州

    const layout = workbook.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as {
      rowTree: { value: string; children: { value: string }[] }[];
    };
    expect(layout.rowTree[0]!.value).toBe('浙江');
    expect(layout.rowTree[0]!.children[0]!.value).toBe('杭州');
    expect(layout.rowTree[0]!.children[1]!.value).toBe('宁波');
  });

  it('should undo pivot config', () => {
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
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(100);

    workbook.undo();
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
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

describe('Pivot Layout Engine', () => {
  const PIVOT_DATA = [
    { country: 'US', city: 'New York', category: 'Electronics', sub: 'Laptop', sales: 12500 },
    { country: 'US', city: 'New York', category: 'Electronics', sub: 'Phone', sales: 8900 },
    { country: 'US', city: 'New York', category: 'Apparel', sub: 'Shirts', sales: 3200 },
    { country: 'US', city: 'New York', category: 'Apparel', sub: 'Shoes', sales: 4100 },
    { country: 'US', city: 'LA', category: 'Electronics', sub: 'Laptop', sales: 9800 },
    { country: 'US', city: 'LA', category: 'Electronics', sub: 'Phone', sales: 7600 },
    { country: 'US', city: 'LA', category: 'Apparel', sub: 'Shirts', sales: 2800 },
    { country: 'US', city: 'LA', category: 'Apparel', sub: 'Shoes', sales: 3500 },
    { country: 'UK', city: 'London', category: 'Electronics', sub: 'Laptop', sales: 8700 },
    { country: 'UK', city: 'London', category: 'Electronics', sub: 'Phone', sales: 6500 },
    { country: 'UK', city: 'London', category: 'Apparel', sub: 'Shirts', sales: 2400 },
    { country: 'UK', city: 'London', category: 'Apparel', sub: 'Shoes', sales: 3100 },
    { country: 'UK', city: 'Manchester', category: 'Electronics', sub: 'Laptop', sales: 5400 },
    { country: 'UK', city: 'Manchester', category: 'Electronics', sub: 'Phone', sales: 4200 },
    { country: 'UK', city: 'Manchester', category: 'Apparel', sub: 'Shirts', sales: 1800 },
    { country: 'UK', city: 'Manchester', category: 'Apparel', sub: 'Shoes', sales: 2300 },
  ];

  function createPivotWithLayout() {
    const workbook = createWorkbook({ modules: [PivotModule] });
    workbook.registerDataSource('data', PIVOT_DATA);
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'data',
        rows: ['country', 'city'],
        columns: ['category', 'sub'],
        values: ['sales'],
        valueAggregation: { sales: 'SUM' },
      },
    }]);
    const layout = new LayoutEngine(workbook.__getModel(), workbook.query);
    return { workbook, layout };
  }

  it('should produce hierarchy headers for pivot tables', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);
    expect(plan.hierarchyRowHeaders.length > 0).toBe(true);
  });

  it('should produce empty hierarchy headers for detail tables', () => {
    const workbook = createWorkbook();
    const layout = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = layout.computeLayoutPlan(800, 400);
    expect(plan.hierarchyRowHeaders.length > 0).toBe(false);
    expect(plan.hierarchyRowHeaders).toEqual([]);
    expect(plan.hierarchyColHeaders).toEqual([]);
    expect(plan.cornerHeaders).toEqual([]);
  });

  it('should compute correct headerArea for pivot tables', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);
    // 2 row fields (country, city) × 120px = 240
    expect(plan.headerArea.left).toBe(240);
    // 2 col fields (category, sub) + 1 value row = 3 × 28 = 84
    expect(plan.headerArea.top).toBe(84);
  });

  it('should have 2 levels of row headers with correct spans', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // Level 0: country — US (spans 2 cities), UK (spans 2 cities)
    expect(plan.hierarchyRowHeaders).toHaveLength(2);
    const level0 = plan.hierarchyRowHeaders[0]!;
    expect(level0).toHaveLength(2);
    expect(level0[0]!.label).toBe('US');
    expect(level0[0]!.span).toBe(2);
    expect(level0[0]!.level).toBe(0);
    expect(level0[1]!.label).toBe('UK');
    expect(level0[1]!.span).toBe(2);

    // Level 1: city — New York, LA, London, Manchester
    const level1 = plan.hierarchyRowHeaders[1]!;
    expect(level1).toHaveLength(4);
    expect(level1[0]!.label).toBe('New York');
    expect(level1[0]!.span).toBe(1);
    expect(level1[0]!.level).toBe(1);
    expect(level1[1]!.label).toBe('LA');
    expect(level1[2]!.label).toBe('London');
    expect(level1[3]!.label).toBe('Manchester');
  });

  it('should have correct col headers with span for parent levels', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // Level 0: category — Electronics (spans 2 subs × 1 value = 2 cols), Apparel (same)
    expect(plan.hierarchyColHeaders.length).toBeGreaterThanOrEqual(2);
    const colLevel0 = plan.hierarchyColHeaders[0]!;
    expect(colLevel0).toHaveLength(2);
    expect(colLevel0[0]!.label).toBe('Electronics');
    expect(colLevel0[0]!.span).toBe(2); // 2 subs × 1 value
    expect(colLevel0[1]!.label).toBe('Apparel');
    expect(colLevel0[1]!.span).toBe(2);

    // Level 1: sub — Laptop, Phone, Shirts, Shoes
    const colLevel1 = plan.hierarchyColHeaders[1]!;
    expect(colLevel1).toHaveLength(4);
    expect(colLevel1[0]!.label).toBe('Laptop');
    expect(colLevel1[1]!.label).toBe('Phone');
    expect(colLevel1[2]!.label).toBe('Shirts');
    expect(colLevel1[3]!.label).toBe('Shoes');

    // Level 2: value field labels (sales × 4)
    const colLevel2 = plan.hierarchyColHeaders[2]!;
    expect(colLevel2).toHaveLength(4);
    for (const h of colLevel2) {
      expect(h.label).toBe('sales');
    }
  });

  it('should produce corner headers with dimension names', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // Row field names: country (level 0), city (level 1)
    // Col field names: category, sub
    expect(plan.cornerHeaders.length).toBe(4); // 2 row fields + 2 col fields

    const labels = plan.cornerHeaders.map((h) => h.label);
    expect(labels).toContain('country');
    expect(labels).toContain('city');
    expect(labels).toContain('category');
    expect(labels).toContain('sub');
  });

  it('should not have detail-mode rowHeaders and colHeaders in pivot mode', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);
    expect(plan.rowHeaders).toEqual([]);
    expect(plan.colHeaders).toEqual([]);
  });

  it('should compute data cells offset after row/col headers', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // First data cell should be at (pivotRowHeaderWidth, pivotColHeaderHeight)
    expect(plan.cells.length).toBeGreaterThan(0);
    const firstCell = plan.cells[0]!;
    expect(firstCell.x).toBe(plan.headerArea.left); // 240
    expect(firstCell.y).toBe(plan.headerArea.top); // 84
    expect(firstCell.row).toBe(0);
    expect(firstCell.col).toBe(0);
  });

  it('should handle pivot without column dimensions (flat row layout)', () => {
    const workbook = createWorkbook({ modules: [PivotModule] });
    workbook.registerDataSource('data', PIVOT_DATA);
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'data',
        rows: ['country'],
        columns: [],
        values: ['sales'],
        valueAggregation: { sales: 'SUM' },
      },
    }]);
    const layout = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = layout.computeLayoutPlan(800, 400);

    expect(plan.hierarchyRowHeaders.length > 0).toBe(true);
    expect(plan.hierarchyRowHeaders).toHaveLength(1); // 1 level
    expect(plan.hierarchyRowHeaders[0]!).toHaveLength(2); // US, UK
    expect(plan.hierarchyRowHeaders[0]![0]!.label).toBe('US');
    expect(plan.hierarchyRowHeaders[0]![1]!.label).toBe('UK');

    // No col dimensions, but value field creates 1 col header level
    expect(plan.hierarchyColHeaders).toHaveLength(1);
    expect(plan.hierarchyColHeaders[0]![0]!.label).toBe('sales');
  });

  it('should handle multiple value fields with correct col header spans', () => {
    const workbook = createWorkbook({ modules: [PivotModule] });
    workbook.registerDataSource('data', PIVOT_DATA);
    workbook.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'data',
        rows: ['country'],
        columns: ['category'],
        values: ['sales'],
        valueAggregation: { sales: 'SUM' },
      },
    }]);
    const layout = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = layout.computeLayoutPlan(1200, 600);

    // category has 2 leaves: Electronics, Apparel
    // Each leaf × 1 value field = 1 col each, so span = 1 per category
    const colLevel0 = plan.hierarchyColHeaders[0]!;
    expect(colLevel0).toHaveLength(2);
    expect(colLevel0[0]!.label).toBe('Electronics');
    expect(colLevel0[0]!.span).toBe(1);
    expect(colLevel0[1]!.label).toBe('Apparel');
    expect(colLevel0[1]!.span).toBe(1);

    // value label row: 2 entries (one per col leaf)
    const valueRow = plan.hierarchyColHeaders[1]!;
    expect(valueRow).toHaveLength(2);
    expect(valueRow[0]!.label).toBe('sales');
    expect(valueRow[1]!.label).toBe('sales');
  });

  it('should position row header heights correctly for spans', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // US spans 2 rows, each row 28px → height = 56
    const usHeader = plan.hierarchyRowHeaders[0]![0]!;
    expect(usHeader.height).toBe(56);

    // UK also spans 2 rows → height = 56
    const ukHeader = plan.hierarchyRowHeaders[0]![1]!;
    expect(ukHeader.height).toBe(56);

    // UK starts after US's 2 rows → y = colHeaderHeight + 2 * 28
    expect(ukHeader.y).toBe(plan.headerArea.top + 56);

    // Individual city headers: each 28px tall
    const cityHeaders = plan.hierarchyRowHeaders[1]!;
    for (const h of cityHeaders) {
      expect(h.height).toBe(28);
    }
  });

  it('should position col header widths correctly for spans', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // Electronics spans 2 sub-categories × 1 value = 2 cols × 100px = 200px
    const electronicsHeader = plan.hierarchyColHeaders[0]![0]!;
    expect(electronicsHeader.width).toBe(200);

    // Apparel starts after Electronics
    const apparelHeader = plan.hierarchyColHeaders[0]![1]!;
    expect(apparelHeader.x).toBe(electronicsHeader.x + electronicsHeader.width);
    expect(apparelHeader.width).toBe(200);
  });
});
