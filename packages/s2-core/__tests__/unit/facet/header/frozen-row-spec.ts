import { createPivotSheet } from 'tests/util/helpers';
import { get } from 'lodash';
import { RowCell } from '../../../../src/cell/row-cell';
import { DEFAULT_OPTIONS } from '@/common';
import { SeriesNumberCell } from '@/cell';
import { PivotRowHeader } from '@/facet/header';
import { SeriesNumberHeader } from '@/facet/header/series-number';

const s2 = createPivotSheet(
  {
    ...DEFAULT_OPTIONS,
    frozenFirstRow: true,
    totals: { row: { showGrandTotals: true, reverseLayout: true } },
    showSeriesNumber: true,
  },
  { useSimpleData: false },
);

describe('Frozen Row Header Test', () => {
  test.each(['grid', 'tree'])(
    'frozen row header group api',
    (hierarchyType: 'grid' | 'tree') => {
      s2.setOptions({ hierarchyType });
      s2.render();
      const rowHeader: PivotRowHeader = s2.facet.rowHeader as PivotRowHeader;

      expect(rowHeader instanceof PivotRowHeader).toBeTrue();
      expect(rowHeader.frozenHeadGroup).toBeTruthy();
      expect(rowHeader.scrollGroup).toBeTruthy();

      expect(rowHeader.frozenHeadGroup.getChildren()).toHaveLength(1);
      const frozenRowCell = rowHeader.frozenHeadGroup.getChildren()[0];

      expect(frozenRowCell instanceof RowCell).toBeTrue();
      expect(get(frozenRowCell, 'meta.height')).toEqual(30);

      expect(rowHeader.scrollGroup.getChildren()).toHaveLength(10);
      const scrollCell = rowHeader.scrollGroup.getChildren()[0];

      expect(scrollCell instanceof RowCell).toBeTrue();
      expect(get(frozenRowCell, 'meta.height')).toEqual(30);

      expect(rowHeader.getFrozenFirstRowHeight()).toBe(30);
    },
  );
});

describe('Frozen Series Number Test', () => {
  test.each(['grid', 'tree'])(
    'series number test',
    (hierarchyType: 'grid' | 'tree') => {
      s2.setOptions({ hierarchyType });
      s2.render();
      const rowIndexHeader: SeriesNumberHeader = s2.facet
        .rowIndexHeader as SeriesNumberHeader;
      expect(rowIndexHeader instanceof SeriesNumberHeader).toBe(true);

      const seriesNumberCell = rowIndexHeader.frozenHeadGroup.getChildren();
      expect(seriesNumberCell).toHaveLength(1);

      expect(
        rowIndexHeader.scrollGroup.getChildren()[0] instanceof SeriesNumberCell,
      ).toBe(true);

      expect(seriesNumberCell[0] instanceof SeriesNumberCell).toBe(true);

      expect(get(seriesNumberCell[0], 'meta.height')).toBe(30);
    },
  );
});
