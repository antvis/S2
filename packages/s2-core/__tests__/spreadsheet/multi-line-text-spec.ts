/* eslint-disable jest/expect-expect */
import { getContainer } from 'tests/util/helpers';
import { range } from 'lodash';
import { PivotSheet, TableSheet, type SpreadSheet } from '../../src';
import type {
  CellTextWordWrapStyle,
  S2CellType,
  S2Options,
} from '../../src/common';
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

  const updateStyle = (maxLines: number) => {
    const cellStyle: CellTextWordWrapStyle = {
      maxLines,
    };

    s2.setOptions({
      style: {
        seriesNumberCell: cellStyle,
        colCell: cellStyle,
        cornerCell: cellStyle,
        rowCell: cellStyle,
        dataCell: cellStyle,
      },
    });
  };

  const expectRowHierarchyHeight = (
    height: number,
    lastLevelY: number = 0,
    lastLevelHeight: number = 30,
    sampleNodesForAllLevelsTotals = 2,
  ) => {
    const { rowsHierarchy } = s2.facet.getLayoutResult();

    expect(rowsHierarchy.height).toEqual(height);
    expect(rowsHierarchy.sampleNodesForAllLevels).toHaveLength(
      sampleNodesForAllLevelsTotals,
    );
    expect(rowsHierarchy.sampleNodeForLastLevel?.y).toEqual(lastLevelY);
    expect(rowsHierarchy.sampleNodeForLastLevel?.height).toEqual(
      lastLevelHeight,
    );
  };

  const expectColHierarchyHeight = (
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
      seriesNumber: {
        enable: true,
      },
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
      expectColHierarchyHeight(90);
    });

    test('should render two max text lines', async () => {
      updateStyle(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectColHierarchyHeight(118, 80, 38);
    });

    test('should render three max text lines', async () => {
      updateStyle(3);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      expectColHierarchyHeight(165, 112, 53);
    });

    test('should render custom text overflow text', async () => {
      const cellTheme: CellTextWordWrapStyle = {
        textOverflow: '@@@',
        maxLines: 1,
      };

      s2.setOptions({
        style: {
          seriesNumberCell: cellTheme,
          colCell: cellTheme,
          cornerCell: cellTheme,
          rowCell: cellTheme,
          dataCell: cellTheme,
        },
      });
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectColHierarchyHeight(90);
    });

    test('should not render word wrap text', async () => {
      const cellTheme: CellTextWordWrapStyle = {
        wordWrap: false,
      };

      s2.setOptions({
        style: {
          seriesNumberCell: cellTheme,
          colCell: cellTheme,
          cornerCell: cellTheme,
          rowCell: cellTheme,
          dataCell: cellTheme,
        },
      });
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();

        // wordWrap 关闭时, 不会渲染省略号
        cells.forEach((cell) => {
          expect(cell.getActualText()).not.toContain('...');
        });
      });
      expectColHierarchyHeight(90);
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

      updateStyle(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectColHierarchyHeight(118, 80, 38);
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

      updateStyle(2);
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

      expectColHierarchyHeight(210, 140, 70);
    });

    test('should render correctly layout if enable totals', async () => {
      setupTotalsOptions();
      await s2.render(false);

      expectColHierarchyHeight(90, 60, 30);
    });

    test('should render correctly layout if enable totals for multiple text lines', async () => {
      setupTotalsOptions();
      updateStyle(3);
      await s2.render(false);

      expectColHierarchyHeight(165, 112, 53);
    });

    test('should render correctly layout if only enable grand totals', async () => {
      setupTotalsOptions(true, false);
      await s2.render(false);

      expectColHierarchyHeight(90, 60, 30);
    });

    test('should render correctly layout if only enable sub totals', async () => {
      setupTotalsOptions(false, true);
      await s2.render(false);

      expectColHierarchyHeight(90, 60, 30);
    });

    test('should not adaptive adjust cell height if hidden col cell', async () => {
      s2.setOptions({
        style: {
          colCell: {
            height: 0,
          },
        },
      });

      updateStyle(1);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectColHierarchyHeight(0, 0, 0);
    });

    // https://github.com/antvis/S2/issues/2594
    test('should calc correctly row cell height if actual text lines is difference', async () => {
      updateStyle(4);
      s2.changeSheetSize(800, 600);
      s2.setDataCfg({
        data: [
          {
            province:
              '浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江',
            city: '杭州杭州杭州杭州',
            type: '纸张纸张纸张纸张纸张',
            price: 2,
            cost: 20,
          },
          ...s2.dataCfg.data,
        ],
      });

      await s2.render();

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      // 省份 4行文本, 叶子节点 (城市) 3行文本, 省份应该和城市高度一致, 才能展示所有文本 (maxLines: 4)
      expectRowHierarchyHeight(568, 0, 72);
      expectColHierarchyHeight(212, 144, 68);
    });

    test('should render three max text lines for tree mode', async () => {
      updateStyle(3);
      s2.setOptions({
        hierarchyType: 'tree',
        style: {
          rowCell: {
            width: 100,
          },
        },
      });
      s2.changeSheetSize(800, 600);
      s2.setDataCfg({
        data: [
          {
            province:
              '浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江',
            city: '杭州杭州杭州杭州',
            type: '纸张纸张纸张纸张纸张',
            price: 2,
            cost: 20,
          },
          ...s2.dataCfg.data,
        ],
      });
      await s2.render();

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      expect(s2.facet.getLayoutResult().rowsHierarchy.height).toEqual(760);
    });
  });

  describe('TableSheet', () => {
    const s2Options: S2Options = {
      width: 600,
      height: 400,
      seriesNumber: {
        enable: true,
      },
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
      expectColHierarchyHeight(30, 0, 30, 1);
    });

    test('should render two max text lines', async () => {
      updateStyle(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectColHierarchyHeight(40, 0, 40, 1);
    });

    test('should render three max text lines', async () => {
      updateStyle(3);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      expectColHierarchyHeight(56, 0, 56, 1);
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

      updateStyle(2);
      await s2.render(false);

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });
      expectColHierarchyHeight(40, 0, 40, 1);
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

      updateStyle(2);
      await s2.render(false);

      [s2.facet.getColLeafCells()].forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();

        cells.forEach((cell) => {
          expect(cell.getMeta().height).toEqual(CUSTOM_CELL_HEIGHT);
        });
      });

      expectColHierarchyHeight(70, 0, 70, 1);
    });

    test('should calc correctly col cell height if actual text lines is difference', async () => {
      updateStyle(4);
      s2.setDataCfg({
        meta: [
          {
            field: 'province',
            name: '省份'.repeat(20),
          },
        ],
      });

      await s2.render();

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      expectColHierarchyHeight(72, 0, 72, 1);
    });

    // https://github.com/antvis/S2/issues/2594
    test('should calc correctly data cell height if actual text lines is difference', async () => {
      updateStyle(4);

      await s2.render();

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      const rowDataCells = s2.facet
        .getDataCells()
        .filter((cell) => cell.getMeta().rowIndex === 1);

      expect(
        rowDataCells.every((cell) => cell.getMeta().height === 76),
      ).toBeTruthy();
    });

    test('should force adaptive adjust row height if custom cell style less than actual text height', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            heightByField: {
              1: 20,
            },
          },
        },
      });
      await s2.render();

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      const rowDataCells = s2.facet
        .getDataCells()
        .filter((cell) => cell.getMeta().rowIndex === 1);

      expect(
        rowDataCells.every((cell) => cell.getMeta().height === 61),
      ).toBeTruthy();
    });

    test('should calc correctly row cell height if actual text lines is difference', async () => {
      updateStyle(4);
      s2.changeSheetSize(800, 600);
      s2.setDataCfg({
        data: [
          {
            province: '浙江浙江浙江浙江浙江浙江浙江浙江浙江浙江',
            city: '杭州杭州杭州杭州',
            type: '纸张纸张纸张纸张纸张',
            price: 2,
            cost: 20,
          },
          ...s2.dataCfg.data,
        ],
      });

      await s2.render();

      getCells().forEach((cells) => {
        expect(mapCells(cells)).toMatchSnapshot();
      });

      const rowDataCells = s2.facet
        .getDataCells()
        .filter((cell) => cell.getMeta().rowIndex === 0);

      expect(
        rowDataCells.every((cell) => cell.getMeta().height === 46),
      ).toBeTruthy();
    });

    test.skip.each(range(1, 6))(
      'should always render default cell height when set %s line, but actual text not wrap',
      async (maxLines) => {
        updateStyle(maxLines);

        s2.setDataCfg(SimpleDataCfg);
        await s2.render();

        expectColHierarchyHeight(30, 0, 30, 1);
      },
    );
  });
});
