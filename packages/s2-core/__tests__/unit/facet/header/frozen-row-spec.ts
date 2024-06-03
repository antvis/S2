import { RowCell } from '@/cell';
import { DEFAULT_OPTIONS, FrozenGroupArea } from '@/common';
import { get } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import type { HierarchyType, RowHeader } from '../../../../src';
import type { FrozenFacet } from '../../../../src/facet/frozen-facet';

const s2 = createPivotSheet(
  {
    ...DEFAULT_OPTIONS,
    frozen: {
      rowCount: 1,
    },
    totals: { row: { showGrandTotals: true, reverseGrandTotalsLayout: true } },
    seriesNumber: {
      enable: false,
    },
  },
  { useSimpleData: false },
);

describe('Pivot Frozen Row Header Test', () => {
  test.each(['grid', 'tree'] as HierarchyType[])(
    'frozen row header group api',
    async (hierarchyType) => {
      s2.setOptions({ hierarchyType });
      await s2.render();

      const rowHeader = s2.facet.rowHeader as RowHeader;

      expect(rowHeader).toBeTruthy();
      expect(rowHeader.frozenGroup).toBeTruthy();
      expect(rowHeader.scrollGroup).toBeTruthy();

      expect(rowHeader.frozenGroup.children).toHaveLength(1);
      const frozenRowCell = rowHeader.frozenGroup.children[0];

      expect(frozenRowCell instanceof RowCell).toBeTrue();
      expect(get(frozenRowCell, 'meta.height')).toEqual(30);

      expect(rowHeader.scrollGroup.getChildren()).toHaveLength(10);
      const scrollCell = rowHeader.scrollGroup.getChildren()[0];

      expect(scrollCell instanceof RowCell).toBeTrue();
      expect(get(frozenRowCell, 'meta.height')).toEqual(30);

      expect(
        (s2.facet as FrozenFacet).frozenGroupAreas[FrozenGroupArea.Row].height,
      ).toBe(30);
    },
  );
});
