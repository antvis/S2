import type { Node } from '@/facet/layout/node';
import {
  getActiveHoverRowColCells,
  updateAllColHeaderCellState,
} from '@/utils/interaction/hover-event';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import { ColCell } from '@/cell';

import { InteractionStateName } from '@/common';

jest.mock('@/cell', () => {
  return {
    // eslint-disable-next-line object-shorthand
    ColCell: function () {
      this.stateName = '';
      this.getMeta = () => {
        return {
          id: 'root[&]city',
        };
      };
      this.updateByState = (stateName) => {
        this.stateName = stateName;
      };
    },
  };
});

describe('Hover Event Utils Tests', () => {
  describe('getActiveHoverRowColCells test', () => {
    test('should return correct result for getActiveHoverRowColCells', () => {
      const cells = [
        new ColCell({} as unknown as Node, {} as unknown as SpreadSheet),
      ];
      let result = getActiveHoverRowColCells('root[&]city', cells, false);
      expect(result.map((cell) => cell.getMeta()?.id)).toStrictEqual([
        'root[&]city',
      ]);

      result = getActiveHoverRowColCells('root[&]city', cells, true);
      expect(result.map((cell) => cell.getMeta()?.id)).toStrictEqual([
        'root[&]city',
      ]);
    });
  });

  describe('updateAllColHeaderCellState test', () => {
    test('should return correct result for updateAllColHeaderCellState', () => {
      const cells = [
        new ColCell({} as unknown as Node, {} as unknown as SpreadSheet),
      ];
      updateAllColHeaderCellState(
        'root[&]city',
        cells,
        InteractionStateName.HOVER,
      );
      expect(cells.map((cell) => (cell as any).stateName)).toStrictEqual([
        InteractionStateName.HOVER,
      ]);
    });
  });
});
