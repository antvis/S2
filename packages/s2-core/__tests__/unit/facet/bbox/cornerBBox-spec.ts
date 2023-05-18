import type { BaseFacet } from '@/facet/base-facet';
import { CornerBBox } from '@/facet/bbox/cornerBBox';

describe('cornerBBox test', () => {
  let mockFacet: BaseFacet;

  beforeEach(() => {
    mockFacet = {
      layoutResult: {
        rowsHierarchy: {
          height: 100,
          width: 100,
        },
        colsHierarchy: {
          height: 100,
          width: 100,
          sampleNodeForLastLevel: true,
        },
      },
      getLayoutResult() {
        return mockFacet.layoutResult;
      },
      getSeriesNumberWidth() {
        return 80;
      },
      spreadsheet: {
        isFrozenRowHeader() {
          return true;
        },
        options: {
          width: 400,
          frozen: {
            rowHeader: true,
          },
          style: {
            colCell: {
              hideValue: false,
            },
          },
        },
      },
    } as unknown as BaseFacet;
  });

  test('should return original width when scroll contains row header', () => {
    mockFacet.spreadsheet.isFrozenRowHeader = () => false;

    const bbox = new CornerBBox(mockFacet, true);

    expect(bbox.height).toEqual(100);
    expect(bbox.width).toEqual(180);
  });

  test('should return correct width when original width is under the limit and freeze row header', () => {
    const bbox = new CornerBBox(mockFacet, true);

    expect(bbox.width).toEqual(180);
  });

  test('should return correct width when original width is reach the limit and freeze row header', () => {
    mockFacet.layoutResult.rowsHierarchy.width = 200;

    const bbox = new CornerBBox(mockFacet, true);

    expect(bbox.width).toEqual(280);
    expect(bbox.originalWidth).toEqual(280);
  });

  test('should return correct width when original width is reach the limit and freeze row header, but cols is short', () => {
    mockFacet.layoutResult.rowsHierarchy.width = 200;
    mockFacet.layoutResult.colsHierarchy.width = 120;

    const bbox = new CornerBBox(mockFacet, true);

    expect(bbox.width).toEqual(280);
    expect(bbox.originalWidth).toEqual(280);
  });

  test('should return correct width when original width is reach the limit and freeze row header, but cols is long', () => {
    mockFacet.layoutResult.rowsHierarchy.width = 200;
    mockFacet.layoutResult.colsHierarchy.width = 200;

    const bbox = new CornerBBox(mockFacet, true);

    expect(bbox.width).toEqual(200);
    expect(bbox.originalWidth).toEqual(280);
  });

  test('should use default column height when columns is empty', () => {
    mockFacet.spreadsheet.options.style!.colCell!.height = 20;
    mockFacet.layoutResult.colsHierarchy.sampleNodeForLastLevel = null;

    const bbox = new CornerBBox(mockFacet, true);

    expect(bbox.height).toEqual(20);
  });
});
