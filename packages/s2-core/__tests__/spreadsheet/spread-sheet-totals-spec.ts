/* eslint-disable @typescript-eslint/ban-ts-comment */
import { merge } from 'lodash';
import { assembleDataCfg, assembleOptions, TOTALS_OPTIONS } from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import type { RawData, S2DataConfig, S2Options } from '@/common';
import type { Node } from '@/facet/layout/node';
import { PivotSheet } from '@/sheet-type';

describe('Spreadsheet Totals Tests', () => {
  let spreadsheet: PivotSheet;
  const dataCfg = assembleDataCfg();

  beforeEach(() => {
    spreadsheet = new PivotSheet(getContainer(), dataCfg, assembleOptions());
  });

  test('should render total nodes on row header', async () => {
    spreadsheet.setOptions({ totals: TOTALS_OPTIONS });
    await spreadsheet.render();

    const totalNodes = spreadsheet.facet.getRowTotalsNodes();

    expect(totalNodes).toHaveLength(3);

    // grand total
    const grandTotalNode = totalNodes.filter(
      (node) => node.isGrandTotals && node.level === 0,
    );

    expect(grandTotalNode).toBeDefined();

    // sub total
    const provinceSubTotalNodes = totalNodes.filter(
      (node) => node.field === 'city' && node.level === 1,
    );

    expect(provinceSubTotalNodes).toHaveLength(2); // 四川、浙江
  });

  test('should render total nodes on col header', async () => {
    spreadsheet.setOptions({ totals: TOTALS_OPTIONS });
    await spreadsheet.render();
    const totalNodes = spreadsheet.facet.getColTotalsNodes();

    expect(totalNodes).toHaveLength(3);

    // grand total
    const grandTotalNode = totalNodes.filter(
      (node) => node.isGrandTotals && node.level === 0,
    );

    expect(grandTotalNode).toBeDefined();

    // sub total
    const typeSubTotalNodes = totalNodes.filter(
      (node) => node.field === 'sub_type' && node.level === 1,
    );

    expect(typeSubTotalNodes).toHaveLength(2); // 家具、办公用品
  });

  test('should not render grand total nodes', async () => {
    spreadsheet.setOptions({
      totals: merge({}, TOTALS_OPTIONS, {
        row: {
          showGrandTotals: false,
        },
        col: {
          showGrandTotals: false,
        },
      }),
    });
    await spreadsheet.render();

    const totalNodes = [
      ...spreadsheet.facet.getRowTotalsNodes(),
      ...spreadsheet.facet.getColTotalsNodes(),
    ];

    expect(totalNodes.filter((node) => node.isGrandTotals)).toHaveLength(0);
    expect(totalNodes).toHaveLength(4);
  });

  test('should not render sub total nodes when always=false', async () => {
    const anotherDataCfg = assembleDataCfg() as S2DataConfig;

    /**
     * 构建专用数据集
     * 行头：浙江省下有多个城市、四川省下只有成都
     * 列头：办公用品下有两个维度，家具下只有桌子
     */
    const filterCond = (item: RawData) =>
      (item!['province'] === '浙江省' || item!['city'] === '成都市') &&
      (item!['type'] === '办公用品' || item!['sub_type'] === '桌子');

    anotherDataCfg.data = anotherDataCfg.data.filter(filterCond);

    spreadsheet.setDataCfg(anotherDataCfg);
    spreadsheet.setOptions({
      totals: merge({}, TOTALS_OPTIONS, {
        row: {
          showSubTotals: {
            always: false,
          },
        },
        col: {
          showSubTotals: {
            always: false,
          },
        },
      } as S2Options['totals']),
    });
    await spreadsheet.render();

    const findSubTotalNode = (
      nodes: Node[],
      parentValue: string,
      subTotalDimension: string,
    ) =>
      nodes.find(
        (node) =>
          node.parent?.value === parentValue &&
          node.field === subTotalDimension &&
          node.isSubTotals,
      );

    const { rowNodes, colNodes } = spreadsheet.facet.getLayoutResult();

    // 当子维度只有一个时，不展示小计节点
    expect(findSubTotalNode(rowNodes, '浙江省', 'city')).toBeDefined();
    expect(findSubTotalNode(rowNodes, '四川省', 'city')).toBeUndefined();
    expect(findSubTotalNode(colNodes, '家具', 'sub_type')).toBeUndefined();
    expect(findSubTotalNode(colNodes, '办公用品', 'sub_type')).toBeDefined();
  });

  test('should render actual row subtotal data in tree mode with row subtotal close', async () => {
    spreadsheet.setOptions({
      hierarchyType: 'tree',
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: false,
          subTotalsDimensions: ['province', 'city'],
        },
      },
    });
    await spreadsheet.render();

    const grandTotal = spreadsheet.facet
      .getDataCells()
      .find((cell) => cell.getMeta().rowId === 'root[&]总计')!;

    expect(grandTotal.getTextShape().attr('text')).toEqual('26193');

    const rowSubtotal1 = spreadsheet.facet
      .getDataCells()
      .find((cell) => cell.getMeta().rowId === 'root[&]浙江省')!;

    expect(rowSubtotal1.getTextShape()).toBeUndefined();

    const rowSubtotal2 = spreadsheet.facet
      .getDataCells()
      .find((cell) => cell.getMeta().rowId === 'root[&]四川省')!;

    expect(rowSubtotal2.getTextShape()).toBeUndefined();
  });
});
