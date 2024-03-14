/**
 * table mode pivot test.
 */
import { Canvas, Group, type CanvasConfig } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { pick } from 'lodash';
import { data } from '../../data/mock-dataset.json';
import { createFakeSpreadSheet } from '../../util/helpers';
import { LayoutWidthType, ROOT_NODE_ID } from '@/common/constant';
import { Store } from '@/common/store';
import { TableDataSet } from '@/data-set/table-data-set';
import { TableFacet } from '@/facet/table-facet';
import { getFrozenLeafNodesCount } from '@/facet/utils';
import {
  Node,
  customMerge,
  type HiddenColumnsInfo,
  type S2DataConfig,
  type S2Options,
} from '@/index';
import { SpreadSheet } from '@/sheet-type';
import { getTheme } from '@/theme';

const actualDataSet = jest.requireActual(
  '@/data-set/base-data-set',
).BaseDataSet;

jest.mock('@/sheet-type', () => {
  return {
    SpreadSheet: jest.fn().mockImplementation(() => {
      const container = new Canvas({
        width: 100,
        height: 100,
        container: document.body,
        renderer: new Renderer() as unknown as CanvasConfig['renderer'],
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
        getLayoutWidthType: jest.fn().mockReturnValue('adaptive'),
        emit: jest.fn(),
        facet: {
          getColLeafNodes: jest.fn().mockReturnValue([]),
          getColNodes: jest.fn().mockReturnValue([]),
          getHiddenColumnsInfo: jest.fn(),
          getColNodeHeight: jest.fn(),
          getHeaderNodes: jest.fn().mockReturnValue([]),
          getCellMeta: jest.fn().mockRejectedValue({}),
        },
        dataSet: {
          isEmpty: jest.fn(),
          displayFormattedValueMap: new Map(),
        },
        isHierarchyTreeType: jest.fn(),
        getCanvasElement: () =>
          container.getContextService().getDomElement() as HTMLCanvasElement,
        hideTooltip: jest.fn(),
        interaction: {
          clearHoverTimer: jest.fn(),
          getState: jest.fn(),
          getCells: jest.fn(() => []),
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
  // @ts-ignore
  s2.dataSet.getField = jest.fn();
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
    const { rowsHierarchy } = facet.getLayoutResult();

    expect(rowsHierarchy.height).toBe(0);
    expect(rowsHierarchy.width).toBe(0);
    expect(rowsHierarchy.getIndexNodes()).toHaveLength(0);
  });

  test('should get default seriesNumberText', () => {
    const { facet } = createMockTableFacet({
      seriesNumber: {
        enable: true,
      },
    });

    expect(facet.getColLeafNodes()[0].value).toEqual('序号');
  });

  test('should get custom seriesNumberText', () => {
    const seriesNumberText = 'test';
    const { facet } = createMockTableFacet({
      seriesNumber: {
        enable: true,
        text: seriesNumberText,
      },
    });

    expect(facet.getColLeafNodes()[0].value).toEqual(seriesNumberText);
  });

  describe('should get none layer when dataCfg.fields is empty', () => {
    const spreadsheet = createFakeSpreadSheet({
      s2DataConfig: {
        fields: {
          rows: [],
          columns: [],
          values: [],
        },
      },
    });
    const mockDataSet = new MockTableDataSet(spreadsheet);

    spreadsheet.dataSet = mockDataSet;

    const newFacet: TableFacet = new TableFacet(spreadsheet);

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
      const { backgroundGroup } = newFacet;
      const rect = backgroundGroup.children[0];

      expect(rect).toBeFalsy();
    });
  });
});

describe('Table Mode Facet Test With Adaptive Layout', () => {
  describe('should get correct col layout', () => {
    test('col hierarchy coordinate with adaptive layout', () => {
      const { facet } = createMockTableFacet({
        seriesNumber: {
          enable: false,
        },
      });

      expect(
        facet
          .getColLeafNodes()
          .map((node) => pick(node, ['x', 'y', 'width', 'height'])),
      ).toMatchSnapshot();
    });
  });

  describe('should get correct col layout with seriesNumber', () => {
    test('col hierarchy coordinate with adaptive layout with seriesNumber', () => {
      const { facet, s2 } = createMockTableFacet({
        seriesNumber: {
          enable: true,
        },
      });
      const { colCell } = s2.options.style!;
      const colLeafNodes = facet.getColLeafNodes();

      const seriesNumberWidth = facet.getSeriesNumberWidth();

      const seriesNumberNode = colLeafNodes[0];

      expect(seriesNumberNode.y).toBe(0);
      expect(seriesNumberNode.x).toBe(0);
      expect(seriesNumberNode.width).toBe(seriesNumberWidth);
      expect(seriesNumberNode.height).toBe(colCell!.height);

      expect(
        colLeafNodes
          .slice(1)
          .map((node) => pick(node, ['x', 'y', 'width', 'height'])),
      ).toMatchSnapshot();
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
        seriesNumber: {
          enable: false,
        },
      },
      undefined,
      (spreadsheet) => {
        spreadsheet.getLayoutWidthType = () => LayoutWidthType.Compact;
        spreadsheet.measureTextWidth =
          mockMeasureFunc as unknown as SpreadSheet['measureTextWidth'];
        spreadsheet.measureTextWidthRoughly = mockMeasureFunc;
      },
    );

    test('col hierarchy coordinate with compact layout', () => {
      const COMPACT_WIDTH = [53, 53, 65, 41, 73];

      let lastX = 0;

      facet.getColLeafNodes().forEach((node, index) => {
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
        seriesNumber: {
          enable: true,
        },
      },
      undefined,
      (spreadsheet) => {
        spreadsheet.getLayoutWidthType = () => LayoutWidthType.Compact;
        spreadsheet.measureTextWidth =
          mockMeasureFunc as unknown as SpreadSheet['measureTextWidth'];
        spreadsheet.measureTextWidthRoughly = mockMeasureFunc;
      },
    );

    const { colCell } = s2.options.style!;

    test('col hierarchy coordinate with compact layout with seriesNumber', () => {
      const COMPACT_WIDTH = [80, 53, 53, 65, 41, 73];

      let lastX = 0;

      facet.getColLeafNodes().forEach((node, index) => {
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

    expect(facet.frozenGroupInfo).toMatchSnapshot();
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

    expect(
      facet
        .getColLeafNodes()
        .slice(-colCount)
        .reverse()
        .map((node) => Math.floor(node.x)),
    ).toEqual([479, 359]);
  });

  test('should get correct cell layout with frozenTrailingCol', () => {
    const { trailingColCount } = s2.options.frozen!;

    expect(
      facet
        .getColLeafNodes()
        .slice(-trailingColCount!)
        .reverse()
        .map((node) => Math.floor(node.x)),
    ).toEqual([479, 359]);
  });

  test('should get correct cell layout with frozenTrailingRow', () => {
    const { trailingRowCount } = s2.options.frozen!;
    const displayData = s2.dataSet.getDisplayDataSet();

    expect(
      displayData
        .slice(-trailingRowCount!)
        .reverse()
        .map((_, idx) => facet.getCellMeta(displayData.length - 1 - idx, 1)!.y),
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
    facet.getColLeafNodes().forEach((item) => {
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

      facet.getColNodes().forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      facet.getColLeafNodes().forEach((node) => {
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
    expect(facet.frozenGroupInfo).toMatchSnapshot();
  });

  test('should get correct col layout with frozen col', () => {
    const { colCount } = s2.options.frozen!;
    const topLevelNodes = facet
      .getColNodes()
      .filter((node) => node.parent!.id === ROOT_NODE_ID);

    expect(
      topLevelNodes.slice(0, colCount).map((node) => node.x),
    ).toStrictEqual([0]);
  });

  test('should get correct cell layout with frozenTrailingCol', () => {
    const { trailingColCount: frozenTrailingColCount } = s2.options.frozen!;
    const topLevelNodes = facet
      .getColNodes()
      .filter((node) => node.parent!.id === ROOT_NODE_ID);
    const { trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      0,
      frozenTrailingColCount!,
    );

    expect(
      facet
        .getColLeafNodes()
        .slice(-trailingColCount)
        .reverse()
        .map((node) => Math.floor(node.x)),
    ).toEqual([399]);
  });

  test('should get correct cell layout with frozenTrailingRow', () => {
    const { trailingRowCount } = s2.options.frozen!;
    const displayData = s2.dataSet.getDisplayDataSet();

    expect(
      displayData
        .slice(-trailingRowCount!)
        .reverse()
        .map((_, idx) => facet.getCellMeta(displayData.length - 1 - idx, 1)!.y),
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
    expect(facet.calculateXYIndexes(0, 0)).toMatchInlineSnapshot(`
      Object {
        "center": Array [
          1,
          1,
          2,
          0,
        ],
        "frozenCol": Array [
          0,
          0,
          2,
          0,
        ],
        "frozenRow": Array [
          1,
          1,
          0,
          1,
        ],
        "frozenTrailingCol": Array [
          2,
          2,
          2,
          0,
        ],
        "frozenTrailingRow": Array [
          1,
          1,
          30,
          31,
        ],
      }
    `);
    // reset
    facet.panelBBox.viewportHeight = originHeight;
  });
});
