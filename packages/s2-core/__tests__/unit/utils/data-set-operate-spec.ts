import { set, keys } from 'lodash';
import { EMPTY_EXTRA_FIELD_PLACEHOLDER, TOTAL_VALUE } from '../../../src';
import {
  filterOutDetail,
  sortByItems,
} from './../../../src/utils/data-set-operate';
import {
  customFlattenDeep,
  getListBySorted,
  getAggregationAndCalcFuncByQuery,
} from '@/utils/data-set-operate';
import { Aggregation } from '@/common/interface';

describe('Data Set Operate Test', () => {
  const data = [];
  describe('Dataset Operate Test That Data Has No undefined', () => {
    beforeEach(() => {
      const paths = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ];
      paths.forEach((item, index) => {
        set(data, [...item], [index, index + 1]);
      });
    });

    it('test custom flattenDeep', () => {
      expect(keys(customFlattenDeep(data))).toHaveLength(8);
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
      expect(getListBySorted(list, [null, undefined])).toEqual([
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
          calcTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            calcFunc: () => 'rowSubTotals',
          },
        },
        col: {
          calcTotals: {
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
            isRowTotal: true,
            isRowSubTotal: false,
            isColTotal: false,
            isColSubTotal: false,
          },
          totalsOptions,
        ),
      ).toEqual({ aggregation: Aggregation.SUM, calcFunc: undefined });
      // 行总计 & 列总计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowTotal: true,
            isRowSubTotal: false,
            isColTotal: true,
            isColSubTotal: false,
          },
          totalsOptions,
        ).toString(),
      ).toEqual(
        { aggregation: undefined, calcFunc: () => 'colTotals' }.toString(),
      );
      // 行总计 & 列小计
      expect(
        getAggregationAndCalcFuncByQuery(
          {
            isRowTotal: true,
            isRowSubTotal: false,
            isColTotal: false,
            isColSubTotal: true,
          },
          totalsOptions,
        ).toString(),
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
            isRowTotal: false,
            isRowSubTotal: true,
            isColTotal: false,
            isColSubTotal: false,
          },
          totalsOptions,
        ).toString(),
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
            isRowTotal: false,
            isRowSubTotal: true,
            isColTotal: true,
            isColSubTotal: false,
          },
          totalsOptions,
        ).toString(),
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
            isRowTotal: false,
            isRowSubTotal: true,
            isColTotal: false,
            isColSubTotal: true,
          },
          totalsOptions,
        ).toString(),
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
