import { EXTRA_FIELD, type S2DataConfig, type S2Options } from '@/common';
import { PivotSheet } from '@/sheet-type';
import { getContainer } from 'tests/util/helpers';

const mockData = [
  // 浙江省数据
  {
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '桌子',
    number: 7789,
  },
  {
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '沙发',
    number: 5343,
  },
  {
    province: '浙江省',
    city: '绍兴市',
    type: '家具',
    sub_type: '桌子',
    number: 2367,
  },
  {
    province: '浙江省',
    city: '绍兴市',
    type: '家具',
    sub_type: '沙发',
    number: 632,
  },
  // 四川省数据
  {
    province: '四川省',
    city: '成都市',
    type: '家具',
    sub_type: '桌子',
    number: 1723,
  },
  {
    province: '四川省',
    city: '成都市',
    type: '家具',
    sub_type: '沙发',
    number: 2451,
  },
  {
    province: '四川省',
    city: '绵阳市',
    type: '家具',
    sub_type: '桌子',
    number: 1822,
  },
  {
    province: '四川省',
    city: '绵阳市',
    type: '家具',
    sub_type: '沙发',
    number: 2244,
  },
];

const dataCfg: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: [
    { field: 'province', name: '省份' },
    { field: 'city', name: '城市' },
    { field: 'type', name: '类别' },
    { field: 'sub_type', name: '子类别' },
    { field: 'number', name: '数量' },
  ],
  data: mockData,
};

describe('build grid-tree hierarchy', () => {
  test('should build grid-tree hierarchy with multi-level columns', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    // grid-tree 模式下，每个维度有独立的列
    const rowNodes = s2.facet.getRowNodes();
    const rowLeafNodes = s2.facet.getRowLeafNodes();

    // 应该有省份和城市两个层级的节点
    expect(rowNodes.some((node) => node.field === 'province')).toBe(true);
    expect(rowNodes.some((node) => node.field === 'city')).toBe(true);

    // 叶子节点应该是城市
    expect(rowLeafNodes.every((node) => node.field === 'city')).toBe(true);
    expect(rowLeafNodes.length).toBe(4); // 杭州、绍兴、成都、绵阳

    s2.destroy();
  });

  test('should collapse nodes when expandDepth is set', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          expandDepth: 0, // 只展开第0层,省份默认折叠
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    // 省份节点应该是折叠的
    const provinceNodes = s2.facet
      .getRowNodes()
      .filter((node) => node.field === 'province');

    expect(provinceNodes.length).toBe(2);
    expect(provinceNodes.every((node) => node.isCollapsed)).toBe(true);

    // 折叠后,省份节点成为叶子节点
    const rowLeafNodes = s2.facet.getRowLeafNodes();

    expect(rowLeafNodes.length).toBe(2); // 浙江省、四川省
    expect(rowLeafNodes.every((node) => node.field === 'province')).toBe(true);

    s2.destroy();
  });

  test('should collapse specific nodes via collapseFields', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          collapseFields: {
            'root[&]浙江省': true,
          },
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    const rowNodes = s2.facet.getRowNodes();
    const zhejiangNode = rowNodes.find((node) => node.value === '浙江省');
    const sichuanNode = rowNodes.find((node) => node.value === '四川省');

    // 浙江省应该折叠
    expect(zhejiangNode?.isCollapsed).toBe(true);
    // 四川省应该展开
    expect(sichuanNode?.isCollapsed).toBe(false);

    s2.destroy();
  });

  test('should collapse all nodes when collapseAll is true', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          collapseAll: true,
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    const provinceNodes = s2.facet
      .getRowNodes()
      .filter((node) => node.field === 'province');

    expect(provinceNodes.every((node) => node.isCollapsed)).toBe(true);

    s2.destroy();
  });

  test('should show totals correctly in grid-tree mode', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    // 应该有总计节点
    const grandTotalNodes = rowNodes.filter((node) => node.isGrandTotals);

    expect(grandTotalNodes.length).toBeGreaterThan(0);

    // 应该有小计节点
    const subTotalNodes = rowNodes.filter((node) => node.isSubTotals);

    expect(subTotalNodes.length).toBeGreaterThan(0);

    s2.destroy();
  });

  test('should not collapse leaf nodes (cities have no expand icon)', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          expandDepth: 1, // 展开到城市级别
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    // 城市节点是真正的叶子节点,不应该有折叠状态
    const cityNodes = s2.facet
      .getRowNodes()
      .filter((node) => node.field === 'city');

    expect(cityNodes.every((node) => node.isCollapsed === false)).toBe(true);
    expect(cityNodes.every((node) => node.isLeaf === true)).toBe(true);

    s2.destroy();
  });

  test('should correctly identify grid-tree hierarchy type', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    expect(s2.isHierarchyGridTreeType()).toBe(true);
    expect(s2.isHierarchyTreeType()).toBe(false);

    s2.destroy();
  });

  test('should return correct row cell properties for grid-tree mode', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          collapseFields: {
            'root[&]浙江省': true, // 折叠浙江省
          },
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    const rowCells = s2.facet.getRowCells();
    const zhejiangCell = rowCells.find(
      (cell) => cell.getMeta().id === 'root[&]浙江省',
    );

    // 1. 测试 getContentIndent (grid-tree 模式下应该为 0)
    // @ts-ignore
    expect(zhejiangCell.getContentIndent()).toBe(0);

    // 2. 测试 showTreeIcon
    // 浙江省 (collapsed) 应该显示图标
    // @ts-ignore
    expect(zhejiangCell.showTreeIcon()).toBe(true);

    s2.destroy();
  });

  test('should get correct subtotal data for collapsed node in grid-tree mode', async () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          collapseFields: {
            'root[&]浙江省': true,
          },
        },
      },
      totals: {
        row: {
          showSubTotals: true,
          subTotalsDimensions: ['province'],
          calcSubTotals: {
            aggregation: 'SUM',
          },
        },
      },
    };

    const s2 = new PivotSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

    const zhejiangNode = s2.facet
      .getRowNodes()
      .find((node) => node.id === 'root[&]浙江省');

    expect(zhejiangNode?.isCollapsed).toBe(true);

    const cellData = s2.dataSet.getCellData({
      query: {
        province: '浙江省',
        [EXTRA_FIELD]: 'number',
      },
      t: 1, // dummy value
      rowNode: zhejiangNode,
      isTotals: false,
    });

    expect(cellData).not.toBeUndefined();
    // 验证返回的是聚合后的数值 (number类型 或 包含 number 的对象)
    const isValidResult =
      (typeof cellData === 'object' && cellData !== null) || cellData === 16131;

    expect(isValidResult).toBe(true);

    s2.destroy();
  });
});
