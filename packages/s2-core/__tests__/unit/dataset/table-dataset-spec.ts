/**
 * table mode data-set test.
 */
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
    it('should getCellData with filterFunction', () => {
      dataSet.setDataCfg({
        ...dataCfg,
        filterParams: [
          {
            filterKey: 'province',
            filterFunction: (row) => row.province === '浙江省',
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
  });
});
