import { Group } from '@antv/g-canvas';
import { range } from 'lodash';
import { DataCell } from 'src/cell/data-cell';
import { RootInteraction } from '@/interaction/root';
import {
  ScrollDirection,
  BrushSelection,
  CellTypes,
  getScrollOffsetForCol,
  getScrollOffsetForRow,
  InteractionBrushSelectionStage,
  InterceptType,
  Node,
  OriginalEvent,
  PivotSheet,
  S2Event,
  SpreadSheet,
  ViewMeta,
} from '@/index';
import { TableFacet } from '@/facet';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/root');
jest.mock('@/utils/tooltip');
jest.mock('src/cell/data-cell');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;
const MockDataCell = DataCell as unknown as jest.Mock<DataCell>;

describe('Interaction Brush Selection Tests', () => {
  let brushSelectionInstance: BrushSelection;
  let mockSpreadSheetInstance: SpreadSheet;
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
          cellType: CellTypes.DATA_CELL,
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
    } as any);
  };

  const emitGlobalEvent = (type: S2Event, event: Partial<MouseEvent>) => {
    brushSelectionInstance.spreadsheet.emit(type, {
      ...event,
      preventDefault() {},
    } as any);
  };

  beforeEach(() => {
    MockRootInteraction.mockClear();

    mockSpreadSheetInstance = new PivotSheet(
      document.createElement('div'),
      null,
      null,
    );
    mockRootInteraction = new MockRootInteraction(mockSpreadSheetInstance);
    mockSpreadSheetInstance.getCell = jest.fn(() => startBrushDataCell) as any;
    mockSpreadSheetInstance.foregroundGroup = new Group('');
    mockSpreadSheetInstance.showTooltipWithInfo = jest.fn();
    mockRootInteraction.getPanelGroupAllDataCells = () =>
      panelGroupAllDataCells;
    mockSpreadSheetInstance.interaction = mockRootInteraction;
    mockSpreadSheetInstance.render();
    mockSpreadSheetInstance.facet.layoutResult.colLeafNodes = Array.from(
      new Array(10),
    ).map((_, idx) => {
      return {
        colIndex: idx,
        id: idx,
        x: idx * 100,
        width: 100,
      };
    }) as unknown[] as Node[];
    mockSpreadSheetInstance.facet.layoutResult.rowLeafNodes = Array.from(
      new Array(10),
    ).map((_, idx) => {
      return {
        rowIndex: idx,
        id: idx,
        y: idx * 100,
        height: 100,
      };
    }) as unknown[] as Node[];
    mockSpreadSheetInstance.facet.getCellRange = () => {
      return {
        start: 0,
        end: 9,
      };
    };
    brushSelectionInstance = new BrushSelection(mockSpreadSheetInstance);
    brushSelectionInstance.brushSelectionStage =
      InteractionBrushSelectionStage.UN_DRAGGED;
    brushSelectionInstance.hidePrepareSelectMaskShape = jest.fn();
  });

  test('should register events', () => {
    expect(brushSelectionInstance.bindEvents).toBeDefined();
  });

  test('should not render invisible prepare select mask shape after rendered', () => {
    expect(brushSelectionInstance.prepareSelectMaskShape).not.toBeDefined();
  });

  test('should init brush selection stage', () => {
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
  });

  test('should render invisible prepare select mask shape after mouse down on the data cell', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
    });
    expect(brushSelectionInstance.prepareSelectMaskShape).toBeDefined();
    expect(
      brushSelectionInstance.prepareSelectMaskShape.attr('visible'),
    ).toBeFalsy();
  });

  test('should get start brush point when mouse down', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
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
    expect(brushSelectionInstance.displayedDataCells).toEqual(
      panelGroupAllDataCells,
    );
  });

  test('should skip brush selection if mouse not dragged', () => {
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
    });
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 12,
      clientY: 22,
    });
    emitEvent(S2Event.GLOBAL_MOUSE_UP, {});

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.BRUSH_SELECTION,
      ]),
    ).toBeFalsy();

    // 如果刷选距离过短, 则走单选的逻辑, 需要隐藏刷选提示框
    expect(
      brushSelectionInstance.hidePrepareSelectMaskShape,
    ).toHaveBeenCalled();
  });

  // https://github.com/antvis/S2/issues/852
  test('should clear brush selection state when mouse down and context menu clicked', () => {
    const globalMouseUp = jest.fn();
    mockSpreadSheetInstance.on(S2Event.GLOBAL_MOUSE_UP, globalMouseUp);

    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, {
      layerX: 10,
      layerY: 20,
    });
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 12,
      clientY: 22,
    });

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.DRAGGED,
    );

    emitEvent(S2Event.GLOBAL_CONTEXT_MENU, {});

    expect(globalMouseUp).not.toHaveBeenCalled();
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.HOVER,
      ]),
    ).toBeFalsy();
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.BRUSH_SELECTION,
      ]),
    ).toBeFalsy();
    expect(
      brushSelectionInstance.hidePrepareSelectMaskShape,
    ).toHaveReturnedTimes(1);
  });

  test('should skip brush selection if mouse move less than valid distance', () => {
    emitEvent(S2Event.GLOBAL_MOUSE_MOVE, {});

    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    expect(brushSelectionInstance.endBrushPoint).not.toBeDefined();
    expect(brushSelectionInstance.brushRangeDataCells).toHaveLength(0);
    expect(
      brushSelectionInstance.spreadsheet.interaction.hasIntercepts([
        InterceptType.HOVER,
      ]),
    ).toBeFalsy();
  });

  test('should get brush selection range cells', async () => {
    const selectedFn = jest.fn();
    const brushSelectionFn = jest.fn();

    mockSpreadSheetInstance.getCell = jest.fn(() => startBrushDataCell) as any;

    mockSpreadSheetInstance.on(S2Event.GLOBAL_SELECTED, selectedFn);
    mockSpreadSheetInstance.on(
      S2Event.DATE_CELL_BRUSH_SELECTION,
      brushSelectionFn,
    );

    // ================== mouse down ==================
    emitEvent(S2Event.DATA_CELL_MOUSE_DOWN, { layerX: 10, layerY: 20 });

    mockSpreadSheetInstance.getCell = jest.fn(() => endBrushDataCell) as any;
    // ================== mouse move ==================
    emitGlobalEvent(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 100,
      clientY: 200,
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
      y: 20,
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
    expect(mockSpreadSheetInstance.showTooltipWithInfo).toHaveBeenCalled();
    // reset brush stage
    expect(brushSelectionInstance.brushSelectionStage).toEqual(
      InteractionBrushSelectionStage.UN_DRAGGED,
    );
    // get brush range selected cells
    expect(brushSelectionInstance.brushRangeDataCells).toHaveLength(15);
    brushSelectionInstance.brushRangeDataCells.forEach((cell) => {
      const { rowIndex, colIndex } = cell.getMeta();
      expect(rowIndex).toBeLessThanOrEqual(endBrushDataCellMeta.rowIndex);
      expect(rowIndex).toBeGreaterThanOrEqual(startBrushDataCellMeta.rowIndex);
      expect(colIndex).toBeLessThanOrEqual(endBrushDataCellMeta.colIndex);
      expect(colIndex).toBeGreaterThanOrEqual(startBrushDataCellMeta.colIndex);
    });
    // emit event
    expect(selectedFn).toHaveBeenCalledTimes(1);
    expect(brushSelectionFn).toHaveBeenCalledTimes(1);
  });

  test('should get correct formatted brush point', async () => {
    const EXTRA_PIXEL = 2;
    const VSCROLLBAR_WIDTH = 5;
    const { width, height } = mockSpreadSheetInstance.facet.getCanvasHW();
    const minX = 10;
    const minY = 10;
    const maxY = height + 10;
    const maxX = width + 10;
    mockSpreadSheetInstance.facet.panelBBox = {
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
    mockSpreadSheetInstance.facet.vScrollBar = {
      getBBox: () =>
        ({
          width: VSCROLLBAR_WIDTH,
        } as any),
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

  test('shoud get correct selected cell metas', async () => {
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

  test('shoud get correct adjusted frozen rowIndex and colIndex', async () => {
    const { adjustNextColIndexWithFrozen, adjustNextRowIndexWithFrozen } =
      brushSelectionInstance;
    mockSpreadSheetInstance.setOptions({
      frozenColCount: 1,
      frozenRowCount: 1,
      frozenTrailingColCount: 1,
      frozenTrailingRowCount: 1,
    });
    mockSpreadSheetInstance.dataSet.getDisplayDataSet = () => {
      return Array.from(new Array(10)).map(() => {
        return {};
      });
    };
    (mockSpreadSheetInstance.facet as TableFacet).panelScrollGroupIndexes = [
      1, 8, 1, 8,
    ];

    expect(adjustNextColIndexWithFrozen(9, ScrollDirection.TRAILING)).toBe(8);
    expect(adjustNextColIndexWithFrozen(0, ScrollDirection.LEADING)).toBe(1);
    expect(adjustNextColIndexWithFrozen(7, ScrollDirection.TRAILING)).toBe(7);

    expect(adjustNextRowIndexWithFrozen(9, ScrollDirection.TRAILING)).toBe(8);
    expect(adjustNextRowIndexWithFrozen(0, ScrollDirection.LEADING)).toBe(1);
    expect(adjustNextRowIndexWithFrozen(7, ScrollDirection.TRAILING)).toBe(7);
  });

  test('shoud get correct scroll offset for row and col', async () => {
    const { facet } = mockSpreadSheetInstance;
    expect(
      getScrollOffsetForCol(
        7,
        ScrollDirection.LEADING,
        mockSpreadSheetInstance,
      ),
    ).toBe(700);
    expect(
      getScrollOffsetForCol(
        7,
        ScrollDirection.TRAILING,
        mockSpreadSheetInstance,
      ),
    ).toBe(200);

    (facet as TableFacet).frozenGroupInfo = {
      col: {
        width: 100,
      },
      trailingCol: {
        width: 100,
      },
    };

    expect(
      getScrollOffsetForCol(
        7,
        ScrollDirection.LEADING,
        mockSpreadSheetInstance,
      ),
    ).toBe(600);
    expect(
      getScrollOffsetForCol(
        7,
        ScrollDirection.TRAILING,
        mockSpreadSheetInstance,
      ),
    ).toBe(300);

    facet.panelBBox = {
      height: facet.getCanvasHW().height,
    } as any;

    facet.viewCellHeights = facet.getViewCellHeights(facet.layoutResult);

    expect(
      getScrollOffsetForRow(
        7,
        ScrollDirection.LEADING,
        mockSpreadSheetInstance,
      ),
    ).toBe(700);
    expect(
      getScrollOffsetForRow(
        7,
        ScrollDirection.TRAILING,
        mockSpreadSheetInstance,
      ),
    ).toBe(320);

    (facet as TableFacet).frozenGroupInfo = {
      row: {
        height: 100,
      },
      trailingRow: {
        height: 100,
      },
    };
    expect(
      getScrollOffsetForRow(
        7,
        ScrollDirection.LEADING,
        mockSpreadSheetInstance,
      ),
    ).toBe(600);
    expect(
      getScrollOffsetForRow(
        7,
        ScrollDirection.TRAILING,
        mockSpreadSheetInstance,
      ),
    ).toBe(420);
  });

  test('shoud get valid x and y index', async () => {
    const { validateXIndex, validateYIndex } = brushSelectionInstance;
    expect(validateXIndex(-1)).toBe(null);
    expect(validateXIndex(1)).toBe(1);
    expect(validateXIndex(10)).toBe(null);
    expect(validateXIndex(9)).toBe(9);

    expect(validateYIndex(-1)).toBe(null);
    expect(validateYIndex(1)).toBe(1);
    expect(validateYIndex(10)).toBe(null);
    expect(validateYIndex(9)).toBe(9);

    (mockSpreadSheetInstance.facet as TableFacet).frozenGroupInfo = {
      col: {
        range: [0, 1],
      },
      trailingCol: {
        range: [8, 9],
      },
      row: {
        range: [0, 1],
      },
      trailingRow: {
        range: [8, 9],
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
});
