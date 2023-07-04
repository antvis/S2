/**
 * @description spec for issue #1014
 * https://github.com/antvis/S2/issues/1014
 * Column should not be formatted
 *
 */
import { get } from 'lodash';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';

const s2options: S2Options = {
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
    rows: ['province'],
    columns: ['city'],
    values: ['price'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'province',
      name: '省份',
      formatter: (v) => `province: ${v}`,
    },
    {
      field: 'city',
      name: '城市',
      formatter: (v) => `city: ${v}`,
    },
    {
      field: 'price',
      name: '价格',
      formatter: (v) => `price:${v}`,
    },
  ],
};

describe('Formatter Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), dataCfg, s2options);
    await s2.render();
  });

  test('corner should not be formatted', () => {
    const cornerCells = s2.facet.getCornerCells();

    const provinceCornerNode = cornerCells.find(
      (cell) => get(cell, 'meta.field') === 'province',
    );

    const cityCornerNode = cornerCells.find(
      (cell) => get(cell, 'meta.field') === 'city',
    );

    expect(get(provinceCornerNode, 'meta.value')).toStrictEqual('省份');
    expect(get(cityCornerNode, 'meta.value')).toStrictEqual('城市');
  });

  test('row should not be formatted', () => {
    const rowNodes = s2.facet.getRowNodes();
    const provinceRowNode = rowNodes.find(({ field }) => field === 'province');

    expect(provinceRowNode!.value).toStrictEqual('浙江');
  });

  test('column should not be formatted', () => {
    const colNodes = s2.facet.getColNodes();

    const cityColNode = colNodes.find(({ field }) => field === 'city');

    expect(cityColNode!.value).toStrictEqual('义乌');
  });

  test('data cell should render formatted value', () => {
    const priceDataCells = s2.facet.getDataCells();

    expect(priceDataCells).not.toHaveLength(0);
    expect(priceDataCells).toSatisfyAll(
      (cell) => cell.getActualText() === 'price:1',
    );
  });
});
