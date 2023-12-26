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
        '四川省[&]成[&]都[&]市',
        '四川省[&]绵阳市',
        '浙江省[&]$$total$$',
        '浙江省[&]杭州市',
        '浙江省[&]舟山市',
      ],
      type: [
        '$$total$$[&]$$total$$[&]$$total$$',
        '四川省[&]$$total$$[&]$$total$$',
        '四川省[&]成[&]都[&]市[&]$$total$$',
        '四川省[&]成[&]都[&]市[&]家具',
        '四川省[&]成[&]都[&]市[&]办公用品',
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
        '四川省[&]成[&]都[&]市[&]$$total$$[&]$$total$$',
        '四川省[&]成[&]都[&]市[&]家具[&]$$total$$',
        '四川省[&]成[&]都[&]市[&]家具[&]桌子',
        '四川省[&]成[&]都[&]市[&]家具[&]沙发',
        '四川省[&]成[&]都[&]市[&]办公用品[&]$$total$$',
        '四川省[&]成[&]都[&]市[&]办公用品[&]笔',
        '四川省[&]成[&]都[&]市[&]办公用品[&]纸张',
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
          dimensions: ['四川省'],
          children: new Map([
            [
              '成[&]都[&]市',
              {
                childField: 'type',
                level: 1,
                id: '四川省[&]成[&]都[&]市',
                dimensions: ['四川省', '成[&]都[&]市'],
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '四川省[&]成[&]都[&]市[&]家具',
                      dimensions: ['四川省', '成[&]都[&]市', '家具'],
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            id: '四川省[&]成[&]都[&]市[&]家具[&]桌子',
                            dimensions: [
                              '四川省',
                              '成[&]都[&]市',
                              '家具',
                              '桌子',
                            ],

                            level: 1,
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]成[&]都[&]市[&]家具[&]沙发',
                            dimensions: [
                              '四川省',
                              '成[&]都[&]市',
                              '家具',
                              '沙发',
                            ],
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
                      id: '四川省[&]成[&]都[&]市[&]办公用品',
                      dimensions: ['四川省', '成[&]都[&]市', '办公用品'],
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '四川省[&]成[&]都[&]市[&]办公用品[&]笔',
                            dimensions: [
                              '四川省',
                              '成[&]都[&]市',
                              '办公用品',
                              '笔',
                            ],
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]成[&]都[&]市[&]办公用品[&]纸张',
                            dimensions: [
                              '四川省',
                              '成[&]都[&]市',
                              '办公用品',
                              '纸张',
                            ],
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
                dimensions: ['四川省', '绵阳市'],
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '四川省[&]绵阳市[&]家具',
                      dimensions: ['四川省', '绵阳市', '家具'],
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            level: 1,
                            id: '四川省[&]绵阳市[&]家具[&]桌子',
                            dimensions: ['四川省', '绵阳市', '家具', '桌子'],
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]绵阳市[&]家具[&]沙发',
                            dimensions: ['四川省', '绵阳市', '家具', '沙发'],
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
                      dimensions: ['四川省', '绵阳市', '办公用品'],
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '四川省[&]绵阳市[&]办公用品[&]笔',
                            dimensions: ['四川省', '绵阳市', '办公用品', '笔'],
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '四川省[&]绵阳市[&]办公用品[&]纸张',
                            dimensions: [
                              '四川省',
                              '绵阳市',
                              '办公用品',
                              '纸张',
                            ],
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
          dimensions: ['浙江省'],
          children: new Map([
            [
              '杭州市',
              {
                childField: 'type',
                level: 1,
                id: '浙江省[&]杭州市',
                dimensions: ['浙江省', '杭州市'],
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '浙江省[&]杭州市[&]家具',
                      dimensions: ['浙江省', '杭州市', '家具'],
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]杭州市[&]家具[&]桌子',
                            dimensions: ['浙江省', '杭州市', '家具', '桌子'],
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]杭州市[&]家具[&]沙发',
                            dimensions: ['浙江省', '杭州市', '家具', '沙发'],
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
                      dimensions: ['浙江省', '杭州市'],
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]杭州市[&]办公用品[&]笔',
                            dimensions: ['浙江省', '杭州市', '办公用品', '笔'],
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]杭州市[&]办公用品[&]纸张',
                            dimensions: [
                              '浙江省',
                              '杭州市',
                              '办公用品',
                              '纸张',
                            ],
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
                dimensions: ['浙江省', '舟山市'],
                children: new Map([
                  [
                    '家具',
                    {
                      childField: 'subType',
                      level: 1,
                      id: '浙江省[&]舟山市[&]家具',
                      dimensions: ['浙江省', '舟山市', '家具'],
                      children: new Map([
                        [
                          '桌子',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]舟山市[&]家具[&]桌子',
                            dimensions: ['浙江省', '舟山市', '家具', '桌子'],
                            children: new Map(),
                          },
                        ],
                        [
                          '沙发',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]舟山市[&]家具[&]沙发',
                            dimensions: ['浙江省', '舟山市', '家具', '沙发'],
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
                      dimensions: ['浙江省', '舟山市', '办公用品'],
                      children: new Map([
                        [
                          '笔',
                          {
                            childFiled: null,
                            level: 1,
                            id: '浙江省[&]舟山市[&]办公用品[&]笔',
                            dimensions: ['浙江省', '舟山市', '办公用品', '笔'],
                            children: new Map(),
                          },
                        ],
                        [
                          '纸张',
                          {
                            childFiled: null,
                            level: 2,
                            id: '浙江省[&]舟山市[&]办公用品[&]纸张',
                            dimensions: [
                              '浙江省',
                              '舟山市',
                              '办公用品',
                              '纸张',
                            ],
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
      existDimensionTotalGroup(['四川省', '成[&]都[&]市', '办公用品', '纸张']),
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
        dimensionValues: ['四川省', '成[&]都[&]市', '办公用品', '纸张'],
      }),
    ).toEqual([['四川省', '成[&]都[&]市', '办公用品', '纸张']]);

    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: ['四川省', '成[&]都[&]市', MULTI_VALUE, MULTI_VALUE],
      }),
    ).toEqual([['四川省', '成[&]都[&]市', MULTI_VALUE, MULTI_VALUE]]);
  });

  test(`should return flatten dimension values if exist total group`, () => {
    expect(
      flattenDimensionValues({
        fields,
        pivotMeta,
        sortedDimensionValues,
        dimensionValues: [MULTI_VALUE, '成[&]都[&]市', MULTI_VALUE, '纸张'],
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "四川省",
          "成[&]都[&]市",
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
        dimensionValues: [
          MULTI_VALUE,
          '成[&]都[&]市',
          MULTI_VALUE,
          MULTI_VALUE,
        ],
      }),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "四川省",
          "成[&]都[&]市",
          "家具",
          "桌子",
        ],
        Array [
          "四川省",
          "成[&]都[&]市",
          "家具",
          "沙发",
        ],
        Array [
          "四川省",
          "成[&]都[&]市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "成[&]都[&]市",
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
          "成[&]都[&]市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "成[&]都[&]市",
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
          "成[&]都[&]市",
          "办公用品",
          "笔",
        ],
        Array [
          "四川省",
          "成[&]都[&]市",
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
  });
});
