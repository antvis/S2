import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  hd: true,
};

describe('Manual Sort Tests', () => {
  let s2: PivotSheet;

  const mockDataCfg: S2DataConfig = {
    fields: {
      rows: ['type1', 'type2'],
      columns: [],
      values: ['count'],
      valueInCols: true,
    },
    data: [
      {
        type1: '整体访问',
        type2: '整体访问',
        count: 20,
      },
      {
        type1: '整体访问',
        type2: '小程序访问',
        count: 12,
      },
      {
        type1: '整体访问',
        type2: '支付宝访问',
        count: 20,
      },
      {
        type1: '小程序访问',
        type2: '整体访问',
        count: 5,
      },
      {
        type1: '小程序访问',
        type2: '小程序访问',
        count: 10,
      },
      {
        type1: '小程序访问',
        type2: '支付宝访问',
        count: 15,
      },
      {
        type1: '支付宝访问',
        type2: '整体访问',
        count: 100,
      },
      {
        type1: '支付宝访问',
        type2: '小程序访问',
        count: 30,
      },
      {
        type1: '支付宝访问',
        type2: '支付宝访问',
        count: 60,
      },
    ],
    sortParams: [
      {
        sortFieldId: 'type1',
        sortBy: ['整体访问', '小程序访问', '支付宝访问'],
      },
      {
        sortFieldId: 'type2',
        sortBy: ['支付宝访问', '整体访问', '小程序访问'],
      },
    ],
  };

  beforeEach(async () => {
    const container = getContainer();

    s2 = new PivotSheet(container, mockDataCfg, s2Options);
    await s2.render();
  });

  test('getDimensionValues should include correct values', () => {
    const sortedType1 = s2.dataSet.getDimensionValues('type1', {});

    expect(sortedType1).toEqual(['整体访问', '小程序访问', '支付宝访问']);

    expect(
      s2.dataSet.getDimensionValues('type2', {
        type1: '整体访问',
      }),
    ).toEqual(['支付宝访问', '整体访问', '小程序访问']);
    expect(
      s2.dataSet.getDimensionValues('type2', {
        type1: '小程序访问',
      }),
    ).toEqual(['支付宝访问', '整体访问', '小程序访问']);
    expect(
      s2.dataSet.getDimensionValues('type2', {
        type1: '支付宝访问',
      }),
    ).toEqual(['支付宝访问', '整体访问', '小程序访问']);
  });
});
