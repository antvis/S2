/**
 * pivot mode pivot test.
 */
import { Canvas, Group, Rect, type CanvasConfig } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { find, size } from 'lodash';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { FrozenGroupType } from '../../../src';
import { createFakeSpreadSheet } from '../../util/helpers';
import { getMockPivotMeta } from './util';
import { CornerCell, DataCell } from '@/cell';
import {
  DEFAULT_OPTIONS,
  DEFAULT_STYLE,
  DEFAULT_TREE_ROW_CELL_WIDTH,
} from '@/common/constant/options';
import type { ViewMeta } from '@/common/interface/basic';
import { Store } from '@/common/store';
import type { CellData } from '@/data-set/cell-data';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { ColHeader, CornerHeader, Frame, RowHeader } from '@/facet/header';
import { Node } from '@/facet/layout/node';
import { PivotFacet } from '@/facet/pivot-facet';
import type { PanelScrollGroup } from '@/group/panel-scroll-group';
import { RootInteraction } from '@/interaction/root';
import { SpreadSheet } from '@/sheet-type';
import { getTheme } from '@/theme';

jest.mock('@/interaction/root');

const actualPivotDataSet = jest.requireActual(
  '@/data-set/pivot-data-set',
).PivotDataSet;
const actualDataSet = jest.requireActual(
  '@/data-set/base-data-set',
).BaseDataSet;

const { rowPivotMeta, colPivotMeta, indexesData, sortedDimensionValues } =
  getMockPivotMeta();

jest.mock('@/sheet-type', () => {
  return {
    SpreadSheet: jest.fn().mockImplementation(() => {
      const container = new Canvas({
        width: 100,
        height: 100,
        container: document.body,
        renderer: new Renderer() as unknown as CanvasConfig['renderer'],
      });
      const panelScrollGroup = new Group({}) as PanelScrollGroup;

      panelScrollGroup.update = () => {};
      container.appendChild(panelScrollGroup);

      return {
        dataCfg: assembleDataCfg(),
        options: assembleOptions({
          dataCell: (viewMeta) => new DataCell(viewMeta, viewMeta.spreadsheet),
        }),
        container,
        theme: getTheme({}),
        store: new Store(),
        panelScrollGroup,
        panelGroup: container.appendChild(new Group()),
        foregroundGroup: container.appendChild(new Group()),
        backgroundGroup: container.appendChild(new Group()),
        isFrozenRowHeader: jest.fn(),
        isTableMode: jest.fn().mockReturnValue(false),
        isPivotMode: jest.fn().mockReturnValue(true),
        getTotalsConfig: jest.fn().mockReturnValue({}),
        getLayoutWidthType: jest.fn().mockReturnValue('adaptive'),
        emit: jest.fn(),
        isHierarchyTreeType: jest.fn(),
        facet: {
          getFreezeCornerDiffWidth: jest.fn(),
          getColLeafNodes: jest.fn().mockReturnValue([]),
          layoutResult: {
            rowLeafNodes: [],
          },
          getLayoutResult: () => ({ rowLeafNodes: [], colLeafNodes: [] }),
          getRowLeafNodes: () => [],
          getRowNodes: () => [],
          getColNodes: () => [],
          getHiddenColumnsInfo: jest.fn(),
          getCellMeta: jest.fn().mockRejectedValue({}),
          getRowLeafNodeByIndex: () => [],
          frozenGroupInfo: {
            [FrozenGroupType.FROZEN_ROW]: {},
            [FrozenGroupType.FROZEN_COL]: {},
            [FrozenGroupType.FROZEN_TRAILING_ROW]: {},
            [FrozenGroupType.FROZEN_TRAILING_COL]: {},
          },
          cornerBBox: {},
          getHeaderNodes: jest.fn().mockReturnValue([]),
        },
        getCanvasElement: () =>
          container.getContextService().getDomElement() as HTMLCanvasElement,
        hideTooltip: jest.fn(),
        interaction: {
          clearHoverTimer: jest.fn(),
        },
        measureTextWidth:
          jest.fn() as unknown as SpreadSheet['measureTextWidth'],
        enableFrozenHeaders() {
          return true;
        },
      };
    }),
  };
});

jest.mock('@/data-set/pivot-data-set', () => {
  return {
    PivotDataSet: jest.fn().mockImplementation(() => {
      return {
        ...assembleDataCfg(),
        rowPivotMeta,
        colPivotMeta,
        indexesData,
        sortedDimensionValues,
        moreThanOneValue: jest.fn(),
        getField: jest.fn(),
        transformIndexesData: actualPivotDataSet.prototype.transformIndexesData,
        getExistValuesByDataItem:
          actualPivotDataSet.prototype.getExistValuesByDataItem,
        getFieldFormatter: actualDataSet.prototype.getFieldFormatter,
        getFieldMeta: (field: string, meta: ViewMeta) => find(meta, { field }),
        getFieldName: actualPivotDataSet.prototype.getFieldName,
        getCellData: actualPivotDataSet.prototype.getCellData,
        getCellMultiData: jest.fn(),
        getDimensionValues: actualPivotDataSet.prototype.getDimensionValues,
        getFieldsAndPivotMetaByField:
          actualPivotDataSet.prototype.getFieldsAndPivotMetaByField,
        displayFormattedValueMap: new Map(),
      };
    }),
  };
});

const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('Pivot Mode Facet Test', () => {
  const s2: SpreadSheet = new MockSpreadSheet();
  const dataSet: PivotDataSet = new MockPivotDataSet(s2);

  s2.dataSet = dataSet;
  s2.interaction = new RootInteraction(s2);
  s2.isValueInCols = jest.fn();
  s2.isCustomHeaderFields = jest.fn();
  s2.isCustomColumnFields = jest.fn();
  s2.isCustomRowFields = jest.fn();
  s2.options = assembleOptions({
    dataCell: (viewMeta) => new DataCell(viewMeta, s2),
  });
  const facet = new PivotFacet(s2);

  s2.facet = facet;

  beforeEach(async () => {
    await s2.container.ready;
  });

  afterEach(() => {
    facet.destroy();
  });

  describe('should get correct hierarchy', () => {
    const { dataCell, colCell } = s2.options.style!;
    const { rowsHierarchy, colsHierarchy, colLeafNodes } =
      facet.getLayoutResult();

    const width = Math.max(
      DEFAULT_STYLE.dataCell!.width!,
      DEFAULT_OPTIONS.width! /
        (size(s2.dataSet.fields.rows) + size(colLeafNodes)),
    );

    test('row hierarchy', () => {
      expect(rowsHierarchy.getIndexNodes()).toHaveLength(8);
      expect(rowsHierarchy.getLeaves()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      expect(rowsHierarchy.getNodes(0)).toHaveLength(2);

      rowsHierarchy.getLeaves().forEach((node, index) => {
        expect(Math.floor(node.width)).toBeCloseTo(99);
        expect(node.height).toBe(dataCell!.height!);
        expect(Math.floor(node.x)).toBeCloseTo(99 * node.level);
        expect(node.y).toBe(node.height * index);
      });

      expect(rowsHierarchy.width).toBe(
        rowsHierarchy.sampleNodesForAllLevels
          .map((node) => node.width)
          .reduce((sum, current) => sum + current),
      );
      expect(rowsHierarchy.height).toBe(
        rowsHierarchy
          .getLeaves()
          .map((node) => node.height)
          .reduce((sum, current) => sum + current),
      );
    });

    test('col hierarchy', () => {
      expect(colsHierarchy.getIndexNodes()).toHaveLength(4);
      expect(colsHierarchy.getLeaves()).toHaveLength(4);
      expect(colsHierarchy.getNodes()).toHaveLength(6);
      expect(colsHierarchy.getNodes(0)).toHaveLength(2);

      colsHierarchy.getLeaves().forEach((node, index) => {
        expect(Math.ceil(node.width)).toBeCloseTo(width);
        expect(node.height).toBe(colCell!.height);
        expect(Math.ceil(node.x)).toBe(width * index);
        expect(node.y).toBe(node.height * node.level);
      });

      expect(colsHierarchy.width).toBe(
        colsHierarchy
          .getLeaves()
          .map((node) => node.width)
          .reduce((sum, current) => sum + current),
      );
      expect(colsHierarchy.height).toBe(
        colsHierarchy.sampleNodesForAllLevels
          .map((node) => node.height)
          .reduce((sum, current) => sum + current),
      );
    });
  });

  describe('should get correct cell meta', () => {
    test('should get correct cell meta', () => {
      expect(
        (facet.getCellMeta(0, 1)?.data as CellData)?.getValueByField('number'),
      ).toBe(5343);
      expect(
        (facet.getCellMeta(1, 1)?.data as CellData)?.getValueByField('number'),
      ).toBe(632);

      expect(
        (facet.getCellMeta(1, 0)?.data as CellData)?.getValueByField('number'),
      ).toBe(2367);
    });
  });

  describe('should get correct result when tree mode', () => {
    test('row hierarchy when tree mode', () => {
      s2.isHierarchyTreeType = jest.fn().mockReturnValue(true);
      s2.options = assembleOptions({
        hierarchyType: 'tree',
      });
      // 小于 DEFAULT_TREE_ROW_WIDTH
      const spy = jest.spyOn(s2, 'measureTextWidth').mockReturnValue(30);

      s2.dataSet = new MockPivotDataSet(s2);
      const treeFacet = new PivotFacet(s2);
      const { rowsHierarchy } = treeFacet.getLayoutResult();

      const { dataCell, rowCell } = s2.options.style!;

      expect(rowsHierarchy.getLeaves()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      expect(rowsHierarchy.width).toBe(DEFAULT_TREE_ROW_CELL_WIDTH);
      expect(rowCell?.width).toBeUndefined();

      rowsHierarchy.getNodes().forEach((node, index) => {
        expect(node.width).toBe(DEFAULT_TREE_ROW_CELL_WIDTH);
        expect(node.height).toBe(dataCell!.height!);
        expect(node.x).toBe(0);
        expect(node.y).toBe(node.height * index);
      });

      spy.mockRestore();
    });
  });

  describe('should get correct layer after render', () => {
    beforeEach(() => {
      facet.render();
    });

    afterEach(() => {
      facet.destroy();
    });

    test('get header after render', () => {
      const { rowHeader, cornerHeader, columnHeader, centerFrame } = facet;

      expect(rowHeader).toBeInstanceOf(RowHeader);
      expect(rowHeader!.children[0].children).toHaveLength(10);
      expect(rowHeader!.parsedStyle.visibility).not.toEqual('hidden');

      expect(cornerHeader).toBeInstanceOf(CornerHeader);
      expect(cornerHeader.children).toHaveLength(2);
      expect(cornerHeader.parsedStyle.visibility).not.toEqual('hidden');

      expect(columnHeader).toBeInstanceOf(ColHeader);
      expect(centerFrame).toBeInstanceOf(Frame);
    });

    test('get background after render', () => {
      const { backgroundGroup } = facet;

      const rect = backgroundGroup.children[0];

      expect(backgroundGroup.children).toHaveLength(1);
      expect(rect).toBeInstanceOf(Rect);
      expect(rect.parsedStyle.visibility).not.toEqual('hidden');
    });
  });

  describe('should get correct result when enable series number', () => {
    test('render correct corner header', () => {
      const s2 = createFakeSpreadSheet();

      s2.dataSet = new MockPivotDataSet(s2);
      const seriesNumberFacet = new PivotFacet(s2);

      seriesNumberFacet.render();
      const { cornerHeader } = seriesNumberFacet;

      expect(cornerHeader instanceof CornerHeader).toBeTrue();
      expect(cornerHeader.children).toHaveLength(3);
      expect(cornerHeader.parsedStyle.visibility).toEqual('visible');

      expect(
        (cornerHeader.children as CornerCell[]).every(
          (cell) => cell.getMeta().spreadsheet,
        ),
      ).toBeTrue();
    });
  });

  it.each(['updateScrollOffset', 'scrollWithAnimation', 'scrollImmediately'])(
    'should not throw "Cannot read property \'value\' of undefined" error if called with single offset config by %s',
    (method) => {
      const onlyOffsetYFn = () => {
        // @ts-ignore
        facet[method]({
          offsetY: {
            value: 10,
          },
        });
      };

      const onlyOffsetXFn = () => {
        // @ts-ignore
        facet[method]({
          offsetX: {
            value: 10,
          },
        });
      };

      [onlyOffsetXFn, onlyOffsetYFn].forEach((handler) => {
        expect(handler).not.toThrow();
      });
    },
  );

  // https://github.com/antvis/S2/pull/1591
  test.each([
    { width: 200, useFunc: false },
    { width: 300, useFunc: true },
  ])(
    'should render custom column leaf node width by %o',
    ({ width, useFunc }) => {
      const widthFn = jest.fn(() => width);

      s2.options = assembleOptions({
        style: {
          colCell: {
            width: useFunc ? widthFn : width,
          },
        },
      });
      const customWidthFacet = new PivotFacet(s2);

      customWidthFacet.getColLeafNodes().forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      if (useFunc) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(widthFn).toHaveReturnedTimes(4);
      }
    },
  );

  // https://github.com/antvis/S2/issues/1622
  test('should render custom column leaf node width and use width first for tree mode', () => {
    s2.options = assembleOptions({
      hierarchyType: 'tree',
      style: {
        dataCell: {},
        colCell: {},
        rowCell: {
          // 树状结构下行头宽度
          width: 400,
        },
      },
    });
    const customWidthFacet = new PivotFacet(s2);

    customWidthFacet.getRowNodes().forEach((node) => {
      expect(node.width).toStrictEqual(400);
    });
  });

  test('should get hidden columns info', () => {
    const node = new Node({ id: '1', field: '1', value: '1' });

    expect(facet.getHiddenColumnsInfo(node)).toBeUndefined();

    const hiddenColumnsInfo = {
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
