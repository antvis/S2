/* eslint-disable jest/expect-expect */
import { EXTRA_FIELD, S2DataConfig, S2Options, TOTAL_VALUE } from '@/common';
import { PivotSheet } from '@/sheet-type';
import { getContainer } from 'tests/util/helpers';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  hd: false,
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

describe('Fallback Calc Sub Totals Sort Tests', () => {
  let s2: PivotSheet;

  const expectSortSnapshot = async (sortMethod: string) => {
    const sortParams: S2DataConfig['sortParams'] = [
      {
        sortFieldId: '2799920880364640bd8f935abd18c5c6',
        sortByMeasure: TOTAL_VALUE,
        sortMethod,
        query: {
          [EXTRA_FIELD]: 'b0aa459e944f4fa2a15aa676675b4fba',
        },
      },
    ];

    const mockDataCfg: S2DataConfig = {
      sortParams,
      fields: {
        rows: [
          '2799920880364640bd8f935abd18c5c6',
          '1cf18bb67da1441b859cda64c725930c',
        ],
        columns: [],
        values: ['b0aa459e944f4fa2a15aa676675b4fba'],
        valueInCols: true,
      },
      data: [
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 29984.65,
          '2799920880364640bd8f935abd18c5c6': '2024-05-08',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 660145.79,
          '2799920880364640bd8f935abd18c5c6': '2024-05-08',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 22266165.73,
          '2799920880364640bd8f935abd18c5c6': '2024-05-08',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 32351.67,
          '2799920880364640bd8f935abd18c5c6': '2024-05-07',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 686584.77,
          '2799920880364640bd8f935abd18c5c6': '2024-05-07',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 22568182.05,
          '2799920880364640bd8f935abd18c5c6': '2024-05-07',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 30943.21,
          '2799920880364640bd8f935abd18c5c6': '2024-05-06',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 695686.31,
          '2799920880364640bd8f935abd18c5c6': '2024-05-06',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 24852159.93,
          '2799920880364640bd8f935abd18c5c6': '2024-05-06',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 31209.15,
          '2799920880364640bd8f935abd18c5c6': '2024-05-05',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 664105.94,
          '2799920880364640bd8f935abd18c5c6': '2024-05-05',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 25240997.54,
          '2799920880364640bd8f935abd18c5c6': '2024-05-05',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 31292.9,
          '2799920880364640bd8f935abd18c5c6': '2024-05-04',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 656579.43,
          '2799920880364640bd8f935abd18c5c6': '2024-05-04',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 25452767.81,
          '2799920880364640bd8f935abd18c5c6': '2024-05-04',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 30225.71,
          '2799920880364640bd8f935abd18c5c6': '2024-05-03',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 701728.79,
          '2799920880364640bd8f935abd18c5c6': '2024-05-03',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 26281050.94,
          '2799920880364640bd8f935abd18c5c6': '2024-05-03',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '办公用品',
          b0aa459e944f4fa2a15aa676675b4fba: 28321.87,
          '2799920880364640bd8f935abd18c5c6': '2024-05-02',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '家具',
          b0aa459e944f4fa2a15aa676675b4fba: 663961.98,
          '2799920880364640bd8f935abd18c5c6': '2024-05-02',
        },
        {
          '1cf18bb67da1441b859cda64c725930c': '设备',
          b0aa459e944f4fa2a15aa676675b4fba: 26853739.68,
          '2799920880364640bd8f935abd18c5c6': '2024-05-02',
        },
      ],
    };

    const container = getContainer();

    s2 = new PivotSheet(container, mockDataCfg, s2Options);
    await s2.render();

    const rowNodes = s2.facet
      .getRowNodes()
      .filter((node) => !node.isLeaf)
      .map((node) => node.value);

    expect(rowNodes).toMatchSnapshot();
  };

  test('should sort by DESC sort method', () => {
    expectSortSnapshot('DESC');
  });

  test('should sort by ASC sort method', () => {
    expectSortSnapshot('ASC');
  });
});
