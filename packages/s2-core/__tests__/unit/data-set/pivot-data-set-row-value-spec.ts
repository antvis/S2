/**
 * pivot mode data-set test when value in row.
 */
import { get, keys } from 'lodash';
import { data } from 'tests/data/mock-dataset.json';
import { assembleDataCfg } from '../../util';
import { EXTRA_FIELD } from '@/common/constant';
import type { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { Store } from '@/common/store';
import { getDimensionsWithoutPathPre } from '@/utils/dataset/pivot-data-set';

jest.mock('@/sheet-type');
jest.mock('@/facet/layout/node');
const MockPivotSheet = PivotSheet as any as jest.Mock<PivotSheet>;

describe('Pivot Mode Test When Value In Row', () => {
  let dataSet: PivotDataSet;
  const dataCfg: S2DataConfig = assembleDataCfg({
    meta: [],
    fields: {
      ...assembleDataCfg({}).fields,
      valueInCols: false,
    },
    data,
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
      expect(rowPivotMeta.get('浙江省')!.level).toEqual(1);
      expect([...rowPivotMeta.get('浙江省')!.children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
      ]);
      expect([
        ...rowPivotMeta.get('浙江省')!.children.get('杭州市')!.children.keys(),
      ]).toEqual(['number']);
      expect(rowPivotMeta.get('四川省')!.level).toEqual(2);
      expect([...rowPivotMeta.get('四川省')!.children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect([
        ...rowPivotMeta.get('四川省')!.children!.get('成都市')!.children.keys(),
      ]).toEqual(['number']);
    });

    test('should get correct col pivot meta', () => {
      const colPivotMeta = dataSet.colPivotMeta;
      expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品']);

      expect(colPivotMeta.get('家具')!.level).toEqual(1);
      expect([...colPivotMeta.get('家具')!.children.keys()]).toEqual([
        '桌子',
        '沙发',
      ]);

      expect(colPivotMeta.get('办公用品')!.level).toEqual(2);
      expect([...colPivotMeta.get('办公用品')!.children.keys()]).toEqual([
        '笔',
        '纸张',
      ]);
    });

    test('should get correct indexesData', () => {
      const indexesData = dataSet.indexesData;
      expect(get(indexesData, '1.1.1.1')).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        number: 7789,
      });
      expect(get(indexesData, '1.2.2.1')).toEqual({
        province: '浙江省',
        city: '绍兴市',
        type: '办公用品',
        sub_type: '笔',
        number: 1304,
      });
      expect(get(indexesData, '2.1.1.2')).toEqual({
        province: '四川省',
        city: '成都市',
        type: '家具',
        sub_type: '沙发',
        number: 2451,
      });
    });

    test('should get correct sorted dimension value', () => {
      const sortedDimensionValues = dataSet.sortedDimensionValues;
      expect([...keys(sortedDimensionValues)]).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['province']),
      ).toEqual(['浙江省', '四川省']);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['city']),
      ).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['type']),
      ).toEqual(['家具', '办公用品']);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['sub_type']),
      ).toEqual(['桌子', '沙发', '笔', '纸张']);
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
