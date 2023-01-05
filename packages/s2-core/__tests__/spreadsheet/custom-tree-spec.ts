import { getContainer } from 'tests/util/helpers';
import { CustomTreePivotDataSet } from '../../src';
import type { HeaderCell } from '../../src/cell/header-cell';
import { customRowGridSimpleFields } from '../data/custom-grid-simple-fields';
import { customTreeNodes } from '../data/custom-tree-nodes';
import { CustomGridData } from '../data/data-custom-grid';
import {
  expectHighlightActiveNodes,
  getSelectedCount,
  getSelectedSum,
  getTestTooltipData,
} from '../util/interaction';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  hierarchyType: 'tree',
  style: {
    rowCell: {
      width: 400,
    },
  },
};

describe('SpreadSheet Custom Tree Tests', () => {
  let s2: SpreadSheet;

  const getCornerCellLabels = () => {
    return (s2.facet as any)
      .getCornerHeader()
      .getChildren()
      .map((cell: HeaderCell) => cell.getActualText());
  };

  const mapRowNodes = (spreadsheet: SpreadSheet) =>
    spreadsheet.getRowLeafNodes().map((node) => {
      const iconName = (node.belongsCell as HeaderCell).getTreeIcon()?.config
        .name;
      return {
        id: node.id,
        iconName,
      };
    });

  const customRowDataCfg: S2DataConfig = {
    data: CustomGridData,
    meta: [
      {
        field: 'type',
        name: '类型',
      },
      {
        field: 'sub_type',
        name: '子类型',
      },
      {
        field: 'a-1',
        name: '层级1',
      },
      {
        field: 'a-2',
        name: '层级2',
      },
    ],
    fields: customRowGridSimpleFields,
  };

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), customRowDataCfg, s2Options);
    s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should disable valueInCols', () => {
    expect(s2.dataCfg.fields.valueInCols).toBeFalsy();
    expect(s2.dataSet.fields.valueInCols).toBeFalsy();
  });

  test('should use custom tree pivot dataSet', () => {
    expect(s2.dataSet).toBeInstanceOf(CustomTreePivotDataSet);
  });

  test('should render custom layout row nodes', () => {
    const rowNodes = s2.getRowNodes().map((node) => ({
      value: node.value,
      width: node.width,
      height: node.height,
      description: node.extra.description,
    }));
    expect(rowNodes).toMatchSnapshot();
  });

  test('should calc correctly row index of leaf nodes', () => {
    const rowLeafNodes = s2.getRowLeafNodes().map((node) => ({
      value: node.value,
      rowIndex: node.rowIndex,
    }));
    expect(rowLeafNodes).toMatchSnapshot();
  });

  test('should select custom row header cell', () => {
    // a-1
    const rowNode = s2.getRowNodes()[0];

    // 选中 a-1
    s2.interaction.selectHeaderCell({
      cell: rowNode.belongsCell!,
    });

    // 选中单元格本身
    expect(s2.interaction.getActiveCells()).toHaveLength(1);
    // 高亮子节点
    expectHighlightActiveNodes(s2, ['root[&]自定义节点 a-1']);

    // 取消选中 a - 1
    s2.interaction.selectHeaderCell({
      cell: rowNode.belongsCell!,
    });
    expect(s2.interaction.getActiveCells()).toBeEmpty();
  });

  test.each([
    { field: 'a-1', count: 2, sum: null },
    { field: 'a-1-1', count: 2, sum: null },
    { field: 'measure-1', count: 2, sum: 24 },
    { field: 'measure-2', count: 2, sum: 10 },
    { field: 'a-1-2', count: 2, sum: null },
    { field: 'a-1-2', count: 2, sum: null },
  ])(
    'should get selected cell summary infos for %o',
    ({ field, count, sum }) => {
      const rowNode = s2.getRowNodes().find((node) => node.field === field)!;

      // 选中
      s2.interaction.selectHeaderCell({
        cell: rowNode.belongsCell!,
      });

      const tooltipData = getTestTooltipData(s2, rowNode.belongsCell!);

      // 选中个数
      expect(getSelectedCount(tooltipData.summaries)).toEqual(count);
      // 汇总数据总和
      expect(getSelectedSum(tooltipData.summaries)).toEqual(sum);
    },
  );

  test('should render custom corner text by default title', () => {
    s2.setDataCfg({
      ...customRowDataCfg,
      meta: [],
    });

    s2.render();

    const cornerCellLabels = getCornerCellLabels();

    expect(cornerCellLabels).toEqual([
      '自定义节点 a-1/自定义节点 a-2/数值',
      'type',
    ]);
  });

  test('should render custom corner text by meta formatter', () => {
    s2.setDataCfg({
      ...customRowDataCfg,
      meta: [
        {
          field: 'a-1',
          name: '文本1',
        },
        {
          field: 'a-2',
          name: '文本2',
        },
      ],
    });

    s2.render();
    const cornerCellLabels = getCornerCellLabels();

    expect(cornerCellLabels).toEqual(['文本1/文本2/数值', 'type']);
  });

  test('should render custom corner text by cornerText options', () => {
    s2.setOptions({
      cornerText: '测试',
    });

    s2.render();

    const cornerCellLabels = (s2.facet as any)
      .getCornerHeader()
      .getChildren()
      .map((cell: HeaderCell) => cell.getActualText());

    expect(cornerCellLabels).toEqual(['测试', '类型']);
  });

  test('should render custom tree row node width', () => {
    s2.setOptions({
      style: {
        rowCell: {
          width: 50,
        },
      },
    });

    s2.render();

    const { rowNodes, rowsHierarchy } = s2.facet.layoutResult;

    expect(rowsHierarchy.width).toEqual(50);
    expect(rowNodes.every((node) => node.width === 50)).toBeTruthy();
  });

  test('should collapse node by collapsed', () => {
    s2.setDataCfg({
      ...customRowDataCfg,
      fields: {
        ...s2.dataSet.fields,
        rows: customTreeNodes.map((node) => {
          return {
            ...node,
            collapsed: true,
          };
        }),
      },
    });
    s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  test('should collapse node by collapsed fields id', () => {
    s2.setOptions({
      style: {
        rowCell: {
          collapsedFields: ['root[&]自定义节点 a-1'],
        },
      },
    });
    s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  test('should collapse node by collapsed field', () => {
    s2.setOptions({
      style: {
        rowCell: {
          collapsedFields: ['a-1-1'],
        },
      },
    });
    s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  test('should collapse node by user collapsedFields first', () => {
    const collapsedField = 'custom-node-1';

    s2.setDataCfg({
      ...customRowDataCfg,
      fields: {
        ...s2.dataSet.fields,
        rows: customTreeNodes.map((node) => {
          return {
            ...node,
            collapsed: node.field !== collapsedField,
          };
        }),
      },
    });

    s2.setOptions({
      style: {
        rowCell: {
          collapsedFields: [collapsedField],
        },
      },
    });
    s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });
});
