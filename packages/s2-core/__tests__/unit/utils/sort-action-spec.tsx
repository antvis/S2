import { getContainer } from 'tests/util/helpers';
import { sortData } from 'tests/data/sort-advanced';
import {
  getSortByMeasureValues,
  sortAction,
  sortByCustom,
} from '@/utils/sort-action';
import { EXTRA_FIELD, S2Options, SortParam, TOTAL_VALUE } from '@/common';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet, SortActionParams } from '@/data-set';

describe('Sort Action Test', () => {
  describe('Sort Action', () => {
    test('sort action with number arr', () => {
      const data = [1, 3, 2];
      expect(sortAction(data, 'ASC')).toEqual([1, 2, 3]);
      expect(sortAction(data, 'DESC')).toEqual([3, 2, 1]);
    });

    test('sort action with number-string and number arr', () => {
      const data1 = ['11', '3', 2];
      expect(sortAction(data1, 'ASC')).toEqual(['11', 2, '3']);
      expect(sortAction(data1, 'DESC')).toEqual(['3', 2, '11']);

      const data2 = ['11', '3', '2'];
      expect(sortAction(data2, 'ASC')).toEqual(['11', '2', '3']);
      expect(sortAction(data2, 'DESC')).toEqual(['3', '2', '11']);
    });

    test('sort action with string arr', () => {
      const data = ['a', 'c', 'b'];
      expect(sortAction(data, 'ASC')).toEqual(['a', 'b', 'c']);
      expect(sortAction(data, 'DESC')).toEqual(['c', 'b', 'a']);

      const data1 = ['啊', '哦', '嗯'];
      expect(sortAction(data1, 'ASC')).toEqual(['啊', '嗯', '哦']);
      expect(sortAction(data1, 'DESC')).toEqual(['哦', '嗯', '啊']);

      const data2 = ['啊', '11', '2'];
      expect(sortAction(data2, 'ASC')).toEqual(['11', '2', '啊']);
      expect(sortAction(data2, 'DESC')).toEqual(['啊', '2', '11']);
    });

    test('sort action with object arr', () => {
      const data1 = [{ a: 1 }, { a: 3 }, { a: 2 }];
      expect(sortAction(data1, 'ASC', 'a')).toEqual([
        { a: 1 },
        { a: 2 },
        { a: 3 },
      ]);
      expect(sortAction(data1, 'DESC', 'a')).toEqual([
        { a: 3 },
        { a: 2 },
        { a: 1 },
      ]);

      const data2 = [{ a: '11' }, { a: '3' }, { a: 2 }];
      expect(sortAction(data2, 'ASC', 'a')).toEqual([
        { a: 2 },
        { a: '3' },
        { a: '11' },
      ]);
      expect(sortAction(data2, 'DESC', 'a')).toEqual([
        { a: '11' },
        { a: '3' },
        { a: 2 },
      ]);

      const data3 = [{ a: '-' }, { a: '3' }, { a: 2 }];
      expect(sortAction(data3, 'ASC', 'a')).toEqual([
        { a: '-' },
        { a: 2 },
        { a: '3' },
      ]);
      expect(sortAction(data3, 'DESC', 'a')).toEqual([
        { a: '3' },
        { a: 2 },
        { a: '-' },
      ]);

      expect(
        sortAction(
          [{ a: '-' }, { a: '3' }, { a: 2 }, { a: undefined }],
          'ASC',
          'a',
        ),
      ).toEqual([{ a: undefined }, { a: '-' }, { a: 2 }, { a: '3' }]);
      expect(
        sortAction(
          [{ a: '-' }, { a: '3' }, { a: 2 }, { a: undefined }],
          'DESC',
          'a',
        ),
      ).toEqual([{ a: '3' }, { a: 2 }, { a: '-' }, { a: undefined }]);
      expect(sortAction([{ a: '' }, { a: '3' }, { a: 2 }], 'ASC', 'a')).toEqual(
        [{ a: '' }, { a: 2 }, { a: '3' }],
      );
    });
  });
});

describe('Sort By Custom Test', () => {
  describe('Sort By Custom', () => {
    test('sort by custom with equal sub node', () => {
      const params = {
        originValues: [
          'Monday[&]noon',
          'Monday[&]afternoon',
          'Monday[&]morning',
          'Tuesday[&]afternoon',
          'Tuesday[&]noon',
          'Tuesday[&]morning',
        ],
        sortByValues: ['morning', 'noon', 'afternoon'],
      };
      expect(sortByCustom(params)).toEqual([
        'Monday[&]morning',
        'Monday[&]noon',
        'Monday[&]afternoon',
        'Tuesday[&]morning',
        'Tuesday[&]noon',
        'Tuesday[&]afternoon',
      ]);
    });
    test('sort by custom with repeated sub node', () => {
      const params = {
        originValues: [
          'Monday[&]noon',
          'Monday[&]afternoon',
          'Tuesday[&]afternoon',
          'Tuesday[&]noon',
          'Tuesday[&]morning',
          'Wednesday[&]afternoon',
          'Wednesday[&]morning',
        ],
        sortByValues: ['morning', 'noon', 'afternoon'],
      };
      expect(sortByCustom(params)).toEqual([
        'Monday[&]noon',
        'Monday[&]afternoon',
        'Tuesday[&]morning',
        'Tuesday[&]noon',
        'Tuesday[&]afternoon',
        'Wednesday[&]morning',
        'Wednesday[&]afternoon',
      ]);
    });
    test('sort by custom with unordered node', () => {
      const params = {
        originValues: [
          'Monday[&]afternoon',
          'Tuesday[&]afternoon',
          'Wednesday[&]afternoon',
          'Monday[&]noon',
          'Tuesday[&]noon',
          'Wednesday[&]morning',
          'Tuesday[&]morning',
        ],
        sortByValues: ['morning', 'noon', 'afternoon'],
      };
      expect(sortByCustom(params)).toEqual([
        'Monday[&]noon',
        'Monday[&]afternoon',
        'Tuesday[&]morning',
        'Tuesday[&]noon',
        'Tuesday[&]afternoon',
        'Wednesday[&]morning',
        'Wednesday[&]afternoon',
      ]);
    });
  });
});

describe('getSortByMeasureValues', () => {
  let sheet: PivotSheet;
  let dataSet: PivotDataSet;
  const s2Options = {
    totals: {
      row: {
        subTotalsDimensions: ['province'],
        calcSubTotals: {
          aggregation: 'SUM',
        },
        calcTotals: {
          aggregation: 'SUM',
        },
      },
      col: {
        showSubTotals: true,
        showGrandTotals: true,
        subTotalsDimensions: ['type'],
        calcTotals: {
          aggregation: 'SUM',
        },
        calcSubTotals: {
          aggregation: 'SUM',
        },
      },
    },
  } as S2Options;
  beforeEach(() => {
    sheet = new PivotSheet(getContainer(), sortData, s2Options);
    dataSet = new PivotDataSet(sheet);
    dataSet.setDataCfg(sortData);
    sheet.dataSet = dataSet;
  });
  test('should sort by col total', () => {
    // 根据列（类别）的总和排序
    const sortParam: SortParam = {
      sortFieldId: 'type',
      sortByMeasure: TOTAL_VALUE,
      sortMethod: 'desc', // getSortByMeasureValues 的返回值还没有进行排序
      query: { [EXTRA_FIELD]: 'price' },
    };

    const params: SortActionParams = {
      dataSet,
      sortParam,
      originValues: ['纸张', '笔'],
    };
    const measureValues = getSortByMeasureValues(params);
    expect(measureValues).toEqual([
      {
        $$extra$$: 'price',
        $$value$$: 41.5,
        price: 41.5,
        type: '纸张',
      },
      {
        $$extra$$: 'price',
        $$value$$: 37,
        price: 37,
        type: '笔',
      },
    ]);
  });

  test('should sort by row total', () => {
    // 根据行（省份）的总和排序
    const sortParam: SortParam = {
      sortFieldId: 'province',
      sortByMeasure: TOTAL_VALUE,
      sortMethod: 'desc',
      query: { [EXTRA_FIELD]: 'price' },
    };

    const params: SortActionParams = {
      dataSet,
      sortParam,
      originValues: ['吉林', '浙江'],
    };
    const measureValues = getSortByMeasureValues(params);
    expect(measureValues).toEqual([
      {
        $$extra$$: 'price',
        $$value$$: 33,
        price: 33,
        province: '吉林',
      },
      {
        $$extra$$: 'price',
        $$value$$: 45.5,
        price: 45.5,
        province: '浙江',
      },
    ]);
  });

  test('should group sort by row price when type is 笔', () => {
    // 对城市依据 笔的价格 进行组内排序
    const sortParam: SortParam = {
      sortFieldId: 'type',
      sortByMeasure: 'price',
      sortMethod: 'desc',
      query: {
        type: '笔',
        [EXTRA_FIELD]: 'price',
      },
    };

    const params: SortActionParams = {
      dataSet,
      sortParam,
      originValues: [
        '浙江[&]杭州',
        '浙江[&]舟山',
        '吉林[&]丹东',
        '吉林[&]白山',
      ],
    };
    const measureValues = getSortByMeasureValues(params);
    expect(measureValues).toEqual([
      {
        province: '浙江',
        city: '杭州',
        type: '笔',
        price: '1',
        $$extra$$: 'price',
        $$value$$: '1',
      },
      {
        province: '浙江',
        city: '舟山',
        type: '笔',
        price: '17',
        $$extra$$: 'price',
        $$value$$: '17',
      },
      {
        province: '吉林',
        city: '丹东',
        type: '笔',
        price: '10',
        $$extra$$: 'price',
        $$value$$: '10',
      },
      {
        province: '吉林',
        city: '白山',
        type: '笔',
        price: '9',
        $$extra$$: 'price',
        $$value$$: '9',
      },
    ]);
  });

  test('should sort by row sub total', () => {
    // 行小计进行 组内排序
    const sortParam: SortParam = {
      sortFieldId: 'city',
      sortMethod: 'desc',
      sortByMeasure: TOTAL_VALUE,
      query: {
        [EXTRA_FIELD]: 'price',
      },
    };

    const params: SortActionParams = {
      dataSet,
      sortParam,
      originValues: [
        '浙江[&]杭州',
        '浙江[&]舟山',
        '吉林[&]丹东',
        '吉林[&]白山',
      ],
    };
    const measureValues = getSortByMeasureValues(params);
    expect(measureValues).toEqual([
      {
        $$extra$$: 'price',
        province: '浙江',
        city: '杭州',
        $$value$$: 3,
        price: 3,
      },
      {
        $$extra$$: 'price',
        province: '浙江',
        city: '舟山',
        $$value$$: 42.5,
        price: 42.5,
      },
      {
        $$extra$$: 'price',
        province: '吉林',
        city: '丹东',
        $$value$$: 13,
        price: 13,
      },
      {
        $$extra$$: 'price',
        province: '吉林',
        city: '白山',
        $$value$$: 20,
        price: 20,
      },
    ]);
  });

  test('should sort by row price when type is 纸', () => {
    // 对城市依据 纸的价格 进行组内排序
    const sortParam: SortParam = {
      sortFieldId: 'city',
      sortMethod: 'asc',
      sortByMeasure: 'price',
      query: {
        type: '纸张',
      },
    };

    const params: SortActionParams = {
      dataSet,
      sortParam,
      originValues: [
        '浙江[&]杭州',
        '浙江[&]舟山',
        '吉林[&]丹东',
        '吉林[&]白山',
      ],
    };
    const measureValues = getSortByMeasureValues(params);
    expect(measureValues).toEqual([
      {
        province: '浙江',
        city: '杭州',
        type: '纸张',
        price: '2',
        $$extra$$: 'price',
        $$value$$: '2',
      },
      {
        province: '浙江',
        city: '舟山',
        type: '纸张',
        price: '25.5',
        $$extra$$: 'price',
        $$value$$: '25.5',
      },
      {
        province: '吉林',
        city: '丹东',
        type: '纸张',
        price: '3',
        $$extra$$: 'price',
        $$value$$: '3',
      },
      {
        province: '吉林',
        city: '白山',
        type: '纸张',
        price: '11',
        $$extra$$: 'price',
        $$value$$: '11',
      },
    ]);
  });
});
