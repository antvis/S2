import { ThemeCfg } from 'src/common';
import { BaseFacet } from 'src/facet/base-facet';
import { PanelBBox } from 'src/facet/bbox/panelBBox';

describe('PanelBBox test', () => {
  const getMockFacet = (
    realWidth: number,
    realHeight: number,
    extraOptions = {},
  ) => {
    return {
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
        isScrollContainsRowHeader() {
          return false;
        },
        theme: {
          scrollBar: {
            size: 5,
          },
        } as ThemeCfg,
        options: {
          width: 600,
          height: 600,
          ...extraOptions,
        },
      },
    } as BaseFacet;
  };

  test('should return correct bbox when no scroll bar exist(small dataset)', () => {
    const facet = getMockFacet(200, 200);
    const bbox = new PanelBBox(facet, true);

    expect(bbox.width).toBe(580);
    expect(bbox.height).toBe(575);
    expect(bbox.viewportWidth).toBe(200);
    expect(bbox.viewportHeight).toBe(200);
    expect(bbox.maxX).toBe(220);
    expect(bbox.maxY).toBe(220);
    expect(bbox.originalHeight).toBe(200);
    expect(bbox.originalWidth).toBe(200);
  });

  test('should return correct bbox when scroll bar exist(large dataset)', () => {
    const facet = getMockFacet(2000, 2000);
    const bbox = new PanelBBox(facet, true);

    expect(bbox.width).toBe(580);
    expect(bbox.height).toBe(575);
    expect(bbox.viewportWidth).toBe(580);
    expect(bbox.viewportHeight).toBe(575);
    expect(bbox.maxX).toBe(600);
    expect(bbox.maxY).toBe(595);
    expect(bbox.originalHeight).toBe(2000);
    expect(bbox.originalWidth).toBe(2000);
  });

  test('should return full viewport when frozen trailing col and row', () => {
    const facet = getMockFacet(200, 200, {
      frozenTrailingColCount: 2,
      frozenTrailingRowCount: 2,
    });

    const bbox = new PanelBBox(facet, true);
    expect(bbox.width).toBe(580);
    expect(bbox.height).toBe(575);
    expect(bbox.viewportWidth).toBe(580);
    expect(bbox.viewportHeight).toBe(575);
    expect(bbox.maxX).toBe(600);
    expect(bbox.maxY).toBe(595);
    expect(bbox.originalHeight).toBe(200);
    expect(bbox.originalWidth).toBe(200);
  });
});
