/**
 * table mode data-set test.
 */
import { assembleDataCfg } from '../../util/sheet-entry';
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
      columns: ['province', 'city', 'type', 'sub_type', 'price'],
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
        'price',
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
            col: 'price',
          },
        }),
      ).toEqual(3);

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
});
