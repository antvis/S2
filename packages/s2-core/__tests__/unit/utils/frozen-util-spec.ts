import { getValidFrozenOptions } from 'src/utils/layout/frozen';
import {
  getFrozenDataCellType,
  calculateFrozenCornerCells,
  splitInViewIndexesWithFrozen,
  getCellRange,
} from '@/facet/utils';
import { FrozenCellType } from '@/common/constant/frozen';
import { Indexes } from '@/utils/indexes';
import { ViewCellHeights } from '@/facet/layout/interface';

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
    beforeEach(() => {});

    it('should return correct data cell type', () => {
      const colLength = 10;
      const cellRange = {
        start: 0,
        end: 499,
      };
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
        cellRange,
      );

      expect(colType).toBe(FrozenCellType.COL);

      const rowType = getFrozenDataCellType(
        {
          rowIndex: 1,
          colIndex: 5,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(rowType).toBe(FrozenCellType.ROW);

      const trailingColType = getFrozenDataCellType(
        {
          rowIndex: 100,
          colIndex: 9,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(trailingColType).toBe(FrozenCellType.TRAILING_COL);

      const trailingRowType = getFrozenDataCellType(
        {
          rowIndex: 499,
          colIndex: 5,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(trailingRowType).toBe(FrozenCellType.TRAILING_ROW);

      const scrollTypeNearTopLeft = getFrozenDataCellType(
        {
          rowIndex: 2,
          colIndex: 2,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearTopLeft).toBe(FrozenCellType.SCROLL);

      const scrollTypeNearTopRight = getFrozenDataCellType(
        {
          rowIndex: 2,
          colIndex: 7,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearTopRight).toBe(FrozenCellType.SCROLL);

      const scrollTypeNearBottomRight = getFrozenDataCellType(
        {
          rowIndex: 497,
          colIndex: 7,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearBottomRight).toBe(FrozenCellType.SCROLL);

      const scrollTypeNearBottomLeft = getFrozenDataCellType(
        {
          rowIndex: 497,
          colIndex: 2,
        },
        frozenOpts,
        colLength,
        cellRange,
      );

      expect(scrollTypeNearBottomLeft).toBe(FrozenCellType.SCROLL);
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
      const cellRange = {
        start: 0,
        end: 999,
      };

      expect(
        calculateFrozenCornerCells(frozenOpts, colLength, cellRange),
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
    it('should return valid frozen options when forzenCount overflow', () => {
      expect(
        getValidFrozenOptions(
          {
            frozenColCount: 10,
            frozenRowCount: 10,
            frozenTrailingColCount: 10,
            frozenTrailingRowCount: 10,
          },
          5,
          5,
        ),
      ).toStrictEqual({
        frozenColCount: 5,
        frozenRowCount: 5,
        frozenTrailingColCount: 0,
        frozenTrailingRowCount: 0,
      });

      expect(
        getValidFrozenOptions(
          {
            frozenColCount: 2,
            frozenRowCount: 2,
            frozenTrailingColCount: 10,
            frozenTrailingRowCount: 10,
          },
          5,
          5,
        ),
      ).toStrictEqual({
        frozenColCount: 2,
        frozenRowCount: 2,
        frozenTrailingColCount: 3,
        frozenTrailingRowCount: 3,
      });
    });

    it('should return original frozen options when forzenCount is all zero', () => {
      expect(
        getValidFrozenOptions(
          {
            frozenColCount: 0,
            frozenRowCount: 0,
            frozenTrailingColCount: 0,
            frozenTrailingRowCount: 0,
          },
          30,
          30,
        ),
      ).toStrictEqual({
        frozenColCount: 0,
        frozenRowCount: 0,
        frozenTrailingColCount: 0,
        frozenTrailingRowCount: 0,
      });
    });

    it('should return original frozen options when forzenCount is exact fit', () => {
      expect(
        getValidFrozenOptions(
          {
            frozenColCount: 10,
            frozenRowCount: 10,
            frozenTrailingColCount: 10,
            frozenTrailingRowCount: 10,
          },
          20,
          20,
        ),
      ).toStrictEqual({
        frozenColCount: 10,
        frozenRowCount: 10,
        frozenTrailingColCount: 10,
        frozenTrailingRowCount: 10,
      });
    });
  });
});
