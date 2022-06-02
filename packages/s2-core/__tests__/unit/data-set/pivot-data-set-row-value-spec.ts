/**
 * pivot mode data-set test when value in row.
 */
import { get, keys } from 'lodash';
import { assembleDataCfg } from '../../util';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { Store } from '@/common/store';
import { getDimensionsWithoutPathPre } from '@/utils/dataset/pivot-data-set';

jest.mock('src/sheet-type');
jest.mock('src/facet/layout/node');
const MockPivotSheet = PivotSheet as any as jest.Mock<PivotSheet>;

describe('Pivot Mode Test When Value In Row', () => {
  let dataSet: PivotDataSet;
  const dataCfg: S2DataConfig = assembleDataCfg({
    totalData: [],
    meta: [],
    fields: {
      ...assembleDataCfg({}).fields,
      valueInCols: false,
    },
  });

  beforeEach(() => {
    MockPivotSheet.mockClear();
    const mockSheet = new MockPivotSheet();
    mockSheet.store = new Store();
    dataSet = new PivotDataSet(mockSheet);

    dataSet.setDataCfg(dataCfg);
  });

  describe('test base dataset structure', () => {
    test('should get correct field data', () => {
      expect(dataSet.fields.rows).toEqual(['province', 'city', EXTRA_FIELD]);
      expect(dataSet.fields.columns).toEqual(['type', 'sub_type']);
      expect(dataSet.fields.values).toEqual(['number']);
    });

    test('should get correct meta data', () => {
      expect(dataSet.meta[0]).toContainEntries([
        ['field', EXTRA_FIELD],
        ['name', '数值'],
      ]);
    });

    test('should get correct row pivot meta', () => {
      const rowPivotMeta = dataSet.rowPivotMeta;
      expect([...rowPivotMeta.keys()]).toEqual(['浙江省', '四川省']);
      expect(rowPivotMeta.get('浙江省').level).toEqual(0);
      expect([...rowPivotMeta.get('浙江省').children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
      ]);
      expect([
        ...rowPivotMeta.get('浙江省').children.get('杭州市').children.keys(),
      ]).toEqual(['number']);
      expect(rowPivotMeta.get('四川省').level).toEqual(1);
      expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect([
        ...rowPivotMeta.get('四川省').children.get('成都市').children.keys(),
      ]).toEqual(['number']);
    });

    test('should get correct col pivot meta', () => {
      const colPivotMeta = dataSet.colPivotMeta;
      expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品']);

      expect(colPivotMeta.get('家具').level).toEqual(0);
      expect([...colPivotMeta.get('家具').children.keys()]).toEqual([
        '桌子',
        '沙发',
      ]);

      expect(colPivotMeta.get('办公用品').level).toEqual(1);
      expect([...colPivotMeta.get('办公用品').children.keys()]).toEqual([
        '笔',
        '纸张',
      ]);
    });

    test('should get correct indexesData', () => {
      const indexesData = dataSet.indexesData;
      expect(get(indexesData, '0.0.0.0.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        number: 7789,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 7789,
      });
      expect(get(indexesData, '0.1.0.1.0')).toEqual({
        province: '浙江省',
        city: '绍兴市',
        type: '办公用品',
        sub_type: '笔',
        number: 1304,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 1304,
      });
      expect(get(indexesData, '1.0.0.0.1')).toEqual({
        province: '四川省',
        city: '成都市',
        type: '家具',
        sub_type: '沙发',
        number: 2451,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 2451,
      });
    });

    test('should get correct sorted dimension value', () => {
      const sortedDimensionValues = dataSet.sortedDimensionValues;
      expect([...keys(sortedDimensionValues)]).toEqual([
        'province',
        'city',
        EXTRA_FIELD,
        'type',
        'sub_type',
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues.province),
      ).toEqual(['浙江省', '四川省']);
      expect(getDimensionsWithoutPathPre(sortedDimensionValues.city)).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect(getDimensionsWithoutPathPre(sortedDimensionValues.type)).toEqual([
        '家具',
        '办公用品',
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues.sub_type),
      ).toEqual(['桌子', '沙发', '笔', '纸张']);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues[EXTRA_FIELD]),
      ).toEqual([
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
      ]);
    });
  });

  describe('test for query data', () => {
    test('getCellData function', () => {
      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 7789]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '四川省',
            city: '乐山市',
            type: '办公用品',
            sub_type: '纸张',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 352]]);
    });

    test('getMultiData function', () => {
      const specialQuery = {
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        [EXTRA_FIELD]: 'number',
      };
      expect(dataSet.getMultiData(specialQuery)).toHaveLength(1);
      expect(dataSet.getMultiData(specialQuery)[0]).toContainEntries([
        [VALUE_FIELD, 7789],
      ]);

      expect(
        dataSet.getMultiData({
          province: '浙江省',
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(4);

      expect(
        dataSet.getMultiData({
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(8);

      expect(
        dataSet.getMultiData({
          type: '家具',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(16);

      expect(
        dataSet.getMultiData({
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(32);
    });

    test('getDimensionValues function', () => {
      // without query
      expect(dataSet.getDimensionValues('province')).toEqual([
        '浙江省',
        '四川省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect(dataSet.getDimensionValues('type')).toEqual(['家具', '办公用品']);
      expect(dataSet.getDimensionValues('sub_type')).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
      ]);
      expect(dataSet.getDimensionValues(EXTRA_FIELD)).toEqual([
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
      ]);
      expect(dataSet.getDimensionValues('empty')).toEqual([]);

      // with query
      expect(
        dataSet.getDimensionValues('city', { province: '四川省' }),
      ).toEqual(['成都市', '绵阳市', '南充市', '乐山市']);
      expect(dataSet.getDimensionValues('sub_type', { type: '家具' })).toEqual([
        '桌子',
        '沙发',
      ]);
      expect(dataSet.getDimensionValues('sub_type', { type: 'empty' })).toEqual(
        [],
      );
    });
  });

  describe('test for sort', () => {
    test('sort by method', () => {
      dataCfg.sortParams = [
        { sortFieldId: 'province', sortMethod: 'ASC' },
        { sortFieldId: 'city', sortMethod: 'DESC' },
      ];
      dataSet.setDataCfg(dataCfg);
      expect(dataSet.getDimensionValues('province')).toEqual([
        '四川省',
        '浙江省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '舟山市',
        '绍兴市',
        '宁波市',
        '杭州市',
        '南充市',
        '绵阳市',
        '乐山市',
        '成都市',
      ]);
    });

    test('sort by list', () => {
      dataCfg.sortParams = [
        { sortFieldId: 'province', sortBy: ['四川省'] },
        { sortFieldId: 'city', sortBy: ['宁波市', '绵阳市', '乐山市'] },
      ];
      dataSet.setDataCfg(dataCfg);
      expect(dataSet.getDimensionValues('province')).toEqual([
        '四川省',
        '浙江省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '宁波市',
        '绵阳市',
        '乐山市',
        '杭州市',
        '绍兴市',
        '舟山市',
        '成都市',
        '南充市',
      ]);
    });

    test('sort by measure', () => {
      dataCfg.sortParams = [
        {
          sortFieldId: 'sub_type',
          sortByMeasure: 'number',
          sortMethod: 'ASC',
          query: {
            province: '浙江省',
            city: '杭州市',
          },
        },
      ];
      dataSet.setDataCfg(dataCfg);
      expect(dataSet.getDimensionValues('sub_type')).toEqual([
        '笔',
        '纸张',
        '沙发',
        '桌子',
      ]);
    });
  });
});
