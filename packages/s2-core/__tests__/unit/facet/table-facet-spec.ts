/**
 * table mode pivot test.
 */
import { Canvas } from '@antv/g-canvas';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { merge } from 'lodash';
import { data } from '../../data/mock-dataset.json';
import { SpreadSheet } from '@/sheet-type';
import { TableDataSet } from '@/data-set/table-data-set';
import { TableFacet } from '@/facet/table-facet';
import { Store } from '@/common/store';
import { getTheme } from '@/theme';
import { DEFAULT_STYLE } from '@/index';

jest.mock('src/sheet-type', () => {
  const container = new Canvas({
    width: 100,
    height: 100,
    container: document.body,
  });
  return {
    SpreadSheet: jest.fn().mockImplementation(() => {
      return {
        dataCfg: {
          ...assembleDataCfg(),
        },
        options: assembleOptions(),
        panelScrollGroup: {
          setClip: jest.fn(),
        },
        container,
        theme: getTheme({}),
        panelGroup: container.addGroup(),
        foregroundGroup: container.addGroup(),
        backgroundGroup: container.addGroup(),
        store: new Store(),
        on: jest.fn(),
        isTableMode: jest.fn().mockReturnValue(true),
        isPivotMode: jest.fn(),
        getTotalsConfig: jest.fn(),
        getLayoutWidthType: jest.fn().mockRejectedValue('adaptive'),
        emit: jest.fn(),
        isScrollContainsRowHeader: jest.fn(),
        isHierarchyTreeType: jest.fn(),
      };
    }),
  };
});
jest.mock('src/data-set/table-data-set', () => {
  return {
    TableDataSet: jest.fn().mockImplementation(() => {
      return {
        ...assembleDataCfg(),
        originData: data,
        displayData: data,
        moreThanOneValue: jest.fn(),
        getFieldName: jest.fn(),
        getDimensionValues: jest.fn(),
        getDisplayDataSet: jest.fn(() => data),
        getCellData: () => 1,
      };
    }),
  };
});
const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;
const MockTableDataSet = TableDataSet as any as jest.Mock<TableDataSet>;

describe('Table Mode Facet Test', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  const facet: TableFacet = new TableFacet({
    spreadsheet: ss,
    dataSet: dataSet,
    ...assembleDataCfg().fields,
    ...assembleOptions(),
    ...DEFAULT_STYLE,
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
  });

  describe('should get correct row hierarchy', () => {
    const { rowsHierarchy } = facet.layoutResult;
    test('row hierarchy structure', () => {
      expect(rowsHierarchy.height).toBe(0);
      expect(rowsHierarchy.width).toBe(0);
      expect(rowsHierarchy.getIndexNodes()).toHaveLength(0);
    });
  });
});

describe('Table Mode Facet Test With Adaptive Layout', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  const options = {
    spreadsheet: ss,
    dataSet: dataSet,
    ...assembleDataCfg().fields,
    ...assembleOptions({}),
    ...DEFAULT_STYLE,
    layoutWidthType: 'adaptive',
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
  };

  describe('should get correct col layout', () => {
    const facet: TableFacet = new TableFacet({
      ...options,
      showSeriesNumber: false,
    });
    const { colCfg, cellCfg } = facet.cfg;

    test('col hierarchy coordinate with adaptive layout', () => {
      const { colLeafNodes } = facet.layoutResult;

      const colHeaderColSize = colLeafNodes.length;
      const canvasW = facet.getCanvasHW().width;
      const adaptiveWith = Math.max(
        cellCfg.width,
        canvasW / Math.max(1, colHeaderColSize),
      );

      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(index * adaptiveWith);
        expect(node.width).toBe(adaptiveWith);
        expect(node.height).toBe(colCfg.height);
      });
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    const ss: SpreadSheet = new MockSpreadSheet();
    const dataSet: TableDataSet = new MockTableDataSet(ss);
    const facet = new TableFacet({
      ...options,
      spreadsheet: ss,
      dataSet,
      showSeriesNumber: true,
    });
    const { colCfg, cellCfg } = facet.cfg;

    test('col hierarchy coordinate with adaptive layout', () => {
      const { colLeafNodes } = facet.layoutResult;

      const seriesNumberWidth = facet.getSeriesNumberWidth();
      const colHeaderColSize = colLeafNodes.length - 1;
      const canvasW = facet.getCanvasHW().width - seriesNumberWidth;
      const adaptiveWith = Math.max(
        cellCfg.width,
        canvasW / Math.max(1, colHeaderColSize),
      );

      const seriesNumberNode = colLeafNodes[0];
      expect(seriesNumberNode.y).toBe(0);
      expect(seriesNumberNode.x).toBe(0);
      expect(seriesNumberNode.width).toBe(seriesNumberWidth);
      expect(seriesNumberNode.height).toBe(colCfg.height);
      colLeafNodes.slice(1).forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(index * adaptiveWith + seriesNumberWidth);
        expect(node.width).toBe(adaptiveWith);
        expect(node.height).toBe(colCfg.height);
      });
    });
  });
});

describe('Table Mode Facet Test With Compact Layout', () => {
  describe('should get correct col layout', () => {
    const ss: SpreadSheet = new MockSpreadSheet();
    const dataSet: TableDataSet = new MockTableDataSet(ss);
    ss.getLayoutWidthType = () => {
      return 'compact';
    };
    const facet: TableFacet = new TableFacet({
      spreadsheet: ss,
      dataSet: dataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      columns: ['province', 'city', 'type', 'sub_type', 'price'],
    });
    const { colCfg } = facet.cfg;

    test('col hierarchy coordinate with compact layout', () => {
      const { colLeafNodes } = facet.layoutResult;

      const COMPACT_WIDTH = [52, 52, 64, 40, 72.765625];

      let lastX = 0;
      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(lastX);
        expect(node.width).toBe(COMPACT_WIDTH[index]);
        expect(node.height).toBe(colCfg.height);
        lastX += COMPACT_WIDTH[index];
      });
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    const ss: SpreadSheet = new MockSpreadSheet();
    const dataSet: TableDataSet = new MockTableDataSet(ss);
    ss.getLayoutWidthType = () => {
      return 'compact';
    };
    const facet: TableFacet = new TableFacet({
      spreadsheet: ss,
      dataSet: dataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      columns: ['province', 'city', 'type', 'sub_type', 'price'],
      showSeriesNumber: true,
    });
    const { colCfg } = facet.cfg;

    test('col hierarchy coordinate with compact layout', () => {
      const { colLeafNodes } = facet.layoutResult;

      const COMPACT_WIDTH = [80, 52, 52, 64, 40, 72.8];

      let lastX = 0;
      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(lastX);
        expect(node.width.toFixed(1)).toBe(COMPACT_WIDTH[index].toFixed(1));
        expect(node.height).toBe(colCfg.height);
        lastX += COMPACT_WIDTH[index];
      });
    });
  });
});

describe('Table Mode Facet With Frozen Test', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  const facet: TableFacet = new TableFacet({
    spreadsheet: ss,
    dataSet: dataSet,
    ...assembleDataCfg().fields,
    ...assembleOptions({
      frozenTrailingColCount: 2,
      frozenTrailingRowCount: 2,
    }),
    ...DEFAULT_STYLE,
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
  });

  test('should get correct col layout with frozen col', () => {
    const { width } = facet.spreadsheet.options;
    const { frozenTrailingColCount } = facet.cfg;
    const { colLeafNodes } = facet.layoutResult;
    let prevWidth = 0;
    colLeafNodes
      .slice(-frozenTrailingColCount)
      .reverse()
      .forEach((node) => {
        prevWidth += node.width;
        expect(node.x).toBe(width - prevWidth);
      });
  });

  test('should get correct cell layout with frozenTrailingCol', () => {
    const { width } = facet.spreadsheet.options;
    const { frozenTrailingColCount } = facet.cfg;
    const { colLeafNodes, getCellMeta } = facet.layoutResult;

    let prevWidth = 0;
    colLeafNodes
      .slice(-frozenTrailingColCount)
      .reverse()
      .forEach((node, index) => {
        prevWidth += node.width;
        expect(getCellMeta(1, colLeafNodes.length - 1 - index).x).toBe(
          width - prevWidth,
        );
      });
  });

  test('should get correct cell layout with frozenTrailingRow', () => {
    const { frozenTrailingRowCount, cellCfg } = facet.cfg;
    const { getCellMeta } = facet.layoutResult;
    const displayData = dataSet.getDisplayDataSet();
    const panelBBox = facet.panelBBox;
    let prevHeight = 0;
    displayData
      .slice(-frozenTrailingRowCount)
      .reverse()
      .forEach((_, idx) => {
        prevHeight += cellCfg.height;
        expect(getCellMeta(displayData.length - 1 - idx, 1).y).toBe(
          panelBBox.maxY - prevHeight,
        );
      });
  });

  test('should get correct viewCellHeights result', () => {
    const viewCellHeights = facet.getViewCellHeights();
    expect(viewCellHeights.getIndexRange(0, 715)).toStrictEqual({
      start: 0,
      end: 23,
    });
    expect(viewCellHeights.getIndexRange(1110, 1500)).toStrictEqual({
      start: 37,
      end: 49,
    });
    expect(viewCellHeights.getIndexRange(0, 0)).toStrictEqual({
      start: 0,
      end: 0,
    });

    expect(viewCellHeights.getTotalHeight()).toBe(960);
    expect(viewCellHeights.getTotalLength()).toBe(32);
    expect(viewCellHeights.getCellOffsetY(0)).toBe(0);
    expect(viewCellHeights.getCellOffsetY(7)).toBe(210);
  });
});

describe('Table Mode Facet Test With Custom Row Height', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  ss.options = merge({}, assembleOptions(), {
    style: {
      rowCfg: {
        heightByField: {
          '2': 300,
          '3': 200,
          '10': 60,
          '15': 20,
        },
      },
    },
  });
  const facet: TableFacet = new TableFacet({
    spreadsheet: ss,
    dataSet: dataSet,
    ...assembleDataCfg().fields,
    ...merge({}, assembleOptions()),
    ...DEFAULT_STYLE,
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
  });

  test('should get correct rowOffsets when custom row height is set', () => {
    const rowOffsets = facet.rowOffsets;
    expect(rowOffsets).toStrictEqual([
      0, 30, 60, 360, 560, 590, 620, 650, 680, 710, 740, 800, 830, 860, 890,
      920, 940, 970, 1000, 1030, 1060, 1090, 1120, 1150, 1180, 1210, 1240, 1270,
      1300, 1330, 1360, 1390, 1420,
    ]);
  });

  test('should get correct viewCellHeights result when custom row height is set', () => {
    const viewCellHeights = facet.getViewCellHeights();

    expect(viewCellHeights.getIndexRange(0, 715)).toStrictEqual({
      start: 0,
      end: 9,
    });
    expect(viewCellHeights.getIndexRange(1110, 1500)).toStrictEqual({
      start: 21,
      end: 31,
    });

    expect(viewCellHeights.getTotalHeight()).toBe(1420);
    expect(viewCellHeights.getTotalLength()).toBe(32);
    expect(viewCellHeights.getCellOffsetY(0)).toBe(0);
    expect(viewCellHeights.getCellOffsetY(7)).toBe(650);
  });
});

describe('Table Mode Facet Test With Zero Height', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  ss.options = merge({}, assembleOptions(), {
    width: 0,
    height: 0,
  });
  const facet: TableFacet = new TableFacet({
    spreadsheet: ss,
    dataSet: dataSet,
    ...assembleDataCfg().fields,
    ...merge({}, assembleOptions()),
    ...DEFAULT_STYLE,
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
  });

  test('should get correct panelBBox', () => {
    const panelBBox = facet.panelBBox;
    expect(panelBBox.width).toBe(0);
    expect(panelBBox.height).toBe(0);
  });

  test('should get correct initial scroll position', () => {
    const { scrollX, scrollY } = facet.getScrollOffset();
    expect(scrollX).toBe(0);
    expect(scrollY).toBe(0);
  });
});
