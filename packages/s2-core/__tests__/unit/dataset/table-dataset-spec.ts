/**
 * table mode data-set test.
 */
import { orderBy, uniq } from 'lodash';
import { assembleDataCfg } from '../../util';
import { S2DataConfig } from '@/common/interface';
import { TableSheet } from '@/sheet-type';
import { TableDataSet } from '@/data-set/table-data-set';

jest.mock('src/sheet-type');
jest.mock('src/facet/layout/node');
const MockTableSheet = TableSheet as any as jest.Mock<TableSheet>;

describe('Table Mode Dataset Test', () => {
  let dataSet: TableDataSet;
  const dataCfg: S2DataConfig = {
    ...assembleDataCfg({}),
    meta: [],
    fields: {
      columns: ['province', 'city', 'type', 'sub_type', 'number'],
    },
  };
  beforeEach(() => {
    MockTableSheet.mockClear();
    dataSet = new TableDataSet(new MockTableSheet());

    dataSet.setDataCfg(dataCfg);
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
            col: 'city',
          },
        }),
      ).toEqual('杭州市');

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 2,
            col: 'number',
          },
        }),
      ).toEqual(3877);

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 5,
            col: 'sub_type',
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
            col: 'sub_type',
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
            col: 'city',
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
            customFilter: (row) => row.province === '浙江省',
          },
        ],
      });
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            col: 'city',
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
              row.province === '浙江省' || row.province === '四川省',
          },
        ],
      });
      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            col: 'city',
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
            col: 'number',
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
          sortFunc: ({ data, sortMethod, sortFieldId }) => {
            return orderBy(
              data,
              [sortFieldId],
              [sortMethod.toLocaleLowerCase() as 'asc' | 'desc'],
            );
          },
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
          sortFunc: null,
        },
      ];
      dataSet.handleDimensionValuesSort();
      expect(
        uniq(dataSet.getDisplayDataSet().map((item) => item.city)),
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
        .filter((record) => record.city !== '杭州市');

      const result = orderBy(
        dataSet
          .getDisplayDataSet()
          .filter((record) => record.city === '杭州市'),
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
  });
});
