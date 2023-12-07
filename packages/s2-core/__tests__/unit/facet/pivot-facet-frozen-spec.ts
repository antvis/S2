/**
 * pivot mode pivot test.
 */
import type { IGroup } from '@antv/g-canvas';
import { get } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import { type PivotSheet, RowCell, SeriesNumberCell } from '../../../src';
import {
  FrozenGroup,
  KEY_GROUP_ROW_HEADER_FROZEN,
  KEY_GROUP_ROW_SCROLL,
  type S2Options,
} from '@/common';
import type { FrozenFacet } from '@/facet/frozen-facet';
import { getFrozenRowCfgPivot } from '@/facet/utils';

const defaultS2Options: S2Options = {
  frozenFirstRow: true,
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
};

const enableFrozenFistRowOption = {
  frozenRowCount: 1,
  frozenColCount: 0,
  frozenTrailingColCount: 0,
  frozenTrailingRowCount: 0,
  enableFrozenFirstRow: true,
  frozenRowHeight: 30,
};

const disableFrozenFistRowOption = {
  ...enableFrozenFistRowOption,
  frozenRowCount: 0,
  enableFrozenFirstRow: false,
  frozenRowHeight: 0,
};

let s2: PivotSheet;

describe('test getFrozenRowCfgPivot', () => {
  beforeEach(() => {
    s2 = createPivotSheet(defaultS2Options, { useSimpleData: false });
  });

  afterEach(() => {
    s2.destroy();
  });

  test.each(['grid', 'tree'])(
    'test getFrozenRowCfgPivot %s mode',
    (hierarchyType: 'grid' | 'tree') => {
      s2.setOptions({
        hierarchyType,
      });
      s2.render();

      expect(
        getFrozenRowCfgPivot(s2.options, s2.facet.layoutResult.rowNodes),
      ).toStrictEqual(enableFrozenFistRowOption);

      s2.setOptions({ pagination: { pageSize: 5, current: 1 } });
      s2.render();

      expect(
        getFrozenRowCfgPivot(s2.options, s2.facet.layoutResult.rowNodes),
      ).toStrictEqual(disableFrozenFistRowOption);
    },
  );
});

describe('test getFrozenRowCfgPivot in tree', () => {
  beforeEach(() => {
    s2 = createPivotSheet(
      {
        ...defaultS2Options,
        hierarchyType: 'tree',
        pagination: {
          pageSize: 0,
          current: 0,
        },
      },
      { useSimpleData: false },
    );
  });

  afterEach(() => {
    s2.destroy();
  });

  test('showSeriesNumber no totals', () => {
    s2.setOptions({
      showSeriesNumber: true,
      totals: { row: { showGrandTotals: false } },
    });
    s2.render();

    expect(
      getFrozenRowCfgPivot(s2.options, s2.facet.layoutResult.rowNodes),
    ).toStrictEqual(disableFrozenFistRowOption);
  });

  test('showSeriesNumber has totals', () => {
    s2.setOptions({
      showSeriesNumber: true,
      ...defaultS2Options,
    });
    s2.render();

    expect(
      getFrozenRowCfgPivot(s2.options, s2.facet.layoutResult.rowNodes),
    ).toStrictEqual(enableFrozenFistRowOption);
  });
});

describe('test cell XYIndexes frozen first row', () => {
  beforeEach(() => {
    s2 = createPivotSheet(defaultS2Options, { useSimpleData: false });
    s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should get correct frozenGroupInfo', () => {
    expect((s2.facet as FrozenFacet).frozenGroupInfo).toStrictEqual({
      [FrozenGroup.FROZEN_COL]: {
        width: 0,
      },
      [FrozenGroup.FROZEN_ROW]: {
        height: 30,
        range: [0, 0],
      },
      [FrozenGroup.FROZEN_TRAILING_COL]: {
        width: 0,
      },
      [FrozenGroup.FROZEN_TRAILING_ROW]: {
        height: 0,
      },
    });
  });

  test('should get correct xy indexes with frozen in grid', () => {
    s2.setOptions({ hierarchyType: 'grid' });
    s2.render(false);

    expect(s2.facet.calculateXYIndexes(0, 0)).toMatchInlineSnapshot(`
      Object {
        "center": Array [
          0,
          3,
          1,
          8,
        ],
        "frozenCol": Array [
          0,
          -1,
          1,
          8,
        ],
        "frozenRow": Array [
          0,
          3,
          0,
          0,
        ],
        "frozenTrailingCol": Array [
          4,
          3,
          1,
          8,
        ],
        "frozenTrailingRow": Array [
          0,
          3,
          9,
          8,
        ],
      }
    `);
    expect(s2.facet.calculateXYIndexes(110, 30)).toMatchInlineSnapshot(`
      Object {
        "center": Array [
          1,
          3,
          2,
          8,
        ],
        "frozenCol": Array [
          0,
          -1,
          2,
          8,
        ],
        "frozenRow": Array [
          1,
          3,
          0,
          0,
        ],
        "frozenTrailingCol": Array [
          4,
          3,
          2,
          8,
        ],
        "frozenTrailingRow": Array [
          1,
          3,
          9,
          8,
        ],
      }
    `);
  });

  test('should get correct xy indexes with frozen in tree', () => {
    s2.setOptions({ hierarchyType: 'tree' });
    s2.render(false);

    expect(s2.facet.calculateXYIndexes(0, 0)).toMatchInlineSnapshot(`
      Object {
        "center": Array [
          0,
          3,
          1,
          10,
        ],
        "frozenCol": Array [
          0,
          -1,
          1,
          10,
        ],
        "frozenRow": Array [
          0,
          3,
          0,
          0,
        ],
        "frozenTrailingCol": Array [
          4,
          3,
          1,
          10,
        ],
        "frozenTrailingRow": Array [
          0,
          3,
          11,
          10,
        ],
      }
    `);
    expect(s2.facet.calculateXYIndexes(110, 30)).toMatchInlineSnapshot(`
      Object {
        "center": Array [
          0,
          3,
          2,
          10,
        ],
        "frozenCol": Array [
          0,
          -1,
          2,
          10,
        ],
        "frozenRow": Array [
          0,
          3,
          0,
          0,
        ],
        "frozenTrailingCol": Array [
          4,
          3,
          2,
          10,
        ],
        "frozenTrailingRow": Array [
          0,
          3,
          11,
          10,
        ],
      }
    `);
  });

  test('should get correct indexes with row height gt canvas height', () => {
    const originHeight = s2.facet.panelBBox.viewportHeight;
    s2.facet.panelBBox.viewportHeight = 10;
    expect(s2.facet.calculateXYIndexes(0, 0)).toMatchInlineSnapshot(`
      Object {
        "center": Array [
          0,
          3,
          1,
          0,
        ],
        "frozenCol": Array [
          0,
          -1,
          1,
          0,
        ],
        "frozenRow": Array [
          0,
          3,
          0,
          0,
        ],
        "frozenTrailingCol": Array [
          4,
          3,
          1,
          0,
        ],
        "frozenTrailingRow": Array [
          0,
          3,
          9,
          8,
        ],
      }
    `);
    // reset
    s2.facet.panelBBox.viewportHeight = originHeight;
  });
});

describe('test frozen group', () => {
  beforeEach(() => {
    s2 = createPivotSheet(
      {
        ...defaultS2Options,
        showSeriesNumber: true,
      },
      { useSimpleData: false },
    );
  });

  afterEach(() => {
    s2.destroy();
  });

  test.each(['grid', 'tree'])(
    'row header group',
    (hierarchyType: 'grid' | 'tree') => {
      s2.setOptions({ hierarchyType });
      s2.render();
      // row header
      const rowHeader = s2.facet.rowHeader;
      const scrollHeaderGroup = rowHeader.getChildren()[0];
      expect(rowHeader.getChildren()).toHaveLength(2);
      expect(scrollHeaderGroup.cfg.name).toBe(KEY_GROUP_ROW_SCROLL);
      expect(rowHeader.getChildren()[1].cfg.name).toBe(
        KEY_GROUP_ROW_HEADER_FROZEN,
      );
      const frozenRowGroupChildren = (
        rowHeader.getChildren()[1] as IGroup
      ).getChildren();
      const scrollRowHeaderGroupChildren = (
        scrollHeaderGroup as IGroup
      ).getChildren();
      expect(frozenRowGroupChildren).toHaveLength(1);
      expect(frozenRowGroupChildren[0] instanceof RowCell).toBeTruthy();
      expect(get(frozenRowGroupChildren[0], 'meta.value')).toBe('总计');
      expect(scrollRowHeaderGroupChildren).toHaveLength(10);
      expect(scrollRowHeaderGroupChildren[0] instanceof RowCell).toBeTruthy();
      expect(get(scrollRowHeaderGroupChildren[0], 'meta.value')).toBe('浙江省');

      // serial number header
      const rowIndexHeader = s2.facet.rowIndexHeader;
      expect(rowIndexHeader.getChildren()).toHaveLength(2);
      expect(rowIndexHeader.getChildren()[0].cfg.name).toBe(
        KEY_GROUP_ROW_SCROLL,
      );
      expect(rowIndexHeader.getChildren()[1].cfg.name).toBe(
        KEY_GROUP_ROW_HEADER_FROZEN,
      );
      const frozenSeriesRowGroupChildren = (
        rowIndexHeader.getChildren()[1] as IGroup
      ).getChildren();
      const scrollSeriesRowScrollGroupChildren = (
        rowIndexHeader.getChildren()[0] as IGroup
      ).getChildren();
      expect(frozenSeriesRowGroupChildren).toHaveLength(1);
      expect(frozenSeriesRowGroupChildren[0] instanceof SeriesNumberCell).toBe(
        true,
      );
      expect(get(frozenSeriesRowGroupChildren[0], 'meta.value')).toBe('1');
      expect(scrollSeriesRowScrollGroupChildren).toHaveLength(2);
      expect(get(scrollSeriesRowScrollGroupChildren[0], 'meta.value')).toBe(
        '2',
      );
    },
  );
});
