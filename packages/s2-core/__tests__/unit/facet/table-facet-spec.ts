/**
 * table mode pivot test.
 */
import { Canvas } from '@antv/g-canvas';
import { get, merge } from 'lodash';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { data } from '../../data/mock-dataset.json';
import { FrozenGroup } from '@/common/constant';
import { Store } from '@/common/store';
import { TableDataSet } from '@/data-set/table-data-set';
import { TableFacet } from '@/facet/table-facet';
import { DataCell, DEFAULT_STYLE, type Fields, Node } from '@/index';
import { getFrozenLeafNodesCount } from '@/facet/utils';
import { SpreadSheet } from '@/sheet-type';
import { getTheme } from '@/theme';

const actualDataSet = jest.requireActual(
  '@/data-set/base-data-set',
).BaseDataSet;

jest.mock('@/sheet-type', () => {
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
        getColumnLeafNodes: jest.fn().mockReturnValue([]),
        isHierarchyTreeType: jest.fn(),
        facet: {
          getFreezeCornerDiffWidth: jest.fn(),
          layoutResult: {
            rowLeafNodes: [],
          },
          getHiddenColumnsInfo: jest.fn(),
        },
        getCanvasElement: () => container.get('el'),
        hideTooltip: jest.fn(),
        interaction: {
          clearHoverTimer: jest.fn(),
        },
        dataSet: {
          isEmpty: jest.fn(),
        },
      };
    }),
  };
});
jest.mock('@/data-set/table-data-set', () => {
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
        getFieldMeta: jest.fn(),
        getFieldFormatter: actualDataSet.prototype.getFieldFormatter,
        isEmpty: jest.fn(),
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
    dataSet,
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

  describe('should get none layer when dataCfg.fields is empty', () => {
    const fields: Fields = {
      rows: [],
      columns: [],
      values: [],
      customTreeItems: [],
      valueInCols: false,
    };
    const container = new Canvas({
      width: 100,
      height: 100,
      container: document.body,
    });
    const spreadsheet = Object.assign({}, ss, {
      dataCfg: { fields },
      panelGroup: container.addGroup(),
      foregroundGroup: container.addGroup(),
      backgroundGroup: container.addGroup(),
      off: jest.fn(),
      on: jest.fn(),
    });
    const mockDataSet = new MockTableDataSet(spreadsheet);
    spreadsheet.dataSet = mockDataSet;

    const newFacet: TableFacet = new TableFacet({
      spreadsheet,
      dataSet: mockDataSet,
      ...fields,
      ...assembleOptions(),
      showSeriesNumber: false,
      dataCell: (fct) => new DataCell(fct, spreadsheet),
    });

    beforeEach(() => {
      newFacet.render();
    });

    afterEach(() => {
      newFacet.destroy();
    });

    test('can not get header after render in table sheet', () => {
      const { rowHeader, cornerHeader, columnHeader, centerFrame } = newFacet;

      expect(rowHeader).toBeFalsy();
      expect(cornerHeader).toBeFalsy();
      expect(columnHeader).toBeFalsy();
      expect(centerFrame).toBeFalsy();
    });

    test('can not get series number after render in table sheet', () => {
      const { backgroundGroup, rowIndexHeader } = newFacet;
      const rect = get(backgroundGroup, 'cfg.children[0]');

      expect(rect).toBeFalsy();
      expect(rowIndexHeader).toBeFalsy();
    });
  });
});

describe('Table Mode Facet Test With Adaptive Layout', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  const options = {
    spreadsheet: ss,
    dataSet,
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
        expect(Math.round(node.width)).toBe(adaptiveWith);
        expect(node.height).toBe(colCfg.height);
      });
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    const s2: SpreadSheet = new MockSpreadSheet();
    const s2DataSet: TableDataSet = new MockTableDataSet(s2);
    const facet = new TableFacet({
      ...options,
      spreadsheet: s2,
      dataSet: s2DataSet,
      showSeriesNumber: true,
    });
    const { colCfg, cellCfg } = facet.cfg;

    test('col hierarchy coordinate with adaptive layout with seriesNumber', () => {
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
    const LABEL_WIDTH = [36, 36, 48, 24, 56]; // 采样的文本宽度
    const ss: SpreadSheet = new MockSpreadSheet();
    const dataSet: TableDataSet = new MockTableDataSet(ss);
    ss.getLayoutWidthType = () => {
      return 'compact';
    };

    const mockMeasureFunc = (text: string | number) => {
      switch (text) {
        case '浙江省':
          return LABEL_WIDTH[0];
        case '杭州市':
          return LABEL_WIDTH[1];
        case '办公用品':
          return LABEL_WIDTH[2];
        case '沙发':
          return LABEL_WIDTH[3];
        case 'undefined':
          return LABEL_WIDTH[4];
        default:
          return 0;
      }
    };
    ss.measureTextWidth =
      mockMeasureFunc as unknown as SpreadSheet['measureTextWidth'];
    ss.measureTextWidthRoughly = mockMeasureFunc;

    const facet: TableFacet = new TableFacet({
      spreadsheet: ss,
      dataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      columns: ['province', 'city', 'type', 'sub_type', 'price'],
    });
    const { colCfg } = facet.cfg;

    test('col hierarchy coordinate with compact layout', () => {
      const { colLeafNodes } = facet.layoutResult;
      const COMPACT_WIDTH = [53, 53, 65, 41, 73];

      let lastX = 0;
      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(lastX);
        expect(Math.floor(node.width)).toEqual(COMPACT_WIDTH[index]);
        expect(node.height).toBe(colCfg.height);
        lastX += COMPACT_WIDTH[index];
      });
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    const LABEL_WIDTH = [36, 36, 48, 24, 56]; // 采样的文本宽度
    const ss: SpreadSheet = new MockSpreadSheet();
    const dataSet: TableDataSet = new MockTableDataSet(ss);
    ss.getLayoutWidthType = () => {
      return 'compact';
    };
    const mockMeasureFunc = (text: string | number) => {
      switch (text) {
        case '浙江省':
          return LABEL_WIDTH[0];
        case '杭州市':
          return LABEL_WIDTH[1];
        case '办公用品':
          return LABEL_WIDTH[2];
        case '沙发':
          return LABEL_WIDTH[3];
        case 'undefined': // seriesnumber & price
          return LABEL_WIDTH[4];
        default:
          return 0;
      }
    };
    ss.measureTextWidth =
      mockMeasureFunc as unknown as SpreadSheet['measureTextWidth'];
    ss.measureTextWidthRoughly = mockMeasureFunc;

    const facet: TableFacet = new TableFacet({
      spreadsheet: ss,
      dataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      columns: ['province', 'city', 'type', 'sub_type', 'price'],
      showSeriesNumber: true,
    });
    const { colCfg } = facet.cfg;

    test('col hierarchy coordinate with compact layout with seriesNumber', () => {
      const { colLeafNodes } = facet.layoutResult;

      const COMPACT_WIDTH = [80, 53, 53, 65, 41, 73];

      let lastX = 0;
      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(lastX);
        expect(Math.floor(node.width)).toBe(COMPACT_WIDTH[index]);
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
    dataSet,
    ...assembleDataCfg().fields,
    ...assembleOptions({
      frozenColCount: 2,
      frozenRowCount: 2,
      frozenTrailingColCount: 2,
      frozenTrailingRowCount: 2,
    }),
    ...DEFAULT_STYLE,
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
  });

  test('should get correct frozenInfo', () => {
    facet.calculateFrozenGroupInfo();
    expect(facet.frozenGroupInfo).toStrictEqual({
      [FrozenGroup.FROZEN_COL]: {
        range: [0, 1],
        width: 240,
      },
      [FrozenGroup.FROZEN_ROW]: {
        height: 60,
        range: [0, 1],
      },
      [FrozenGroup.FROZEN_TRAILING_COL]: {
        range: [3, 4],
        width: 240,
      },
      [FrozenGroup.FROZEN_TRAILING_ROW]: {
        height: 60,
        range: [30, 31],
      },
    });
  });

  test('should get correct xy indexes with frozen', () => {
    expect(facet.calculateXYIndexes(0, 0)).toStrictEqual({
      center: [2, 2, 2, 16],
      frozenCol: [0, 1, 2, 16],
      frozenRow: [2, 2, 0, 1],
      frozenTrailingCol: [3, 4, 2, 16],
      frozenTrailingRow: [2, 2, 30, 31],
    });

    expect(facet.calculateXYIndexes(100, 200)).toStrictEqual({
      center: [2, 2, 8, 23],
      frozenCol: [0, 1, 8, 23],
      frozenRow: [2, 2, 0, 1],
      frozenTrailingCol: [3, 4, 8, 23],
      frozenTrailingRow: [2, 2, 30, 31],
    });
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

  test('should get correct indexes with row height gt canvas height', () => {
    const originHeight = facet.panelBBox.viewportHeight;
    facet.panelBBox.viewportHeight = 10;
    expect(facet.calculateXYIndexes(0, 0)).toStrictEqual({
      center: [2, 2, 2, 0],
      frozenCol: [0, 1, 2, 0],
      frozenRow: [2, 2, 0, 1],
      frozenTrailingCol: [3, 4, 2, 0],
      frozenTrailingRow: [2, 2, 30, 31],
    });
    // reset
    facet.panelBBox.viewportHeight = originHeight;
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
    dataSet,
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
    dataSet,
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

describe('Table Mode Facet With Frozen layoutCoordinate Test', () => {
  const s2: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(s2);
  const facet: TableFacet = new TableFacet({
    spreadsheet: s2,
    dataSet,
    ...assembleDataCfg().fields,
    ...assembleOptions({
      frozenColCount: 2,
      frozenRowCount: 2,
      frozenTrailingColCount: 2,
      frozenTrailingRowCount: 2,
    }),
    ...DEFAULT_STYLE,
    columns: ['province', 'city', 'type', 'sub_type', 'price'],
    layoutCoordinate: (cfg, _, currentNode) => {
      currentNode.width = 200;
    },
  });

  test('should get correct width by layoutCoordinate', () => {
    facet.layoutResult.colLeafNodes.forEach((item) => {
      expect(item.width).toBe(200);
    });
  });
});

describe('Custom Column Width Tests', () => {
  // https://github.com/antvis/S2/pull/1591
  test.each([
    { width: 200, useFunc: false },
    { width: 300, useFunc: true },
  ])(
    'should render custom column leaf node width by %o',
    ({ width, useFunc }) => {
      const s2: SpreadSheet = new MockSpreadSheet();
      const dataSet: TableDataSet = new MockTableDataSet(s2);
      const widthFn = jest.fn(() => width);
      const customWidthFacet = new TableFacet({
        spreadsheet: s2,
        dataSet,
        ...assembleDataCfg().fields,
        ...assembleOptions(),
        ...DEFAULT_STYLE,
        colCfg: {
          width: useFunc ? widthFn : width,
        },
      });

      customWidthFacet.layoutResult.colNodes.forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      customWidthFacet.layoutResult.colLeafNodes.forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      if (useFunc) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(widthFn).toHaveReturnedTimes(2);
      }
    },
  );

  test('should get hidden columns info', () => {
    const s2: SpreadSheet = new MockSpreadSheet();
    const dataSet: TableDataSet = new MockTableDataSet(s2);
    const facet: TableFacet = new TableFacet({
      spreadsheet: s2,
      dataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
    });
    const node = new Node({ id: '1', key: '1', value: '1' });

    expect(facet.getHiddenColumnsInfo(node)).toBeNull();

    const hiddenColumnsInfo = {
      hideColumnNodes: [node],
      displaySiblingNode: null,
    };

    s2.store.set('hiddenColumnsDetail', [hiddenColumnsInfo]);

    expect(facet.getHiddenColumnsInfo(node)).toEqual(hiddenColumnsInfo);
  });
});

describe('Table Mode Facet With Column Grouping Test', () => {
  const s2: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(s2);
  const facet: TableFacet = new TableFacet({
    spreadsheet: s2,
    dataSet,
    ...assembleDataCfg().fields,
    ...DEFAULT_STYLE,
    columns: [
      {
        key: 'area',
        children: ['province', 'city'],
      },
      {
        key: 'all_type',
        children: ['type', 'sub_type'],
      },
      'price',
    ],
  });
  const { colCfg } = facet.cfg;

  test('should get correct group', () => {
    const leafNodes = facet.layoutResult.colLeafNodes;
    expect(leafNodes[0].parent.field).toEqual('area');
    expect(leafNodes[1].parent.field).toEqual('area');
    expect(leafNodes[2].parent.field).toEqual('all_type');
    expect(leafNodes[3].parent.field).toEqual('all_type');
    expect(leafNodes[4].parent.id).toEqual('root');
  });
  test('should has correct col hierarchy', () => {
    expect(facet.layoutResult.colNodes).toHaveLength(7);
    expect(facet.layoutResult.colLeafNodes).toHaveLength(5);
    const nodes = facet.layoutResult.colNodes;
    expect(nodes[0].y).toBe(0);
    expect(nodes[0].height).toEqual(colCfg.height);
    expect(nodes[1].y).toBe(colCfg.height);
    expect(nodes[1].height).toEqual(colCfg.height);
    expect(nodes[2].y).toBe(colCfg.height);
    expect(nodes[2].height).toEqual(colCfg.height);

    expect(nodes[3].y).toBe(0);
    expect(nodes[3].height).toEqual(colCfg.height);
    expect(nodes[4].y).toBe(colCfg.height);
    expect(nodes[4].height).toEqual(colCfg.height);
    expect(nodes[5].y).toBe(colCfg.height);
    expect(nodes[5].height).toEqual(colCfg.height);

    expect(nodes[6].y).toBe(0);
    expect(nodes[6].height).toEqual(colCfg.height * 2);
  });
});

describe('Table Mode Facet With Column Grouping Frozen Test', () => {
  const ss: SpreadSheet = new MockSpreadSheet();
  const dataSet: TableDataSet = new MockTableDataSet(ss);
  const facet: TableFacet = new TableFacet({
    spreadsheet: ss,
    dataSet,
    ...assembleDataCfg().fields,
    ...assembleOptions({
      frozenColCount: 1,
      frozenRowCount: 2,
      frozenTrailingColCount: 1,
      frozenTrailingRowCount: 2,
    }),
    ...DEFAULT_STYLE,
    columns: [
      {
        key: 'area',
        children: ['province', 'city'],
      },
      'price',
      {
        key: 'all_type',
        children: ['type', 'sub_type'],
      },
    ],
  });

  test('should get correct frozenInfo', () => {
    facet.calculateFrozenGroupInfo();
    expect(facet.frozenGroupInfo).toStrictEqual({
      [FrozenGroup.FROZEN_COL]: {
        range: [0, 0],
        width: 240,
      },
      [FrozenGroup.FROZEN_ROW]: {
        height: 60,
        range: [0, 1],
      },
      [FrozenGroup.FROZEN_TRAILING_COL]: {
        range: [2, 2],
        width: 240,
      },
      [FrozenGroup.FROZEN_TRAILING_ROW]: {
        height: 60,
        range: [30, 31],
      },
    });
  });

  test('should get correct col layout with frozen col', () => {
    const { width } = facet.spreadsheet.options;
    const { frozenColCount } = facet.cfg;
    const { colNodes } = facet.layoutResult;
    const topLevelNodes = colNodes.filter((node) => node.parent.id === 'root');
    let prevWidth = 0;
    topLevelNodes.slice(0, frozenColCount).forEach((node) => {
      expect(node.x).toBe(prevWidth);
      prevWidth += node.width;
    });
  });

  test('should get correct cell layout with frozenTrailingCol', () => {
    const { width } = facet.spreadsheet.options;
    const { frozenTrailingColCount } = facet.cfg;
    const { colNodes, colLeafNodes, getCellMeta } = facet.layoutResult;
    const topLevelNodes = colNodes.filter((node) => node.parent.id === 'root');
    const { trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      0,
      frozenTrailingColCount,
    );
    let prevWidth = 0;
    colLeafNodes
      .slice(-trailingColCount)
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

  test('should get correct indexes with row height gt canvas height', () => {
    const originHeight = facet.panelBBox.viewportHeight;
    facet.panelBBox.viewportHeight = 10;
    expect(facet.calculateXYIndexes(0, 0)).toStrictEqual({
      center: [2, 2, 2, 0],
      frozenCol: [0, 1, 2, 0],
      frozenRow: [2, 2, 0, 1],
      frozenTrailingCol: [3, 4, 2, 0],
      frozenTrailingRow: [2, 2, 30, 31],
    });
    // reset
    facet.panelBBox.viewportHeight = originHeight;
  });
});
