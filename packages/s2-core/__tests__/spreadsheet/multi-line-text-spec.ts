/* eslint-disable jest/expect-expect */
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, TableSheet, type SpreadSheet } from '../../src';
import type { DefaultCellTheme, S2CellType, S2Options } from '../../src/common';
import {
  PivotSheetMultiLineTextDataCfg,
  TableSheetMultiLineTextDataCfg,
} from '../data/data-multi-line-text';
import SimpleDataCfg from '../data/simple-data.json';

describe('SpreadSheet Multi Line Text Tests', () => {
  let s2: SpreadSheet;

  const mapCells = (cells: S2CellType[]) => {
    return cells.map((cell) => {
      const meta = cell.getMeta();

      return {
        actualText: cell.getActualText(),
        originalText: cell.getOriginalText(),
        actualTextWidth: Math.floor(cell.getMultiLineActualTextWidth()),
        actualTextHeight: Math.floor(cell.getMultiLineActualTextHeight()),
        multiLineActualTexts: cell.getMultiLineActualTexts(),
        width: meta.width,
        height: meta.height,
      };
    });
  };

  const updateTheme = (maxLines: number) => {
    const cellTheme: DefaultCellTheme = {
      text: {
        maxLines,
      },
      bolderText: {
        maxLines,
      },
      measureText: {
        maxLines,
      },
    };

    s2.setTheme({
      seriesNumberCell: cellTheme,
      colCell: cellTheme,
      cornerCell: cellTheme,
      rowCell: cellTheme,
      dataCell: cellTheme,
    });
  };

  const expectHierarchyHeight = (
    height: number,
    lastLevelY: number = 60,
    lastLevelHeight: number = 30,
    sampleNodesForAllLevelsTotals = 3,
  ) => {
    const { colsHierarchy } = s2.facet.getLayoutResult();

    expect(colsHierarchy.height).toEqual(height);
    expect(colsHierarchy.sampleNodesForAllLevels).toHaveLength(
      sampleNodesForAllLevelsTotals,
    );
    expect(colsHierarchy.sampleNodeForLastLevel?.y).toEqual(lastLevelY);
    expect(colsHierarchy.sampleNodeForLastLevel?.height).toEqual(
      lastLevelHeight,
    );
  };

  const setupTotalsOptions = (showGrandTotals = true, showSubTotals = true) => {
    s2.setOptions({
      totals: {
        col: {
          showGrandTotals,
          showSubTotals,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['type'],
        },
        row: {
          showGrandTotals,
          showSubTotals,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
        },
      },
    });

    s2.changeSheetSize(600, 400);
  };

  const getCells = () => [
    s2.facet.getCornerCells(),
    s2.facet.getSeriesNumberCells(),
    s2.facet.getColCells(),
    s2.facet.getRowCells(),
    s2.facet.getDataCells(),
  ];

  describe('PivotSheet', () => {
    const s2Options: S2Options = {
      width: 300,
      height: 400,
      showSeriesNumber: true,
    };

    beforeEach(async () => {
      s2 = new PivotSheet(
        getContainer(),
        PivotSheetMultiLineTextDataCfg,
        s2Options,
      );
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should default render one line text', () => {
      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(90);
    });

    test('should custom two max text lines', async () => {
      updateTheme(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(118, 80, 38);
    });

    test('should custom three max text lines', async () => {
      updateTheme(3);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      expectHierarchyHeight(165, 112, 53);
    });

    test('should render custom text overflow text', async () => {
      const cellTheme: DefaultCellTheme = {
        text: {
          textOverflow: '@@@',
          maxLines: 1,
        },
        bolderText: {
          textOverflow: '我是省略号',
          maxLines: 1,
        },
        measureText: {
          textOverflow: '😸',
          maxLines: 1,
        },
      };

      s2.setTheme({
        seriesNumberCell: cellTheme,
        colCell: cellTheme,
        cornerCell: cellTheme,
        rowCell: cellTheme,
        dataCell: cellTheme,
      });
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(90);
    });

    test('should not render word wrap text', async () => {
      const cellTheme: DefaultCellTheme = {
        text: {
          wordWrap: false,
        },
        bolderText: {
          wordWrap: false,
        },
        measureText: {
          wordWrap: false,
        },
      };

      s2.setTheme({
        seriesNumberCell: cellTheme,
        colCell: cellTheme,
        cornerCell: cellTheme,
        rowCell: cellTheme,
        dataCell: cellTheme,
      });
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();

        // wordWrap 关闭时, 不会渲染省略号
        cells.forEach((cell) => {
          expect(cell.getActualText()).not.toContain('...');
        });
      });
      expectHierarchyHeight(90);
    });

    test('should force adaptive adjust cell height if custom cell style less than actual text height', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            height: 20,
            heightByField: {
              city: 10,
            },
          },
          colCell: {
            height: 20,
          },
          dataCell: {
            height: 20,
          },
        },
      });

      updateTheme(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(118, 80, 38);
    });

    test('should not adaptive adjust cell height if custom cell style more than actual text height', async () => {
      const CUSTOM_CELL_HEIGHT = 70;

      s2.setOptions({
        style: {
          rowCell: {
            height: CUSTOM_CELL_HEIGHT,
          },
          colCell: {
            height: CUSTOM_CELL_HEIGHT,
          },
          dataCell: {
            height: CUSTOM_CELL_HEIGHT,
          },
        },
      });

      updateTheme(2);
      await s2.render(false);

      [
        s2.facet.getCornerCells(),
        s2.facet.getColLeafCells(),
        s2.facet.getRowLeafCells(),
        s2.facet.getDataCells(),
      ].forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();

        cells.forEach((cell) => {
          expect(cell.getMeta().height).toEqual(CUSTOM_CELL_HEIGHT);
        });
      });

      expectHierarchyHeight(210, 140, 70);
    });

    test('should render correctly layout if enable totals', async () => {
      setupTotalsOptions();
      await s2.render(false);

      expectHierarchyHeight(90, 60, 30);
    });

    test('should render correctly layout if enable totals for multiple text lines', async () => {
      setupTotalsOptions();
      updateTheme(3);
      await s2.render(false);

      expectHierarchyHeight(165, 112, 53);
    });

    test('should render correctly layout if only enable grand totals', async () => {
      setupTotalsOptions(true, false);
      await s2.render(false);

      expectHierarchyHeight(90, 60, 30);
    });

    test('should render correctly layout if only enable sub totals', async () => {
      setupTotalsOptions(false, true);
      await s2.render(false);

      expectHierarchyHeight(90, 60, 30);
    });

    test('should not adaptive adjust cell height if hidden col cell', async () => {
      s2.setOptions({
        style: {
          colCell: {
            height: 0,
          },
        },
      });

      updateTheme(1);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(0, 0, 0);
    });
  });

  describe('TableSheet', () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      showSeriesNumber: true,
    };

    beforeEach(async () => {
      s2 = new TableSheet(
        getContainer(),
        TableSheetMultiLineTextDataCfg,
        s2Options,
      );
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should default render one line text', () => {
      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(30, 0, 30, 1);
    });

    test('should custom two max text lines', async () => {
      updateTheme(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(40, 0, 40, 1);
    });

    test('should custom three max text lines', async () => {
      updateTheme(3);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      expectHierarchyHeight(56, 0, 56, 1);
    });

    test('should force adaptive adjust cell height if custom cell style less than actual text height', async () => {
      s2.setOptions({
        style: {
          colCell: {
            height: 20,
          },
          dataCell: {
            height: 20,
          },
        },
      });

      updateTheme(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectHierarchyHeight(40, 0, 40, 1);
    });

    test('should not adaptive adjust cell height if custom cell style more than actual text height', async () => {
      const CUSTOM_CELL_HEIGHT = 70;

      s2.setOptions({
        style: {
          colCell: {
            height: CUSTOM_CELL_HEIGHT,
          },
        },
      });

      updateTheme(2);
      await s2.render(false);

      [s2.facet.getColLeafCells()].forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();

        cells.forEach((cell) => {
          expect(cell.getMeta().height).toEqual(CUSTOM_CELL_HEIGHT);
        });
      });

      expectHierarchyHeight(70, 0, 70, 1);
    });

    test.skip.each([1, 2, 3, 4, 5])(
      'should always render default cell height when set %s line, but actual text not wrap',
      async (maxLines) => {
        updateTheme(maxLines);

        s2.setDataCfg(SimpleDataCfg);
        await s2.render();

        expectHierarchyHeight(30, 0, 30, 1);
      },
    );
  });
});
