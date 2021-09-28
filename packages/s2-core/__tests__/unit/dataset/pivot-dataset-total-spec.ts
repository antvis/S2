/**
 * pivot mode base data-set test.
 */
import { get } from 'lodash';
import { assembleDataCfg } from '../../util/sheet-entry';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';

jest.mock('src/sheet-type');
jest.mock('src/facet/layout/node');
const MockPivotSheet = PivotSheet as any as jest.Mock<PivotSheet>;

describe('Pivot Dataset Total Test', () => {
  let dataSet: PivotDataSet;
  let dataCfg: S2DataConfig;

  beforeEach(() => {
    MockPivotSheet.mockClear();
    dataSet = new PivotDataSet(new MockPivotSheet());

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
        price: 28,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 28,
      });
      expect(get(indexesData, '0.0.1.undefined.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '办公用品',
        price: 22,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 22,
      });
      expect(get(indexesData, '1.undefined.1.undefined.0')).toEqual({
        province: '四川省',
        type: '办公用品',
        price: 228,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 228,
      });
      expect(
        get(indexesData, 'undefined.undefined.undefined.undefined.0'),
      ).toEqual({
        price: 528,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 528,
      });
    });

    test('should get correct sorted dimension value', () => {
      const sortedDimensionValues = dataSet.sortedDimensionValues;
      expect([...sortedDimensionValues.keys()]).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        EXTRA_FIELD,
      ]);
      expect([...sortedDimensionValues.get('province')]).toEqual([
        '浙江省',
        '四川省',
        undefined,
      ]);
      expect([...sortedDimensionValues.get('city')]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
        undefined,
      ]);
      expect([...sortedDimensionValues.get('type')]).toEqual([
        '家具',
        '办公用品',
        undefined,
      ]);
      expect([...sortedDimensionValues.get('sub_type')]).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
        undefined,
      ]);
      expect([...sortedDimensionValues.get(EXTRA_FIELD)]).toEqual(['price']);
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
            [EXTRA_FIELD]: 'price',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 10]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'price',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 84]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            [EXTRA_FIELD]: 'price',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 6]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            [EXTRA_FIELD]: 'price',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 28]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            [EXTRA_FIELD]: 'price',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 200]]);

      expect(
        dataSet.getCellData({
          query: {
            [EXTRA_FIELD]: 'price',
          },
        }),
      ).toContainEntries([[VALUE_FIELD, 528]]);
    });

    test('getMultiData function', () => {
      const specialQuery = {
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        [EXTRA_FIELD]: 'price',
      };
      expect(dataSet.getMultiData(specialQuery)).toHaveLength(1);
      expect(dataSet.getMultiData(specialQuery)[0]).toContainEntries([
        [VALUE_FIELD, 1],
      ]);
      expect(
        dataSet.getMultiData({
          province: '浙江省',
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'price',
        }),
      ).toHaveLength(4);

      expect(
        dataSet.getMultiData({
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'price',
        }),
      ).toHaveLength(8);

      expect(
        dataSet.getMultiData({
          type: '家具',
          [EXTRA_FIELD]: 'price',
        }),
      ).toHaveLength(16);

      expect(
        dataSet.getMultiData({
          [EXTRA_FIELD]: 'price',
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
      expect(dataSet.getDimensionValues(EXTRA_FIELD)).toEqual(['price']);
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
