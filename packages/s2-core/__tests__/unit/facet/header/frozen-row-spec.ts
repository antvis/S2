import { createPivotSheet } from 'tests/util/helpers';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { DEFAULT_STYLE } from '@/common';

import { FrozenRowCell, RowCell, SeriesNumberCell } from '@/cell';
import type { PivotFacet } from '@/facet';
import { FrozenRowHeader } from '@/facet/header';
import { FrozenSeriesNumber } from '@/facet/header/frozen-series-number';

const s2 = createPivotSheet({
  ...assembleDataCfg().fields,
  valueInCols: true,
  ...assembleOptions({
    frozenEntireHeadRowPivot: true,
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
describe('Frozen Row Header Tests Grid Mode', () => {
  let facet;
  beforeEach(() => {
    s2.setOptions({ hierarchyType: 'grid' });
    s2.render();
    facet = s2.facet as PivotFacet;
  });
  test('get header after render', () => {
    expect(facet.rowHeader instanceof FrozenRowHeader).toBeTrue();
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
  });

  test('frozen header api is it correct?', () => {
    const rowHeader = facet.rowHeader;
    expect(rowHeader.getFrozenRowHeight()).toBe(30);

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

    expect(rowHeader.getFrozenRowCount()).toBe(1);
  });
});

describe('Frozen Row Header Tests Tree Mode', () => {
  let facet;
  beforeEach(() => {
    s2.setOptions({ hierarchyType: 'tree' });
    s2.render();
    facet = s2.facet as PivotFacet;
  });
  test('get header after render', () => {
    expect(facet.rowHeader instanceof FrozenRowHeader).toBeTrue();
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
  });

  test('frozen header api is it correct?', () => {
    const rowHeader = facet.rowHeader;
    expect(rowHeader.getFrozenRowHeight()).toBe(30);

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

    expect(rowHeader.getFrozenRowCount()).toBe(1);
  });
});

describe('Frozen Series Number Tests Tree Mode', () => {
  let facet;
  beforeEach(() => {
    s2.setOptions({ hierarchyType: 'tree' });
    s2.render();
    facet = s2.facet as PivotFacet;
  });

  test('FrozenSeriesNumber Header Tests', () => {
    expect(facet.rowIndexHeader instanceof FrozenSeriesNumber).toBe(true);

    const seriesNumberCell = facet.rowIndexHeader.frozenHeadGroup.getChildren();
    expect(seriesNumberCell).toHaveLength(1);

    expect(
      facet.rowIndexHeader.scrollGroup.getChildren()[0] instanceof
        SeriesNumberCell,
    ).toBe(true);

    expect(seriesNumberCell[0] instanceof SeriesNumberCell).toBe(true);

    expect(seriesNumberCell[0].meta.height).toBe(30);
  });
});

describe('Frozen Series Number Tests Grid Mode', () => {
  let facet;
  beforeEach(() => {
    s2.setOptions({ hierarchyType: 'grid' });
    s2.render();
    facet = s2.facet as PivotFacet;
  });

  test('FrozenSeriesNumber Header Tests', () => {
    expect(facet.rowIndexHeader instanceof FrozenSeriesNumber).toBe(true);

    const seriesNumberCell = facet.rowIndexHeader.frozenHeadGroup.getChildren();
    expect(seriesNumberCell).toHaveLength(1);

    expect(
      facet.rowIndexHeader.scrollGroup.getChildren()[0] instanceof
        SeriesNumberCell,
    ).toBe(true);

    expect(seriesNumberCell[0] instanceof SeriesNumberCell).toBe(true);

    expect(seriesNumberCell[0].meta.height).toBe(30);
  });
});
