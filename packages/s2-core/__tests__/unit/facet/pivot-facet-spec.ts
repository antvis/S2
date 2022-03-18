/**
 * pivot mode pivot test.
 */
import { Canvas } from '@antv/g-canvas';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { size, get, find } from 'lodash';
import { getMockPivotMeta } from './util';
import { SpreadSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { PivotFacet } from '@/facet/pivot-facet';
import { DataCell } from '@/cell';
import { Store } from '@/common/store';
import { getTheme } from '@/theme';
import { DEFAULT_OPTIONS, DEFAULT_STYLE } from '@/common/constant/options';
import { ColHeader, CornerHeader, Frame, RowHeader } from '@/facet/header';
import { ViewMeta } from '@/common/interface/basic';
import { RootInteraction } from '@/interaction/root';

jest.mock('@/interaction/root');

const actualPivotDataSet = jest.requireActual(
  'src/data-set/pivot-data-set',
).PivotDataSet;
const actualDataSet = jest.requireActual(
  'src/data-set/base-data-set',
).BaseDataSet;

const { rowPivotMeta, colPivotMeta, indexesData, sortedDimensionValues } =
  getMockPivotMeta();

jest.mock('src/sheet-type', () => {
  const container = new Canvas({
    width: 100,
    height: 100,
    container: document.body,
  });
  return {
    SpreadSheet: jest.fn().mockImplementation(() => {
      return {
        dataCfg: assembleDataCfg(),
        options: assembleOptions(),
        container,
        theme: getTheme({}),
        store: new Store(),
        panelScrollGroup: container.addGroup(),
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
        },
      };
    }),
  };
});

jest.mock('src/data-set/pivot-data-set', () => {
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
        getFieldMeta: (field: string, meta: ViewMeta) =>
          find(meta, (m) => m.field === field),
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
    dataSet: dataSet,
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
    const ds = new MockPivotDataSet(s2);
    const treeFacet = new PivotFacet({
      spreadsheet: s2,
      dataSet: ds,
      ...assembleDataCfg().fields,
      ...assembleOptions(),
      ...DEFAULT_STYLE,
      hierarchyType: 'tree',
    });
    const { rowsHierarchy } = treeFacet.layoutResult;

    test('row hierarchy when tree mode', () => {
      const { cellCfg, spreadsheet } = facet.cfg;
      const rowCellStyle = spreadsheet.theme.rowCell.cell;
      const width = facet.cfg.treeRowsWidth;

      expect(rowsHierarchy.getLeaves()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      expect(rowsHierarchy.width).toBe(width);

      rowsHierarchy.getNodes().forEach((node, index) => {
        expect(node.width).toBe(width);
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
    facet.render();
    const {
      rowHeader,
      cornerHeader,
      columnHeader,
      centerFrame,
      backgroundGroup,
    } = facet;
    test('get header after render', () => {
      expect(rowHeader instanceof RowHeader).toBeTrue();
      expect(rowHeader.cfg.children).toHaveLength(10);
      expect(rowHeader.cfg.visible).toBeTrue();

      expect(cornerHeader instanceof CornerHeader).toBeTrue();
      expect(cornerHeader.cfg.children).toHaveLength(3);
      expect(cornerHeader.cfg.visible).toBeTrue();

      expect(columnHeader instanceof ColHeader).toBeTrue();
      expect(centerFrame instanceof Frame).toBeTrue();
    });

    test('get background after render', () => {
      const rect = get(backgroundGroup, 'cfg.children[0]');

      expect(backgroundGroup.cfg.children).toHaveLength(1);
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
});
