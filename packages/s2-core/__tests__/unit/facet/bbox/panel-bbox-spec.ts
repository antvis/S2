import type { S2Options, ThemeCfg } from '@/common';
import type { BaseFacet } from '@/facet/base-facet';
import { PanelBBox } from '@/facet/bbox/panel-bbox';

describe('PanelBBox Tests', () => {
  const layoutResult = {
    rowsHierarchy: {
      height: 100,
      width: 100,
    },
    colsHierarchy: {
      height: 100,
      width: 100,
    },
  };

  const getMockFacet = (
    realWidth: number,
    realHeight: number,
    extraOptions: S2Options = {},
    shouldEnableFrozenHeaders = true,
  ) =>
    ({
      layoutResult: {
        rowsHierarchy: {
          height: 100,
          width: 100,
        },
        colsHierarchy: {
          height: 100,
          width: 100,
        },
      },
      getLayoutResult() {
        return layoutResult;
      },
      cornerBBox: {
        width: 20,
        height: 20,
        maxX: 20,
        maxY: 20,
      },
      getRealWidth() {
        return realWidth;
      },
      getRealHeight() {
        return realHeight;
      },
      getSeriesNumberWidth() {
        return 80;
      },

      spreadsheet: {
        isFrozenRowHeader() {
          return true;
        },
        enableFrozenHeaders() {
          return shouldEnableFrozenHeaders;
        },
        isPivotMode() {
          return true;
        },
        theme: {
          scrollBar: {
            size: 5,
          },
          splitLine: { verticalBorderWidth: 2, horizontalBorderWidth: 2 },
        } as ThemeCfg,
        options: {
          width: 600,
          height: 600,
          frozen: {},
          ...extraOptions,
        },
      },
    }) as unknown as BaseFacet;

  test('should return correct bbox when no scroll bar exist(small dataset)', () => {
    const facet = getMockFacet(200, 200);
    const bbox = new PanelBBox(facet, true);

    expect(bbox.width).toBe(578);
    expect(bbox.height).toBe(573);
    expect(bbox.viewportWidth).toBe(200);
    expect(bbox.viewportHeight).toBe(200);
    expect(bbox.maxX).toBe(222);
    expect(bbox.maxY).toBe(222);
    expect(bbox.originalHeight).toBe(200);
    expect(bbox.originalWidth).toBe(200);
  });

  test('should return correct bbox when scroll bar exist(large dataset)', () => {
    const facet = getMockFacet(2000, 2000);
    const bbox = new PanelBBox(facet, true);

    expect(bbox.width).toBe(578);
    expect(bbox.height).toBe(573);
    expect(bbox.viewportWidth).toBe(578);
    expect(bbox.viewportHeight).toBe(573);
    expect(bbox.maxX).toBe(600);
    expect(bbox.maxY).toBe(595);
    expect(bbox.originalHeight).toBe(2000);
    expect(bbox.originalWidth).toBe(2000);
  });

  test('should return full viewport when frozen trailing col and row', () => {
    const facet = getMockFacet(200, 200, {
      frozen: {
        trailingColCount: 2,
        trailingRowCount: 2,
      },
    });

    const bbox = new PanelBBox(facet, true);

    expect(bbox.width).toBe(578);
    expect(bbox.height).toBe(573);
    expect(bbox.viewportWidth).toBe(578);
    expect(bbox.viewportHeight).toBe(573);
    expect(bbox.maxX).toBe(600);
    expect(bbox.maxY).toBe(595);
    expect(bbox.originalHeight).toBe(200);
    expect(bbox.originalWidth).toBe(200);
  });

  test('should return correct viewport when disable frozen trailing col and row', () => {
    const facet = getMockFacet(
      200,
      200,
      {
        frozen: {
          trailingColCount: 2,
          trailingRowCount: 2,
        },
      },
      false,
    );

    const bbox = new PanelBBox(facet, true);

    expect(bbox.width).toBe(578);
    expect(bbox.height).toBe(573);
    expect(bbox.viewportWidth).toBe(200);
    expect(bbox.viewportHeight).toBe(200);
    expect(bbox.maxX).toBe(222);
    expect(bbox.maxY).toBe(222);
    expect(bbox.originalHeight).toBe(200);
    expect(bbox.originalWidth).toBe(200);
  });
});
