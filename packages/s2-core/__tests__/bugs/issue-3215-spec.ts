/**
 * @description spec for issue #3215
 * https://github.com/antvis/S2/issues/3215
 * customValueOrder=0 时，多个数值列的总计列头被合并到一起了
 */
import { PivotSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '../../src';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 600,
  height: 480,
  totals: {
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
    },
    row: {
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      showGrandTotals: true,
      showSubTotals: true,
    },
  },
};

const s2DataConfig: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number', 'price'],
    valueInCols: true,
    customValueOrder: 0,
  },
  data: [
    {
      number: 7789,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
      price: 1899,
    },
  ],
  meta: [
    {
      field: 'number',
      name: '数量',
    },
    {
      field: 'price',
      name: '价格',
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
  ],
};

describe('GrandTotals Header Merge Tests', () => {
  test('should have separate grand total nodes for each measure when customValueOrder=0', async () => {
    const s2 = new PivotSheet(getContainer(), s2DataConfig, s2Options);

    await s2.render();

    const { colLeafNodes } = s2.facet.getLayoutResult();

    // 筛选出总计相关的叶子节点
    const grandTotalLeafNodes = colLeafNodes.filter(
      (node) => node.isGrandTotals,
    );

    // 当 customValueOrder=0 时，应该有2个总计叶子节点（对应 number 和 price 两个数值列）
    // 期望的节点 ID 格式：root[&]price[&]总计, root[&]number[&]总计
    // 而不是 root[&]总计 (错误的合并情况)
    expect(grandTotalLeafNodes).toHaveLength(2);

    // 验证节点 ID 包含数值字段名
    const nodeIds = grandTotalLeafNodes.map((node) => node.id);

    expect(nodeIds.some((id) => id.includes('price'))).toBe(true);
    expect(nodeIds.some((id) => id.includes('number'))).toBe(true);

    // 验证每个节点 ID 都包含总计标识
    expect(nodeIds.every((id) => id.includes('总计'))).toBe(true);

    s2.destroy();
  });

  test('should keep normal behavior when customValueOrder is not 0', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      {
        ...s2DataConfig,
        fields: {
          ...s2DataConfig.fields,
          customValueOrder: 1,
        },
      },
      s2Options,
    );

    await s2.render();

    const { colLeafNodes } = s2.facet.getLayoutResult();

    // 筛选出总计相关的叶子节点
    const grandTotalLeafNodes = colLeafNodes.filter(
      (node) => node.isGrandTotals,
    );

    // 应该有2个总计叶子节点
    expect(grandTotalLeafNodes).toHaveLength(2);

    s2.destroy();
  });

  test('should keep normal behavior when customValueOrder is not specified', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      {
        ...s2DataConfig,
        fields: {
          rows: ['province', 'city'],
          columns: ['type', 'sub_type'],
          values: ['number', 'price'],
          valueInCols: true,
          // no customValueOrder specified
        },
      },
      s2Options,
    );

    await s2.render();

    const { colLeafNodes } = s2.facet.getLayoutResult();

    // 筛选出总计相关的叶子节点
    const grandTotalLeafNodes = colLeafNodes.filter(
      (node) => node.isGrandTotals,
    );

    // 应该有2个总计叶子节点
    expect(grandTotalLeafNodes).toHaveLength(2);

    s2.destroy();
  });
});
