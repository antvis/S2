import { getContainer } from 'tests/util/helpers';
import { EMPTY_FIELD_VALUE, type S2DataConfig, type S2Options } from '@/common';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 400,
  hierarchyType: 'grid',
  totals: {
    row: {
      showGrandTotals: false,
      showSubTotals: {
        always: false,
      },
      reverseLayout: false,
      reverseSubLayout: false,
      subTotalsDimensions: [
        '2d7feabd-76a2-4c11-8f24-79764af936b4',
        '30b4b32d-d69a-4772-b7f9-84cd54cf0cec',
      ],
    },
    col: {
      showGrandTotals: false,
      showSubTotals: false,
      reverseLayout: false,
      reverseSubLayout: false,
      subTotalsDimensions: [],
    },
  },
  style: {
    layoutWidthType: 'adaptive',
    cellCfg: {
      height: 30,
    },
  },
  showDefaultHeaderActionIcon: false,
};

const testDataCfg: S2DataConfig = {
  meta: [
    {
      field: '2d7feabd-76a2-4c11-8f24-79764af936b4',
      name: '一级维度',
    },
    {
      field: '30b4b32d-d69a-4772-b7f9-84cd54cf0cec',
      name: '二级维度',
    },
    {
      field: 'c5ce4e54-795a-42b3-9cc8-e8b685da44ee',
      name: '数值',
    },
  ],
  fields: {
    rows: [
      '2d7feabd-76a2-4c11-8f24-79764af936b4',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec',
    ],
    columns: [],
    values: ['c5ce4e54-795a-42b3-9cc8-e8b685da44ee'],
    valueInCols: true,
  },
  data: [
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '总计',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 1732771,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 172245,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 12222,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 11111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '维值-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 11111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '维值-1',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 456,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 12,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-2',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 4444567,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 111233,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-3',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 785222,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-4',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 6455644,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-4',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 289898,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-5',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 2222,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-5',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 1111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-1',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 125555,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-x',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 409090,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-x',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 111111,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-7',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 5555,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-7',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 67878,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-8',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 53445.464,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      '30b4b32d-d69a-4772-b7f9-84cd54cf0cec': '测试-8',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 456.464,
    },
    {
      '2d7feabd-76a2-4c11-8f24-79764af936b4': '测试-6',
      'c5ce4e54-795a-42b3-9cc8-e8b685da44ee': 123.416,
    },
  ],
};

describe('Miss Dimension Values Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), testDataCfg, s2Options);
    s2.render();
  });

  test('should get correctly empty dimension values', () => {
    const emptyDimensionValueNode = s2.getRowNodes()[0].children[0];

    expect(emptyDimensionValueNode.value).toEqual(EMPTY_FIELD_VALUE);
    expect(emptyDimensionValueNode.id).toEqual(
      `root[&]总计[&]${EMPTY_FIELD_VALUE}`,
    );
    expect(emptyDimensionValueNode.belongsCell.getActualText()).toEqual('-');
  });

  test('should get correctly empty dimension values and use custom placeholder text', () => {
    const placeholder = '*';

    s2.setOptions({
      placeholder,
    });
    s2.render(false);

    const emptyDimensionValueNode = s2.getRowNodes()[0].children[0];
    expect(emptyDimensionValueNode.belongsCell.getActualText()).toEqual(
      placeholder,
    );
  });

  test('should get correctly dimension data and ignore empty dimension value', () => {
    const emptyDimensionValueNode = s2.getRowNodes()[0].children[0];

    const data = s2.dataSet.getMultiData(emptyDimensionValueNode.query);
    const dimensionValues = s2.dataSet.getDimensionValues(
      emptyDimensionValueNode.field,
    );
    const emptyDimensionDataCell =
      s2.interaction.getPanelGroupAllDataCells()[0];

    expect(emptyDimensionValueNode.query).toEqual(
      emptyDimensionValueNode.parent.query,
    );
    expect(emptyDimensionDataCell.getMeta().fieldValue).toEqual(1732771);
    expect(data).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "$$extra$$": "c5ce4e54-795a-42b3-9cc8-e8b685da44ee",
            "$$value$$": 1732771,
            "2d7feabd-76a2-4c11-8f24-79764af936b4": "总计",
            "c5ce4e54-795a-42b3-9cc8-e8b685da44ee": 1732771,
          },
        ],
      ]
    `);
    expect(dimensionValues).toMatchInlineSnapshot(`
      Array [
        "维值-2",
        "维值-3",
        "测试-2",
        "测试-3",
        "测试-4",
        "测试-5",
        "测试-x",
        "测试-7",
        "测试-8",
      ]
    `);
  });
});
