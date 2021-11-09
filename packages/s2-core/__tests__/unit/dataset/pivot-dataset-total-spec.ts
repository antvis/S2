/**
 * pivot mode base data-set test.
 */
import { get, keys } from 'lodash';
import { assembleDataCfg } from '../../util/sheet-entry';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { Store } from '@/common/store';

jest.mock('src/sheet-type');
jest.mock('src/facet/layout/node');
const MockPivotSheet = PivotSheet as any as jest.Mock<PivotSheet>;

describe('Pivot Dataset Total Test', () => {
  let dataSet: PivotDataSet;
  let dataCfg: S2DataConfig;

  beforeEach(() => {
    MockPivotSheet.mockClear();
    const mockSheet = new MockPivotSheet();
    mockSheet.store = new Store();
    dataSet = new PivotDataSet(mockSheet);

    dataCfg = assembleDataCfg({
      meta: [],
    });
    dataSet.setDataCfg(dataCfg);
  });

  describe('test base dataset structure', () => {
    test('should get correct row pivot meta', () => {
      const rowPivotMeta = dataSet.rowPivotMeta;

      expect([...rowPivotMeta.keys()]).toEqual([
        '浙江省',
        '四川省',
        undefined, // 行总计，根据数据结构来的
      ]);
      expect([...rowPivotMeta.get('浙江省').children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        undefined, // 行小计，来源测试数据
      ]);
      expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
        undefined,
      ]);
    });

    test('should get correct col pivot meta', () => {
      const colPivotMeta = dataSet.colPivotMeta;
      expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品', undefined]);

      expect([...colPivotMeta.get('家具').children.keys()]).toEqual([
        '桌子',
        '沙发',
        undefined,
      ]);

      expect([...colPivotMeta.get('办公用品').children.keys()]).toEqual([
        '笔',
        '纸张',
        undefined,
      ]);
    });

    test('should get correct indexesData', () => {
      const indexesData = dataSet.indexesData;
      expect(get(indexesData, '0.0.undefined.undefined.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        number: 15420,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 15420,
      });

      expect(get(indexesData, '0.0.1.undefined.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '办公用品',
        number: 2288,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 2288,
      });
      expect(get(indexesData, '1.undefined.1.undefined.0')).toEqual({
        province: '四川省',
        type: '办公用品',
        number: 18479,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 18479,
      });
      expect(
        get(indexesData, 'undefined.undefined.undefined.undefined.0'),
      ).toEqual({
        number: 78868,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 78868,
      });
    });

    test('should get correct sorted dimension value', () => {
      const sortedDimensionValues = dataSet.sortedDimensionValues;
      expect([...keys(sortedDimensionValues)]).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        EXTRA_FIELD,
      ]);
      expect([...sortedDimensionValues.province]).toEqual([
        '浙江省',
        '四川省',
        undefined,
      ]);
      expect([...sortedDimensionValues.city]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
        undefined,
        undefined,
        undefined,
      ]);
      expect([...sortedDimensionValues.type]).toEqual([
        '家具',
        '办公用品',
        undefined,
      ]);
      expect([...sortedDimensionValues.sub_type]).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
        undefined,
        undefined,
        undefined,
      ]);
      expect([...sortedDimensionValues[EXTRA_FIELD]]).toEqual(['number']);
    });
  });

  describe('test for query data', () => {
    test('getCellData function', () => {
      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 18375]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 26193]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 13132]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 15420]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 49709]]);

      expect(
        dataSet.getCellData({
          query: {
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 78868]]);
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
      expect(dataSet.getDimensionValues(EXTRA_FIELD)).toEqual(['number']);
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
});
