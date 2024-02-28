/**
 * @description spec for issue #2340
 * https://github.com/antvis/S2/issues/2340
 */
import {
  CellType,
  InteractionStateName,
  getCellMeta,
  type S2CellType,
  type S2Options,
} from '../../src';
import { createPivotSheet, sleep } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    dataCell: {
      width: 200,
      height: 200,
    },
  },
};

describe('Header Brush Selection Tests', () => {
  test.each([CellType.COL_CELL, CellType.ROW_CELL])(
    'should not trigger data cell selected when header selected and scroll out of viewport',
    async (cellType) => {
      const s2 = createPivotSheet(s2Options, { useSimpleData: false });

      await s2.render();

      const isRow = cellType === CellType.ROW_CELL;
      const stateName = isRow
        ? InteractionStateName.ROW_CELL_BRUSH_SELECTED
        : InteractionStateName.COL_CELL_BRUSH_SELECTED;
      const targetCells = isRow
        ? s2.facet.getRowCells()
        : s2.facet.getColCells();

      const cells = [
        targetCells.find((cell) => {
          const meta = cell.getMeta();

          return meta.isLeaf;
        }),
      ] as S2CellType[];

      s2.interaction.changeState({
        cells: cells.map(getCellMeta),
        stateName,
      });

      await sleep(500);

      const offsetKey = isRow ? 'offsetY' : 'offsetX';

      // 将圈选的单元格滑出可视范围
      s2.facet.updateScrollOffset({
        [offsetKey]: { value: 300 },
      });

      await sleep(500);

      // 还原
      s2.facet.updateScrollOffset({
        [offsetKey]: { value: 0 },
      });

      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      expect(s2.interaction.getCurrentStateName()).toEqual(stateName);

      // 交互过的不应该有 dataCell (未触发过列头多选)
      s2.interaction.getInteractedCells().forEach((cell) => {
        expect(cell.cellType).toEqual(
          isRow ? CellType.ROW_CELL : CellType.COL_CELL,
        );
      });
    },
  );
});
