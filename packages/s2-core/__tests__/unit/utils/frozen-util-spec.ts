import {
  getFrozenDataCellType,
  calculateFrozenCornerCells,
  splitInViewIndexesWithFrozen,
} from '@/facet/utils';
import { FrozenCellType } from '@/common/constant/frozen';
import { Indexes } from '@/utils/indexes';

describe('Frozen util test', () => {
  describe('getFrozenDataCellType', () => {
    beforeEach(() => {});

    it('should return correct data cell type', () => {
      const colLength = 10;
      const rowLength = 500;
      const frozenOpts = {
        frozenColCount: 2,
        frozenRowCount: 2,
        frozenTrailingColCount: 2,
        frozenTrailingRowCount: 2,
      };

      const colType = getFrozenDataCellType(
        {
          rowIndex: 100,
          colIndex: 1,
        },
        frozenOpts,
        colLength,
        rowLength,
      );

      expect(colType).toBe(FrozenCellType.COL);

      const rowType = getFrozenDataCellType(
        {
          rowIndex: 1,
          colIndex: 5,
        },
        frozenOpts,
        colLength,
        rowLength,
      );

      expect(rowType).toBe(FrozenCellType.ROW);

      const trailingColType = getFrozenDataCellType(
        {
          rowIndex: 100,
          colIndex: 9,
        },
        frozenOpts,
        colLength,
        rowLength,
      );

      expect(trailingColType).toBe(FrozenCellType.TRAILING_COL);

      const trailingRowType = getFrozenDataCellType(
        {
          rowIndex: 499,
          colIndex: 5,
        },
        frozenOpts,
        colLength,
        rowLength,
      );

      expect(trailingRowType).toBe(FrozenCellType.TRAILING_ROW);

      const scrollType = getFrozenDataCellType(
        {
          rowIndex: 497,
          colIndex: 7,
        },
        frozenOpts,
        colLength,
        rowLength,
      );

      expect(scrollType).toBe(FrozenCellType.SCROLL);
    });
  });

  describe('calculateFrozenCornerCells', () => {
    it('should return correct frozen corner cell', () => {
      const frozenOpts = {
        frozenColCount: 1,
        frozenRowCount: 2,
        frozenTrailingColCount: 1,
        frozenTrailingRowCount: 1,
      };
      const colLength = 4;
      const rowLength = 1000;

      expect(
        calculateFrozenCornerCells(frozenOpts, colLength, rowLength),
      ).toStrictEqual({
        bottom: [
          {
            x: 0,
            y: 999,
          },
          {
            x: 3,
            y: 999,
          },
        ],
        top: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 0,
            y: 1,
          },
          {
            x: 3,
            y: 0,
          },
          {
            x: 3,
            y: 1,
          },
        ],
      });
    });
  });

  describe('splitInViewIndexesWithFrozen', () => {
    it('should return splitted frozen indexes group', () => {
      const indexes: Indexes = [0, 3, 0, 11];
      const colLength = 4;
      const rowLength = 1000;
      const frozenOpts = {
        frozenColCount: 1,
        frozenRowCount: 2,
        frozenTrailingColCount: 1,
        frozenTrailingRowCount: 1,
      };

      const result = splitInViewIndexesWithFrozen(
        indexes,
        frozenOpts,
        colLength,
        rowLength,
      );

      expect(result).toStrictEqual({
        center: [1, 2, 2, 11],
        frozenCol: [0, 0, 2, 11],
        frozenRow: [1, 2, 0, 1],
        frozenTrailingCol: [3, 3, 2, 11],
        frozenTrailingRow: [1, 2, 999, 999],
      });
    });
  });
});
