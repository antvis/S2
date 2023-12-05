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
      subTotalsDimensions: ['first', 'second'],
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
      field: 'first',
      name: '一级维度',
    },
    {
      field: 'second',
      name: '二级维度',
    },
    {
      field: 'third',
      name: '三级维度',
    },
    {
      field: 'number',
      name: '数值',
    },
  ],
  fields: {
    rows: ['first', 'second', 'third'],
    columns: [],
    values: ['number'],
    valueInCols: true,
  },
  data: [
    {
      first: '总计',
      number: 1732771,
    },
    {
      first: '维值-1',
      second: '维值-2',
      third: '维度-3',
      number: 172245,
    },
    {
      first: '维值-1',
      second: '维值-2',
      third: '维度-3',
      number: 12222,
    },
    {
      first: '维值-1',
      second: '维值-3',
      third: '维值-3',
      number: 11111,
    },
    {
      first: '维值-1',
      second: '维值-3',
      third: '维度-3',
      number: 11111,
    },
    {
      first: '维值-1',
      number: 456,
    },
    {
      first: '测试-1',
      second: '测试-2',
      third: '维度-3',
      number: 12,
    },
    {
      first: '测试-1',
      second: '测试-2',
      third: '维度-3',
      number: 4444567,
    },
    {
      first: '测试-1',
      second: '测试-3',
      number: 111233,
    },
    {
      first: '测试-1',
      second: '测试-3',
      number: 785222,
    },
    {
      first: '测试-1',
      second: '测试-4',
      third: '维度-3',
      number: 6455644,
    },
    {
      first: '测试-1',
      second: '测试-4',
      number: 289898,
    },
    {
      first: '测试-1',
      second: '测试-5',
      number: 2222,
    },
    {
      first: '测试-1',
      second: '测试-5',
      third: '维度-3',
      number: 1111,
    },
    {
      first: '测试-1',
      number: 125555,
    },
    {
      first: '测试-6',
      second: '测试-x',
      number: 409090,
    },
    {
      first: '测试-6',
      second: '测试-x',
      number: 111111,
    },
    {
      first: '测试-6',
      second: '测试-7',
      number: 5555,
    },
    {
      first: '测试-6',
      second: '测试-7',
      number: 67878,
    },
    {
      first: '测试-6',
      second: '测试-8',
      number: 53445.464,
    },
    {
      first: '测试-6',
      second: '测试-8',
      number: 456.464,
    },
    {
      first: '测试-6',
      number: 123.416,
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

  test('should generate correct query for empty node', () => {
    const emptyDimensionValueNode1 = s2.facet.layoutResult.rowNodes[0];
    expect(emptyDimensionValueNode1.query).toEqual({
      first: '总计',
    });

    const emptyDimensionValueNode2 = s2.facet.layoutResult.rowNodes[1];
    expect(emptyDimensionValueNode2.query).toEqual({
      first: '总计',
    });
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
            "$$extra$$": "number",
            "$$value$$": 1732771,
            "first": "总计",
            "number": 1732771,
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
