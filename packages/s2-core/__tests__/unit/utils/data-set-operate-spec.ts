import { Aggregation } from '@/common/interface';
import {
  getAggregationAndCalcFuncByQuery,
  getListBySorted,
} from '@/utils/data-set-operate';
import { keys, set } from 'lodash';
import {
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  QueryDataType,
  TOTAL_VALUE,
  type FlattingIndexesData,
} from '../../../src';
import {
  customFlattenDeep,
  filterOutDetail,
  sortByItems,
} from '../../../src/utils/data-set-operate';
import { flattenIndexesData } from '../../../src/utils/dataset/pivot-data-set';

describe('Data Set Operate Test', () => {
  const data: FlattingIndexesData = [];

  describe('flatten test', () => {
    beforeEach(() => {
      const paths = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
      ];

      paths.forEach((item, index) => {
        set(data, [...item], [index, index + 1]);
      });
    });

    test('flatten out all data with all select type', () => {
      expect(flattenIndexesData(data, QueryDataType.All)).toBeArrayOfSize(6);
    });

    test('flatten out detail data with detail only type', () => {
      expect(
        flattenIndexesData(data, QueryDataType.DetailOnly),
      ).toBeArrayOfSize(4);
    });

    test('custom flattenDeep', () => {
      expect(keys(customFlattenDeep(data))).toHaveLength(12);
    });
  });

  describe('Dataset Operate Test GetListBySorted', () => {
    let list: string[] = [];

    beforeEach(() => {
      list = ['浙江省', '四川省'];
    });

    it('should get correct list by complete sorted', () => {
      expect(getListBySorted(list, ['四川省', '浙江省'])).toEqual([
        '四川省',
        '浙江省',
      ]);
      expect(getListBySorted(list, ['浙江省', '四川省'])).toEqual([
        '浙江省',
        '四川省',
      ]);
    });

    it('should get correct list by sub sorted list', () => {
      expect(getListBySorted(list, ['四川省'])).toEqual(['四川省', '浙江省']);
      expect(getListBySorted(list, ['浙江省'])).toEqual(['浙江省', '四川省']);
    });

    it('should get correct list by empty sorted list', () => {
      expect(getListBySorted(list, [])).toEqual(['浙江省', '四川省']);
      expect(getListBySorted(list, ['', ''])).toEqual(['浙江省', '四川省']);
      expect(getListBySorted(list, [null as any, undefined as any])).toEqual([
        '浙江省',
        '四川省',
      ]);
    });
  });

  describe('Dataset Operate Test GetAggregationAndCalcFuncByQuery', () => {
    let totalsOptions = {};

    beforeEach(() => {
      totalsOptions = {
        row: {
          calcGrandTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            calcFunc: () => 'rowSubTotals',
          },
        },
        col: {
          calcGrandTotals: {
            calcFunc: () => 'colTotals',
          },
          calcSubTotals: {
            calcFunc: () => 'colSubTotals',
          },
        },
      };
    });

    it('should get correct aggregation and calcFunc', () => {
      // 行总计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowGrandTotal: true,
            isRowSubTotal: false,
            isColGrandTotal: false,
            isColSubTotal: false,
          },
          totalsOptions,
        ),
      ).toEqual({ aggregation: Aggregation.SUM, calcFunc: undefined });
      // 行总计 & 列总计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowGrandTotal: true,
            isRowSubTotal: false,
            isColGrandTotal: true,
            isColSubTotal: false,
          },
          totalsOptions,
        )!.toString(),
      ).toEqual(
        { aggregation: undefined, calcFunc: () => 'colTotals' }.toString(),
      );
      // 行总计 & 列小计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowGrandTotal: true,
            isRowSubTotal: false,
            isColGrandTotal: false,
            isColSubTotal: true,
          },
          totalsOptions,
        )!.toString(),
      ).toEqual(
        {
          aggregation: undefined,
          calcFunc: () => 'colSubTotals',
        }.toString(),
      );
      // 行小计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowGrandTotal: false,
            isRowSubTotal: true,
            isColGrandTotal: false,
            isColSubTotal: false,
          },
          totalsOptions,
        )!.toString(),
      ).toEqual(
        {
          aggregation: undefined,
          calcFunc: () => 'rowSubTotals',
        }.toString(),
      );
      // 行小计 & 列总计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowGrandTotal: false,
            isRowSubTotal: true,
            isColGrandTotal: true,
            isColSubTotal: false,
          },
          totalsOptions,
        )!.toString(),
      ).toEqual(
        {
          aggregation: undefined,
          calcFunc: () => 'colTotals',
        }.toString(),
      );
      // 行小计 & 列小计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowGrandTotal: false,
            isRowSubTotal: true,
            isColGrandTotal: false,
            isColSubTotal: true,
          },
          totalsOptions,
        )!.toString(),
      ).toEqual(
        {
          aggregation: undefined,
          calcFunc: () => 'colSubTotals',
        }.toString(),
      );
    });
  });

  it('#filterOutDetail()', () => {
    expect(filterOutDetail()).toEqual([]);
    expect(filterOutDetail([TOTAL_VALUE])).toEqual([]);
    expect(filterOutDetail([EMPTY_EXTRA_FIELD_PLACEHOLDER])).toEqual([]);
    expect(filterOutDetail(['test'])).toEqual(['test']);
    expect(filterOutDetail([''])).toEqual(['']);
  });

  it('#sortByItems()', () => {
    expect(sortByItems([], [])).toEqual([]);
    expect(sortByItems(['1', '2', '5'], ['1', '2', '3'])).toEqual([
      '5',
      '1',
      '2',
      '3',
    ]);
    expect(sortByItems(['1', '2', '3'], ['3', '2', '1'])).toEqual([
      '3',
      '2',
      '1',
    ]);
    expect(sortByItems(['1', '2', '3'], ['4', '5', '6'])).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ]);
  });
});
