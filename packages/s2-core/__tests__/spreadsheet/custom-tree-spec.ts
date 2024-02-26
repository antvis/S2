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
    return s2.facet.getCornerCells().map((cell) => cell.getActualText());
  };

  const mapRowNodes = (spreadsheet: SpreadSheet) =>
    spreadsheet.facet.getRowLeafNodes().map((node) => {
      const iconName = (node.belongsCell as HeaderCell).getTreeIcon()?.config
        .name;

      return {
        id: node.id,
        value: node.value,
        isCollapsed: node.isCollapsed,
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

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), customRowDataCfg, s2Options);
    await s2.render();
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
    const rowNodes = s2.facet.getRowNodes().map((node) => {
      return {
        value: node.value,
        width: node.width,
        height: node.height,
        description: node.extra?.['description'],
      };
    });

    expect(rowNodes).toMatchSnapshot();
  });

  test('should calc correctly row index of leaf nodes', () => {
    const rowLeafNodes = s2.facet.getRowLeafNodes().map((node) => {
      return {
        value: node.value,
        rowIndex: node.rowIndex,
      };
    });

    expect(rowLeafNodes).toMatchSnapshot();
  });

  test('should select custom row header cell', () => {
    // a-1
    const rowNode = s2.facet.getRowNodes()[0];

    // 选中 a-1
    s2.interaction.selectHeaderCell({
      cell: rowNode.belongsCell!,
    });

    // 选中单元格本身
    expect(s2.interaction.getActiveCells()).toHaveLength(1);
    // 高亮子节点
    expectHighlightActiveNodes(s2, ['root[&]a-1']);

    // 取消选中 a-1
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
      const rowNode = s2.facet
        .getRowNodes()
        .find((node) => node.field === field)!;

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

  test('should render custom corner text by default title', async () => {
    s2.setDataCfg({
      meta: [],
    });

    await s2.render(true);

    const cornerCellLabels = getCornerCellLabels();

    expect(cornerCellLabels).toEqual([
      '自定义节点 a-1/自定义节点 a-2/数值',
      'type',
    ]);
  });

  test('should render custom corner text by meta formatter', async () => {
    s2.setDataCfg({
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

    await s2.render(true);
    const cornerCellLabels = getCornerCellLabels();

    expect(cornerCellLabels).toEqual(['文本1/文本2/数值', 'type']);
  });

  test('should render custom corner text by cornerText options', async () => {
    s2.setOptions({
      cornerText: '测试',
    });

    await s2.render();

    const cornerCellLabels = getCornerCellLabels();

    expect(cornerCellLabels).toEqual(['测试', '类型']);
  });

  test('should render custom tree row node width', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          width: 50,
        },
      },
    });

    await s2.render();

    const { rowNodes, rowsHierarchy } = s2.facet.getLayoutResult();

    expect(rowsHierarchy.width).toEqual(50);
    expect(rowNodes.every((node) => node.width === 50)).toBeTruthy();
  });

  test('should collapse node by collapsed', async () => {
    s2.setDataCfg({
      fields: {
        rows: customTreeNodes.map((node) => {
          return {
            ...node,
            collapsed: true,
          };
        }),
      },
    });
    await s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  test('should collapse node by collapsed fields id', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          collapseFields: {
            'root[&]自定义节点 a-1': true,
            'root[&]自定义节点 a-2': false,
          },
        },
      },
    });
    await s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  test('should collapse node by collapsed field', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          collapseFields: { 'a-1-1': true, 'a-1-2': false },
        },
      },
    });
    await s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  test('should collapse node by user collapseFields first', async () => {
    const collapsedField = 'custom-node-1';

    s2.setDataCfg({
      fields: {
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
          collapseFields: {
            [collapsedField]: true,
          },
        },
      },
    });
    await s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/2455
  test('should only collapse first node by node id', async () => {
    const collapsedField = 'custom-node-1';

    s2.setDataCfg({
      fields: {
        rows: customTreeNodes.map((node) => {
          return {
            ...node,
            // 让两个节点名一样
            title: '自定义节点A',
            collapsed: false,
          };
        }),
      },
    });

    s2.setOptions({
      style: {
        rowCell: {
          collapseFields: {
            [collapsedField]: true,
          },
        },
      },
    });
    await s2.render(true);

    expect(mapRowNodes(s2)).toMatchSnapshot();
  });
});
