/**
 * @description spec for issue #2340
 * https://github.com/antvis/S2/issues/2340
 */
import { map } from 'lodash';
import {
  CellTypes,
  InteractionStateName,
  getCellMeta,
  type S2Options,
  HeaderCell,
} from '../../src';
import { createPivotSheet, sleep } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    cellCfg: {
      width: 200,
      height: 200,
    },
  },
};

describe('Header Brush Selection Tests', () => {
  test.each([CellTypes.COL_CELL, CellTypes.ROW_CELL])(
    'should not trigger data cell selected when header selected and scroll out of viewport',
    async (cellType) => {
      const s2 = createPivotSheet(s2Options, { useSimpleData: false });
      s2.render();

      const isRow = cellType === CellTypes.ROW_CELL;
      const targetCells = isRow
        ? s2.interaction.getAllRowHeaderCells()
        : s2.interaction.getAllColHeaderCells();

      const cells = [
        (targetCells as HeaderCell[]).find((cell) => {
          const meta = cell.getMeta();
          return meta.isLeaf;
        }),
      ];

      s2.interaction.changeState({
        cells: map(cells, getCellMeta),
        stateName: InteractionStateName.BRUSH_SELECTED,
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
      expect(s2.interaction.getCurrentStateName()).toEqual(
        InteractionStateName.BRUSH_SELECTED,
      );

      // 交互过的不应该有 dataCell (未触发过列头多选)
      s2.interaction.getInteractedCells().forEach((cell) => {
        expect(cell.cellType).toEqual(
          isRow ? CellTypes.ROW_CELL : CellTypes.COL_CELL,
        );
      });
    },
  );
});
