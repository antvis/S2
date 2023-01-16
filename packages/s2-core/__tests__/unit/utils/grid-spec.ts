import type { Node } from '@/facet/layout/node';
import type { ViewCellHeights } from '@/facet/layout/interface';
import {
  getColsForGrid,
  getFrozenRowsForGrid,
  getRowsForGrid,
} from '@/utils/grid';

describe('Grid util test', () => {
  describe('getColsForGrid', () => {
    it('should return correct range', () => {
      const colNodes = [
        {
          x: 0,
          width: 50,
        },
        {
          x: 50,
          width: 100,
        },
        {
          x: 150,
          width: 40,
        },
        {
          x: 190,
          width: 50,
        },
      ] as Node[];

      expect(getColsForGrid(0, 1, colNodes)).toStrictEqual([50, 150]);
      expect(getColsForGrid(1, 3, colNodes)).toStrictEqual([150, 190, 240]);
    });
  });

  describe('getRowsForGrid', () => {
    it('should return correct range', () => {
      const viewCellHeights = {
        getCellOffsetY: (index) => index * 50,
      } as ViewCellHeights;

      expect(getRowsForGrid(0, 3, viewCellHeights)).toStrictEqual([
        50, 100, 150, 200,
      ]);
    });
  });

  describe('getFrozenRowsForGrid', () => {
    it('should return correct range', () => {
      const viewCellHeights = {
        getCellOffsetY: (index) => index * 50,
      } as ViewCellHeights;
      const startY = 50;

      expect(getFrozenRowsForGrid(0, 3, startY, viewCellHeights)).toStrictEqual(
        [100, 150, 200, 250],
      );
    });
  });
});
