/**
 * @description spec for issue #1014
 * https://github.com/antvis/S2/issues/1014
 * Column should not be formatted
 *
 */
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { filter, get } from 'lodash';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';
import { CornerCell } from '@/cell';

const s2options: S2Options = {
  // 让被测试的单元格在首屏显示出来
  width: 300,
  height: 200,
  style: {
    colCfg: {
      height: 60,
    },
    cellCfg: {
      width: 100,
      height: 50,
    },
  },
};

const dataCfg = {
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

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), dataCfg, s2options);
    s2.render();
  });

  test('corner should not be formatted', () => {
    const cornerNodes = filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      s2.facet.getCornerHeader().getChildren(),
      (node) => node instanceof CornerCell,
    ) as unknown[] as CornerCell[];

    const provinceCornerNode = cornerNodes.find(
      (cell) => get(cell, 'meta.field') === 'province',
    );

    const cityCornerNode = cornerNodes.find(
      (cell) => get(cell, 'meta.field') === 'city',
    );

    expect(get(provinceCornerNode, 'meta.value')).toStrictEqual('省份');
    expect(get(provinceCornerNode, 'meta.label')).toStrictEqual('省份');
    expect(get(cityCornerNode, 'meta.value')).toStrictEqual('城市');
    expect(get(cityCornerNode, 'meta.label')).toStrictEqual('城市');
  });

  test('row should not be formatted', () => {
    const rowNodes = s2.getRowNodes();
    const provinceRowNode = rowNodes.find(({ field }) => field === 'province');

    expect(provinceRowNode.label).toStrictEqual('浙江');
    expect(provinceRowNode.value).toStrictEqual('浙江');
  });

  test('column should not be formatted', () => {
    const colNodes = s2.getColumnNodes();

    const cityColNode = colNodes.find(({ field }) => field === 'city');

    expect(cityColNode.label).toStrictEqual('义乌');
    expect(cityColNode.value).toStrictEqual('义乌');
  });

  test('data cell should render formatted value', () => {
    const priceDataCells = s2.interaction.getPanelGroupAllDataCells();

    expect(priceDataCells).not.toHaveLength(0);
    expect(priceDataCells).toSatisfyAll(
      (cell) => cell.getActualText() === 'price:1',
    );
  });
});
