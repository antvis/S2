import type { S2TableSheetFrozenOptions } from '@/common/interface/s2Options';
import { getValidFrozenOptions } from '@/utils/layout/frozen';
import {
  getFrozenDataCellType,
  calculateFrozenCornerCells,
  splitInViewIndexesWithFrozen,
  getCellRange,
} from '@/facet/utils';
import { FrozenCellType } from '@/common/constant/frozen';
import type { Indexes } from '@/utils/indexes';
import type { ViewCellHeights } from '@/facet/layout/interface';

describe('Frozen util test', () => {
  describe('getCellRange', () => {
    const pagination = {
      current: 1,
      pageSize: 50,
    };
    const viewCellHeights = {
      getTotalLength: () => 1000,
    };

    it('should return correct range', () => {
      expect(getCellRange(viewCellHeights as ViewCellHeights)).toStrictEqual({
        start: 0,
        end: 999,
      });
    });

    it('should return correct range when pagination is on', () => {
      expect(
        getCellRange(viewCellHeights as ViewCellHeights, pagination),
      ).toStrictEqual({
        start: 0,
        end: 49,
      });
    });
  });

  describe('getFrozenDataCellType', () => {
    it('should return correct data cell type', () => {
      const colLength = 10;
      const cellRange = {
        start: 0,
        end: 499,
      };
      const frozenOptions: S2TableSheetFrozenOptions = {
        colCount: 2,
        rowCount: 2,
        trailingColCount: 2,
        trailingRowCount: 2,
      };

      const colType = getFrozenDataCellType(
        {
          rowIndex: 100,
          colIndex: 1,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(colType).toBe(FrozenCellType.COL);

      const rowType = getFrozenDataCellType(
        {
          rowIndex: 1,
          colIndex: 5,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(rowType).toBe(FrozenCellType.ROW);

      const trailingColType = getFrozenDataCellType(
        {
          rowIndex: 100,
          colIndex: 9,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(trailingColType).toBe(FrozenCellType.TRAILING_COL);

      const trailingRowType = getFrozenDataCellType(
        {
          rowIndex: 499,
          colIndex: 5,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(trailingRowType).toBe(FrozenCellType.TRAILING_ROW);

      const scrollTypeNearTopLeft = getFrozenDataCellType(
        {
          rowIndex: 2,
          colIndex: 2,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearTopLeft).toBe(FrozenCellType.SCROLL);

      const scrollTypeNearTopRight = getFrozenDataCellType(
        {
          rowIndex: 2,
          colIndex: 7,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearTopRight).toBe(FrozenCellType.SCROLL);

      const scrollTypeNearBottomRight = getFrozenDataCellType(
        {
          rowIndex: 497,
          colIndex: 7,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearBottomRight).toBe(FrozenCellType.SCROLL);

      const scrollTypeNearBottomLeft = getFrozenDataCellType(
        {
          rowIndex: 497,
          colIndex: 2,
        },
        frozenOptions,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearBottomLeft).toBe(FrozenCellType.SCROLL);
    });
  });

  describe('calculateFrozenCornerCells', () => {
    it('should return correct frozen corner cell', () => {
      const frozenOptions: S2TableSheetFrozenOptions = {
        colCount: 1,
        rowCount: 2,
        trailingColCount: 1,
        trailingRowCount: 1,
      };
      const colLength = 4;
      const cellRange = {
        start: 0,
        end: 999,
      };

      expect(
        calculateFrozenCornerCells(frozenOptions, colLength, cellRange),
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
      const cellRange = {
        start: 0,
        end: 999,
      };
      const frozenOptions: S2TableSheetFrozenOptions = {
        colCount: 1,
        rowCount: 2,
        trailingColCount: 1,
        trailingRowCount: 1,
      };

      const result = splitInViewIndexesWithFrozen(
        indexes,
        frozenOptions,
        colLength,
        cellRange,
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

  describe('getValidFrozenOptions', () => {
    it('should return valid frozen options when frozenCount overflow', () => {
      expect(
        getValidFrozenOptions(
          {
            colCount: 10,
            rowCount: 10,
            trailingColCount: 10,
            trailingRowCount: 10,
          },
          5,
          5,
        ),
      ).toStrictEqual({
        colCount: 5,
        rowCount: 5,
        trailingColCount: 0,
        trailingRowCount: 0,
      });

      expect(
        getValidFrozenOptions(
          {
            colCount: 2,
            rowCount: 2,
            trailingColCount: 10,
            trailingRowCount: 10,
          },
          5,
          5,
        ),
      ).toStrictEqual({
        colCount: 2,
        rowCount: 2,
        trailingColCount: 3,
        trailingRowCount: 3,
      });
    });

    it('should return original frozen options when frozenCount is all zero', () => {
      expect(
        getValidFrozenOptions(
          {
            colCount: 0,
            rowCount: 0,
            trailingColCount: 0,
            trailingRowCount: 0,
          },
          30,
          30,
        ),
      ).toStrictEqual({
        colCount: 0,
        rowCount: 0,
        trailingColCount: 0,
        trailingRowCount: 0,
      });
    });

    it('should return original frozen options when frozenCount is exact fit', () => {
      expect(
        getValidFrozenOptions(
          {
            colCount: 10,
            rowCount: 10,
            trailingColCount: 10,
            trailingRowCount: 10,
          },
          20,
          20,
        ),
      ).toStrictEqual({
        colCount: 10,
        rowCount: 10,
        trailingColCount: 10,
        trailingRowCount: 10,
      });
    });
  });
});
