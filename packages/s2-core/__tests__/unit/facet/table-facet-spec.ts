/**
 * table mode pivot test.
 */
import { Canvas, Group } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { data } from '../../data/mock-dataset.json';
import { FrozenGroupType } from '@/common/constant';
import { Store } from '@/common/store';
import { TableDataSet } from '@/data-set/table-data-set';
import { TableFacet } from '@/facet/table-facet';
import { getFrozenLeafNodesCount } from '@/facet/utils';
import {
  customMerge,
  Node,
  type HiddenColumnsInfo,
  type S2DataConfig,
  type S2Options,
} from '@/index';
import { SpreadSheet } from '@/sheet-type';
import { getTheme } from '@/theme';

jest.mock('@/sheet-type', () => {
  return {
    SpreadSheet: jest.fn().mockImplementation(() => {
      const container = new Canvas({
        width: 100,
        height: 100,
        container: document.body,
        renderer: new Renderer(),
      });

      return {
        dataCfg: assembleDataCfg(),
        options: assembleOptions(),
        panelScrollGroup: {
          setClip: jest.fn(),
        },
        container,
        theme: getTheme({}),
        panelGroup: container.appendChild(new Group()),
        foregroundGroup: container.appendChild(new Group()),
        backgroundGroup: container.appendChild(new Group()),
        store: new Store(),
        on: jest.fn(),
        isTableMode: jest.fn().mockReturnValue(true),
        isPivotMode: jest.fn(),
        getTotalsConfig: jest.fn(),
        getLayoutWidthType: jest.fn().mockRejectedValue('adaptive'),
        emit: jest.fn(),
        getColumnLeafNodes: jest.fn().mockReturnValue([]),
        getColumnNodes: jest.fn().mockReturnValue([]),
        isHierarchyTreeType: jest.fn(),
        getCanvasElement: () =>
          container.getContextService().getDomElement() as HTMLCanvasElement,
        hideTooltip: jest.fn(),
        interaction: {
          clearHoverTimer: jest.fn(),
        },
        enableFrozenHeaders() {
          return false;
        },
        isFrozenRowHeader() {
          return false;
        },
        isValueInCols: jest.fn(),
        isCustomHeaderFields: jest.fn(),
        isCustomColumnFields: jest.fn(),
        measureTextWidthRoughly: jest.fn(),
        measureTextWidth: jest.fn(),
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
        getFieldFormatter: jest.fn(),
        getCellData: () => 1,
      };
    }),
  };
});

const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;
const MockTableDataSet = TableDataSet as any as jest.Mock<TableDataSet>;

const createMockTableFacet = (
  options?: S2Options | null,
  fields?: S2DataConfig['fields'],
  before?: (s2: SpreadSheet) => void,
) => {
  const s2 = new MockSpreadSheet();

  before?.(s2);

  s2.options = customMerge(assembleOptions(), options);
  s2.dataCfg = assembleDataCfg({
    fields: customMerge(
      {
        columns: ['province', 'city', 'type', 'sub_type', 'price'],
      },
      fields,
    ),
  });
  s2.dataSet = new MockTableDataSet(s2);
  s2.dataSet.fields = s2.dataCfg.fields;
  const facet = new TableFacet(s2);

  s2.facet = facet;

  return {
    facet,
    s2,
  };
};

describe('Table Mode Facet Test', () => {
  test('should get correct row hierarchy', () => {
    const { facet } = createMockTableFacet();
    const { rowsHierarchy } = facet.layoutResult;

    expect(rowsHierarchy.height).toBe(0);
    expect(rowsHierarchy.width).toBe(0);
    expect(rowsHierarchy.getIndexNodes()).toHaveLength(0);
  });

  test('should get default seriesNumberText', () => {
    const { facet } = createMockTableFacet({
      showSeriesNumber: true,
    });

    expect(facet.layoutResult.colLeafNodes[0].value).toEqual('序号');
  });

  test('should get custom seriesNumberText', () => {
    const seriesNumberText = 'test';
    const { facet } = createMockTableFacet({
      showSeriesNumber: true,
      seriesNumberText,
    });

    expect(facet.layoutResult.colLeafNodes[0].value).toEqual(seriesNumberText);
  });
});

describe('Table Mode Facet Test With Adaptive Layout', () => {
  describe('should get correct col layout', () => {
    const { facet, s2 } = createMockTableFacet({
      showSeriesNumber: false,
    });
    const { colCell } = s2.options.style!;

    test('col hierarchy coordinate with adaptive layout', () => {
      const { colLeafNodes } = facet.layoutResult;

      const adaptiveWith = 119;

      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(index * adaptiveWith);
        expect(Math.round(node.width)).toBe(adaptiveWith);
        expect(node.height).toBe(colCell!.height);
      });
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    const { facet, s2 } = createMockTableFacet({
      showSeriesNumber: true,
    });
    const { colCell } = s2.options.style!;

    test('col hierarchy coordinate with adaptive layout with seriesNumber', () => {
      const { colLeafNodes } = facet.layoutResult;

      const seriesNumberWidth = facet.getSeriesNumberWidth();
      const adaptiveWith = 103;

      const seriesNumberNode = colLeafNodes[0];

      expect(seriesNumberNode.y).toBe(0);
      expect(seriesNumberNode.x).toBe(0);
      expect(seriesNumberNode.width).toBe(seriesNumberWidth);
      expect(seriesNumberNode.height).toBe(colCell!.height);

      colLeafNodes.slice(1).forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(index * adaptiveWith + seriesNumberWidth);
        expect(node.width).toBe(adaptiveWith);
        expect(node.height).toBe(colCell!.height);
      });
    });
  });
});

describe('Table Mode Facet Test With Compact Layout', () => {
  describe('should get correct col layout', () => {
    const LABEL_WIDTH = [36, 36, 48, 24, 56]; // 采样的文本宽度

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

    const { facet, s2 } = createMockTableFacet(
      {
        showSeriesNumber: false,
      },
      undefined,
      (spreadsheet) => {
        spreadsheet.getLayoutWidthType = () => 'compact';
        spreadsheet.measureTextWidth =
          mockMeasureFunc as unknown as SpreadSheet['measureTextWidth'];
        spreadsheet.measureTextWidthRoughly = mockMeasureFunc;
      },
    );

    test('col hierarchy coordinate with compact layout', () => {
      const { colLeafNodes } = facet.layoutResult;
      const COMPACT_WIDTH = [53, 53, 65, 41, 73];

      let lastX = 0;

      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(lastX);
        expect(Math.floor(node.width)).toEqual(COMPACT_WIDTH[index]);
        expect(node.height).toBe(s2.options!.style!.colCell!.height);
        lastX += COMPACT_WIDTH[index];
      });
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    const LABEL_WIDTH = [36, 36, 48, 24, 56]; // 采样的文本宽度
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
        case 'undefined': // serialnumber & price
          return LABEL_WIDTH[4];
        default:
          return 0;
      }
    };

    const { facet, s2 } = createMockTableFacet(
      {
        showSeriesNumber: true,
      },
      undefined,
      (spreadsheet) => {
        spreadsheet.getLayoutWidthType = () => 'compact';
        spreadsheet.measureTextWidth =
          mockMeasureFunc as unknown as SpreadSheet['measureTextWidth'];
        spreadsheet.measureTextWidthRoughly = mockMeasureFunc;
      },
    );

    const { colCell } = s2.options.style!;

    test('col hierarchy coordinate with compact layout with seriesNumber', () => {
      const { colLeafNodes } = facet.layoutResult;

      const COMPACT_WIDTH = [80, 53, 53, 65, 41, 73];

      let lastX = 0;

      colLeafNodes.forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(lastX);
        expect(Math.floor(node.width)).toBe(COMPACT_WIDTH[index]);
        expect(node.height).toBe(colCell!.height);
        lastX += COMPACT_WIDTH[index];
      });
    });
  });
});

describe('Table Mode Facet With Frozen Test', () => {
  const { facet, s2 } = createMockTableFacet({
    frozen: {
      colCount: 2,
      rowCount: 2,
      trailingColCount: 2,
      trailingRowCount: 2,
    },
  });

  test('should get correct frozenInfo', () => {
    facet.calculateFrozenGroupInfo();
    expect(facet.frozenGroupInfo).toStrictEqual({
      [FrozenGroupType.FROZEN_COL]: {
        range: [0, 1],
        width: 238,
      },
      [FrozenGroupType.FROZEN_ROW]: {
        height: 60,
        range: [0, 1],
      },
      [FrozenGroupType.FROZEN_TRAILING_COL]: {
        range: [3, 4],
        width: 238,
      },
      [FrozenGroupType.FROZEN_TRAILING_ROW]: {
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
    const { colCount = 0 } = s2.options.frozen!;
    const { colLeafNodes } = facet.layoutResult;

    expect(
      colLeafNodes
        .slice(-colCount)
        .reverse()
        .map((node) => node.x),
    ).toEqual([481, 362]);
  });

  test('should get correct cell layout with frozenTrailingCol', () => {
    const { trailingColCount } = s2.options.frozen!;
    const { colLeafNodes } = facet.layoutResult;

    expect(
      colLeafNodes
        .slice(-trailingColCount!)
        .reverse()
        .map((node) => node.x),
    ).toEqual([481, 362]);
  });

  test('should get correct cell layout with frozenTrailingRow', () => {
    const { trailingRowCount } = s2.options.frozen!;
    const { getCellMeta } = facet.layoutResult;
    const displayData = s2.dataSet.getDisplayDataSet();

    expect(
      displayData
        .slice(-trailingRowCount!)
        .reverse()
        .map((_, idx) => getCellMeta(displayData.length - 1 - idx, 1)!.y),
    ).toEqual([532, 502]);
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
  const { facet } = createMockTableFacet({
    style: {
      rowCell: {
        heightByField: {
          '2': 300,
          '3': 200,
          '10': 60,
          '15': 20,
        },
      },
    },
  });

  test('should get correct rowOffsets when custom row height is set', () => {
    const rowOffsets = facet.rowOffsets;

    expect(rowOffsets).toMatchInlineSnapshot(`
      Array [
        0,
        30,
        60,
        360,
        560,
        590,
        620,
        650,
        680,
        710,
        740,
        800,
        830,
        860,
        890,
        920,
        940,
        970,
        1000,
        1030,
        1060,
        1090,
        1120,
        1150,
        1180,
        1210,
        1240,
        1270,
        1300,
        1330,
        1360,
        1390,
        1420,
      ]
    `);
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
  const { facet } = createMockTableFacet({
    width: 0,
    height: 0,
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
  const { facet } = createMockTableFacet({
    frozen: {
      colCount: 2,
      rowCount: 2,
      trailingColCount: 2,
      trailingRowCount: 2,
    },
    layoutCoordinate: (_, __, currentNode) => {
      currentNode!.width = 200;
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
      const widthFn = jest.fn(() => width);
      const { facet } = createMockTableFacet({
        style: {
          colCell: {
            width: useFunc ? widthFn : width,
          },
        },
      });

      facet.layoutResult.colNodes.forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      facet.layoutResult.colLeafNodes.forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      if (useFunc) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(widthFn).toHaveBeenCalled();
      }
    },
  );

  test('should get hidden columns info', () => {
    const s2 = new MockSpreadSheet();

    s2.dataSet = new MockTableDataSet(s2);
    const facet = new TableFacet(s2);
    const node = new Node({ id: '1', field: '1', value: '1' });

    expect(facet.getHiddenColumnsInfo(node)).toBeUndefined();

    const hiddenColumnsInfo: HiddenColumnsInfo = {
      hideColumnNodes: [node],
      displaySiblingNode: {
        prev: null,
        next: null,
      },
    };

    s2.store.set('hiddenColumnsDetail', [hiddenColumnsInfo]);

    expect(facet.getHiddenColumnsInfo(node)).toEqual(hiddenColumnsInfo);
  });
});

describe('Table Mode Facet With Column Grouping Frozen Test', () => {
  const { facet, s2 } = createMockTableFacet(
    {
      frozen: {
        colCount: 1,
        rowCount: 2,
        trailingColCount: 1,
        trailingRowCount: 2,
      },
    },
    {
      columns: [
        {
          field: 'area',
          children: [{ field: 'province' }, { field: 'city' }],
        },
        { field: 'price' },
        {
          field: 'all_type',
          children: [{ field: 'type' }, { field: 'sub_type' }],
        },
      ],
    },
  );

  test('should get correct frozenInfo', () => {
    facet.calculateFrozenGroupInfo();
    expect(facet.frozenGroupInfo).toStrictEqual({
      [FrozenGroupType.FROZEN_COL]: {
        range: [0, 0],
        width: 238,
      },
      [FrozenGroupType.FROZEN_ROW]: {
        height: 60,
        range: [0, 1],
      },
      [FrozenGroupType.FROZEN_TRAILING_COL]: {
        range: [2, 2],
        width: 238,
      },
      [FrozenGroupType.FROZEN_TRAILING_ROW]: {
        height: 60,
        range: [30, 31],
      },
    });
  });

  test('should get correct col layout with frozen col', () => {
    const { colCount } = s2.options.frozen!;
    const { colNodes } = facet.layoutResult;
    const topLevelNodes = colNodes.filter((node) => node.parent!.id === 'root');

    expect(
      topLevelNodes.slice(0, colCount).map((node) => node.x),
    ).toStrictEqual([0]);
  });

  test('should get correct cell layout with frozenTrailingCol', () => {
    const { trailingColCount: frozenTrailingColCount } = s2.options.frozen!;
    const { colNodes, colLeafNodes } = s2.facet.layoutResult;
    const topLevelNodes = colNodes.filter((node) => node.parent!.id === 'root');
    const { trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      0,
      frozenTrailingColCount!,
    );

    expect(
      colLeafNodes
        .slice(-trailingColCount)
        .reverse()
        .map((node) => node.x),
    ).toEqual([481, 362]);
  });

  test('should get correct cell layout with frozenTrailingRow', () => {
    const { trailingRowCount } = s2.options.frozen!;
    const { getCellMeta } = facet.layoutResult;
    const displayData = s2.dataSet.getDisplayDataSet();

    expect(
      displayData
        .slice(-trailingRowCount!)
        .reverse()
        .map((_, idx) => getCellMeta(displayData.length - 1 - idx, 1)!.y),
    ).toEqual([502, 472]);
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
