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

  it('should drill down into a dimension value', () => {
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

    workbook.apply([{
      type: 'pivot.drill',
      payload: { sheet: 0, dimension: 'province', value: '浙江' },
    }]);

    const layout = workbook.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as { rowLeafCount: number; rowTree: { value: string }[] };
    expect(layout.rowLeafCount).toBe(2);
    expect(layout.rowTree[0]!.value).toBe('杭州');
    expect(layout.rowTree[1]!.value).toBe('宁波');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(65);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(35);
  });

  it('should undo drill and restore original config', () => {
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

    workbook.apply([{
      type: 'pivot.drill',
      payload: { sheet: 0, dimension: 'province', value: '浙江' },
    }]);

    workbook.undo();
    const layout = workbook.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as { rowLeafCount: number };
    expect(layout.rowLeafCount).toBe(4);
  });

  it('should compute subtotals for each parent group', () => {
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
        showSubTotals: true,
      },
    }]);

    // Without subtotals: 4 rows (杭州=65, 宁波=35, 南京=60, 苏州=35)
    // With subtotals: 杭州, 宁波, 浙江subtotal, 南京, 苏州, 江苏subtotal = 6 rows
    const layout = workbook.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as { rowLeafCount: number };
    expect(layout.rowLeafCount).toBe(6);

    // 浙江 subtotal (row 2): 65 + 35 = 100
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(100);
    // 江苏 subtotal (row 5): 60 + 35 = 95
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 5, col: 0 })).toBe(95);
  });

  it('should compute grand total', () => {
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
        showGrandTotal: true,
      },
    }]);

    // 2 rows + 1 grand total = 3 rows
    const layout = workbook.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as { rowLeafCount: number };
    expect(layout.rowLeafCount).toBe(3);

    // Grand total (last row): 100 + 95 = 195
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(195);
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
    const plan = layout.computeLayoutPlan(1200, 600, null, true);
    expect(plan.headerArea.left).toBe(240);
    expect(plan.headerArea.top).toBe(3 * 28);
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

    // US spans 2 rows
    const usHeader = plan.hierarchyRowHeaders[0]![0]!;
    expect(usHeader.height).toBeGreaterThanOrEqual(28 * 2);

    // UK also spans 2 rows, starts after US
    const ukHeader = plan.hierarchyRowHeaders[0]![1]!;
    expect(ukHeader.height).toBeGreaterThanOrEqual(28 * 2);
    expect(ukHeader.y).toBe(usHeader.y + usHeader.height);

    // City headers have positive height
    const cityHeaders = plan.hierarchyRowHeaders[1]!;
    for (const h of cityHeaders) {
      expect(h.height).toBeGreaterThanOrEqual(28);
    }
  });

  it('should position col header widths correctly for spans', () => {
    const { layout } = createPivotWithLayout();
    const plan = layout.computeLayoutPlan(1200, 600);

    // Electronics spans 2 sub-categories × 1 value = 2 cols
    const electronicsHeader = plan.hierarchyColHeaders[0]![0]!;
    const valueRow = plan.hierarchyColHeaders[plan.hierarchyColHeaders.length - 1]!;
    const colW = valueRow[0]!.width;
    expect(colW).toBeGreaterThanOrEqual(100);
    expect(electronicsHeader.width).toBe(colW * 2);

    // Apparel starts after Electronics
    const apparelHeader = plan.hierarchyColHeaders[0]![1]!;
    expect(apparelHeader.x).toBe(electronicsHeader.x + electronicsHeader.width);
    expect(apparelHeader.width).toBe(colW * 2);
  });
});

describe('PivotModule — tree mode', () => {
  it('tree mode sets hierarchyType on layout', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'tree',
      },
    }]);
    const layout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('tree');
    // tree 模式: 2 省 + 4 市 = 6 行
    expect(layout.rowLeafCount).toBe(6);
  });

  it('toggleCollapse reduces rowLeafCount and shows aggregate', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'tree',
      },
    }]);

    const beforeLayout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    expect(beforeLayout.rowLeafCount).toBe(6);

    // Collapse 浙江
    wb.apply([{ type: 'pivot.toggleCollapse', payload: { sheet: 0, nodeId: 'province:浙江' } }]);

    const afterLayout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    // 浙江 collapsed = 1 row, 江苏 parent + 2 cities = 3, total = 4
    expect(afterLayout.rowLeafCount).toBe(4);

    // Collapsed 浙江 row should have aggregate value (20+30+15+25+10 = 100)
    const val = wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(val).toBe(100);
  });

  it('undo toggleCollapse restores state', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'tree',
      },
    }]);

    wb.apply([{ type: 'pivot.toggleCollapse', payload: { sheet: 0, nodeId: 'province:浙江' } }]);
    expect((wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any).rowLeafCount).toBe(4);

    wb.undo();
    expect((wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any).rowLeafCount).toBe(6);
  });

  it('expandDepth controls initial collapse', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'tree',
        expandDepth: 0,
      },
    }]);

    const layout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    // expandDepth 0 → all provinces collapsed → rowLeafCount = province count = 2
    expect(layout.rowLeafCount).toBe(2);
  });

  it('grid mode still works when hierarchyType not set', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: ['type'], values: ['price'],
        valueAggregation: { price: 'SUM' },
      },
    }]);
    const layout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('grid');
    expect(layout.rowLeafCount).toBe(4);
  });

  it('tree mode layout has single-level hierarchyRowHeaders', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'tree',
      },
    }]);

    const engine = new LayoutEngine(wb.__getModel(), wb.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    // Tree mode: only 1 level of row headers
    expect(plan.hierarchyRowHeaders.length).toBe(1);
    // Should have headers with nodeId
    const headers = plan.hierarchyRowHeaders[0]!;
    expect(headers.length).toBeGreaterThan(0);
    expect(headers[0]!.nodeId).toBeDefined();
    // 浙江 has children
    const zhejianHeader = headers.find(h => h.label === '浙江');
    expect(zhejianHeader?.hasChildren).toBe(true);
    expect(zhejianHeader?.isCollapsed).toBe(false);
    // 杭州 is a leaf
    const hangzhouHeader = headers.find(h => h.label === '杭州');
    expect(hangzhouHeader?.hasChildren).toBe(false);
    expect(hangzhouHeader?.level).toBe(1);
  });
});

describe('PivotModule — grid-tree mode', () => {
  it('grid-tree mode sets hierarchyType on layout', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'grid-tree',
      },
    }]);
    const layout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('grid-tree');
  });

  it('grid-tree mode has multiple row header levels', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'grid-tree',
      },
    }]);

    const engine = new LayoutEngine(wb.__getModel(), wb.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    expect(plan.hierarchyRowHeaders.length).toBe(2);
    expect(plan.hierarchyRowHeaders[0]!.length).toBe(2);
    expect(plan.hierarchyRowHeaders[1]!.length).toBe(4);
  });

  it('grid-tree row leaf count equals grid mode leaf count (no collapse)', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'grid-tree',
      },
    }]);
    const layout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    expect(layout.rowLeafCount).toBe(4);
  });

  it('toggleCollapse reduces rowLeafCount in grid-tree mode', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'grid-tree',
      },
    }]);

    wb.apply([{ type: 'pivot.toggleCollapse', payload: { sheet: 0, nodeId: 'province:浙江' } }]);

    const layout = wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any;
    expect(layout.rowLeafCount).toBe(3);

    const val = wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 });
    expect(val).toBe(100);
  });

  it('collapsed node has span=1 and extended width', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'grid-tree',
      },
    }]);

    wb.apply([{ type: 'pivot.toggleCollapse', payload: { sheet: 0, nodeId: 'province:浙江' } }]);

    const engine = new LayoutEngine(wb.__getModel(), wb.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    const zjHeader = plan.hierarchyRowHeaders[0]!.find(h => h.label === '浙江');
    expect(zjHeader).toBeDefined();
    expect(zjHeader!.span).toBe(1);
    expect(zjHeader!.isCollapsed).toBe(true);
    expect(zjHeader!.hasChildren).toBe(true);
    expect(zjHeader!.width).toBe(240);
  });

  it('undo toggleCollapse restores grid-tree state', () => {
    const wb = createPivotWorkbook();
    wb.apply([{
      type: 'pivot.setConfig',
      payload: {
        sheet: 0, dataSourceId: 'sales',
        rows: ['province', 'city'], columns: [], values: ['price'],
        valueAggregation: { price: 'SUM' },
        hierarchyType: 'grid-tree',
      },
    }]);

    wb.apply([{ type: 'pivot.toggleCollapse', payload: { sheet: 0, nodeId: 'province:浙江' } }]);
    expect((wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any).rowLeafCount).toBe(3);

    wb.undo();
    expect((wb.query.moduleQuery('pivot.getLayout', { sheet: 0 }) as any).rowLeafCount).toBe(4);
  });
});
