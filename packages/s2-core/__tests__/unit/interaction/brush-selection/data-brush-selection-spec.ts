import { Group } from '@antv/g';
import { range } from 'lodash';
import { getContainer } from 'tests/util/helpers';
import { DataCell } from '@/cell/data-cell';
import type { TableFacet } from '@/facet';
import {
  CellType,
  DataCellBrushSelection,
  InteractionBrushSelectionStage,
  Node,
  PivotSheet,
  S2Event,
  ScrollDirection,
  SpreadSheet,
  getScrollOffsetForCol,
  getScrollOffsetForRow,
  type LayoutResult,
  type OriginalEvent,
  type S2DataConfig,
  type S2Options,
  type ViewMeta,
  EventController,
  FrozenGroupPosition,
} from '@/index';
import { RootInteraction } from '@/interaction/root';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');
jest.mock('@/cell/data-cell');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;
const MockDataCell = DataCell as unknown as jest.Mock<DataCell>;

describe('Interaction Data Cell Brush Selection Tests', () => {
  let brushSelectionInstance: DataCellBrushSelection;
  let s2: SpreadSheet;
  let mockRootInteraction: RootInteraction;

  const startBrushDataCellMeta: Partial<ViewMeta> = {
    colIndex: 0,
    rowIndex: 1,
  };
  const endBrushDataCellMeta: Partial<ViewMeta> = {
    colIndex: 4,
    rowIndex: 3,
  };

  const startBrushDataCell = new MockDataCell();

  startBrushDataCell.getMeta = () => startBrushDataCellMeta as ViewMeta;

  const endBrushDataCell = new MockDataCell();

  endBrushDataCell.getMeta = () => endBrushDataCellMeta as ViewMeta;

  const panelGroupAllDataCells = Array.from<number[]>({ length: 4 })
    .fill(range(10))
    .reduce<DataCell[]>((arr, v, i) => {
      v.forEach((_, j) => {
        const cell = {
          cellType: CellType.DATA_CELL,
          getMeta() {
            return {
              colIndex: j,
              rowIndex: i,
            } as ViewMeta;
          },
        } as DataCell;

        arr.push(cell);
      });

      return arr;
    }, []);

  const emitEvent = (type: S2Event, event: Partial<OriginalEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      originalEvent: event,
      preventDefault() {},
      ...event,
    } as any);
  };

  const emitGlobalEvent = (type: S2Event, event: Partial<MouseEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      ...event,
      preventDefault() {},
    } as any);
  };

  beforeEach(async () => {
    MockRootInteraction.mockClear();

    const mockColLeafNodes = Array.from(new Array(10)).map((_, idx) => {
      return {
        colIndex: idx,
        id: idx,
        x: idx * 100,
        width: 100,
      };
    }) as unknown as Node[];

    const mockRowLeafNodes = Array.from(new Array(10)).map((_, idx) => {
      return {
        rowIndex: idx,
        id: idx,
        y: idx * 100,
        height: 100,
      };
    }) as unknown as Node[];

    s2 = new PivotSheet(
      getContainer(),
      null as unknown as S2DataConfig,
      null as unknown as S2Options,
    );
    await s2.render();

    mockRootInteraction = new MockRootInteraction(s2);
    mockRootInteraction.eventController = new EventController(s2);
    mockRootInteraction.eventController.getViewportPoint = (event) => {
      return s2.container.client2Viewport({
        x: event.clientX,
        y: event.clientY,
      });
    };
    s2.getCell = jest.fn(() => startBrushDataCell) as any;
    s2.showTooltipWithInfo = jest.fn();
    mockRootInteraction.getSelectedCellHighlight = () => {
      return {
        rowHeader: false,
        colHeader: false,
        currentRow: false,
        currentCol: false,
      };
    };
    mockRootInteraction.getBrushSelection = () => {
      return {
        dataCell: true,
        rowCell: true,
        colCell: true,
      };
    };
    s2.interaction = mockRootInteraction;
    s2.facet.getDataCells = () => panelGroupAllDataCells;
    s2.facet.getLayoutResult = () =>
      ({
        colLeafNodes: mockColLeafNodes,
        rowLeafNodes: mockRowLeafNodes,
      }) as LayoutResult;
    s2.facet.getColLeafNodes = () => mockColLeafNodes;
    s2.facet.getRowLeafNodes = () => mockRowLeafNodes;
    s2.facet.foregroundGroup = new Group();
    s2.facet.getCellRange = () => {
      return {
        start: 0,
        end: 9,
      };
    };
    brushSelectionInstance = new DataCellBrushSelection(s2);
    brushSelectionInstance.brushSelectionStage =
      InteractionBrushSelectionStage.UN_DRAGGED;
    brushSelectionInstance.hidePrepareSelectMaskShape = jest.fn();
  });

  test('should highlight relevant col&row header cell with selectedCellHighlight option toggled on', () => {
    s2.setOptions({
      interaction: { selectedCellHighlight: true },
    });
    mockRootInteraction.getSelectedCellHighlight = () => {
      return {
        rowHeader: true,
        colHeader: true,
        currentRow: false,
        currentCol: false,
      };
    };

    brushSelectionInstance.getBrushRange = () => {
      return {
        start: {
          rowIndex: 0,
          colIndex: 0,
          x: 0,
          y: 0,
        },
        end: {
          rowIndex: 5,
          colIndex: 5,
          x: 200,
          y: 200,
        },
        width: 200,
        height: 200,
      };
    };

    (brushSelectionInstance as any).updateSelectedCells();

    (s2.facet.getColCells() || [])
      .filter((_, i) => i < 5)
      .forEach((cell) => {
        expect(cell.updateByState).toHaveBeenCalled();
      });

    s2.facet.getCells();

    (s2.facet.getRowCells() || [])
      .filter((_, i) => i < 5)
      .forEach((cell) => {
        expect(cell.updateByState).toHaveBeenCalled();
      });
  });

  test('should get start brush point when mouse down', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      x: 10,
      y: 20,
    });
    expect(brushSelectionInstance.spreadsheet.getCell).toHaveBeenCalled();
    expect(brushSelectionInstance.startBrushPoint).toStrictEqual({
      x: 10,
      y: 20,
      scrollX: 0,
      scrollY: 0,
      rowIndex: 1,
      colIndex: 0,
    });
    expect(brushSelectionInstance.displayedCells).toEqual(
      panelGroupAllDataCells,
    );
  });

  test('should skip brush selection if mouse not dragged', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      x: 10,
      y: 20,
    });

    const domRect = s2.getCanvasElement().getBoundingClientRect();

    //  全局事件，需要用全局坐标
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: domRect.left + 12,
      clientY: domRect.top + 22,
    });
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );

    expect(brushSelectionInstance.isValidBrushSelection()).toBeFalsy();

    // 如果刷选距离过短, 则走单选的逻辑, 需要隐藏刷选提示框
    expect(
      brushSelectionInstance.hidePrepareSelectMaskShape,
    ).toHaveBeenCalled();
  });

  test('should get brush selection range cells', () => {
    const selectedFn = jest.fn();
    const brushSelectionFn = jest.fn();

    s2.getCell = jest.fn(() => startBrushDataCell) as any;

    s2.on(S2Event.GLOBAL_SELECTED, selectedFn);
    s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, brushSelectionFn);

    // ================== mouse down ==================
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, { x: 10, y: 20 });

    s2.getCell = jest.fn(() => endBrushDataCell) as any;
    // ================== mouse move ==================
    const domRect = s2.getCanvasElement().getBoundingClientRect();

    //  全局事件，需要用全局坐标
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: domRect.left + 100,
      clientY: domRect.top + 200,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );
    // get end brush point
    expect(brushSelectionInstance.endBrushPoint).toEqual({
      ...endBrushDataCellMeta,
      x: 100,
      y: 200,
    });
    // show prepare brush selection mask
    expect(brushSelectionInstance.prepareSelectMaskShape.attr()).toMatchObject({
      x: 10,
      y: 32,
      width: 90,
      height: 180,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    // hide prepare mask
    expect(
      brushSelectionInstance.prepareSelectMaskShape.attr('visible'),
    ).toBeFalsy();
    // show tooltip
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
    // reset brush stage
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    // get brush range selected cells
    expect(brushSelectionInstance.brushRangeCells).toHaveLength(15);
    brushSelectionInstance.brushRangeCells.forEach((cell) => {
      const { rowIndex, colIndex } = cell.getMeta();

      expect(rowIndex).toBeLessThanOrEqual(endBrushDataCellMeta.rowIndex!);
      expect(rowIndex).toBeGreaterThanOrEqual(startBrushDataCellMeta.rowIndex!);
      expect(colIndex).toBeLessThanOrEqual(endBrushDataCellMeta.colIndex!);
      expect(colIndex).toBeGreaterThanOrEqual(startBrushDataCellMeta.colIndex!);
    });
    // emit event
    expect(selectedFn).toHaveBeenCalledTimes(1);
    expect(brushSelectionFn).toHaveBeenCalledTimes(1);
  });

  test('should get correct formatted brush point', () => {
    const EXTRA_PIXEL = 2;
    const VSCROLLBAR_WIDTH = 5;
    const { width, height } = s2.facet.getCanvasSize();
    const minX = 10;
    const minY = 10;
    const maxY = height + 10;
    const maxX = width + 10;

    s2.facet.panelBBox = {
      minX,
      minY,
      maxY,
      maxX,
    } as any;
    brushSelectionInstance.endBrushPoint = {
      x: maxX - 10,
      y: maxY - 10,
      scrollX: 0,
      colIndex: 0,
      rowIndex: 0,
    };
    s2.facet.vScrollBar = {
      getBBox: () =>
        ({
          width: VSCROLLBAR_WIDTH,
        }) as any,
    } as any;
    let result = brushSelectionInstance.formatBrushPointForScroll({
      x: 20,
      y: 20,
    });

    expect(result).toStrictEqual({
      x: {
        needScroll: true,
        value: maxX - VSCROLLBAR_WIDTH - EXTRA_PIXEL,
      },
      y: {
        needScroll: true,
        value: maxY - EXTRA_PIXEL,
      },
    });

    brushSelectionInstance.endBrushPoint = {
      x: maxX - 10,
      y: maxY - 10,
      scrollX: 0,
      colIndex: 0,
      rowIndex: 0,
    };

    result = brushSelectionInstance.formatBrushPointForScroll({
      x: 1,
      y: 1,
    });

    expect(result).toStrictEqual({
      x: {
        needScroll: false,
        value: maxX - 10 + 1,
      },
      y: {
        needScroll: false,
        value: maxY - 10 + 1,
      },
    });

    brushSelectionInstance.endBrushPoint = {
      x: minX + 10,
      y: minY + 10,
      scrollX: 0,
      colIndex: 0,
      rowIndex: 0,
    };

    result = brushSelectionInstance.formatBrushPointForScroll({
      x: -20,
      y: -20,
    });

    expect(result).toStrictEqual({
      x: {
        needScroll: true,
        value: minX + EXTRA_PIXEL,
      },
      y: {
        needScroll: true,
        value: minY + EXTRA_PIXEL,
      },
    });
  });

  test('should get correct selected cell metas', () => {
    expect(
      brushSelectionInstance.getSelectedCellMetas({
        start: {
          colIndex: 0,
          rowIndex: 0,
        },
        end: {
          colIndex: 9,
          rowIndex: 9,
        },
      } as any).length,
    ).toBe(100);
  });

  test('should get correct adjusted frozen rowIndex and colIndex', () => {
    const { adjustNextColIndexWithFrozen, adjustNextRowIndexWithFrozen } =
      brushSelectionInstance;

    s2.setOptions({
      frozen: {
        colCount: 1,
        rowCount: 1,
        trailingColCount: 1,
        trailingRowCount: 1,
      },
    });
    s2.dataSet.getDisplayDataSet = () =>
      Array.from(new Array(10)).map(() => {
        return {};
      });
    (s2.facet as TableFacet).panelScrollGroupIndexes = [1, 8, 1, 8];
    (s2.facet as TableFacet).getRealFrozenOptions = jest.fn().mockReturnValue({
      colCount: 1,
      rowCount: 1,
      trailingColCount: 1,
      trailingRowCount: 1,
    });

    expect(adjustNextColIndexWithFrozen(9, ScrollDirection.SCROLL_DOWN)).toBe(
      8,
    );
    expect(adjustNextColIndexWithFrozen(0, ScrollDirection.SCROLL_UP)).toBe(1);
    expect(adjustNextColIndexWithFrozen(7, ScrollDirection.SCROLL_DOWN)).toBe(
      7,
    );

    expect(adjustNextRowIndexWithFrozen(9, ScrollDirection.SCROLL_DOWN)).toBe(
      8,
    );
    expect(adjustNextRowIndexWithFrozen(0, ScrollDirection.SCROLL_UP)).toBe(1);
    expect(adjustNextRowIndexWithFrozen(7, ScrollDirection.SCROLL_DOWN)).toBe(
      7,
    );
  });

  test('should get correct scroll offset for row and col', () => {
    const { facet } = s2;

    expect(getScrollOffsetForCol(7, ScrollDirection.SCROLL_UP, s2)).toBe(700);
    expect(getScrollOffsetForCol(7, ScrollDirection.SCROLL_DOWN, s2)).toBe(800);

    (facet as TableFacet).frozenGroupPositions = {
      [FrozenGroupPosition.Col]: {
        width: 100,
        x: 0,
        range: [] as number[],
      },
      [FrozenGroupPosition.TrailingCol]: {
        width: 100,
        x: 0,
        range: [] as number[],
      },
      [FrozenGroupPosition.Row]: {
        height: 0,
        y: 0,
        range: [] as number[],
      },
      [FrozenGroupPosition.TrailingRow]: {
        height: 0,
        y: 0,
        range: [] as number[],
      },
    };
    (s2.facet as TableFacet).getRealFrozenOptions = jest.fn().mockReturnValue({
      colCount: 1,
      rowCount: 1,
      trailingColCount: 1,
      trailingRowCount: 1,
    });

    expect(getScrollOffsetForCol(7, ScrollDirection.SCROLL_UP, s2)).toBe(600);
    expect(getScrollOffsetForCol(7, ScrollDirection.SCROLL_DOWN, s2)).toBe(900);

    facet.panelBBox = {
      viewportHeight: facet.getCanvasSize().height,
      height: facet.getCanvasSize().height,
    } as any;

    facet.viewCellHeights = facet.getViewCellHeights();

    expect(getScrollOffsetForRow(7, ScrollDirection.SCROLL_UP, s2)).toBe(700);
    expect(getScrollOffsetForRow(7, ScrollDirection.SCROLL_DOWN, s2)).toBe(320);

    (facet as TableFacet).frozenGroupPositions = {
      [FrozenGroupPosition.Col]: {
        width: 0,
        x: 0,
        range: [] as number[],
      },
      [FrozenGroupPosition.TrailingCol]: {
        width: 0,
        x: 0,
        range: [] as number[],
      },
      [FrozenGroupPosition.Row]: {
        height: 100,
        y: 0,
        range: [] as number[],
      },
      [FrozenGroupPosition.TrailingRow]: {
        height: 100,
        y: 0,
        range: [] as number[],
      },
    };
    expect(getScrollOffsetForRow(7, ScrollDirection.SCROLL_UP, s2)).toBe(600);
    expect(getScrollOffsetForRow(7, ScrollDirection.SCROLL_DOWN, s2)).toBe(420);
  });

  test('should get valid x and y index', () => {
    const { validateXIndex, validateYIndex } = brushSelectionInstance;

    expect(validateXIndex(-1)).toBe(null);
    expect(validateXIndex(1)).toBe(1);
    expect(validateXIndex(10)).toBe(null);
    expect(validateXIndex(9)).toBe(9);

    expect(validateYIndex(-1)).toBe(null);
    expect(validateYIndex(1)).toBe(1);
    expect(validateYIndex(10)).toBe(null);
    expect(validateYIndex(9)).toBe(9);

    (s2.facet as TableFacet).frozenGroupPositions = {
      [FrozenGroupPosition.Col]: {
        width: 0,
        x: 0,
        range: [0, 1] as number[],
      },
      [FrozenGroupPosition.TrailingCol]: {
        width: 0,
        x: 0,
        range: [8, 9] as number[],
      },
      [FrozenGroupPosition.Row]: {
        height: 0,
        y: 0,
        range: [0, 1] as number[],
      },
      [FrozenGroupPosition.TrailingRow]: {
        height: 0,
        y: 0,
        range: [8, 9] as number[],
      },
    };

    expect(validateXIndex(1)).toBe(null);
    expect(validateXIndex(2)).toBe(2);
    expect(validateXIndex(8)).toBe(null);
    expect(validateXIndex(7)).toBe(7);
    expect(validateXIndex(1)).toBe(null);
    expect(validateXIndex(2)).toBe(2);
    expect(validateXIndex(8)).toBe(null);
    expect(validateXIndex(7)).toBe(7);
  });

  test('should not emit brush selection event', () => {
    mockRootInteraction.getBrushSelection = () => ({
      dataCell: false,
      rowCell: true,
      colCell: true,
    });

    const brushSelectionFn = jest.fn();

    s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, brushSelectionFn);

    // ================== mouse down ==================
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, { x: 10, y: 20 });

    // ================== mouse move ==================
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 100,
      clientY: 200,
    });

    // ================== mouse up ==================
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});
    // emit event
    expect(brushSelectionFn).toHaveBeenCalledTimes(0);
  });
});
