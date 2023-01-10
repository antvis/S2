/**
 * pivot mode base data-set test.
 */
import { get, keys } from 'lodash';
import * as multiDataCfg from 'tests/data/simple-data.json';
import * as mockData from 'tests/data/mock-dataset.json';
import { assembleDataCfg, TOTALS_OPTIONS } from '../../util';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '@/common/constant';
import {
  type S2DataConfig,
  Aggregation,
  type CalcTotals,
} from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { Store } from '@/common/store';
import { getDimensionsWithoutPathPre } from '@/utils/dataset/pivot-data-set';

jest.mock('@/sheet-type');
jest.mock('@/facet/layout/node');
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
        TOTAL_VALUE, // 行总计，根据数据结构来的
      ]);
      expect([...rowPivotMeta.get('浙江省')!.children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        TOTAL_VALUE, // 行小计，来源测试数据
      ]);
      expect([...rowPivotMeta.get('四川省')!.children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
        TOTAL_VALUE,
      ]);
    });

    test('should get correct col pivot meta', () => {
      const colPivotMeta = dataSet.colPivotMeta;

      expect([...colPivotMeta.keys()]).toEqual([
        '家具',
        '办公用品',
        TOTAL_VALUE,
      ]);

      expect([...colPivotMeta.get('家具')!.children.keys()]).toEqual([
        '桌子',
        '沙发',
        TOTAL_VALUE,
      ]);

      expect([...colPivotMeta.get('办公用品')!.children.keys()]).toEqual([
        '笔',
        '纸张',
        TOTAL_VALUE,
      ]);
    });

    test('should get correct indexesData', () => {
      const indexesData = dataSet.indexesData;

      expect(get(indexesData, '1.1.0.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        number: 15420,
      });

      expect(get(indexesData, '1.1.2.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '办公用品',
        number: 2288,
      });
      expect(get(indexesData, '2.0.2.0')).toEqual({
        province: '四川省',
        type: '办公用品',
        number: 18479,
      });
      expect(get(indexesData, '0.0.0.0')).toEqual({
        number: 78868,
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
        getDimensionsWithoutPathPre(sortedDimensionValues.province),
      ).toEqual(['浙江省', '四川省', TOTAL_VALUE]);
      expect(getDimensionsWithoutPathPre(sortedDimensionValues.city)).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
        TOTAL_VALUE,
        TOTAL_VALUE,
        TOTAL_VALUE,
      ]);
      expect(getDimensionsWithoutPathPre(sortedDimensionValues.type)).toEqual([
        '家具',
        '办公用品',
        TOTAL_VALUE,
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues.sub_type),
      ).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
        TOTAL_VALUE,
        TOTAL_VALUE,
        TOTAL_VALUE,
      ]);
    });
  });

  describe('test for query data', () => {
    test('getCellData function', () => {
      expect(
        dataSet
          .getCellData({
            query: {
              province: '浙江省',
              type: '家具',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
          })!
          .getOrigin(),
      ).toContainEntries([['number', 18375]]);

      expect(
        dataSet
          .getCellData({
            query: {
              type: '家具',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
          })!
          .getOrigin(),
      ).toContainEntries([['number', 26193]]);

      expect(
        dataSet
          .getCellData({
            query: {
              province: '浙江省',
              city: '杭州市',
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
          })!
          .getOrigin(),
      ).toContainEntries([['number', 13132]]);

      expect(
        dataSet
          .getCellData({
            query: {
              province: '浙江省',
              city: '杭州市',
              [EXTRA_FIELD]: 'number',
            },
          })!
          .getOrigin(),
      ).toContainEntries([['number', 15420]]);

      expect(
        dataSet
          .getCellData({
            query: {
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
          })!
          .getOrigin(),
      ).toContainEntries([['number', 49709]]);

      expect(
        dataSet
          .getCellData({
            query: {
              [EXTRA_FIELD]: 'number',
            },
          })!
          .getOrigin(),
      ).toContainEntries([['number', 78868]]);
    });

    describe('getCellData function when totals calculated by aggregation', () => {
      beforeEach(() => {
        MockPivotSheet.mockClear();
        const mockSheet = new MockPivotSheet();

        mockSheet.store = new Store();
        mockSheet.isValueInCols = () => true;
        mockSheet.options = {
          width: 800,
          height: 600,
          totals: {
            row: {
              ...TOTALS_OPTIONS?.row,
              calcTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
            col: {
              ...TOTALS_OPTIONS?.col,
              calcTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        };
        dataCfg = assembleDataCfg({
          meta: [],
          data: mockData.data,
        });
        dataSet = new PivotDataSet(mockSheet);
        dataSet.setDataCfg(dataCfg);
      });
      test('should get correct total cell data when calculated by aggregation', () => {
        expect(
          dataSet
            .getCellData({
              query: {
                province: '浙江省',
                type: '家具',
                sub_type: '桌子',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 18375]]);

        expect(
          dataSet
            .getCellData({
              query: {
                type: '家具',
                sub_type: '桌子',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 26193]]);

        expect(
          dataSet
            .getCellData({
              query: {
                province: '浙江省',
                city: '杭州市',
                type: '家具',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 13132]]);

        expect(
          dataSet
            .getCellData({
              query: {
                province: '浙江省',
                city: '杭州市',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 15420]]);

        expect(
          dataSet
            .getCellData({
              query: {
                type: '家具',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 49709]]);

        expect(
          dataSet
            .getCellData({
              query: {
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 78868]]);
      });

      describe('getCellData function when totals calculated when multi values', () => {
        beforeEach(() => {
          MockPivotSheet.mockClear();
          const mockSheet = new MockPivotSheet();

          mockSheet.store = new Store();
          mockSheet.isValueInCols = () => true;
          mockSheet.options = {
            width: 800,
            height: 600,
            totals: {
              row: {
                showGrandTotals: true,
                showSubTotals: true,
                subTotalsDimensions: ['city'],
                calcTotals: {
                  aggregation: Aggregation.SUM,
                },
                calcSubTotals: {
                  aggregation: Aggregation.SUM,
                },
              },
              col: {
                showGrandTotals: true,
                showSubTotals: true,
                subTotalsDimensions: ['type'],
                calcTotals: {
                  aggregation: Aggregation.SUM,
                },
                calcSubTotals: {
                  aggregation: Aggregation.SUM,
                },
              },
            },
          };
          dataCfg = assembleDataCfg({
            ...multiDataCfg,
            meta: [],
          });
          dataSet = new PivotDataSet(mockSheet);
          dataSet.setDataCfg(dataCfg);
        });
        test('should get correct total cell data when calculated by aggregation and multi values', () => {
          expect(
            dataSet
              .getCellData({
                query: {
                  province: '浙江',
                  type: '笔',
                  [EXTRA_FIELD]: 'price',
                },
                isTotals: true,
              })!
              .getOrigin(),
          ).toContainEntries([['price', 2]]);
          expect(
            dataSet
              .getCellData({
                query: {
                  province: '浙江',
                  type: '笔',
                  [EXTRA_FIELD]: 'cost',
                },
                isTotals: true,
              })!
              .getOrigin(),
          ).toContainEntries([['cost', 4]]);
        });
      });
    });

    describe('getCellData function when totals calculated by calcFunc', () => {
      beforeEach(() => {
        MockPivotSheet.mockClear();
        const mockSheet = new MockPivotSheet();

        mockSheet.store = new Store();
        mockSheet.isValueInCols = () => true;

        const calcFunc1: CalcTotals['calcFunc'] = (_, data) => {
          const sum = data.reduce(
            (pre, next) => pre + (next[VALUE_FIELD] as number),
            0,
          );

          return sum * 2;
        };

        const calcFunc2: CalcTotals['calcFunc'] = (_, data) => {
          const sum = data.reduce(
            (pre, next) => pre + (next[VALUE_FIELD] as number),
            0,
          );

          return sum;
        };

        mockSheet.options = {
          width: 800,
          height: 600,
          totals: {
            row: {
              ...TOTALS_OPTIONS?.row,
              calcTotals: {
                calcFunc: calcFunc1,
              },
              calcSubTotals: {
                calcFunc: calcFunc2,
              },
            },
            col: {
              ...TOTALS_OPTIONS?.col,
              calcTotals: {
                calcFunc: calcFunc2,
              },
              calcSubTotals: {
                calcFunc: calcFunc1,
              },
            },
          },
        };
        dataCfg = assembleDataCfg({
          meta: [],
          data: mockData.data,
        });
        dataSet = new PivotDataSet(mockSheet);
        dataSet.setDataCfg(dataCfg);
      });
      test('should get correct total cell data when totals calculated by calcFunc', () => {
        expect(
          dataSet
            .getCellData({
              query: {
                province: '浙江省',
                type: '家具',
                sub_type: '桌子',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 18375]]);

        expect(
          dataSet
            .getCellData({
              query: {
                type: '家具',
                sub_type: '桌子',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 52386]]);

        expect(
          dataSet
            .getCellData({
              query: {
                province: '浙江省',
                city: '杭州市',
                type: '家具',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 26264]]);

        expect(
          dataSet
            .getCellData({
              query: {
                province: '浙江省',
                city: '杭州市',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 15420]]);

        expect(
          dataSet
            .getCellData({
              query: {
                type: '家具',
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 99418]]);

        expect(
          dataSet
            .getCellData({
              query: {
                [EXTRA_FIELD]: 'number',
              },
              isTotals: true,
            })!
            .getOrigin(),
        ).toContainEntries([['number', 78868]]);
      });
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
      expect(
        dataSet.getMultiData(specialQuery)[0].getOrigin(),
      ).toContainEntries([['number', 7789]]);
      expect(
        dataSet.getMultiData({
          province: '浙江省',
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(5);

      expect(
        dataSet.getMultiData({
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(11);

      expect(
        dataSet.getMultiData({
          type: '家具',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(33);

      expect(
        dataSet.getMultiData({
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(77);
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

  describe('test for get total status', () => {
    beforeEach(() => {
      MockPivotSheet.mockClear();
      const mockSheet = new MockPivotSheet();

      mockSheet.store = new Store();
      mockSheet.isValueInCols = () => true;
      dataSet = new PivotDataSet(mockSheet);

      dataCfg = assembleDataCfg({
        meta: [],
      });
      dataSet.setDataCfg(dataCfg);
    });

    test('should get correct total status', () => {
      const {
        isRowTotal: isRowTotal1,
        isRowSubTotal: isRowSubTotal1,
        isColTotal: isColTotal1,
        isColSubTotal: isColSubTotal1,
      } = dataSet.getTotalStatus({
        [EXTRA_FIELD]: 'number',
      });

      expect(isRowTotal1).toBeTrue();
      expect(isRowSubTotal1).toBeFalse();
      expect(isColTotal1).toBeTrue();
      expect(isColSubTotal1).toBeFalse();

      const {
        isRowTotal: isRowTotal2,
        isRowSubTotal: isRowSubTotal2,
        isColTotal: isColTotal2,
        isColSubTotal: isColSubTotal2,
      } = dataSet.getTotalStatus({
        type: '家具',
        [EXTRA_FIELD]: 'number',
      });

      expect(isRowTotal2).toBeTrue();
      expect(isRowSubTotal2).toBeFalse();
      expect(isColTotal2).toBeFalse();
      expect(isColSubTotal2).toBeTrue();

      const {
        isRowTotal: isRowTotal3,
        isRowSubTotal: isRowSubTotal3,
        isColTotal: isColTotal3,
        isColSubTotal: isColSubTotal3,
      } = dataSet.getTotalStatus({
        province: '浙江',
        [EXTRA_FIELD]: 'number',
      });

      expect(isRowTotal3).toBeFalse();
      expect(isRowSubTotal3).toBeTrue();
      expect(isColTotal3).toBeTrue();
      expect(isColSubTotal3).toBeFalse();

      const {
        isRowTotal: isRowTotal4,
        isRowSubTotal: isRowSubTotal4,
        isColTotal: isColTotal4,
        isColSubTotal: isColSubTotal4,
      } = dataSet.getTotalStatus({
        province: '浙江',
        type: '家具',
        [EXTRA_FIELD]: 'number',
      });

      expect(isRowTotal4).toBeFalse();
      expect(isRowSubTotal4).toBeTrue();
      expect(isColTotal4).toBeFalse();
      expect(isColSubTotal4).toBeTrue();
    });
  });
});
