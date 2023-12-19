<<<<<<< HEAD
import { assembleDataCfg } from 'tests/util';
import { get } from 'lodash';
import { data } from 'tests/data/mock-dataset.json';
import {
  deleteMetaById,
  transformIndexesData,
  transformDimensionsValues,
  getDataPath,
  getDimensionsWithoutPathPre,
  getDimensionsWithParentPath,
} from '@/utils/dataset/pivot-data-set';
import type { S2DataConfig } from '@/common/interface';
import { CellData } from '@/data-set/cell-data';

describe('PivotDataSet util test', () => {
  const dataCfg: S2DataConfig = assembleDataCfg({
    data,
    meta: [],
  });

  test('for deleteMetaById function', () => {
    const childrenMeta = {
      level: 0,
      children: new Map(),
      childField: 'country',
    };
    const meta = new Map().set('浙江省', {
      level: 0,
      children: new Map().set('杭州市', childrenMeta),
      childField: 'city',
    });

    deleteMetaById(meta, 'root[&]浙江省');
    const result = meta.get('浙江省');

    expect(result.childField).toBeUndefined();
    expect(result.children).toBeEmpty();
  });

  test('for transformIndexesData function', () => {
    const { rows, columns, values } = dataCfg.fields;
    const sortedDimensionValues = {};
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();
    const result = transformIndexesData({
      rows,
      values,
      columns: columns as string[],
<<<<<<<< HEAD:packages/s2-core/__tests__/unit/utils/dataset/pivot-data-set-spec.ts
      originData: dataCfg.data,
      indexesData: [],
========
      values,
      data: dataCfg.data,
      indexesData: {},
>>>>>>>> origin/master:packages/s2-core/__tests__/unit/utils/dataset/pivot-dataset-spec.ts
      sortedDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      valueInCols: true,
    });
<<<<<<<< HEAD:packages/s2-core/__tests__/unit/utils/dataset/pivot-data-set-spec.ts

    expect(result.indexesData).toHaveLength(3);
========
>>>>>>>> origin/master:packages/s2-core/__tests__/unit/utils/dataset/pivot-dataset-spec.ts
    expect(result.paths).toHaveLength(32);
    expect(get(result.indexesData, result.paths[0])).toEqual({
      city: '杭州市',
      number: 7789,
      province: '浙江省',
      sub_type: '桌子',
      type: '家具',
    });
    expect(result.colPivotMeta?.has('家具')).toBeTrue();
    expect(result.rowPivotMeta?.has('浙江省')).toBeTrue();
    expect(
      getDimensionsWithoutPathPre(result.sortedDimensionValues['province']),
    ).toEqual(['浙江省', '四川省']);
  });

  test('for transformDimensionsValues function', () => {
    const rows = ['province', 'city'];
    const data = {
      city: '杭州市',
      number: 7789,
      province: '浙江省',
      sub_type: '桌子',
      type: '家具',
    };
    const result = transformDimensionsValues(data, rows);

    expect(result).toEqual(['浙江省', '杭州市']);
  });

  test('for return type of transformDimensionsValues function', () => {
    const rows = ['row0', 'row1'];
    const data = {
      row0: 0,
      number: 7789,
      row1: 1,
      sub_type: '桌子',
      type: '家具',
    };
    const result = transformDimensionsValues(data, rows);

    expect(result).toEqual(['0', '1']);
  });

  test('for getDataPath function', () => {
    const rowDimensionValues = ['浙江省', '杭州市'];
    const colDimensionValues = ['家具', '桌子'];
    const rows = ['province', 'city'];
    const columns = ['type', 'sub_type'];
<<<<<<<< HEAD:packages/s2-core/__tests__/unit/utils/dataset/pivot-data-set-spec.ts
    const values = ['value'];
========
    const prefix = 'province[&]city[&]type[&]sub_type';
>>>>>>>> origin/master:packages/s2-core/__tests__/unit/utils/dataset/pivot-dataset-spec.ts
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();

    const result = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
<<<<<<<< HEAD:packages/s2-core/__tests__/unit/utils/dataset/pivot-data-set-spec.ts
      shouldCreateOrUpdate: true,
      rows,
      columns,
      values,
    });

    expect(result).toEqual([1, 1, 1, 1]);
  });

  test('for getDataPath function when not createIfNotExist and without rows or columns', () => {
    const rowDimensionValues = ['浙江省', '杭州市'];
    const colDimensionValues = ['家具', '桌子'];
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();

    getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
    });
    expect(rowPivotMeta.size).toEqual(0);
    expect(colPivotMeta.size).toEqual(0);
  });

  test('for getDataPath function when createIfNotExist and without rows or columns', () => {
    const rowDimensionValues = ['浙江省', '杭州市'];
    const colDimensionValues = ['家具', '桌子'];
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();

    getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      shouldCreateOrUpdate: true,
    });
    expect(rowPivotMeta.get(rowDimensionValues[0]).childField).toBeUndefined();
    expect(colPivotMeta.get(colDimensionValues[0]).childField).toBeUndefined();
========
      isFirstCreate: true,
      rowFields: rows,
      colFields: columns,
      prefix,
    });
    expect(result).toEqual([prefix, 1, 1, 1, 1]);
>>>>>>>> origin/master:packages/s2-core/__tests__/unit/utils/dataset/pivot-dataset-spec.ts
  });

  test('for getDataPath function when createIfNotExist and with rows or columns', () => {
    const rowDimensionValues = ['浙江省', '杭州市'];
    const colDimensionValues = ['家具', '桌子'];
    const rows = ['province', 'city'];
    const columns = ['type', 'sub_type'];
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();

    getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
<<<<<<<< HEAD:packages/s2-core/__tests__/unit/utils/dataset/pivot-data-set-spec.ts
      shouldCreateOrUpdate: true,
      rows,
      columns,
========
      isFirstCreate: true,
      rowFields: rows,
      colFields: columns,
>>>>>>>> origin/master:packages/s2-core/__tests__/unit/utils/dataset/pivot-dataset-spec.ts
    });
    expect(rowPivotMeta.get(rowDimensionValues[0]).childField).toEqual('city');
    expect(colPivotMeta.get(colDimensionValues[0]).childField).toEqual(
      'sub_type',
    );
  });

  test('for getDimensionsWithoutPathPre function', () => {
    const dimensions = ['芜湖市[&]家具[&]椅子', '芜湖市[&]家具', '芜湖市'];

    expect(getDimensionsWithoutPathPre(dimensions)).toEqual([
      '椅子',
      '家具',
      '芜湖市',
    ]);
  });

  test('for getDimensionsWithParentPath function', () => {
    const field = 'city';
    const defaultDimensions = ['province', 'city'];
    const dimensions = [
      new CellData(
        {
          province: '辽宁省',
          city: '芜湖市',
          category: '家具',
          subCategory: '椅子',
          price: '',
        },
        'price',
      ),
    ];
    const result = getDimensionsWithParentPath(
      field,
      defaultDimensions,
      dimensions,
    );

    expect(result).toEqual(['辽宁省[&]芜湖市']);
=======
import { MULTI_VALUE } from '@/common/constant/field';
import type { PivotMeta, SortedDimensionValues } from '@/data-set/interface';
import {
  existDimensionTotalGroup,
  flattenDimensionValues,
} from '@/utils/dataset/pivot-data-set';

describe('pivot-data-set utils test', () => {
  let fields: string[];
  let sortedDimensionValues: SortedDimensionValues;
  let pivotMeta: PivotMeta;

  beforeEach(() => {
    fields = ['province', 'city', 'type', 'subType'];

    sortedDimensionValues = {
      province: ['浙江省', '四川省', '$$total$$'],
      city: [
        '$$total$$[&]$$total$$',
        '四川省[&]$$total$$',
        '四川省[&]成都市',
        '四川省[&]绵阳市',
        '浙江省[&]$$total$$',
        '浙江省[&]杭州市',
        '浙江省[&]舟山市',
      ],
      type: [
        '$$total$$[&]$$total$$[&]$$total$$',
        '四川省[&]$$total$$[&]$$total$$',
        '四川省[&]成都市[&]$$total$$',
        '四川省[&]成都市[&]家具',
        '四川省[&]成都市[&]办公用品',
        '四川省[&]绵阳市[&]$$total$$',
        '四川省[&]绵阳市[&]家具',
        '四川省[&]绵阳市[&]办公用品',
        '浙江省[&]$$total$$[&]$$total$$',
        '浙江省[&]杭州市[&]$$total$$',
        '浙江省[&]杭州市[&]家具',
        '浙江省[&]杭州市[&]办公用品',
        '浙江省[&]舟山市[&]$$total$$',
        '浙江省[&]舟山市[&]家具',
        '浙江省[&]舟山市[&]办公用品',
      ],

      subType: [
        '$$total$$[&]$$total$$[&]$$total$$[&]$$total$$',
        '四川省[&]$$total$$[&]$$total$$[&]$$total$$',
        '四川省[&]成都市[&]$$total$$[&]$$total$$',
        '四川省[&]成都市[&]家具[&]$$total$$',
        '四川省[&]成都市[&]家具[&]桌子',
        '四川省[&]成都市[&]家具[&]沙发',
        '四川省[&]成都市[&]办公用品[&]$$total$$',
        '四川省[&]成都市[&]办公用品[&]笔',
        '四川省[&]成都市[&]办公用品[&]纸张',
        '四川省[&]绵阳市[&]$$total$$[&]$$total$$',
        '四川省[&]绵阳市[&]家具[&]$$total$$',
        '四川省[&]绵阳市[&]家具[&]桌子',
        '四川省[&]绵阳市[&]家具[&]沙发',
        '四川省[&]绵阳市[&]办公用品[&]$$total$$',
        '四川省[&]绵阳市[&]办公用品[&]笔',
        '四川省[&]绵阳市[&]办公用品[&]纸张',
        '浙江省[&]$$total$$[&]$$total$$[&]$$total$$',
        '浙江省[&]杭州市[&]$$total$$[&]$$total$$',
        '浙江省[&]杭州市[&]家具[&]$$total$$',
        '浙江省[&]杭州市[&]家具[&]桌子',
        '浙江省[&]杭州市[&]家具[&]沙发',
        '浙江省[&]杭州市[&]办公用品[&]$$total$$',
        '浙江省[&]杭州市[&]办公用品[&]笔',
        '浙江省[&]杭州市[&]办公用品[&]纸张',
        '浙江省[&]舟山市[&]$$total$$[&]$$total$$',
        '浙江省[&]舟山市[&]家具[&]$$total$$',
        '浙江省[&]舟山市[&]家具[&]桌子',
        '浙江省[&]舟山市[&]家具[&]沙发',
        '浙江省[&]舟山市[&]办公用品[&]$$total$$',
        '浙江省[&]舟山市[&]办公用品[&]笔',
        '浙江省[&]舟山市[&]办公用品[&]纸张',
      ],
    };

    pivotMeta = new Map([
      [
        '四川省',
        {
          childField: 'city',
          level: 1,
          id: '四川省',
          children: new Map([
            [
              '成都市',
              {
                childField: 'type',
                level: 1,
                id: '四川省[&]成都市',
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '四川省[&]成都市[&]家具',
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            id: '四川省[&]成都市[&]家具[&]桌子',
                            level: 1,
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]成都市[&]家具[&]沙发',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                  [
                    '办公用品',
                    {
                      childField: 'subType',
                      level: 2,
                      id: '四川省[&]成都市[&]办公用品',
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '四川省[&]成都市[&]办公用品[&]笔',
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]成都市[&]办公用品[&]纸张',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                ]),
              },
            ],
            [
              '绵阳市',
              {
                childField: 'type',
                level: 2,
                id: '四川省[&]绵阳市',
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '四川省[&]绵阳市[&]家具',
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            level: 1,
                            id: '四川省[&]绵阳市[&]家具[&]桌子',

                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]绵阳市[&]家具[&]沙发',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                  [
                    '办公用品',
                    {
                      childField: 'subType',
                      level: 2,
                      id: '四川省[&]绵阳市[&]办公用品',
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,

                            id: '四川省[&]绵阳市[&]办公用品[&]笔',
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]绵阳市[&]办公用品[&]纸张',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                ]),
              },
            ],
          ]),
        },
      ],
      [
        '浙江省',
        {
          childField: 'city',
          level: 2,
          id: '浙江省',
          children: new Map([
            [
              '杭州市',
              {
                childField: 'type',
                level: 1,
                id: '浙江省[&]杭州市',
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '浙江省[&]杭州市[&]家具',
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]杭州市[&]家具[&]桌子',
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]杭州市[&]家具[沙发]桌子',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                  [
                    '办公用品',
                    {
                      childField: 'subType',
                      level: 2,
                      id: '浙江省[&]杭州市[&]办公用品',
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]杭州市[&]办公用品[&]笔',
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]杭州市[&]办公用品[&]纸张',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                ]),
              },
            ],
            [
              '舟山市',
              {
                childField: 'type',
                level: 2,
                id: '浙江省[&]舟山市',
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '浙江省[&]舟山市[&]家具',
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]舟山市[&]家具[&]桌子',
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]舟山市[&]家具[&]沙发',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                  [
                    '办公用品',
                    {
                      childField: 'subType',
                      level: 2,
                      id: '浙江省[&]舟山市[&]办公用品',
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]舟山市[&]办公用品[&]笔',
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]舟山市[&]办公用品[&]纸张',
                            children: new Map(),
                          },
                        ],
                      ]),
                    },
                  ],
                ]),
              },
            ],
          ]),
        },
      ],
    ]) as unknown as PivotMeta;
  });

  test(`should return false if doesn't exist total group`, () => {
    expect(
      existDimensionTotalGroup(['家具', '纸张', MULTI_VALUE, MULTI_VALUE]),
    ).toBeFalse();

    expect(
      existDimensionTotalGroup([
        MULTI_VALUE,
        MULTI_VALUE,
        MULTI_VALUE,
        MULTI_VALUE,
      ]),
    ).toBeFalse();

    expect(
      existDimensionTotalGroup(['四川省', '成都市', '办公用品', '纸张']),
    ).toBeFalse();
  });

  test('should return true if exist total group', () => {
    expect(
      existDimensionTotalGroup(['四川省', MULTI_VALUE, '家具', MULTI_VALUE]),
    ).toBeTrue();

    expect(
      existDimensionTotalGroup([MULTI_VALUE, MULTI_VALUE, '家具', MULTI_VALUE]),
    ).toBeTrue();

    expect(
      existDimensionTotalGroup([MULTI_VALUE, MULTI_VALUE, MULTI_VALUE, '纸张']),
    ).toBeTrue();
  });

  test(`should return flatten dimension values if doesn't exist total group`, () => {
    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: ['四川省', '成都市', '办公用品', '纸张'],
      }),
    ).toEqual([['四川省', '成都市', '办公用品', '纸张']]);

    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: ['四川省', '成都市', MULTI_VALUE, MULTI_VALUE],
      }),
    ).toEqual([['四川省', '成都市', MULTI_VALUE, MULTI_VALUE]]);
  });

  test(`should return flatten dimension values if exist total group`, () => {
    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: [MULTI_VALUE, '成都市', MULTI_VALUE, '纸张'],
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "纸张",
        ],
      ]
    `);

    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: [MULTI_VALUE, '成都市', MULTI_VALUE, MULTI_VALUE],
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "四川省",
          "成都市",
          "家具",
          "桌子",
        ],
        Array [
          "四川省",
          "成都市",
          "家具",
          "沙发",
        ],
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "纸张",
        ],
      ]
    `);

    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: [MULTI_VALUE, MULTI_VALUE, '办公用品', MULTI_VALUE],
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "纸张",
        ],
        Array [
          "四川省",
          "绵阳市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "绵阳市",
          "办公用品",
          "纸张",
        ],
        Array [
          "浙江省",
          "杭州市",
          "办公用品",
          "笔",
        ],
        Array [
          "浙江省",
          "杭州市",
          "办公用品",
          "纸张",
        ],
        Array [
          "浙江省",
          "舟山市",
          "办公用品",
          "笔",
        ],
        Array [
          "浙江省",
          "舟山市",
          "办公用品",
          "纸张",
        ],
      ]
    `);

    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: ['四川省', MULTI_VALUE, '办公用品', MULTI_VALUE],
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "成都市",
          "办公用品",
          "纸张",
        ],
        Array [
          "四川省",
          "绵阳市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "绵阳市",
          "办公用品",
          "纸张",
        ],
      ]
    `);
>>>>>>> origin/master
  });
});
