import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import { size, sumBy } from 'lodash';
import { getTooltipData, mergeCellInfo } from '../../src/utils/tooltip';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type {
  S2CellType,
  S2Options,
  TooltipSummaryOptions,
} from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  tooltip: {
    showTooltip: true,
  },
};

describe('Interaction Multi Selection Tests', () => {
  let s2: SpreadSheet;

  const expectNodes = (ids: string[] = []) => {
    const state = s2.interaction.getState();
    const nodeIds = state.nodes.map((node) => node.id);
    expect(nodeIds).toEqual(ids);
  };

  const getSelectedCount = (summaries: TooltipSummaryOptions[]) => {
    return sumBy(summaries, (item) => size(item?.selectedData));
  };

  const getSelectedSum = (summaries: TooltipSummaryOptions[]) => {
    return sumBy(summaries, 'value');
  };

  const getTestTooltipData = (cell: S2CellType) => {
    const cellInfos = mergeCellInfo(s2.interaction.getActiveCells());

    return getTooltipData({
      spreadsheet: s2,
      cellInfos,
      targetCell: cell,
      options: {
        showSingleTips: true,
      },
    });
  };

  beforeEach(() => {
    jest
      .spyOn(SpreadSheet.prototype, 'getCell')
      .mockImplementation(() => createMockCellInfo('testId').mockCell);

    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  // https://github.com/antvis/S2/issues/1306
  test('should selected belong data cell after selected root col cells', () => {
    s2.setOptions({
      hierarchyType: 'tree',
    });
    s2.render(false);

    const colRootCell = s2.interaction.getAllColHeaderCells()[0];

    // 选中
    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    s2.interaction
      .getPanelGroupAllDataCells()
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

    expectNodes(['root[&]笔[&]price', 'root[&]笔[&]cost']);

    // 取消选中
    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    expect(s2.interaction.getActiveCells()).toHaveLength(0);
  });

  // https://github.com/antvis/S2/pull/1419
  test('should always get leaf nodes at multiple row level more than 2', () => {
    const data = mockDataConfig.data.map((item) => ({
      ...item,
      country: '中国',
    }));

    s2.setDataCfg({
      fields: {
        rows: ['country', 'province', 'city'],
      },
      data,
    });

    s2.render();

    const rowRootCell = s2.interaction.getAllRowHeaderCells()[0];

    s2.interaction.selectHeaderCell({
      cell: rowRootCell,
    });

    expectNodes(['root[&]中国[&]浙江[&]义乌', 'root[&]中国[&]浙江[&]杭州']);

    const tooltipData = getTestTooltipData(rowRootCell);

    expect(getSelectedCount(tooltipData.summaries)).toEqual(4);
    expect(getSelectedSum(tooltipData.summaries)).toEqual(6);
  });

  test('should always get leaf nodes at multiple column level more than 2', () => {
    const data = mockDataConfig.data.map((item) => ({
      ...item,
      country: '中国',
    }));

    s2.setDataCfg({
      fields: {
        rows: ['city'],
        columns: ['country', 'province'],
      },
      data,
    });

    s2.render();

    const colRootCell = s2.interaction.getAllColHeaderCells()[0];

    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    expectNodes(['root[&]中国[&]浙江[&]price', 'root[&]中国[&]浙江[&]cost']);

    const tooltipData = getTestTooltipData(colRootCell);

    expect(getSelectedCount(tooltipData.summaries)).toEqual(4);
    expect(getSelectedSum(tooltipData.summaries)).toEqual(6);
  });
});
