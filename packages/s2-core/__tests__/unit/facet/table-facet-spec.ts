/**
 * table mode pivot test.
 */
import { Canvas } from '@antv/g-canvas';
import { assembleDataCfg, assembleOptions } from 'tests/util/sheet-entry';
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
        isColAdaptive: jest.fn().mockRejectedValue('adaptive'),
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

  describe('should get correct col hierarchy', () => {
    const { colsHierarchy } = facet.layoutResult;
    test('col hierarchy structure', () => {
      const indexNodes = colsHierarchy.getIndexNodes();
      expect(indexNodes).toHaveLength(5);
      expect(indexNodes.map((node) => node.key)).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        'price',
      ]);
    });

    test('col hierarchy coordinate', () => {
      const { width, style } = facet.spreadsheet.options;
      const { cellCfg, rowCfg, colCfg } = facet.cfg;
      const { colLeafNodes, colsHierarchy } = facet.layoutResult;
      expect(cellCfg.width).toEqual(
        Math.max(style.cellCfg.width, width / colLeafNodes.length),
      );
      expect(rowCfg.width).toEqual(
        Math.max(style.cellCfg.width, width / colLeafNodes.length),
      );
      expect(colsHierarchy.sampleNodeForLastLevel.height).toEqual(
        colCfg.height,
      );

      colsHierarchy.getNodes().forEach((node, index) => {
        expect(node.y).toBe(0);
        expect(node.x).toBe(index * cellCfg.width);
        expect(node.width).toBe(cellCfg.width);
        expect(node.height).toBe(colCfg.height);
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
});
