/**
 * custom-tree mode base data-set test.
 */
import { get } from 'lodash';
import { customTreeItems } from 'tests/data/custom-tree-items';
import { dataCustomTrees } from 'tests/data/data-custom-trees';
import { S2DataConfig } from '@/common/interface';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { PivotSheet } from '@/sheet-type';
import { transformCustomTreeItems } from '@/index';
import { CustomTreePivotDataSet } from '@/data-set/custom-tree-pivot-data-set';

jest.mock('@/sheet-type');

jest.mock('@/interaction/root');

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;

describe('Custom Tree Dataset Test', () => {
  const values = [
    'measure-a',
    'measure-b',
    'measure-c',
    'measure-d',
    'measure-e',
    'measure-f',
  ];
  const dataCfg: S2DataConfig = {
    meta: [],
    data: dataCustomTrees,
    totalData: [],
    fields: {
      rows: [],
      columns: ['type', 'sub_type'],
      values,
      customTreeItems: transformCustomTreeItems(customTreeItems),
      valueInCols: false,
    },
  };

  const mockSheet = new MockPivotSheet();
  const dataSet = new CustomTreePivotDataSet(mockSheet);
  dataSet.setDataCfg(dataCfg);

  describe('test base dataset structure', () => {
    test('should get correct field data', () => {
      expect(dataSet.fields.rows).toEqual([EXTRA_FIELD]);
      expect(dataSet.fields.columns).toEqual(['type', 'sub_type']);
      expect(dataSet.fields.values).toEqual(values);
    });

    test('should get correct row pivot meta', () => {
      const rowPivotMeta = dataSet.rowPivotMeta;
      expect([...rowPivotMeta.keys()]).toEqual(values);
      expect(rowPivotMeta.get('measure-a').level).toEqual(0);
    });

    test('should get correct col pivot meta', () => {
      const colPivotMeta = dataSet.colPivotMeta;
      expect([...colPivotMeta.keys()]).toEqual(['家具']);

      expect(colPivotMeta.get('家具').level).toEqual(0);
      expect([...colPivotMeta.get('家具').children.keys()]).toEqual([
        '桌子',
        '椅子',
      ]);
    });

    test('should get correct indexesData', () => {
      const indexesData = dataSet.indexesData;
      expect(get(indexesData, '0.0.0')).toEqual({
        type: '家具',
        sub_type: '桌子',
        'measure-a': 1,
        [EXTRA_FIELD]: 'measure-a',
        [VALUE_FIELD]: 1,
      });
      expect(get(indexesData, '0.0.1')).toEqual({
        type: '家具',
        sub_type: '椅子',
        'measure-a': 11,
        [EXTRA_FIELD]: 'measure-a',
        [VALUE_FIELD]: 11,
      });
      expect(get(indexesData, '5.0.1')).toEqual({
        type: '家具',
        sub_type: '椅子',
        'measure-f': 66,
        [EXTRA_FIELD]: 'measure-f',
        [VALUE_FIELD]: 66,
      });
    });
  });

  describe('test for query data', () => {
    test('getCellData function', () => {
      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'measure-a',
          },
          isTotals: true,
        }),
      ).toContainEntries([[VALUE_FIELD, 1]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            sub_type: '椅子',
            [EXTRA_FIELD]: 'measure-e',
          },
          isTotals: true,
        }),
      ).toContainEntries([[VALUE_FIELD, 55]]);
    });
  });
});
