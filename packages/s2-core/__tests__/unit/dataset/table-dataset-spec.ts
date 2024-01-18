/**
 * table mode data-set test.
 */
import { first, last, orderBy, uniq } from 'lodash';
import { data } from 'tests/data/mock-dataset.json';
import { assembleDataCfg } from '../../util';
import type { S2DataConfig, SortParam } from '@/common/interface';
import { TableDataSet } from '@/data-set/table-data-set';
import { TableSheet } from '@/sheet-type';

jest.mock('@/sheet-type');
jest.mock('@/facet/layout/node');

const MockTableSheet = TableSheet as any as jest.Mock<TableSheet>;

describe('Table Mode Dataset Test', () => {
  let dataSet: TableDataSet;

  const dataCfg: S2DataConfig = {
    ...assembleDataCfg({}),
    meta: [],
    fields: {
      columns: ['province', 'city', 'type', 'sub_type', 'number'],
    },
    data,
  };

  beforeEach(() => {
    MockTableSheet.mockClear();
    const s2 = new MockTableSheet();

    s2.options = {
      frozen: {},
    };
    dataSet = new TableDataSet(s2);

    dataSet.setDataCfg(dataCfg);
  });

  afterEach(() => {
    MockTableSheet.mockClear();
  });

  describe('test base dataset structure', () => {
    test('should get correct field data', () => {
      expect(dataSet.fields.rows).toEqual(undefined);
      expect(dataSet.fields.columns).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        'number',
      ]);
      expect(dataSet.fields.values).toEqual(undefined);
    });

    test('should get correct meta data', () => {
      expect(dataSet.meta).toEqual(expect.objectContaining([]));
    });
  });

  describe('test for query data', () => {
    test('getCellData function', () => {
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            field: 'city',
          },
        }),
      ).toEqual('杭州市');

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 2,
            field: 'number',
          },
        }),
      ).toEqual(3877);

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 5,
            field: 'sub_type',
          },
        }),
      ).toEqual('沙发');
    });
  });

  describe('test dataset query when no data', () => {
    test('should handle getCellData when no data', () => {
      MockTableSheet.mockClear();
      const emptyDataSet = new TableDataSet(new MockTableSheet());

      emptyDataSet.setDataCfg({
        ...dataCfg,
        data: [],
      });
      expect(
        emptyDataSet.getCellData({
          query: {
            field: 'sub_type',
            rowIndex: 0,
          },
        }),
      ).toEqual(undefined);
    });
  });

  describe('test for sort and filter', () => {
    it('should getCellData with filteredValues', () => {
      dataSet.setDataCfg({
        ...dataCfg,
        filterParams: [
          {
            filterKey: 'province',
            filteredValues: ['浙江省'],
          },
        ],
      });
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            field: 'city',
          },
        }),
      ).toEqual('成都市');
    });

    it('should getCellData with customFilter', () => {
      dataSet.setDataCfg({
        ...dataCfg,
        filterParams: [
          {
            filterKey: 'province',
            customFilter: (row) => row['province'] === '浙江省',
          },
        ],
      });
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            field: 'city',
          },
        }),
      ).toEqual('杭州市');
    });

    it('should getCellData with customFilter and filteredValues', () => {
      dataSet.setDataCfg({
        ...dataCfg,
        filterParams: [
          {
            filterKey: 'province',
            filteredValues: ['浙江省'],
            customFilter: (row) =>
              row['province'] === '浙江省' || row['province'] === '四川省',
          },
        ],
      });
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            field: 'city',
          },
        }),
      ).toEqual('成都市');
    });

    it('should getCellData with sort', () => {
      dataSet.setDataCfg({
        ...dataCfg,
        sortParams: [
          {
            sortFieldId: 'number',
            sortMethod: 'ASC',
          },
        ],
      });
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            field: 'number',
          },
        }),
      ).toEqual(245);
    });

    it('should get correct sorted data with sortFunc', () => {
      const sortFieldId = 'number';
      const sortMethod = 'desc';
      const sorted = orderBy(
        dataSet.getDisplayDataSet(),
        [sortFieldId],
        [sortMethod.toLocaleLowerCase() as 'asc' | 'desc'],
      );

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod,
          sortFunc: ({ data, sortMethod, sortFieldId }) =>
            orderBy(
              data,
              [sortFieldId],
              [sortMethod!.toLocaleLowerCase() as 'asc' | 'desc'],
            ),
        },
      ];
      dataSet.handleDimensionValuesSort();

      expect(dataSet.getDisplayDataSet()).toStrictEqual(sorted);
    });

    it('should get correct sorted data with sortBy', () => {
      const sortFieldId = 'city';
      const sortBy = [
        '杭州市',
        '成都市',
        '绍兴市',
        '舟山市',
        '宁波市',
        '绵阳市',
        '乐山市',
        '南充市',
      ];

      dataSet.sortParams = [
        {
          sortFieldId,
          sortBy,
          sortFunc: null as unknown as SortParam['sortFunc'],
        },
      ];
      dataSet.handleDimensionValuesSort();
      expect(
        uniq(dataSet.getDisplayDataSet().map((item) => item['city'])),
      ).toStrictEqual(sortBy);
    });

    it('should get correct sorted data with sortMethod', () => {
      const sortFieldId = 'number';

      let result = orderBy(dataSet.getDisplayDataSet(), [sortFieldId], 'asc');

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'asc',
        },
      ];
      dataSet.handleDimensionValuesSort();
      expect(result).toStrictEqual(dataSet.getDisplayDataSet());

      result = orderBy(dataSet.getDisplayDataSet(), [sortFieldId], 'desc');
      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'desc',
        },
      ];
      dataSet.handleDimensionValuesSort();
      expect(result).toStrictEqual(dataSet.getDisplayDataSet());
    });

    it('should get scoped sort result', () => {
      const sortFieldId = 'number';
      const query = {
        city: '杭州市',
      };

      const rest = dataSet
        .getDisplayDataSet()
        .filter((record) => record['city'] !== '杭州市');

      const result = orderBy(
        dataSet
          .getDisplayDataSet()
          .filter((record) => record['city'] === '杭州市'),
        [sortFieldId],
        'asc',
      );

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'asc',
          query,
        },
      ];
      dataSet.handleDimensionValuesSort();
      expect([...result, ...rest]).toStrictEqual(dataSet.getDisplayDataSet());
    });

    it('should asc sort by number field', () => {
      const sortFieldId = 'number';

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'asc',
        },
      ];

      dataSet.handleDimensionValuesSort();

      expect(dataSet.getDisplayDataSet()).toHaveLength(32);
      expect(dataSet.getDisplayDataSet()).toMatchSnapshot();
    });

    it('should desc sort by number field', () => {
      const sortFieldId = 'number';

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'desc',
        },
      ];

      dataSet.handleDimensionValuesSort();

      expect(dataSet.getDisplayDataSet()).toHaveLength(32);
      expect(dataSet.getDisplayDataSet()).toMatchSnapshot();
    });

    // https://github.com/antvis/S2/issues/2388
    it('should frozen correctly desc sorted data', () => {
      const sortFieldId = 'number';

      Object.defineProperty(dataSet.spreadsheet, 'options', {
        value: {
          frozenRowCount: 1,
          frozenTrailingRowCount: 1,
        },
      });

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'desc',
        },
      ];

      dataSet.handleDimensionValuesSort();

      expect(dataSet.getDisplayDataSet()).toHaveLength(32);
      expect(first(dataSet.getDisplayDataSet())).toMatchInlineSnapshot(`
        Object {
          "city": "杭州市",
          "number": 7789,
          "province": "浙江省",
          "sub_type": "桌子",
          "type": "家具",
        }
      `);
      expect(last(dataSet.getDisplayDataSet())).toMatchInlineSnapshot(`
        Object {
          "city": "绵阳市",
          "number": 245,
          "province": "四川省",
          "sub_type": "笔",
          "type": "办公用品",
        }
      `);
    });

    it('should frozen correctly asc sorted data', () => {
      const sortFieldId = 'number';

      Object.defineProperty(dataSet.spreadsheet, 'options', {
        value: {
          frozenRowCount: 1,
          frozenTrailingRowCount: 1,
        },
      });

      dataSet.sortParams = [
        {
          sortFieldId,
          sortMethod: 'asc',
        },
      ];

      dataSet.handleDimensionValuesSort();

      expect(dataSet.getDisplayDataSet()).toHaveLength(32);
      expect(first(dataSet.getDisplayDataSet())).toMatchInlineSnapshot(`
        Object {
          "city": "绵阳市",
          "number": 245,
          "province": "四川省",
          "sub_type": "笔",
          "type": "办公用品",
        }
      `);
      expect(last(dataSet.getDisplayDataSet())).toMatchInlineSnapshot(`
        Object {
          "city": "杭州市",
          "number": 7789,
          "province": "浙江省",
          "sub_type": "桌子",
          "type": "家具",
        }
      `);
    });
  });
});
