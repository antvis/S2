import * as mockDataConfig from 'tests/data/simple-data.json';
import { createMockCellInfo, getContainer } from 'tests/util/helpers';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  tooltip: {
    showTooltip: true,
  },
};

describe('Interaction Multi Selection Tests', () => {
  let s2: SpreadSheet;

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

    // 取消选中
    s2.interaction.selectHeaderCell({
      cell: colRootCell,
    });

    expect(s2.interaction.getActiveCells()).toHaveLength(0);
  });
});
