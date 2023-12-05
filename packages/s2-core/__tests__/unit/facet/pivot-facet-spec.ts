/**
 * pivot mode pivot test.
 */
import { Canvas, Group } from '@antv/g-canvas';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { size, get, find } from 'lodash';
import { getMockPivotMeta } from './util';
import { Node } from '@/facet/layout/node';
import { DEFAULT_TREE_ROW_WIDTH } from '@/common/constant/options';
import type { PanelScrollGroup } from '@/group/panel-scroll-group';
import { SpreadSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { PivotFacet } from '@/facet/pivot-facet';
import { CornerCell, DataCell } from '@/cell';
import { Store } from '@/common/store';
import { getTheme } from '@/theme';
import { DEFAULT_OPTIONS, DEFAULT_STYLE } from '@/common/constant/options';
import {
  ColHeader,
  CornerHeader,
  Frame,
  PivotRowHeader,
  RowHeader,
} from '@/facet/header';
import type { Fields, ViewMeta } from '@/common/interface/basic';
import { RootInteraction } from '@/interaction/root';
import { areAllFieldsEmpty } from '@/facet/utils';

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
  const container = new Canvas({
    width: 100,
    height: 100,
    container: document.body,
  });
  const panelScrollGroup = new Group({}) as PanelScrollGroup;
  panelScrollGroup.update = () => {};
  container.add(panelScrollGroup);
  return {
    SpreadSheet: jest.fn().mockImplementation(() => {
      return {
        dataCfg: assembleDataCfg(),
        options: assembleOptions(),
        container,
        theme: getTheme({}),
        store: new Store(),
        panelScrollGroup,
        panelGroup: container.addGroup(),
        foregroundGroup: container.addGroup(),
        backgroundGroup: container.addGroup(),
        isFrozenRowHeader: jest.fn(),
        isTableMode: jest.fn().mockReturnValue(false),
        isPivotMode: jest.fn().mockReturnValue(true),
        getTotalsConfig: jest.fn().mockReturnValue({}),
        getLayoutWidthType: jest.fn().mockReturnValue('adaptive'),
        emit: jest.fn(),
        getColumnLeafNodes: jest.fn().mockReturnValue([]),
        isScrollContainsRowHeader: jest.fn(),
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
        measureTextWidth:
          jest.fn() as unknown as SpreadSheet['measureTextWidth'],
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
        getFieldFormatter: actualDataSet.prototype.getFieldFormatter,
        getFieldMeta: (field: string, meta: ViewMeta) => find(meta, { field }),
        getFieldName: actualPivotDataSet.prototype.getFieldName,
        getCellData: actualPivotDataSet.prototype.getCellData,
        getMultiData: jest.fn(),
        getDimensionValues: actualPivotDataSet.prototype.getDimensionValues,
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

  const facet: PivotFacet = new PivotFacet({
    spreadsheet: s2,
    dataSet,
    dataCell: (fct) => new DataCell(fct, s2),
    ...assembleDataCfg().fields,
    ...assembleOptions(),
    ...DEFAULT_STYLE,
  });

  describe('should get correct hierarchy', () => {
    const { cellCfg, colCfg, rows, spreadsheet } = facet.cfg;
    const { rowsHierarchy, colsHierarchy, colLeafNodes } = facet.layoutResult;
    const rowCellStyle = spreadsheet.theme.rowCell.cell;
    const width = Math.max(
      DEFAULT_STYLE.cellCfg.width,
      DEFAULT_OPTIONS.width / (size(rows) + size(colLeafNodes)),
    );
    test('row hierarchy', () => {
      expect(rowsHierarchy.getIndexNodes()).toHaveLength(8);
      expect(rowsHierarchy.getLeaves()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      expect(rowsHierarchy.getNodes(0)).toHaveLength(2);

      rowsHierarchy.getLeaves().forEach((node, index) => {
        expect(node.width).toBe(width);
        expect(node.height).toBe(
          cellCfg.height +
            rowCellStyle.padding?.top +
            rowCellStyle.padding?.bottom,
        );
        expect(node.x).toBe(width * node.level);
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
        expect(node.width).toBe(width);
        expect(node.height).toBe(colCfg.height);
        expect(node.x).toBe(width * index);
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
    const { getCellMeta } = facet.layoutResult;

    test('should get correct cell meta', () => {
      expect(getCellMeta(0, 1)?.data?.number).toBe(5343);
      expect(getCellMeta(1, 1)?.data?.number).toBe(632);

      expect(getCellMeta(1)?.data?.number).toBe(2367);
    });
  });

  describe('should get correct result when tree mode', () => {
    s2.isHierarchyTreeType = jest.fn().mockReturnValue(true);
    const spy = jest.spyOn(s2, 'measureTextWidth').mockReturnValue(30); // 小于 DEFAULT_TREE_ROW_WIDTH
    const mockDataSet = new MockPivotDataSet(s2);
    // 所以我需要重置 Spreadsheet  中的 dataCfg.fields
    const treeFacet = new PivotFacet({
      spreadsheet: s2,
      dataSet: mockDataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      hierarchyType: 'tree',
    });
    const { rowsHierarchy } = treeFacet.layoutResult;

    afterEach(() => {
      spy.mockRestore();
    });

    test('row hierarchy when tree mode', () => {
      const { cellCfg, spreadsheet } = facet.cfg;
      const rowCellStyle = spreadsheet.theme.rowCell.cell;
      const width = facet.cfg.treeRowsWidth;

      expect(rowsHierarchy.getLeaves()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      expect(rowsHierarchy.width).toBe(DEFAULT_TREE_ROW_WIDTH);
      expect(width).toBeUndefined();

      rowsHierarchy.getNodes().forEach((node, index) => {
        expect(node.width).toBe(DEFAULT_TREE_ROW_WIDTH);
        expect(node.height).toBe(
          cellCfg.height +
            rowCellStyle.padding?.top +
            rowCellStyle.padding?.bottom,
        );
        expect(node.x).toBe(0);
        expect(node.y).toBe(node.height * index);
      });
    });
  });

  describe('should get correct layer after render', () => {
    beforeEach(() => {
      facet.render();
    });

    afterEach(() => {
      facet.render();
    });

    test('get header after render', () => {
      const { rowHeader, cornerHeader, columnHeader, centerFrame } = facet;

      expect(
        rowHeader instanceof PivotRowHeader || rowHeader instanceof RowHeader,
      ).toBeTrue();

      expect(rowHeader.cfg.children[0].getChildren()).toHaveLength(10);
      expect(rowHeader.cfg.visible).toBeTrue();

      expect(cornerHeader instanceof CornerHeader).toBeTrue();
      expect(cornerHeader.cfg.children).toHaveLength(2);
      expect(cornerHeader.cfg.visible).toBeTrue();

      expect(columnHeader instanceof ColHeader).toBeTrue();
      expect(centerFrame instanceof Frame).toBeTrue();
    });

    test('get background after render', () => {
      const { backgroundGroup } = facet;

      const rect = get(backgroundGroup, 'cfg.children[0]');
      expect(backgroundGroup.cfg.children).toHaveLength(3);
      expect(rect.cfg.type).toBe('rect');
      expect(rect.cfg.visible).toBeTrue();
    });

    test('get cell after render', () => {
      const { panelScrollGroup } = s2;
      const sampleDataCell = get(panelScrollGroup, 'cfg.children[0]');
      expect(panelScrollGroup.cfg.children).toHaveLength(32);
      expect(panelScrollGroup.cfg.visible).toBeTrue();
      expect(get(sampleDataCell, 'meta.data.number')).toBe(7789);
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
    // 所以我需要重置 Spreadsheet  中的 dataCfg.fields
    const spreadsheet = Object.assign({}, s2, {
      dataCfg: { fields },
      panelGroup: container.addGroup(),
      foregroundGroup: container.addGroup(),
      backgroundGroup: container.addGroup(),
    });

    const mockDataSet = new MockPivotDataSet(spreadsheet);
    const newFacet = new PivotFacet({
      spreadsheet,
      dataSet: mockDataSet,
      ...fields,
      ...assembleOptions(),
    });

    beforeEach(() => {
      newFacet.render();
    });

    afterEach(() => {
      newFacet.destroy();
    });

    test('areAllFieldsEmpty execution result is true', () => {
      expect(areAllFieldsEmpty(fields)).toBeTrue();
    });

    test('can not get header after render', () => {
      const { rowHeader, cornerHeader, columnHeader, centerFrame } = newFacet;

      expect(rowHeader).toBeFalsy();
      expect(cornerHeader).toBeFalsy();
      expect(columnHeader).toBeFalsy();
      expect(centerFrame).toBeFalsy();
    });

    test('can not get series number after render', () => {
      const { backgroundGroup, rowIndexHeader } = newFacet;
      const rect = get(backgroundGroup, 'cfg.children[0]');

      expect(rect).toBeFalsy();
      expect(rowIndexHeader).toBeFalsy();
    });

    test('can not get cell after render', () => {
      const { panelGroup } = spreadsheet;

      expect(panelGroup.cfg.children).toBeEmpty();
    });
  });

  describe('should get correct result when enable series number', () => {
    const mockDataSet = new MockPivotDataSet(s2);
    const seriesNumberFacet = new PivotFacet({
      spreadsheet: s2,
      dataSet: mockDataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      showSeriesNumber: true,
    });

    beforeEach(() => {
      seriesNumberFacet.render();
    });

    afterEach(() => {
      seriesNumberFacet.destroy();
    });

    test('render corrent corner header', () => {
      const { cornerHeader } = seriesNumberFacet;

      expect(cornerHeader instanceof CornerHeader).toBeTrue();
      expect(cornerHeader.cfg.children).toHaveLength(3);
      expect(cornerHeader.cfg.visible).toBeTrue();

      expect(
        cornerHeader
          .getChildren()
          .every((cell: CornerCell) => cell.getMeta().spreadsheet),
      ).toBeTrue();
    });
  });

  it.each(['updateScrollOffset', 'scrollWithAnimation', 'scrollImmediately'])(
    'should not throw "Cannot read property \'value\' of undefined" error if called with single offset config',
    (method) => {
      const onlyOffsetYFn = () => {
        facet[method]({
          offsetY: {
            value: 10,
          },
        });
      };

      const onlyOffsetXFn = () => {
        facet[method]({
          offsetX: {
            value: 10,
          },
        });
      };

      [onlyOffsetXFn, onlyOffsetYFn].forEach((handler) => {
        expect(handler).not.toThrowError();
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
      const mockDataSet = new MockPivotDataSet(s2);
      const widthFn = jest.fn(() => width);
      const customWidthFacet = new PivotFacet({
        spreadsheet: s2,
        dataSet: mockDataSet,
        ...assembleDataCfg().fields,
        ...assembleOptions(),
        colCfg: {
          width: useFunc ? widthFn : width,
        },
      });

      customWidthFacet.layoutResult.colLeafNodes.forEach((node) => {
        expect(node.width).toStrictEqual(width);
      });

      if (useFunc) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(widthFn).toHaveReturnedTimes(4);
      }
    },
  );

  // https://github.com/antvis/S2/issues/1622
  test('should render custom column leaf node width and use treeRowsWidth first for tree mode', () => {
    const mockDataSet = new MockPivotDataSet(s2);
    const customWidthFacet = new PivotFacet({
      spreadsheet: s2,
      dataSet: mockDataSet,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      hierarchyType: 'tree',
      cellCfg: {},
      colCfg: {},
      rowCfg: {
        // 行头宽度
        width: 200,
        // 已废弃
        treeRowsWidth: 300,
      },
      // 树状结构下行头宽度 (优先级最高)
      treeRowsWidth: 400,
    });

    customWidthFacet.layoutResult.rowNodes.forEach((node) => {
      expect(node.width).toStrictEqual(400);
    });
  });

  test('should get hidden columns info', () => {
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
