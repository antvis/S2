/**
 * @description spec for issue #840
 * https://github.com/antvis/S2/issues/840
 * Column should not be formatted
 *
 */
import type { S2DataConfig, S2Options } from '@/common/interface';
import { SpreadSheet, TableSheet } from '@/sheet-type';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';

const s2Options: S2Options = {
  // 让被测试的单元格在首屏显示出来
  width: 300,
  height: 200,
  style: {
    colCell: {
      height: 60,
    },
    dataCell: {
      width: 100,
      height: 50,
    },
  },
};

const dataCfg: S2DataConfig = {
  ...mockDataConfig,
  fields: {
    columns: ['cost', 'type', 'province', 'price'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'type',
      name: '类型',
      formatter: (v) => `#${v}`,
    },
    {
      field: 'cost',
      name: '成本',
      formatter: (v) => `@${v}`,
    },
  ],
};

describe('Column Formatter Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new TableSheet(getContainer(), dataCfg, s2Options);
    await s2.render();
  });

  test('column should not be formatted', () => {
    const colNodes = s2.facet.getColNodes();
    const typeColNode = colNodes.find(({ field }) => field === 'type');
    const costColNode = colNodes.find(({ field }) => field === 'cost');

    expect(typeColNode!.value).toStrictEqual('类型');
    expect(costColNode!.value).toStrictEqual('成本');
  });

  test('date cell should render formatted value', () => {
    const dataCells = s2.facet.getDataCells();
    const typeDataCells = dataCells.filter(
      (cell) => cell.getMeta().valueField === 'type',
    );
    const costDataCells = dataCells.filter(
      (cell) => cell.getMeta().valueField === 'cost',
    );

    // 确保下面的 forEach 断言能被触发
    expect(typeDataCells).not.toHaveLength(0);
    expect(costDataCells).not.toHaveLength(0);

    typeDataCells.forEach((cell) => {
      expect(cell.getActualText()).toStrictEqual('#笔');
    });
    costDataCells.forEach((cell) => {
      expect(cell.getActualText()).toStrictEqual('@2');
    });
  });
});
