import { getContainer } from 'tests/util/helpers';
import { sortData } from 'tests/data/sort-advanced';
import {
  getSortByMeasureValues,
  sortAction,
  sortByCustom,
  sortByFunc,
} from '@/utils/sort-action';
import {
  EXTRA_FIELD,
  type S2Options,
  type SortParam,
  TOTAL_VALUE,
  type S2DataConfig,
  VALUE_FIELD,
} from '@/common';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { PivotDataSet, type SortActionParams } from '@/data-set';
import { CellData } from '@/data-set/cell-data';

describe('Sort Action Test', () => {
  describe('Sort Action', () => {
    test('sort action with number arr', () => {
      const data = [1, 3, 2];

      expect(sortAction(data, 'ASC')).toEqual([1, 2, 3]);
      expect(sortAction(data, 'DESC')).toEqual([3, 2, 1]);
    });

    test('sort action with number-string and number arr', () => {
      const data2 = ['11', '3', '2'];

      expect(sortAction(data2, 'ASC')).toEqual(['11', '2', '3']);
      expect(sortAction(data2, 'DESC')).toEqual(['3', '2', '11']);
    });

    test('sort action with zero and number arr', () => {
      const data1 = [1, 6, -2, 0];

      expect(sortAction(data1, 'ASC')).toEqual([-2, 0, 1, 6]);
      expect(sortAction(data1, 'DESC')).toEqual([6, 1, 0, -2]);

      const data2 = ['0', 0, 2, -2];

      expect(sortAction(data2, 'ASC')).toEqual([-2, '0', 0, 2]);
      expect(sortAction(data2, 'DESC')).toEqual([2, '0', 0, -2]);
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
      function createCellData(list: (number | string | undefined)[]) {
        return list.map((a) => new CellData({ a }, 'a'));
      }

      function unwrapCellData(cellDataList: CellData[]) {
        return cellDataList.map((cell) => cell[VALUE_FIELD]);
      }

      const data1 = createCellData([1, 0, -3, 2]);

      expect(
        unwrapCellData(sortAction(data1, 'ASC', 'a') as CellData[]),
      ).toEqual([-3, 0, 1, 2]);
      expect(
        unwrapCellData(sortAction(data1, 'DESC', 'a') as CellData[]),
      ).toEqual([2, 1, 0, -3]);

      const data2 = createCellData([1, 3, 2]);

      expect(
        unwrapCellData(sortAction(data2, 'ASC', 'a') as CellData[]),
      ).toEqual([1, 2, 3]);
      expect(
        unwrapCellData(sortAction(data2, 'DESC', 'a') as CellData[]),
      ).toEqual([3, 2, 1]);

      const data3 = createCellData(['11', 2, '3']);

      expect(
        unwrapCellData(sortAction(data3, 'ASC', 'a') as CellData[]),
      ).toEqual([2, '3', '11']);
      expect(
        unwrapCellData(sortAction(data3, 'DESC', 'a') as CellData[]),
      ).toEqual(['11', '3', 2]);

      const data4 = createCellData(['-', 2, '3']);

      expect(
        unwrapCellData(sortAction(data4, 'ASC', 'a') as CellData[]),
      ).toEqual(['-', 2, '3']);
      expect(
        unwrapCellData(sortAction(data4, 'DESC', 'a') as CellData[]),
      ).toEqual(['3', 2, '-']);

      expect(
        unwrapCellData(
          sortAction(
            createCellData(['-', 2, '3', undefined]),
            'ASC',
            'a',
          ) as CellData[],
        ),
      ).toEqual([undefined, '-', 2, '3']);
      expect(
        unwrapCellData(
          sortAction(
            createCellData(['-', 2, '3', undefined]),
            'DESC',
            'a',
          ) as CellData[],
        ),
      ).toEqual(['3', 2, '-', undefined]);

      const data6 = createCellData(['', 2, '3']);

      expect(
        unwrapCellData(sortAction(data6, 'ASC', 'a') as CellData[]),
      ).toEqual(['', 2, '3']);
      expect(
        unwrapCellData(sortAction(data6, 'DESC', 'a') as CellData[]),
      ).toEqual(['3', 2, '']);
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

describe('Sort By Func Tests', () => {
  test('should return default values', () => {
    const originValues = ['四川[&]成都', '四川[&]绵阳', '浙江[&]杭州'];

    const result = sortByFunc({
      originValues,
      sortParam: {
        sortFieldId: 'city',
        sortFunc: () => [],
      },
    });

    expect(result).toEqual(originValues);
  });

  test('should return merged result', () => {
    const originValues = ['四川[&]成都', '四川[&]绵阳', '浙江[&]杭州'];

    const result = sortByFunc({
      originValues,
      sortParam: {
        sortFieldId: 'city',
        sortFunc: () => ['浙江[&]杭州'],
      },
      dataSet: {
        fields: {
          rows: ['province', 'city'],
        },
      } as unknown as PivotDataSet,
    });

    // sortFunc 返回的值在前，未返回的值在后
    expect(result).toEqual(['浙江[&]杭州', '四川[&]成都', '四川[&]绵阳']);
  });

  test('should return merged result when sorting by ASC', () => {
    const originValues = ['四川[&]成都', '四川[&]绵阳', '浙江[&]杭州'];

    const result = sortByFunc({
      originValues,
      sortParam: {
        sortMethod: 'ASC',
        sortFieldId: 'city',
        sortFunc: () => ['浙江[&]杭州'],
      },
      dataSet: {
        fields: {
          rows: ['province', 'city'],
        },
      } as unknown as PivotDataSet,
    });

    /*
     * asc 升序时
     * sortFunc 没返回的值在前，返回的值在后
     */
    expect(result).toEqual(['四川[&]成都', '四川[&]绵阳', '浙江[&]杭州']);
  });

  test('should return fallback result', () => {
    const result = sortByFunc({
      originValues: [
        '四川[&]成都',
        '四川[&]绵阳',
        '浙江[&]杭州',
        '浙江[&]绍兴',
      ],
      sortParam: {
        sortFieldId: 'city',
        // 不返回带 [&] 分隔符的结果
        sortFunc: () => ['绍兴', '绵阳', '杭州', '成都'],
      },
      dataSet: {
        fields: {
          rows: ['province', 'city'],
        },
      } as unknown as PivotDataSet,
    });

    expect(result).toEqual([
      '四川[&]绵阳',
      '四川[&]成都',
      '浙江[&]绍兴',
      '浙江[&]杭州',
    ]);
  });
});

describe('GetSortByMeasureValues Tests', () => {
  let s2: PivotSheet;

  beforeEach(async () => {
    const dataCfg: S2DataConfig = {
      ...sortData,
      // 补充一些总、小计数据
      data: sortData.data.concat([
        {
          province: '浙江',
          price: '777',
        },
        {
          province: '吉林',
          price: '888',
        },
        {
          province: '浙江',
          type: '笔',
          price: '199',
        },
        {
          province: '吉林',
          type: '笔',
          price: '188',
        },
      ] as any),
    };

    s2 = new PivotSheet(getContainer(), dataCfg, {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
        },
      },
    });
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should return detail data', () => {
    /*
     * 对城市（最后一个维度）进行按指标排序
     * query 会包含所有列维度，才能指向明细数据格（无汇总数据）
     */
    const sortParam: SortParam = {
      sortFieldId: 'city',
      sortByMeasure: 'price',
      sortMethod: 'desc',
      query: { province: '吉林', type: '笔', [EXTRA_FIELD]: 'price' },
    };

    const measureValues = getSortByMeasureValues({
      dataSet: s2.dataSet as PivotDataSet,
      sortParam,
      originValues: ['纸张', '笔'],
    });

    expect(measureValues).toEqual([
      new CellData(
        {
          province: '吉林',
          city: '长春',
          type: '笔',
          price: '10',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '白山',
          type: '笔',
          price: '9',
        },
        'price',
      ),
    ]);
  });

  test('should return sub-total data', () => {
    /*
     * 对省维度（非最后一个维度）进行按指标排序
     * 排序数据需要取汇总值
     */
    const sortParam: SortParam = {
      sortFieldId: 'province',
      sortByMeasure: TOTAL_VALUE,
      sortMethod: 'desc',
      query: { type: '笔', [EXTRA_FIELD]: 'price' },
    };

    /*
     * query 限定了 type
     * 所以取出的数据为，'省'的维值 与 type='笔' 这一列交叉的汇总数据
     */
    const measureValues = getSortByMeasureValues({
      dataSet: s2.dataSet as PivotDataSet,
      sortParam,
      originValues: ['纸张', '笔'],
    });

    expect(measureValues).toEqual([
      new CellData(
        {
          province: '浙江',
          type: '笔',
          price: '199',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          type: '笔',
          price: '188',
        },
        'price',
      ),
    ]);
  });

  test('should return grand-total data', () => {
    /*
     * 对省维度（非最后一个维度）进行按指标排序
     * 排序数据需要取汇总值
     */
    const sortParam: SortParam = {
      sortFieldId: 'province',
      sortByMeasure: TOTAL_VALUE,
      sortMethod: 'desc',
      query: { [EXTRA_FIELD]: 'price' },
    };

    /*
     * query 为限定任何列维度
     * 所以取出的数据为，'省'的维值 与 列总计这一列交叉的汇总数据
     */
    const measureValues = getSortByMeasureValues({
      dataSet: s2.dataSet as PivotDataSet,
      sortParam,
      originValues: ['纸张', '笔'],
    });

    expect(measureValues).toEqual([
      new CellData(
        {
          province: '浙江',
          price: '777',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          price: '888',
        },
        'price',
      ),
    ]);
  });
});

describe('GetSortByMeasureValues Total Fallback Tests', () => {
  let sheet: PivotSheet;
  let dataSet: PivotDataSet;
  const s2Options = {
    totals: {
      row: {
        subTotalsDimensions: ['province'],
        calcSubTotals: {
          aggregation: 'SUM',
        },
        calcGrandTotals: {
          aggregation: 'SUM',
        },
      },
      col: {
        showSubTotals: true,
        showGrandTotals: true,
        subTotalsDimensions: ['type'],
        calcGrandTotals: {
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

  afterEach(() => {
    sheet.destroy();
  });

  test('should sort by col total', () => {
    // 根据列（类别）的总和排序
    const sortParam: SortParam = {
      sortFieldId: 'type',
      sortByMeasure: TOTAL_VALUE,
      // getSortByMeasureValues 的返回值还没有进行排序
      sortMethod: 'desc',
      query: { [EXTRA_FIELD]: 'price' },
    };

    const params: SortActionParams = {
      dataSet,
      sortParam,
      originValues: ['纸张', '笔'],
    };
    const measureValues = getSortByMeasureValues(params);

    expect(measureValues).toEqual([
      new CellData(
        {
          price: 41.5,
          type: '纸张',
        },
        'price',
      ),
      new CellData(
        {
          price: 37,
          type: '笔',
        },
        'price',
      ),
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
      new CellData(
        {
          price: 33,
          province: '吉林',
        },
        'price',
      ),
      new CellData(
        {
          price: 45.5,
          province: '浙江',
        },
        'price',
      ),
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
        '吉林[&]长春',
        '吉林[&]白山',
      ],
    };
    const measureValues = getSortByMeasureValues(params);

    expect(measureValues).toEqual([
      new CellData(
        {
          province: '浙江',
          city: '杭州',
          type: '笔',
          price: '1',
        },
        'price',
      ),
      new CellData(
        {
          province: '浙江',
          city: '舟山',
          type: '笔',
          price: '17',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '长春',
          type: '笔',
          price: '10',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '白山',
          type: '笔',
          price: '9',
        },
        'price',
      ),
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
        '吉林[&]长春',
        '吉林[&]白山',
      ],
    };
    const measureValues = getSortByMeasureValues(params);

    expect(measureValues).toEqual([
      new CellData(
        {
          province: '浙江',
          city: '杭州',
          price: 3,
        },
        'price',
      ),
      new CellData(
        {
          province: '浙江',
          city: '舟山',
          price: 42.5,
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '长春',
          price: 13,
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '白山',
          price: 20,
        },
        'price',
      ),
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
        '吉林[&]长春',
        '吉林[&]白山',
      ],
    };
    const measureValues = getSortByMeasureValues(params);

    expect(measureValues).toEqual([
      new CellData(
        {
          province: '浙江',
          city: '杭州',
          price: '2',
          type: '纸张',
        },
        'price',
      ),
      new CellData(
        {
          province: '浙江',
          city: '舟山',
          type: '纸张',
          price: '25.5',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '长春',
          type: '纸张',
          price: '3',
        },
        'price',
      ),
      new CellData(
        {
          province: '吉林',
          city: '白山',
          type: '纸张',
          price: '11',
        },
        'price',
      ),
    ]);
  });
});

describe('total group dimension sort test', () => {
  let sheet: SpreadSheet;

  beforeEach(() => {
    const currentOptions = {
      totals: {
        col: {
          grandTotalsGroupDimensions: ['city'],
          showGrandTotals: true,
        },
      },
    } as S2Options;

    const dataConfig = {
      ...sortData,
      data: [
        ...sortData.data,
        {
          city: '杭州',
          type: '纸张',
          price: '999',
        },
        {
          city: '杭州',
          type: '笔',
          price: '666',
        },
      ],
      fields: {
        rows: ['type'],
        columns: ['province', 'city'],
        values: ['price'],
      },
    };

    sheet = new PivotSheet(getContainer(), dataConfig, currentOptions);
    sheet.render();
  });

  afterEach(() => {
    sheet.destroy();
  });
  test('should sort by col total with group', () => {
    // 根据列（类别）的总和排序
    const sortParam: SortParam = {
      sortFieldId: 'type',
      sortByMeasure: TOTAL_VALUE,
      sortMethod: 'desc',
      query: {
        [EXTRA_FIELD]: 'price',
        city: '杭州',
      },
    };

    const params: SortActionParams = {
      dataSet: sheet.dataSet as PivotDataSet,
      sortParam,
    };
    const measureValues = getSortByMeasureValues(params);

    expect(measureValues).toMatchSnapshot();
  });
});
