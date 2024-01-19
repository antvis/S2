import { set } from 'lodash';
import { flattenIndexesData } from '../../../src/utils/dataset/pivot-data-set';
import { QueryDataType, type FlattingIndexesData } from '../../../src';
import { Aggregation } from '@/common/interface';
import {
  getAggregationAndCalcFuncByQuery,
  getListBySorted,
} from '@/utils/data-set-operate';

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
        )!.toString(),
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
            isRowTotal: false,
            isRowSubTotal: true,
            isColTotal: false,
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
            isRowTotal: false,
            isRowSubTotal: true,
            isColTotal: true,
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
            isRowTotal: false,
            isRowSubTotal: true,
            isColTotal: false,
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
});
