/* eslint-disable jest/expect-expect */
import { getContainer } from 'tests/util/helpers';
import { range } from 'lodash';
import {
  PivotSheet,
  TableSheet,
  EXTRA_FIELD,
  type SpreadSheet,
  type TableFacet,
} from '../../src';
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

  const matchCellStyleSnapshot = (cb?: (cells: S2CellType[]) => void) => {
    getCells().forEach((cells) => {
      expect(mapCells(cells)).toMatchSnapshot();
      cb?.(cells);
    });
  };

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
      // s2.destroy();
    });

    test('should default render one line text', () => {
      matchCellStyleSnapshot();
      expectColHierarchyHeight(90);
    });

    test('should render two max text lines', async () => {
      updateStyle(2);
      await s2.render(false);

      matchCellStyleSnapshot();
      expectColHierarchyHeight(118, 80, 38);
    });

    test('should render three max text lines', async () => {
      updateStyle(3);
      await s2.render(false);

      matchCellStyleSnapshot();
      expectColHierarchyHeight(165, 112, 53);
    });

    test('should render custom text overflow text', async () => {
      const cellStyle: CellTextWordWrapStyle = {
        textOverflow: '@@@',
        maxLines: 1,
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
      await s2.render(false);

      matchCellStyleSnapshot();
      expectColHierarchyHeight(90);
    });

    test('should not render word wrap text', async () => {
      const cellStyle: CellTextWordWrapStyle = {
        wordWrap: false,
        maxLines: 2,
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
      await s2.render(false);

      matchCellStyleSnapshot((cells) => {
        // wordWrap 关闭时, 不会渲染省略号
        cells.forEach((cell) => {
          expect(cell.getActualText()).not.toContain('...');
        });
      });
      expectColHierarchyHeight(90);
    });

    test('should not adaptive adjust cell height if custom cell style less than actual text height by rowCell.height', async () => {
      updateStyle(2);

      s2.setOptions({
        style: {
          rowCell: {
            height: 20,
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style less than actual text height by rowCell.height()', async () => {
      updateStyle(2);

      s2.setOptions({
        style: {
          rowCell: {
            height: () => 20,
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style more than actual text height by rowCell.heightByField', async () => {
      updateStyle(2);

      s2.setOptions({
        style: {
          rowCell: {
            heightByField: {
              city: 35,
              'root[&]四川省[&]成都市': 50,
            },
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style less than actual text height by colCell.height', async () => {
      updateStyle(2);

      s2.setOptions({
        style: {
          colCell: {
            height: 20,
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style less than actual text height by colCell.height()', async () => {
      updateStyle(2);

      s2.setOptions({
        style: {
          colCell: {
            height: () => 20,
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style more than actual text height by colCell.heightByField', async () => {
      updateStyle(4);

      s2.setOptions({
        style: {
          colCell: {
            heightByField: {
              type: 50,
              sub_type: 40,
              [EXTRA_FIELD]: 120,
            },
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style less than actual text height by dataCell.height', async () => {
      updateStyle(2);

      s2.setOptions({
        style: {
          dataCell: {
            height: 20,
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
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

      expectColHierarchyHeight(149, 96, 53);
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

      matchCellStyleSnapshot();
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

      matchCellStyleSnapshot();

      // 省份 4行文本, 叶子节点 (城市) 3行文本, 省份应该和城市高度一致, 才能展示所有文本 (maxLines: 4)
      expectRowHierarchyHeight(384, 0, 72);
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

      matchCellStyleSnapshot();
      expect(s2.facet.getLayoutResult().rowsHierarchy.height).toEqual(524);
    });

    // https://github.com/antvis/S2/issues/2678
    test('should get correctly row cell height priority if actual text not wrap', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            heightByField: {
              'root[&]浙江省[&]宁波市': 20,
              'root[&]浙江省[&]舟山市': 60,
              'root[&]浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省浙江省[&]杭州市杭州市杭州市杭州市杭州市杭州市杭州市杭州市杭州市杭州市': 20,
              'root[&]四川省[&]成都市': 100,
            },
          },
        },
      });
      s2.changeSheetSize(800, 600);
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should get correctly col cell height priority if actual text not wrap', async () => {
      updateStyle(3);

      // 清空多行文本
      s2.setDataCfg({ meta: [], data: s2.dataCfg.data.slice(3) });
      s2.setOptions({
        style: {
          colCell: {
            heightByField: {
              type: 20,
              sub_type: 20,
              [EXTRA_FIELD]: 20,
            },
          },
        },
      });
      s2.changeSheetSize(800, 600);
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should use actual text height for large max line', async () => {
      // 设置 20 行文本, 应该以实际的文本自适应高度
      updateStyle(20);

      s2.changeSheetSize(800, 600);
      await s2.render();

      matchCellStyleSnapshot();
      expect(s2.facet.getLayoutResult().rowsHierarchy.height).toEqual(328);
    });

    test.each(range(1, 11))(
      'should always render default cell height when set %s line, but actual text not wrap',
      async (maxLines) => {
        updateStyle(maxLines);

        s2.changeSheetSize(800, 600);
        s2.setDataCfg(SimpleDataCfg);
        await s2.render();

        // 不管设置了多少行的文本, 如果实际文本未换行, 高度不应该自适应, 以默认高度为准.
        expectColHierarchyHeight(60, 30, 30, 2);
        expectRowHierarchyHeight(60, 0, 30, 2);
      },
    );
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
      // s2.destroy();
    });

    test('should default render one line text', () => {
      matchCellStyleSnapshot();
      expectColHierarchyHeight(30, 0, 30, 1);
    });

    test('should render two max text lines', async () => {
      updateStyle(2);
      await s2.render(false);

      matchCellStyleSnapshot();
      expectColHierarchyHeight(40, 0, 40, 1);
    });

    test('should render three max text lines', async () => {
      updateStyle(3);
      await s2.render(false);

      matchCellStyleSnapshot();

      expectColHierarchyHeight(56, 0, 56, 1);
    });

    test('should render custom text overflow text', async () => {
      const cellStyle: CellTextWordWrapStyle = {
        textOverflow: '@@@',
        maxLines: 1,
      };

      s2.setOptions({
        style: {
          seriesNumberCell: cellStyle,
          colCell: cellStyle,
          dataCell: cellStyle,
        },
      });
      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not render word wrap text', async () => {
      const cellStyle: CellTextWordWrapStyle = {
        wordWrap: false,
        maxLines: 2,
      };

      s2.setOptions({
        style: {
          seriesNumberCell: cellStyle,
          colCell: cellStyle,
          dataCell: cellStyle,
        },
      });
      await s2.render(false);

      matchCellStyleSnapshot((cells) => {
        // wordWrap 关闭时, 不会渲染省略号
        cells.forEach((cell) => {
          expect(cell.getActualText()).not.toContain('...');
        });
      });
    });

    test('should not force adaptive adjust cell height if custom cell style less than actual text height by colCell.height', async () => {
      s2.setOptions({
        style: {
          colCell: {
            height: 20,
          },
        },
      });

      updateStyle(2);
      await s2.render(false);

      matchCellStyleSnapshot();
      expectColHierarchyHeight(20, 0, 20, 1);
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

      matchCellStyleSnapshot();
      expectColHierarchyHeight(72, 0, 72, 1);
    });

    // https://github.com/antvis/S2/issues/2594
    test('should calc correctly data cell height if actual text lines is difference', async () => {
      updateStyle(4);

      await s2.render();

      matchCellStyleSnapshot();

      const rowDataCells = s2.facet
        .getDataCells()
        .filter((cell) => cell.getMeta().rowIndex === 1);

      expect(
        rowDataCells.every((cell) => cell.getMeta().height === 76),
      ).toBeTruthy();
    });

    test('should calc correctly data cell height if actual text lines is difference and partial outside the canvas', async () => {
      updateStyle(4);
      s2.setOptions({
        style: {
          rowCell: {
            // 让第二行部分超出屏幕
            heightByField: {
              0: 300,
            },
          },
        },
      });

      await s2.render();

      matchCellStyleSnapshot();
      expect((s2.facet as unknown as TableFacet).rowOffsets).toMatchSnapshot();
    });

    test('should calc correctly data cell height if actual text lines is difference and outside the canvas', async () => {
      updateStyle(4);
      s2.setOptions({
        style: {
          rowCell: {
            // 让第二行超出屏幕
            heightByField: {
              0: 360,
            },
          },
        },
      });

      await s2.render();

      matchCellStyleSnapshot();
      expect((s2.facet as unknown as TableFacet).rowOffsets).toMatchSnapshot();
    });

    test('should not force adaptive adjust row height if custom cell style less than actual text height by rowCell.heightByField', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            heightByField: {
              1: 20,
              4: 100,
            },
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should not force adaptive adjust row height if custom cell style less than actual text height by rowCell.height', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            height: 20,
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should not force adaptive adjust row height if custom cell style more than actual text height by rowCell.heightByField', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            heightByField: {
              0: 100,
              1: 100,
            },
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should not force adaptive adjust row height if custom cell style more than actual text height by rowCell.height', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            height: 100,
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    // https://github.com/antvis/S2/issues/2613
    test('should get correctly cell height priority if actual text not wrap', async () => {
      updateStyle(3);

      // 清空多行文本
      s2.setDataCfg({ meta: [], data: s2.dataCfg.data.slice(3) });
      s2.setOptions({
        style: {
          colCell: {
            height: 20,
          },
          rowCell: {
            heightByField: {
              1: 20,
              4: 100,
            },
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should get correctly cell height priority if actual text wrap', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          colCell: {
            height: 70,
          },
          rowCell: {
            heightByField: {
              0: 70,
              1: 100,
            },
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust data cell height if custom cell style more than actual text height by dataCell.height', async () => {
      s2.setOptions({
        style: {
          dataCell: {
            height: 100,
          },
        },
      });

      updateStyle(2);
      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust data cell height if custom cell style less than actual text height by dataCell.height', async () => {
      s2.setOptions({
        style: {
          dataCell: {
            height: 20,
          },
        },
      });

      updateStyle(2);
      await s2.render(false);

      matchCellStyleSnapshot();
    });

    test('should force adaptive adjust row height if custom cell style more than actual text height by rowCell.height', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            height: null,
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should force adaptive adjust row height if custom cell style more than actual text height by rowCell.heightByField', async () => {
      updateStyle(3);

      s2.setOptions({
        style: {
          rowCell: {
            heightByField: null,
          },
        },
      });
      await s2.render();

      matchCellStyleSnapshot();
    });

    test('should not adaptive adjust cell height if custom cell style more than actual text height by colCell.heightByField', async () => {
      updateStyle(4);

      s2.setOptions({
        style: {
          colCell: {
            height: 100,
            heightByField: {
              type: 50,
            },
          },
        },
      });

      await s2.render(false);

      matchCellStyleSnapshot();
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

      matchCellStyleSnapshot();

      const rowDataCells = s2.facet
        .getDataCells()
        .filter((cell) => cell.getMeta().rowIndex === 0);

      expect(
        rowDataCells.every((cell) => cell.getMeta().height === 46),
      ).toBeTruthy();
    });

    test('should use actual text height for large max line', async () => {
      updateStyle(20);

      s2.changeSheetSize(800, 600);
      await s2.render();

      matchCellStyleSnapshot();
      expect(s2.facet.getLayoutResult().colsHierarchy.height).toEqual(56);
    });

    test.each(range(1, 11))(
      'should always render default cell height when set %s line, but actual text not wrap',
      async (maxLines) => {
        updateStyle(maxLines);

        s2.setDataCfg(
          {
            ...SimpleDataCfg,
            fields: {
              rows: [],
              columns: ['province', 'city', 'type', 'price', 'cost'],
              values: [],
            },
          },
          true,
        );
        await s2.render();

        expectColHierarchyHeight(30, 0, 30, 1);
      },
    );
  });
});
