/**
 * pivot mode base data-set test.
 */
import { get, keys } from 'lodash';
import * as mockData from 'tests/data/mock-dataset.json';
import * as multiDataCfg from 'tests/data/simple-data.json';
import type { Query } from '../../../src/data-set/interface';
import { TOTALS_OPTIONS, assembleDataCfg } from '../../util';
import {
  EXTRA_FIELD,
  ORIGIN_FIELD,
  QueryDataType,
  TOTAL_VALUE,
  VALUE_FIELD,
} from '@/common/constant';
import {
  Aggregation,
  type CalcTotals,
  type S2DataConfig,
} from '@/common/interface';
import { Store } from '@/common/store';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { PivotSheet } from '@/sheet-type';
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

      expect(
        get(indexesData, ['province[&]city[&]type[&]sub_type', 1, 1, 0, 0, 1]),
      ).toEqual({
        province: '浙江省',
        city: '杭州市',
        number: 15420,
      });

      expect(
        get(indexesData, ['province[&]city[&]type[&]sub_type', 1, 1, 2, 0, 1]),
      ).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '办公用品',
        number: 2288,
      });
      expect(
        get(indexesData, ['province[&]city[&]type[&]sub_type', 2, 0, 2, 0, 1]),
      ).toEqual({
        province: '四川省',
        type: '办公用品',
        number: 18479,
      });
      expect(
        get(indexesData, ['province[&]city[&]type[&]sub_type', 0, 0, 0, 0, 1]),
      ).toEqual({
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
        EXTRA_FIELD,
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['province']),
      ).toEqual(['浙江省', '四川省', TOTAL_VALUE]);

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
        TOTAL_VALUE,
        TOTAL_VALUE,
        TOTAL_VALUE,
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['type']),
      ).toEqual(['家具', '办公用品', TOTAL_VALUE]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['type']),
      ).toEqual(['家具', '办公用品', TOTAL_VALUE]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues['sub_type']),
      ).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
        TOTAL_VALUE,
        TOTAL_VALUE,
        TOTAL_VALUE,
      ]);
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
      ]);
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
        })?.[ORIGIN_FIELD],
      ).toContainEntries([['number', 18375]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
        })?.[ORIGIN_FIELD],
      ).toContainEntries([['number', 26193]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            [EXTRA_FIELD]: 'number',
          },
        })?.[ORIGIN_FIELD],
      ).toContainEntries([['number', 13132]]);

      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            [EXTRA_FIELD]: 'number',
          },
        })?.[ORIGIN_FIELD],
      ).toContainEntries([['number', 15420]]);

      expect(
        dataSet.getCellData({
          query: {
            type: '家具',
            [EXTRA_FIELD]: 'number',
          },
        })?.[ORIGIN_FIELD],
      ).toContainEntries([['number', 49709]]);

      expect(
        dataSet.getCellData({
          query: {
            [EXTRA_FIELD]: 'number',
          },
        })?.[ORIGIN_FIELD],
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
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
            col: {
              ...TOTALS_OPTIONS?.col,
              calcGrandTotals: {
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
          dataSet.getCellData({
            query: {
              province: '浙江省',
              type: '家具',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 18375]]);

        expect(
          dataSet.getCellData({
            query: {
              type: '家具',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 26193]]);

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              city: '杭州市',
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 13132]]);

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              city: '杭州市',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 15420]]);

        expect(
          dataSet.getCellData({
            query: {
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 49709]]);

        expect(
          dataSet.getCellData({
            query: {
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
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
                calcGrandTotals: {
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
                calcGrandTotals: {
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
            dataSet.getCellData({
              query: {
                province: '浙江',
                type: '笔',
                [EXTRA_FIELD]: 'price',
              },
              isTotals: true,
            })?.[ORIGIN_FIELD],
          ).toContainEntries([['price', 2]]);
          expect(
            dataSet.getCellData({
              query: {
                province: '浙江',
                type: '笔',
                [EXTRA_FIELD]: 'cost',
              },
              isTotals: true,
            })?.[ORIGIN_FIELD],
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
              calcGrandTotals: {
                calcFunc: calcFunc1,
              },
              calcSubTotals: {
                calcFunc: calcFunc2,
              },
            },
            col: {
              ...TOTALS_OPTIONS?.col,
              calcGrandTotals: {
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

      test('should get correct total cell data when totals calculated by calcFunc and Existential dimension grouping', () => {
        const totalStatus = {
          isRowTotal: true,
          isColTotal: true,
          isRowSubTotal: true,
          isColSubTotal: true,
        };

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
            totalStatus,
          })?.[VALUE_FIELD],
        ).toEqual(18375);

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              [EXTRA_FIELD]: 'number',
            },
            totalStatus,
            isTotals: true,
          })?.[VALUE_FIELD],
        ).toEqual(43098);

        expect(
          dataSet.getCellData({
            query: {
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
            totalStatus,
            isTotals: true,
          })?.[VALUE_FIELD],
        ).toEqual(26193);

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
            totalStatus,
          })?.[VALUE_FIELD],
        ).toEqual(32418);
      });

      test('should get correct total cell data when totals calculated by calcFunc', () => {
        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              type: '家具',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 18375]]);

        expect(
          dataSet.getCellData({
            query: {
              type: '家具',
              sub_type: '桌子',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 52386]]);

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              city: '杭州市',
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 26264]]);

        expect(
          dataSet.getCellData({
            query: {
              province: '浙江省',
              city: '杭州市',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 15420]]);

        expect(
          dataSet.getCellData({
            query: {
              type: '家具',
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 99418]]);

        expect(
          dataSet.getCellData({
            query: {
              [EXTRA_FIELD]: 'number',
            },
            isTotals: true,
          })?.[ORIGIN_FIELD],
        ).toContainEntries([['number', 78868]]);
      });
    });

    test('getCellMultiData function', () => {
      const specialQuery: Query = {
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        [EXTRA_FIELD]: 'number',
      };

      expect(dataSet.getCellMultiData({ query: specialQuery })).toHaveLength(1);
      expect(
        dataSet.getCellMultiData({ query: specialQuery })[0]?.[ORIGIN_FIELD],
      ).toContainEntries([['number', 7789]]);
      expect(
        dataSet.getCellMultiData({
          query: {
            province: '浙江省',
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toHaveLength(5);

      expect(
        dataSet.getCellMultiData({
          query: {
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toHaveLength(11);

      expect(
        dataSet.getCellMultiData({
          query: {
            type: '家具',
            [EXTRA_FIELD]: 'number',
          },
        }),
      ).toHaveLength(33);

      expect(
        dataSet.getCellMultiData({
          query: {
            [EXTRA_FIELD]: 'number',
          },
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

  describe('test for total with dimension group', () => {
    beforeEach(() => {
      MockPivotSheet.mockClear();
      const mockSheet = new MockPivotSheet();

      mockSheet.store = new Store();
      mockSheet.isValueInCols = () => true;
      dataSet = new PivotDataSet(mockSheet);

      dataCfg = assembleDataCfg({
        meta: [],
        fields: {
          rows: ['province', 'city', 'type', 'sub_type'],
          columns: [],
        },
      });
      dataSet.setDataCfg(dataCfg);
    });

    test('get correct MultiData when query need to be processed', () => {
      expect(
        dataSet.getCellMultiData({
          query: {
            province: '浙江省',
            sub_type: '桌子',
          },
          queryType: QueryDataType.DetailOnly,
        }),
      ).toMatchSnapshot();
      expect(
        dataSet.getCellMultiData({
          query: {
            province: '浙江省',
            sub_type: '杭州市',
          },
          queryType: QueryDataType.DetailOnly,
        }),
      ).toMatchSnapshot();
      expect(
        dataSet.getCellMultiData({
          query: {
            sub_type: '桌子',
          },
          queryType: QueryDataType.DetailOnly,
        }),
      ).toMatchSnapshot();
    });
  });
});
