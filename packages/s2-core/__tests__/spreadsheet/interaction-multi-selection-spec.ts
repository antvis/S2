import * as mockDataConfig from 'tests/data/simple-data.json';
import {
  createMockCellInfo,
  createPivotSheet,
  getContainer,
  sleep,
} from 'tests/util/helpers';
import {
  expectHighlightActiveNodes,
  getSelectedCount,
  getSelectedSum,
  getTestTooltipData,
} from '../util/interaction';
import { CellType, InteractionStateName } from '../../src';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { HierarchyType, S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  tooltip: {
    enable: true,
  },
};

const highlightCellConfig: Array<{
  hierarchyType: HierarchyType;
  stateName: InteractionStateName;
}> = [
  { hierarchyType: 'tree', stateName: InteractionStateName.HOVER },
  { hierarchyType: 'tree', stateName: InteractionStateName.SELECTED },
  { hierarchyType: 'grid', stateName: InteractionStateName.HOVER },
  { hierarchyType: 'grid', stateName: InteractionStateName.SELECTED },
];

describe('Interaction Multi Selection Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    jest
      .spyOn(SpreadSheet.prototype, 'getCell')
      .mockImplementation(() => createMockCellInfo('testId').mockCell);

    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  // https://github.com/antvis/S2/issues/1306
  test('should selected belong data cell after selected root col cells', async () => {
    s2.setOptions({
      hierarchyType: 'tree',
    });
    await s2.render(false);

    const colRootCell = s2.facet.getColCells()[0];

    // 选中
    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    s2.facet
      .getDataCells()
      .filter((cell) => {
        const targetCellMeta = colRootCell.getMeta();
        const meta = cell.getMeta();

        return meta.colIndex === targetCellMeta.colIndex;
      })
      .forEach((cell) => {
        expect(cell.getBackgroundColor()).toEqual({
          backgroundColor: '#F5F8FE',
          backgroundColorOpacity: 1,
        });
      });

    expectHighlightActiveNodes(s2, ['root[&]笔[&]price', 'root[&]笔[&]cost']);

    // 取消选中
    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    expect(s2.interaction.getActiveCells()).toHaveLength(0);
  });

  // https://github.com/antvis/S2/pull/1419
  test('should always get leaf nodes at multiple row level more than 2', async () => {
    const data = mockDataConfig.data.map((item) => {
      return {
        ...item,
        country: '中国',
      };
    });

    s2.setDataCfg({
      fields: {
        rows: ['country', 'province', 'city'],
      },
      data,
    });

    await s2.render();

    const rowRootCell = s2.facet.getRowCells()[0];

    s2.interaction.selectHeaderCell({
      cell: rowRootCell,
    });

    expectHighlightActiveNodes(s2, [
      'root[&]中国[&]浙江',
      'root[&]中国[&]浙江[&]义乌',
      'root[&]中国[&]浙江[&]杭州',
    ]);

    const tooltipData = getTestTooltipData(s2, rowRootCell);

    expect(getSelectedCount(tooltipData.summaries)).toEqual(4);
    expect(getSelectedSum(tooltipData.summaries)).toEqual(6);
  });

  test('should always get leaf nodes at multiple column level more than 2', async () => {
    const data = mockDataConfig.data.map((item) => {
      return {
        ...item,
        country: '中国',
      };
    });

    s2.setDataCfg({
      fields: {
        rows: ['city'],
        columns: ['country', 'province'],
      },
      data,
    });

    await s2.render();

    const colRootCell = s2.facet.getColCells()[0];

    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    expectHighlightActiveNodes(s2, [
      'root[&]中国[&]浙江',
      'root[&]中国[&]浙江[&]price',
      'root[&]中国[&]浙江[&]cost',
    ]);

    const tooltipData = getTestTooltipData(s2, colRootCell);

    expect(getSelectedCount(tooltipData.summaries)).toEqual(4);
    expect(getSelectedSum(tooltipData.summaries)).toEqual(6);
  });

  // https://github.com/antvis/S2/issues/2503
  test('should keep all cell highlighted after scroll', async () => {
    const pivotSheet = createPivotSheet(
      {
        style: {
          // 显示滚动条
          dataCell: {
            width: 200,
          },
        },
      },
      { useSimpleData: false },
    );

    await pivotSheet.render();

    const colRootCell = pivotSheet.facet.getColCells()[0];

    pivotSheet.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    await sleep(100);

    pivotSheet.updateScrollOffset({
      offsetX: {
        value: 100,
        animate: true,
      },
    });

    await sleep(500);

    expectHighlightActiveNodes(pivotSheet, [
      'root[&]家具[&]桌子',
      'root[&]家具[&]桌子[&]number',
      'root[&]家具[&]沙发',
      'root[&]家具[&]沙发[&]number',
    ]);

    const interactedCells = pivotSheet.interaction.getInteractedCells();

    ['root[&]家具[&]桌子', 'root[&]家具[&]沙发'].forEach((id) => {
      expect(
        interactedCells.find((cell) => cell.getMeta().id === id),
      ).toBeTruthy();
    });
  });

  test.each(highlightCellConfig)(
    'should highlight relevancy header cell after selected data cell by %s mode',
    async ({ hierarchyType, stateName }) => {
      s2.setOptions({
        hierarchyType,
        interaction: {
          selectedCellHighlight: true,
          hoverHighlight: true,
        },
        seriesNumber: { enable: true },
      });
      await s2.render(false);

      const dataCell = s2.facet.getDataCells()[0];

      s2.interaction.updateDataCellRelevantHeaderCells(
        stateName,
        dataCell.getMeta(),
      );

      expect(s2.interaction.getInteractedCells()).toHaveLength(
        s2.isHierarchyTreeType() ? 4 : 5,
      );
    },
  );

  test.each(highlightCellConfig)(
    'should highlight relevancy row cell after selected data cell by %s mode',
    async ({ hierarchyType, stateName }) => {
      s2.setOptions({
        hierarchyType,
        interaction: {
          selectedCellHighlight: true,
          hoverHighlight: true,
        },
        seriesNumber: { enable: true },
      });
      await s2.render(false);

      const dataCell = s2.facet.getDataCells()[0];

      s2.interaction.updateDataCellRelevantRowCells(
        stateName,
        dataCell.getMeta(),
      );

      const interactedCells = s2.interaction
        .getInteractedCells()
        .filter((cell) => cell.cellType === CellType.ROW_CELL);

      expect(interactedCells).toHaveLength(s2.isHierarchyTreeType() ? 2 : 3);
    },
  );

  test.each(highlightCellConfig)(
    'should highlight relevancy row cell after selected data cell by %s mode',
    async ({ hierarchyType, stateName }) => {
      s2.setOptions({
        hierarchyType,
        interaction: {
          selectedCellHighlight: true,
          hoverHighlight: true,
        },
        seriesNumber: { enable: true },
      });
      await s2.render(false);

      const dataCell = s2.facet.getDataCells()[0];

      s2.interaction.updateDataCellRelevantColCells(
        stateName,
        dataCell.getMeta(),
      );

      const interactedCells = s2.interaction
        .getInteractedCells()
        .filter((cell) => cell.cellType === CellType.COL_CELL);

      expect(interactedCells).toHaveLength(2);
    },
  );
});
