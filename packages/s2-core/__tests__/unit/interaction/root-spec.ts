import { Canvas, Group } from '@antv/g-canvas';
import { getCellMeta } from 'src/utils/interaction/select-event';
import { sleep } from 'tests/util/helpers';
import { RootInteraction } from '@/interaction/root';
import {
  CellTypes,
  InteractionStateName,
  InterceptType,
  RowCell,
  DataCell,
  S2Options,
  SpreadSheet,
  MergedCell,
  InteractionName,
  DataCellClick,
  RowColumnClick,
  RowTextClick,
  MergedCellClick,
  HoverEvent,
  BrushSelection,
  RowColumnResize,
  DataCellMultiSelection,
  RangeSelection,
  SelectedCellMove,
  BaseEvent,
  GuiIcon,
} from '@/index';
import { Store } from '@/common/store';
import { mergeCell, unmergeCell } from '@/utils/interaction/merge-cell';

jest.mock('@/sheet-type');
jest.mock('@/interaction/event-controller');
jest.mock('@/utils/interaction/merge-cell', () => {
  return {
    mergeCell: jest.fn(),
    unmergeCell: jest.fn(),
  };
});
const MockSpreadSheet = SpreadSheet as unknown as jest.Mock<SpreadSheet>;

describe('RootInteraction Tests', () => {
  let rootInteraction: RootInteraction;
  let mockSpreadSheetInstance: SpreadSheet;
  let panelGroupAllDataCells: DataCell[];
  let mockCell: DataCell;
  const defaultInteractionSize = Object.keys(InteractionName).length;

  const getMockCell = (id: number) =>
    ({
      type: CellTypes.DATA_CELL,
      hideInteractionShape: jest.fn(),
      clearUnselectedState: jest.fn(),
      update: jest.fn(),
      cellType: CellTypes.DATA_CELL,
      getMeta: () => {
        return {
          colIndex: id,
          rowIndex: 1,
          id: `0-${id}`,
          x: 1,
        };
      },
    } as unknown as DataCell);

  beforeAll(() => {
    MockSpreadSheet.mockClear();
    panelGroupAllDataCells = Array.from<DataCell>({ length: 10 }).map(
      (_, idx) => getMockCell(idx),
    );
    mockCell = panelGroupAllDataCells[0];
    mockSpreadSheetInstance = new MockSpreadSheet();
    mockSpreadSheetInstance.store = new Store();
    mockSpreadSheetInstance.options = {
      interaction: {
        selectedCellsSpotlight: false,
      },
    } as S2Options;
    mockSpreadSheetInstance.hideTooltip = jest.fn();
    mockSpreadSheetInstance.container = {
      draw: jest.fn(),
    } as unknown as Canvas;
    mockSpreadSheetInstance.panelGroup = new Group('');
    mockSpreadSheetInstance.isTableMode = jest.fn();
    rootInteraction = new RootInteraction(mockSpreadSheetInstance);
    rootInteraction.getPanelGroupAllDataCells = () => panelGroupAllDataCells;
    rootInteraction.getAllColHeaderCells = () => [];
    rootInteraction.getAllRowHeaderCells = () => [];
    mockSpreadSheetInstance.interaction = rootInteraction;
  });

  test('should get default interaction state', () => {
    expect(rootInteraction.getState()).toEqual({
      cells: [],
      force: false,
    });
  });

  test('should set interaction state correct', () => {
    rootInteraction.setState({
      cells: [getCellMeta(mockCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(rootInteraction.getState()).toEqual({
      cells: [getCellMeta(mockCell)],
      stateName: InteractionStateName.SELECTED,
    });
  });

  test('should clear interaction state correct', () => {
    const icon = new GuiIcon({
      name: '',
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });
    mockSpreadSheetInstance.store.set('visibleActionIcons', [icon]);
    rootInteraction.setState({
      cells: [getCellMeta(mockCell)],
      stateName: InteractionStateName.SELECTED,
    });
    rootInteraction.setInteractedCells(mockCell);
    rootInteraction.addIntercepts([InterceptType.CLICK]);

    rootInteraction.clearState();

    // clear state
    expect(rootInteraction.getState()).toEqual({
      cells: [],
      force: false,
    });
    expect(rootInteraction.getActiveCells()).toHaveLength(0);
    expect(rootInteraction.getCells()).toHaveLength(0);
    // hide action icon
    expect(icon.get('visible')).toBeFalsy();
    // reset icon store
    expect(
      mockSpreadSheetInstance.store.get('visibleActionIcons'),
    ).toHaveLength(0);
    // hide interaction shape
    expect(mockCell.hideInteractionShape).toHaveBeenCalledTimes(1);
    // draw call
    expect(mockSpreadSheetInstance.container.draw).toHaveBeenCalledTimes(1);
  });

  test('should set all selected interaction state correct', () => {
    rootInteraction.selectAll();
    expect(rootInteraction.getState()).toEqual({
      stateName: InteractionStateName.ALL_SELECTED,
    });
  });

  test('should set headerCell selected interaction state correct', () => {
    rootInteraction.selectHeaderCell({ cell: mockCell });
    const state = rootInteraction.getState();
    expect(state.stateName).toEqual(InteractionStateName.SELECTED);
    expect(state.cells).toEqual([getCellMeta(mockCell)]);
  });

  test('should call merge cells', () => {
    rootInteraction.mergeCells();
    expect(mergeCell).toBeCalled();
  });

  test('should call cancel mergedCell', () => {
    let mergedCell: MergedCell;
    rootInteraction.unmergeCell(mergedCell);
    expect(unmergeCell).toBeCalled();
  });

  test('should call hideColumns', () => {
    const hideColumnsSpy = jest
      .spyOn(rootInteraction, 'hideColumns')
      .mockImplementation(() => {});

    rootInteraction.hideColumns(['field1']);
    expect(hideColumnsSpy).toHaveBeenCalledTimes(1);
  });

  test('should get default interacted cells', () => {
    expect(rootInteraction.getInteractedCells()).toEqual([]);
  });

  test('should set interacted cell', () => {
    rootInteraction.setInteractedCells(mockCell);
    expect(rootInteraction.getInteractedCells()).toEqual([mockCell]);
    rootInteraction.setInteractedCells(mockCell);
    expect(rootInteraction.getInteractedCells()).toEqual([mockCell, mockCell]);
  });

  test('should reset interaction', async () => {
    let flag = false;
    const hoverTimer = setTimeout(() => {
      flag = true;
    }, 100);

    rootInteraction.setState({
      cells: [getCellMeta(mockCell)],
      stateName: InteractionStateName.SELECTED,
    });
    rootInteraction.setInteractedCells(mockCell);
    rootInteraction.addIntercepts([InterceptType.CLICK]);
    rootInteraction.setHoverTimer(hoverTimer);

    rootInteraction.reset();

    await sleep(200);

    // reset intercept
    expect(rootInteraction.intercepts.size).toEqual(0);
    // clear hover focus timer
    expect(flag).toBeFalsy();
    // reset state
    expect(rootInteraction.getState()).toEqual({
      cells: [],
      force: false,
    });
    // hide tooltip
    expect(mockSpreadSheetInstance.hideTooltip).toHaveBeenCalled();
  });

  test('should destroy interaction', async () => {
    let flag = false;
    const hoverTimer = setTimeout(() => {
      flag = true;
    }, 100);

    rootInteraction.setState({
      cells: [getCellMeta(mockCell)],
      stateName: InteractionStateName.SELECTED,
    });
    rootInteraction.setInteractedCells(mockCell);
    rootInteraction.addIntercepts([InterceptType.CLICK]);
    rootInteraction.setHoverTimer(hoverTimer);

    rootInteraction.destroy();

    await sleep(200);

    // reset intercept
    expect(rootInteraction.intercepts.size).toEqual(0);
    // clear registered interactions
    expect(rootInteraction.interactions.size).toEqual(0);
    // clear hover focus timer
    expect(flag).toBeFalsy();
    // reset state
    expect(rootInteraction.getState()).toEqual({
      cells: [],
      force: false,
    });
    // clear events
    expect(rootInteraction.eventController.canvasEventHandlers).toBeFalsy();
    expect(rootInteraction.eventController.s2EventHandlers).toBeFalsy();
    expect(rootInteraction.eventController.domEventListeners).toBeFalsy();
  });

  describe('RootInteraction Change State', () => {
    test('should update cell style when update interaction state', () => {
      const cells = [mockCell, mockCell, mockCell];
      rootInteraction.changeState({
        cells: cells.map((item) => getCellMeta(item)),
        stateName: InteractionStateName.SELECTED,
      });
      expect(mockSpreadSheetInstance.container.draw).toHaveBeenCalled();
      panelGroupAllDataCells.forEach((cell) => {
        expect(cell.update).toHaveBeenCalled();
      });
    });

    test('should unselect cell when force update empty cells', () => {
      rootInteraction.changeState({
        cells: [getCellMeta(mockCell)],
        stateName: InteractionStateName.SELECTED,
      });
      rootInteraction.changeState({
        cells: [],
        stateName: InteractionStateName.SELECTED,
        force: true,
      });
      expect(rootInteraction.getCurrentStateName()).toEqual(
        InteractionStateName.UNSELECTED,
      );
    });

    test('should skip draw container when active cells is empty', () => {
      rootInteraction.changeState({
        cells: [],
        stateName: InteractionStateName.SELECTED,
      });
      expect(mockSpreadSheetInstance.container.draw).not.toHaveBeenCalled();
    });

    test('should draw container when active cells is empty and enable force update', () => {
      rootInteraction.changeState({
        cells: [],
        stateName: InteractionStateName.SELECTED,
        force: true,
      });
      expect(mockSpreadSheetInstance.container.draw).toHaveBeenCalled();
    });

    test('should update last selected cells when repeated call changeState', () => {
      rootInteraction.changeState({
        cells: [getCellMeta(mockCell)],
        stateName: InteractionStateName.SELECTED,
      });
      rootInteraction.setInteractedCells(mockCell);
      rootInteraction.changeState({
        cells: [getCellMeta(mockCell), getCellMeta(mockCell)],
        stateName: InteractionStateName.SELECTED,
      });
      expect(rootInteraction.getActiveCells()).toHaveLength(2);
    });
  });

  describe('RootInteraction Calc Utils Tests', () => {
    beforeEach(() => {
      rootInteraction.setState({
        cells: [getCellMeta(mockCell)],
        stateName: InteractionStateName.SELECTED,
      });
    });

    test('should get current interaction state name', () => {
      expect(rootInteraction.getCurrentStateName()).toEqual(
        InteractionStateName.SELECTED,
      );
      rootInteraction.resetState();
      expect(rootInteraction.getCurrentStateName()).toBeUndefined();
    });

    test('should get current active cells count', () => {
      expect(rootInteraction.getCells().length).toStrictEqual(1);
      rootInteraction.resetState();
      expect(rootInteraction.getCells().length).toStrictEqual(0);
    });

    test('should get current active cells', () => {
      expect(rootInteraction.getActiveCells()).toEqual([
        panelGroupAllDataCells[0],
      ]);
      rootInteraction.resetState();
      expect(rootInteraction.getActiveCells()).toEqual([]);
    });

    test.each`
      stateName                        | handler
      ${InteractionStateName.SELECTED} | ${'isSelectedState'}
      ${InteractionStateName.HOVER}    | ${'isHoverState'}
    `('should get correctly %o state', ({ stateName, handler }) => {
      rootInteraction.changeState({
        cells: [getCellMeta(mockCell)],
        stateName: stateName,
      });
      expect(rootInteraction[handler]()).toBeTruthy();
      rootInteraction.resetState();
      expect(rootInteraction[handler]()).toBeFalsy();
    });

    test('should get current cell status is equal', () => {
      expect(
        rootInteraction.isEqualStateName('' as InteractionStateName),
      ).toBeFalsy();
      expect(
        rootInteraction.isEqualStateName(InteractionStateName.HOVER_FOCUS),
      ).toBeFalsy();
      expect(
        rootInteraction.isEqualStateName(InteractionStateName.SELECTED),
      ).toBeTruthy();
    });

    test('should get target cell is selected status', () => {
      const mockRowCell = {
        type: CellTypes.ROW_CELL,
        cellType: CellTypes.ROW_CELL,
        getMeta: () => {
          return {
            colIndex: 0,
            rowIndex: 1,
            id: '0-1',
          };
        },
      } as unknown as RowCell;
      expect(rootInteraction.isSelectedCell(mockCell)).toBeTruthy();
      expect(rootInteraction.isSelectedCell(mockRowCell)).toBeFalsy();
    });
  });

  describe('RootInteraction Intercepts Tests', () => {
    test('should get current interaction state name', () => {
      rootInteraction.addIntercepts([
        InterceptType.HOVER,
        InterceptType.HOVER,
        InterceptType.CLICK,
      ]);
      expect(rootInteraction.intercepts.size).toEqual(2);
    });

    test('should check intercepts status correct', () => {
      rootInteraction.addIntercepts([InterceptType.HOVER, InterceptType.CLICK]);
      expect(rootInteraction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
      expect(rootInteraction.hasIntercepts([InterceptType.CLICK])).toBeTruthy();
      expect(
        rootInteraction.hasIntercepts([
          InterceptType.HOVER,
          InterceptType.CLICK,
        ]),
      ).toBeTruthy();
      expect(
        rootInteraction.hasIntercepts([InterceptType.BRUSH_SELECTION]),
      ).toBeFalsy();
    });

    test('should remove intercepts correct', () => {
      rootInteraction.addIntercepts([InterceptType.HOVER, InterceptType.CLICK]);
      expect(
        rootInteraction.hasIntercepts([
          InterceptType.HOVER,
          InterceptType.CLICK,
        ]),
      ).toBeTruthy();
      rootInteraction.removeIntercepts([InterceptType.CLICK]);
      expect(rootInteraction.hasIntercepts([InterceptType.CLICK])).toBeFalsy();
      expect(rootInteraction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
    });
  });

  describe('RootInteraction Hover Timer Tests', () => {
    test('should save hover timer', () => {
      const timer = setTimeout(() => jest.fn(), 200);

      rootInteraction.setHoverTimer(timer);

      expect(rootInteraction.getHoverTimer()).toEqual(timer);
    });

    test('should clear hover timer', async () => {
      let flag = false;
      const timer = setTimeout(() => {
        flag = true;
      }, 200);

      rootInteraction.setHoverTimer(timer);
      rootInteraction.clearHoverTimer();

      await sleep(300);

      expect(flag).toBeFalsy();
    });
  });

  test('should get correctly default interaction size', () => {
    expect(defaultInteractionSize).toEqual(10);
  });

  test('should register default interaction', () => {
    rootInteraction = new RootInteraction(mockSpreadSheetInstance);
    expect(rootInteraction.interactions.size).toEqual(defaultInteractionSize);
    Object.keys(InteractionName).forEach((key) => {
      expect(
        rootInteraction.interactions.has(InteractionName[key]),
      ).toBeTruthy();
    });
  });

  test.each`
    key                                          | expected
    ${InteractionName.DATA_CELL_CLICK}           | ${DataCellClick}
    ${InteractionName.ROW_COLUMN_CLICK}          | ${RowColumnClick}
    ${InteractionName.ROW_TEXT_CLICK}            | ${RowTextClick}
    ${InteractionName.MERGED_CELLS_CLICK}        | ${MergedCellClick}
    ${InteractionName.HOVER}                     | ${HoverEvent}
    ${InteractionName.BRUSH_SELECTION}           | ${BrushSelection}
    ${InteractionName.COL_ROW_RESIZE}            | ${RowColumnResize}
    ${InteractionName.DATA_CELL_MULTI_SELECTION} | ${DataCellMultiSelection}
    ${InteractionName.RANGE_SELECTION}           | ${RangeSelection}
    ${InteractionName.SELECTED_CELL_MOVE}        | ${SelectedCellMove}
  `(
    'should register correctly interaction instance for %o',
    ({ key, expected }) => {
      // 保证对应的交互实例注册正确
      expect(rootInteraction.interactions.get(key)).toBeInstanceOf(expected);
    },
  );

  test('should register custom interaction', () => {
    class MyInteraction extends BaseEvent {
      bindEvents() {}
    }

    const customInteraction = {
      key: 'customInteraction',
      interaction: MyInteraction,
    };

    mockSpreadSheetInstance.options.interaction.customInteractions = [
      customInteraction,
    ];

    rootInteraction = new RootInteraction(mockSpreadSheetInstance);
    expect(rootInteraction.interactions.size).toEqual(
      defaultInteractionSize + 1,
    );
    expect(
      rootInteraction.interactions.has(customInteraction.key),
    ).toBeTruthy();
    expect(
      rootInteraction.interactions.get(customInteraction.key),
    ).toBeInstanceOf(MyInteraction);
  });

  test.each`
    option                | name                                         | expected
    ${`brushSelection`}   | ${InteractionName.BRUSH_SELECTION}           | ${BrushSelection}
    ${`resize`}           | ${InteractionName.COL_ROW_RESIZE}            | ${RowColumnResize}
    ${`multiSelection`}   | ${InteractionName.DATA_CELL_MULTI_SELECTION} | ${DataCellMultiSelection}
    ${`rangeSelection`}   | ${InteractionName.RANGE_SELECTION}           | ${RangeSelection}
    ${`selectedCellMove`} | ${InteractionName.SELECTED_CELL_MOVE}        | ${SelectedCellMove}
  `(
    'should disable interaction by options %o',
    ({ option, name, expected }) => {
      mockSpreadSheetInstance.options = {
        interaction: {
          [option]: false,
        },
      } as unknown as S2Options;

      rootInteraction = new RootInteraction(mockSpreadSheetInstance);
      expect(rootInteraction.interactions.size).toEqual(
        defaultInteractionSize - 1,
      );
      expect(rootInteraction.interactions.has(name)).toBeFalsy();
      [...rootInteraction.interactions.values()].forEach((interaction) => {
        expect(interaction).not.toBeInstanceOf(expected);
      });
    },
  );
});
