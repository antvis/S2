import { createPivotSheet } from 'tests/util/helpers';
import { get } from 'lodash';
import type { HierarchyType, RowHeader } from '../../../../src';
import type { FrozenFacet } from '../../../../src/facet/frozen-facet';
import { DEFAULT_OPTIONS, FrozenGroupType } from '@/common';
import { RowCell } from '@/cell';

const s2 = createPivotSheet(
  {
    ...DEFAULT_OPTIONS,
    frozen: {
      firstRow: true,
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
      expect(rowHeader.frozenRowGroup).toBeTruthy();
      expect(rowHeader.scrollGroup).toBeTruthy();

      expect(rowHeader.frozenRowGroup.children).toHaveLength(1);
      const frozenRowCell = rowHeader.frozenRowGroup.children[0];

      expect(frozenRowCell instanceof RowCell).toBeTrue();
      expect(get(frozenRowCell, 'meta.height')).toEqual(30);

      expect(rowHeader.scrollGroup.getChildren()).toHaveLength(10);
      const scrollCell = rowHeader.scrollGroup.getChildren()[0];

      expect(scrollCell instanceof RowCell).toBeTrue();
      expect(get(frozenRowCell, 'meta.height')).toEqual(30);

      expect(
        (s2.facet as FrozenFacet).frozenGroupInfo[FrozenGroupType.FROZEN_ROW]
          .height,
      ).toBe(30);
    },
  );
});
