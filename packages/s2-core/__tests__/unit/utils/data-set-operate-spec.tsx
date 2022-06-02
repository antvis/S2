import { set, keys } from 'lodash';
import {
  flattenDeep as customFlattenDeep,
  flatten as customFlatten,
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
      expect(keys(customFlattenDeep(data))).toBeArrayOfSize(8);
    });

    it('test custom flatten', () => {
      expect(keys(customFlatten(data))).toBeArrayOfSize(4);
    });
  });

  describe('Dataset Operate Test That Data Has undefined', () => {
    beforeEach(() => {
      const paths = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [undefined, undefined],
        [0, undefined],
      ];
      paths.forEach((item, index) => {
        set(data, [...item], [index, index + 1]);
      });
    });

    it('test custom flattenDeep', () => {
      expect(keys(customFlattenDeep(data))).toBeArrayOfSize(11);
    });

    it('test custom flatten', () => {
      expect(keys(customFlatten(data))).toBeArrayOfSize(6);
    });
  });

  describe('Dataset Operate Test GetListBySorted', () => {
    let list = [];
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
});
