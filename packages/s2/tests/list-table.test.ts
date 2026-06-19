import { describe, it, expect } from 'vitest';
import { createWorkbook, PivotModule } from '../src/index';
import { LayoutEngine } from '../src/layout/engine';

// 将在 ListTableModule 实现后从 index 导出
// import { ListTableModule } from '../src/modules/list-table';
// 临时：测试编写阶段先用动态 import，实现后改为静态导入
let ListTableModule: any;
try {
  ListTableModule = (await import('../src/modules/list-table')).ListTableModule;
} catch {
  // Module not yet implemented — tests will fail with clear message
}

// ========== 测试数据 ==========

const FLAT_DATA = [
  { name: '张三', age: 28, salary: 15000 },
  { name: '李四', age: 32, salary: 20000 },
  { name: '王五', age: 25, salary: 12000 },
];

const TREE_DATA = [
  {
    department: '人力资源部',
    headcount: 30,
    expense: 45000,
    children: [
      {
        department: '招聘组',
        headcount: 15,
        expense: 25000,
        children: [
          { department: '张三', headcount: 1, expense: 8000 },
          { department: '李四', headcount: 1, expense: 6000 },
        ],
      },
      {
        department: '培训组',
        headcount: 15,
        expense: 20000,
        children: [
          { department: '王五', headcount: 1, expense: 8000 },
        ],
      },
    ],
  },
  {
    department: '技术部',
    headcount: 50,
    expense: 80000,
    children: [
      { department: '赵六', headcount: 1, expense: 10000 },
    ],
  },
];

// 全部展开后的扁平行数：
// 人力资源部, 招聘组, 张三, 李四, 培训组, 王五, 技术部, 赵六 = 8 行
const TREE_EXPANDED_ROW_COUNT = 8;

function createListWorkbook() {
  if (!ListTableModule) throw new Error('ListTableModule not yet implemented');
  const workbook = createWorkbook({ modules: [ListTableModule] });
  return workbook;
}

function createListWorkbookWithFlatData() {
  const workbook = createListWorkbook();
  workbook.registerDataSource('flat', FLAT_DATA);
  return workbook;
}

function createListWorkbookWithTreeData() {
  const workbook = createListWorkbook();
  workbook.registerDataSource('tree', TREE_DATA);
  return workbook;
}

// ========== 基础功能 ==========

describe('ListTableModule — basic', () => {
  it('should populate cells with correct field data after list.setConfig', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name' },
          { field: 'age' },
          { field: 'salary' },
        ],
      },
    }]);

    // Row 0: 张三, 28, 15000
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(28);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(15000);
    // Row 1: 李四, 32, 20000
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('李四');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(32);
    // Row 2: 王五, 25, 12000
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('王五');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 2 })).toBe(12000);
  });

  it('should return correct config via list.getConfig', () => {
    const workbook = createListWorkbookWithFlatData();
    const config = {
      sheet: 0,
      dataSourceId: 'flat',
      columns: [
        { field: 'name' },
        { field: 'age' },
      ],
    };
    workbook.apply([{ type: 'list.setConfig', payload: config }]);

    const result = workbook.query.moduleQuery('list.getConfig', { sheet: 0 }) as any;
    expect(result).not.toBeNull();
    expect(result.dataSourceId).toBe('flat');
    expect(result.columns).toHaveLength(2);
    expect(result.columns[0].field).toBe('name');
    expect(result.columns[1].field).toBe('age');
  });

  it('should return correct HierarchyLayout via list.getLayout', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name' },
          { field: 'age' },
          { field: 'salary' },
        ],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout).not.toBeNull();
    expect(layout.hierarchyType).toBe('list');
    expect(layout.rowLeafCount).toBe(3); // 3 flat rows
    expect(layout.colLeafCount).toBe(3); // 3 columns
    expect(layout.colTree).toEqual([]);
    expect(layout.colFields).toEqual([]);
  });

  it('should clear cells and return null layout after list.clearConfig', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [{ field: 'name' }, { field: 'age' }],
      },
    }]);

    // Verify data exists
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');

    workbook.apply([{ type: 'list.clearConfig', payload: { sheet: 0 } }]);

    // Cells should be cleared
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
    // Layout should be null
    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 });
    expect(layout).toBeNull();
  });

  it('should restore original state after undo list.setConfig', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [{ field: 'name' }],
      },
    }]);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');

    workbook.undo();

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(null);
    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 });
    expect(layout).toBeNull();
  });
});

// ========== 树形展示 ==========

describe('ListTableModule — tree', () => {
  it('should expand tree data and populate cells correctly', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.rowLeafCount).toBe(TREE_EXPANDED_ROW_COUNT);

    // Tree column (department) is excluded from data cells; col 0 = headcount, col 1 = expense
    // Row 0: 人力资源部 — headcount=30, expense=45000
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(30);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(45000);
    // Row 2: 张三 — headcount=1, expense=8000
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(1);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 1 })).toBe(8000);
  });

  it('should reduce rowLeafCount after toggleCollapse', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    // Collapse 人力资源部 (nodeId = '0')
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // 人力资源部 collapsed: 1 row (itself) instead of 6 (itself + 招聘组 + 张三 + 李四 + 培训组 + 王五)
    // 技术部 expanded: 2 rows (itself + 赵六)
    // Total: 1 + 2 = 3
    expect(layout.rowLeafCount).toBe(3);
  });

  it('should not include child rows in cells after collapse', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    // Collapse 人力资源部
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);

    // Row 0: 人力资源部 (collapsed) — headcount=30
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(30);
    // Row 1: 技术部 (next top-level) — headcount=50
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(50);
    // Row 2: 赵六 — headcount=1
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(1);
    // Row 3 should not exist
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe(null);
  });

  it('should restore child rows after re-expanding with toggleCollapse', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    // Collapse then expand
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.rowLeafCount).toBe(TREE_EXPANDED_ROW_COUNT);

    // 招聘组 should be visible again at row 1 — headcount=15
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(15);
  });

  it('should restore collapse state after undo toggleCollapse', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);
    expect((workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any).rowLeafCount).toBe(3);

    workbook.undo();
    expect((workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any).rowLeafCount).toBe(TREE_EXPANDED_ROW_COUNT);
  });

  it('should handle 3-level nested tree collapse/expand', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    // Collapse 招聘组 (nodeId = '0/0', child of 人力资源部)
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0/0' } }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // Original 8 rows, minus 张三 and 李四 = 6
    expect(layout.rowLeafCount).toBe(6);

    // Row 0: 人力资源部 — headcount=30
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe(30);
    // Row 1: 招聘组 (collapsed) — headcount=15
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(15);
    // Row 2: 培训组 (skipped 张三, 李四) — headcount=15
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe(15);
  });
});

// ========== Layout 集成 ==========

describe('ListTableModule — layout integration', () => {
  it('should provide HierarchyLayout consumed by LayoutEngine', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name' },
          { field: 'age' },
          { field: 'salary' },
        ],
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    // Should have hierarchy headers (tree mode)
    expect(plan.hierarchyRowHeaders.length).toBeGreaterThanOrEqual(0);
    // Should have cells for the 3 rows × 3 (or fewer) visible columns
    expect(plan.cells.length).toBeGreaterThan(0);
  });

  it('should produce correct cells and hierarchyRowHeaders in computeLayoutPlan', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    // Tree mode: 1 level of row headers
    expect(plan.hierarchyRowHeaders).toHaveLength(1);
    const headers = plan.hierarchyRowHeaders[0]!;
    // Should have 8 headers (one per visible row)
    expect(headers).toHaveLength(TREE_EXPANDED_ROW_COUNT);

    // 人力资源部 should have children
    const hrHeader = headers.find((h: any) => h.label === '人力资源部');
    expect(hrHeader?.hasChildren).toBe(true);
    expect(hrHeader?.isCollapsed).toBe(false);
  });

  it('should keep fixed row height in autoFit mode', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [{ field: 'name' }, { field: 'age' }],
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    // All data cells should have the same height (fixed, not stretched)
    const heights = plan.cells.map((c: any) => c.height);
    const uniqueHeights = [...new Set(heights)];
    expect(uniqueHeights).toHaveLength(1);
  });

  it('should update layout correctly after collapse', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department', tree: true },
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);

    const planBefore = engine.computeLayoutPlan(1200, 600, null, true);
    const rowsBefore = planBefore.hierarchyRowHeaders[0]?.length ?? 0;

    // Collapse 人力资源部
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);

    const planAfter = engine.computeLayoutPlan(1200, 600, null, true);
    const rowsAfter = planAfter.hierarchyRowHeaders[0]?.length ?? 0;

    expect(rowsAfter).toBeLessThan(rowsBefore);
    // Total height should decrease
    const totalHeightBefore = planBefore.cells.reduce((max: number, c: any) => Math.max(max, c.y + c.height), 0);
    const totalHeightAfter = planAfter.cells.reduce((max: number, c: any) => Math.max(max, c.y + c.height), 0);
    expect(totalHeightAfter).toBeLessThan(totalHeightBefore);
  });
});

// ========== 边界情况 ==========

describe('ListTableModule — edge cases', () => {
  it('should not crash with empty data source', () => {
    const workbook = createListWorkbook();
    workbook.registerDataSource('empty', []);
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'empty',
        columns: [{ field: 'name' }],
      },
    }]);

    // Should not throw, layout may be null or have 0 rows
    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // Empty data: either null layout or rowLeafCount = 0
    if (layout) {
      expect(layout.rowLeafCount).toBe(0);
    }
  });

  it('should display flat rows when no tree column is defined', () => {
    const workbook = createListWorkbookWithTreeData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'tree',
        columns: [
          { field: 'department' },  // no tree: true
          { field: 'headcount' },
          { field: 'expense' },
        ],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // Without tree column, all rows (including children) are flattened: 8 rows total
    expect(layout.rowLeafCount).toBe(8);
    expect(layout.rowFields).toEqual([]);
  });

  it('should work with a single column', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [{ field: 'name' }],
      },
    }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(null);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.colLeafCount).toBe(1);
  });

  it('should recalculate when data source is updated', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [{ field: 'name' }, { field: 'age' }],
      },
    }]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');

    // Update data source — registerDataSource triggers lifecycle hook automatically
    workbook.registerDataSource('flat', [
      { name: '新员工A', age: 22, salary: 10000 },
    ]);

    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('新员工A');
    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.rowLeafCount).toBe(1);
  });
});

// ========== groupBy 分组 ==========

const GROUP_DATA = [
  { name: 'Alice', dept: 'Engineering', level: 'Senior', salary: 8000 },
  { name: 'Bob', dept: 'Engineering', level: 'Junior', salary: 6000 },
  { name: 'Carol', dept: 'Marketing', level: 'Senior', salary: 7000 },
  { name: 'Dave', dept: 'Engineering', level: 'Senior', salary: 9000 },
  { name: 'Eve', dept: 'Marketing', level: 'Junior', salary: 5000 },
];

describe('ListTableModule — groupBy', () => {
  it('should group flat data by single field', () => {
    const workbook = createListWorkbook();
    workbook.registerDataSource('group', GROUP_DATA);
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'group',
        columns: [
          { field: 'name' },
          { field: 'dept' },
          { field: 'salary' },
        ],
        groupBy: ['dept'],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // 2 groups + 5 data rows = 7 rows
    expect(layout.rowLeafCount).toBe(7);
    expect(layout.hierarchyType).toBe('tree');
  });

  it('should group by multiple fields', () => {
    const workbook = createListWorkbook();
    workbook.registerDataSource('group', GROUP_DATA);
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'group',
        columns: [
          { field: 'name' },
          { field: 'salary' },
        ],
        groupBy: ['dept', 'level'],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // dept groups: Engineering, Marketing = 2
    // level groups under Engineering: Senior, Junior = 2
    // level groups under Marketing: Senior, Junior = 2
    // data rows: 5
    // total: 2 + 2 + 2 + 5 = 11
    expect(layout.rowLeafCount).toBe(11);
  });

  it('should support collapse on group nodes', () => {
    const workbook = createListWorkbook();
    workbook.registerDataSource('group', GROUP_DATA);
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'group',
        columns: [
          { field: 'name' },
          { field: 'dept' },
          { field: 'salary' },
        ],
        groupBy: ['dept'],
      },
    }]);

    // Collapse Engineering group (nodeId = '0')
    workbook.apply([{ type: 'list.toggleCollapse', payload: { sheet: 0, nodeId: '0' } }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // Engineering collapsed: 1 row (group header only)
    // Marketing expanded: 1 group + 2 data = 3
    // Total: 1 + 3 = 4
    expect(layout.rowLeafCount).toBe(4);
  });

  it('should insert virtual group column when groupBy field is not in columns', () => {
    const workbook = createListWorkbook();
    workbook.registerDataSource('group', GROUP_DATA);
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'group',
        columns: [
          { field: 'name' },
          { field: 'salary' },
        ],
        groupBy: ['dept'],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('tree');
    expect(layout.rowFields).toEqual(['dept']);
    // 2 groups + 5 data = 7
    expect(layout.rowLeafCount).toBe(7);
  });
});

// ========== 转置 (transpose) ==========

describe('ListTableModule — transpose', () => {
  it('should transpose rows and columns in layout', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name', title: '姓名' },
          { field: 'age', title: '年龄' },
          { field: 'salary', title: '薪资' },
        ],
        transpose: true,
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('list-transpose');
    expect(layout.rowLeafCount).toBe(3);  // 3 fields as rows
    expect(layout.colLeafCount).toBe(3);  // 3 data records as columns
    expect(layout.rowFields).toEqual(['姓名', '年龄', '薪资']);
    expect(layout.valueFields).toEqual([]);
  });

  it('should write transposed cell data to model', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name' },
          { field: 'age' },
          { field: 'salary' },
        ],
        transpose: true,
      },
    }]);

    // row=field index, col=record index
    // (0,0) = name of record 0 = 张三
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');
    // (0,1) = name of record 1 = 李四
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe('李四');
    // (1,0) = age of record 0 = 28
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe(28);
    // (2,2) = salary of record 2 = 12000
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 2 })).toBe(12000);
  });

  it('should display field names as row headers in layout plan', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name', title: '姓名' },
          { field: 'age', title: '年龄' },
        ],
        transpose: true,
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    expect(plan.hierarchyRowHeaders).toHaveLength(1);
    const rowHeaders = plan.hierarchyRowHeaders[0]!;
    expect(rowHeaders).toHaveLength(2);
    expect(rowHeaders[0]!.label).toBe('姓名');
    expect(rowHeaders[1]!.label).toBe('年龄');

    // headerArea.left should be > 0 (row header width)
    expect(plan.headerArea.left).toBeGreaterThan(0);
  });

  it('should produce correct cell count in layout plan', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [
          { field: 'name' },
          { field: 'age' },
          { field: 'salary' },
        ],
        transpose: true,
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    // 3 rows (fields) × 3 cols (records) = 9 cells
    expect(plan.cells).toHaveLength(9);
  });
});

// ========== tryModuleQuery ==========

describe('QueryLayer — tryModuleQuery', () => {
  it('should return undefined for unregistered query instead of throwing', () => {
    const workbook = createWorkbook();
    const result = workbook.query.tryModuleQuery('nonexistent.query', {});
    expect(result).toBeUndefined();
  });

  it('should return correct result for registered query', () => {
    const workbook = createListWorkbookWithFlatData();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'flat',
        columns: [{ field: 'name' }],
      },
    }]);

    const result = workbook.query.tryModuleQuery('list.getConfig', { sheet: 0 }) as any;
    expect(result).not.toBeUndefined();
    expect(result.dataSourceId).toBe('flat');
  });
});

// ========== gridFields 平铺分组 ==========

const GRID_DATA = [
  { province: '浙江', city: '杭州', name: '张三', salary: 25000 },
  { province: '浙江', city: '杭州', name: '李四', salary: 18000 },
  { province: '浙江', city: '宁波', name: '王五', salary: 22000 },
  { province: '江苏', city: '南京', name: '赵六', salary: 30000 },
];

function createGridWorkbook() {
  const workbook = createWorkbook({ modules: [ListTableModule] });
  workbook.registerDataSource('grid', GRID_DATA);
  return workbook;
}

describe('ListTableModule — gridFields', () => {
  it('should produce grid hierarchyType with merged row headers', () => {
    const workbook = createGridWorkbook();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'grid',
        columns: [
          { field: 'province', title: '省份' },
          { field: 'city', title: '城市' },
          { field: 'name', title: '姓名' },
          { field: 'salary', title: '薪资' },
        ],
        gridFields: ['province', 'city'],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('grid');
    expect(layout.rowLeafCount).toBe(4);
    expect(layout.rowFields).toEqual(['province', 'city']);
    expect(layout.valueFields).toEqual(['姓名', '薪资']);
    expect(layout.colLeafCount).toBe(2);
  });

  it('should only show non-grid columns in data area', () => {
    const workbook = createGridWorkbook();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'grid',
        columns: [
          { field: 'province', title: '省份' },
          { field: 'city', title: '城市' },
          { field: 'name', title: '姓名' },
          { field: 'salary', title: '薪资' },
        ],
        gridFields: ['province', 'city'],
      },
    }]);

    // Data cells: only name and salary columns (col 0 and col 1)
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(25000);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('李四');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(18000);
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 2, col: 0 })).toBe('王五');
    expect(workbook.query.getCellDisplayValue({ sheet: 0, row: 3, col: 0 })).toBe('赵六');
  });

  it('should build correct rowTree structure', () => {
    const workbook = createGridWorkbook();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'grid',
        columns: [
          { field: 'province' },
          { field: 'city' },
          { field: 'name' },
          { field: 'salary' },
        ],
        gridFields: ['province', 'city'],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    // 浙江 has 2 children (杭州×2 leaves, 宁波×1 leaf)
    expect(layout.rowTree).toHaveLength(2);
    expect(layout.rowTree[0].value).toBe('浙江');
    expect(layout.rowTree[0].children).toHaveLength(3);
    expect(layout.rowTree[1].value).toBe('江苏');
    expect(layout.rowTree[1].children).toHaveLength(1);
  });

  it('should produce correct layout plan via LayoutEngine', () => {
    const workbook = createGridWorkbook();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'grid',
        columns: [
          { field: 'province', title: '省份' },
          { field: 'city', title: '城市' },
          { field: 'name', title: '姓名' },
          { field: 'salary', title: '薪资' },
        ],
        gridFields: ['province', 'city'],
      },
    }]);

    const engine = new LayoutEngine(workbook.__getModel(), workbook.query);
    const plan = engine.computeLayoutPlan(1200, 600, null, true);

    // Should have 2 levels of row headers (province, city)
    expect(plan.hierarchyRowHeaders).toHaveLength(2);
    // Corner headers should show dimension names
    expect(plan.cornerHeaders.length).toBeGreaterThanOrEqual(2);
    expect(plan.cornerHeaders[0]!.label).toBe('province');
    expect(plan.cornerHeaders[1]!.label).toBe('city');
    // Data cells: 4 rows × 2 cols = 8
    expect(plan.cells).toHaveLength(8);
  });

  it('should work with single gridField', () => {
    const workbook = createGridWorkbook();
    workbook.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'grid',
        columns: [
          { field: 'province' },
          { field: 'name' },
          { field: 'salary' },
        ],
        gridFields: ['province'],
      },
    }]);

    const layout = workbook.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.hierarchyType).toBe('grid');
    expect(layout.rowLeafCount).toBe(4);
    expect(layout.rowFields).toEqual(['province']);
    expect(layout.valueFields).toEqual(['name', 'salary']);
  });
});

// ========== 多级表头 ==========

describe('ListTableModule — multi-level headers', () => {
  const MULTI_HEADER_DATA = [
    { name: '张三', revenue: 1000, cost: 500, dept: '工程', level: '高级' },
    { name: '李四', revenue: 2000, cost: 800, dept: '产品', level: '中级' },
  ];

  function createMultiHeaderWorkbook() {
    const wb = createListWorkbook();
    wb.registerDataSource('mh', MULTI_HEADER_DATA);
    return wb;
  }

  it('should render two-level column headers', () => {
    const wb = createMultiHeaderWorkbook();
    wb.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'mh',
        columns: [
          { field: 'name', title: '姓名' },
          {
            title: '销售数据',
            columns: [
              { field: 'revenue', title: '营收' },
              { field: 'cost', title: '成本' },
            ],
          },
          {
            title: '人员信息',
            columns: [
              { field: 'dept', title: '部门' },
              { field: 'level', title: '级别' },
            ],
          },
        ],
      },
    }]);

    const layout = wb.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout).not.toBeNull();
    expect(layout.hierarchyType).toBe('list');
    expect(layout.colLeafCount).toBe(5);
    expect(layout.valueFields).toEqual(['姓名', '营收', '成本', '部门', '级别']);
    expect(layout.colTree.length).toBe(3);
    expect(layout.colTree[0].value).toBe('姓名');
    expect(layout.colTree[0].children).toEqual([]);
    expect(layout.colTree[1].value).toBe('销售数据');
    expect(layout.colTree[1].children.length).toBe(2);
    expect(layout.colTree[2].value).toBe('人员信息');
    expect(layout.colTree[2].children.length).toBe(2);

    // Data written correctly using leaf columns
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(1000);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 4 })).toBe('高级');
  });

  it('should render three-level column headers', () => {
    const wb = createListWorkbook();
    wb.registerDataSource('ds3', [{ a: 1, b: 2, c: 3, d: 4 }]);
    wb.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'ds3',
        columns: [
          {
            title: 'L1',
            columns: [
              {
                title: 'L2',
                columns: [
                  { field: 'a', title: 'A' },
                  { field: 'b', title: 'B' },
                ],
              },
              { field: 'c', title: 'C' },
            ],
          },
          { field: 'd', title: 'D' },
        ],
      },
    }]);

    const layout = wb.query.moduleQuery('list.getLayout', { sheet: 0 }) as any;
    expect(layout.colLeafCount).toBe(4);
    expect(layout.valueFields).toEqual(['A', 'B', 'C', 'D']);
    expect(layout.colTree.length).toBe(2);
    expect(layout.colTree[0].children.length).toBe(2);
    expect(layout.colTree[0].children[0].children.length).toBe(2);
  });

  it('should correctly flatten leaf columns for data', () => {
    const wb = createMultiHeaderWorkbook();
    wb.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'mh',
        columns: [
          { field: 'name', title: '姓名' },
          {
            title: '销售数据',
            columns: [
              { field: 'revenue', title: '营收' },
              { field: 'cost', title: '成本' },
            ],
          },
        ],
      },
    }]);

    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 0 })).toBe('张三');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 1 })).toBe(1000);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 0, col: 2 })).toBe(500);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 0 })).toBe('李四');
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 1 })).toBe(2000);
    expect(wb.query.getCellDisplayValue({ sheet: 0, row: 1, col: 2 })).toBe(800);
  });

  it('should produce multi-level hierarchyColHeaders in layout plan', () => {
    const wb = createMultiHeaderWorkbook();
    wb.apply([{
      type: 'list.setConfig',
      payload: {
        sheet: 0,
        dataSourceId: 'mh',
        columns: [
          { field: 'name', title: '姓名' },
          {
            title: '销售数据',
            columns: [
              { field: 'revenue', title: '营收' },
              { field: 'cost', title: '成本' },
            ],
          },
        ],
      },
    }]);

    const engine = new LayoutEngine(wb.__getModel(), wb.query);
    const plan = engine.computeLayoutPlan(800, 600, null, true);

    expect(plan.hierarchyColHeaders.length).toBe(2);
    const level0 = plan.hierarchyColHeaders[0]!;
    expect(level0.length).toBe(2);
    expect(level0[0]!.label).toBe('姓名');
    expect(level0[1]!.label).toBe('销售数据');
    const level1 = plan.hierarchyColHeaders[1]!;
    expect(level1.length).toBe(2);
    expect(level1[0]!.label).toBe('营收');
    expect(level1[1]!.label).toBe('成本');
    expect(plan.headerArea.top).toBe(56);
    expect(plan.colHeaders.length).toBe(0);
  });
});
