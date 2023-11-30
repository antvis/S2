import { createPivotSheet } from 'tests/util/helpers';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { DEFAULT_STYLE } from '@/common';

import { FrozenRowCell, RowCell, SeriesNumberCell } from '@/cell';
import type { PivotFacet } from '@/facet';
import { PivotRowHeader } from '@/facet/header';
import { SeriesNumberHeader } from '@/facet/header/series-number';

const s2 = createPivotSheet({
  ...assembleDataCfg().fields,
  valueInCols: true,
  ...assembleOptions({
    frozenFirstRowPivot: true,
    totals: {
      row: {
        showGrandTotals: true,
        reverseLayout: true,
      },
    },
    frozenColCount: 2,
    frozenRowCount: 2,
    frozenTrailingColCount: 2,
    frozenTrailingRowCount: 2,
    showSeriesNumber: true,
  }),
  ...DEFAULT_STYLE,
  height: 480,
  width: 400,
  cellCfg: {
    width: 200,
    height: 50,
  },
});
describe('Frozen Row Header Test', () => {
  let facet;

  test.each(['grid', 'tree'])(
    'frozen row header group api',
    (hierarchyType: 'grid' | 'tree') => {
      s2.setOptions({ hierarchyType });
      s2.render();
      facet = s2.facet as PivotFacet;

      expect(facet.rowHeader instanceof PivotRowHeader).toBeTrue();
      expect(facet.rowHeader.frozenHeadGroup).toBeTruthy();
      expect(facet.rowHeader.scrollGroup).toBeTruthy();

      expect(facet.rowHeader.frozenHeadGroup.getChildren()).toHaveLength(1);
      const frozenRowCell = facet.rowHeader.frozenHeadGroup.getChildren()[0];

      expect(frozenRowCell instanceof RowCell).toBeTrue();
      expect(frozenRowCell.meta.height).toEqual(30);

      expect(facet.rowHeader.scrollGroup.getChildren()).toHaveLength(3);
      const scrollCell = facet.rowHeader.scrollGroup.getChildren()[0];

      expect(scrollCell instanceof FrozenRowCell).toBeTrue();
      expect(frozenRowCell.meta.height).toEqual(30);

      const rowHeader = facet.rowHeader;
      expect(rowHeader.getFrozenFirstRowHeight()).toBe(30);

      expect(
        rowHeader.isFrozenRow({
          rowIndex: 0,
        }),
      ).toBe(true);
      expect(
        rowHeader.isFrozenRow({
          rowIndex: -1,
        }),
      ).toBe(false);
    },
  );
});

describe('Frozen Series Number Test', () => {
  let facet;
  test.each(['grid', 'tree'])(
    'series number test',
    (hierarchyType: 'grid' | 'tree') => {
      s2.setOptions({ hierarchyType });
      s2.render();
      facet = s2.facet as PivotFacet;
      expect(facet.rowIndexHeader instanceof SeriesNumberHeader).toBe(true);

      const seriesNumberCell =
        facet.rowIndexHeader.frozenHeadGroup.getChildren();
      expect(seriesNumberCell).toHaveLength(1);

      expect(
        facet.rowIndexHeader.scrollGroup.getChildren()[0] instanceof
          SeriesNumberCell,
      ).toBe(true);

      expect(seriesNumberCell[0] instanceof SeriesNumberCell).toBe(true);

      expect(seriesNumberCell[0].meta.height).toBe(30);
    },
  );
});
