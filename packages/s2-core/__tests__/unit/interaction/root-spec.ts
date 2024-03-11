import type { Canvas } from '@antv/g';
import { get } from 'lodash';
import { createMockCellInfo, sleep } from 'tests/util/helpers';
import type { PivotFacet } from '../../../src/facet';
import { Store } from '@/common/store';
import {
  BaseEvent,
  CellType,
  ColCellBrushSelection,
  CornerCellClick,
  DataCell,
  DataCellBrushSelection,
  DataCellClick,
  DataCellMultiSelection,
  GuiIcon,
  HoverEvent,
  InteractionName,
  InteractionStateName,
  InterceptType,
  MergedCell,
  MergedCellClick,
  Node,
  RangeSelection,
  RowCellBrushSelection,
  RowColumnClick,
  RowColumnResize,
  RowTextClick,
  SelectedCellMove,
  SpreadSheet,
  type S2Options,
} from '@/index';
import { RootInteraction } from '@/interaction/root';
import { mergeCell, unmergeCell } from '@/utils/interaction/merge-cell';
import { getCellMeta } from '@/utils/interaction/select-event';

jest.mock('@/sheet-type');
jest.mock('@/interaction/event-controller');
jest.mock('@/ui/hd-adapter');
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
      type: CellType.DATA_CELL,
      hideInteractionShape: jest.fn(),
      clearUnselectedState: jest.fn(),
      update: jest.fn(),
      cellType: CellType.DATA_CELL,
      getMeta: () => {
        return {
          colIndex: id,
          rowIndex: 1,
          id: `0-${id}`,
          x: 1,
        };
      },
    }) as unknown as DataCell;

  beforeEach(() => {
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
        brushSelection: true,
      },
    } as S2Options;
    mockSpreadSheetInstance.hideTooltip = jest.fn();
    mockSpreadSheetInstance.container = {
      render: jest.fn(),
    } as unknown as Canvas;
    mockSpreadSheetInstance.isTableMode = jest.fn();
    mockSpreadSheetInstance.isHierarchyTreeType = () => false;
    rootInteraction = new RootInteraction(mockSpreadSheetInstance);
    mockSpreadSheetInstance.facet = {
      getDataCells: () => panelGroupAllDataCells,
      getColCells: () => [],
      getRowCells: () => [],
      getCells: () => panelGroupAllDataCells,
      getCellChildrenNodes: () => [],
      getHeaderCells: () => [],
    } as unknown as PivotFacet;
    mockSpreadSheetInstance.interaction = rootInteraction;
  });

  afterEach(() => {
    rootInteraction.destroy();
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
    expect(mockSpreadSheetInstance.container.render).toHaveBeenCalledTimes(1);
  });

  test('should set all selected interaction state correct', () => {
    rootInteraction.selectAll();
    expect(rootInteraction.getState()).toEqual({
      stateName: InteractionStateName.ALL_SELECTED,
    });
  });

  test('should set header cell selected interaction state correct', () => {
    rootInteraction.selectHeaderCell({ cell: mockCell });
    const state = rootInteraction.getState();

    expect(state.stateName).toEqual(InteractionStateName.SELECTED);
    expect(state.cells).toEqual([getCellMeta(mockCell)]);
    expect(rootInteraction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
  });

  // https://github.com/antvis/S2/issues/1243
  test('should multi selected header cells', () => {
    jest
      .spyOn(rootInteraction, 'isEqualStateName')
      .mockImplementationOnce(() => false);

    const mockCellA = createMockCellInfo('test-A').mockCell;
    const mockCellB = createMockCellInfo('test-B').mockCell;

    // 选中 cellA
    rootInteraction.selectHeaderCell({
      cell: mockCellA,
      isMultiSelection: true,
    });

    expect(rootInteraction.getState().cells).toEqual([getCellMeta(mockCellA)]);

    // 选中 cellB
    rootInteraction.selectHeaderCell({
      cell: mockCellB,
      isMultiSelection: true,
    });

    expect(rootInteraction.getState().cells).toEqual([
      getCellMeta(mockCellA),
      getCellMeta(mockCellB),
    ]);

    // 再次选中 cellB
    rootInteraction.selectHeaderCell({
      cell: mockCellB,
      isMultiSelection: true,
    });

    // 取消选中
    expect(rootInteraction.getState().cells).toEqual([getCellMeta(mockCellA)]);
  });

  test('should disable multi selected header cells when cell type is difference', () => {
    jest
      .spyOn(rootInteraction, 'isEqualStateName')
      .mockImplementationOnce(() => false);

    const mockCellA = createMockCellInfo('test-A', {
      cellType: CellType.ROW_CELL,
    }).mockCell;
    const mockCellB = createMockCellInfo('test-B', {
      cellType: CellType.COL_CELL,
    }).mockCell;

    rootInteraction.selectHeaderCell({
      cell: mockCellA,
      isMultiSelection: true,
    });

    expect(rootInteraction.getState().cells).toEqual([getCellMeta(mockCellA)]);

    rootInteraction.selectHeaderCell({
      cell: mockCellB,
      isMultiSelection: true,
    });

    expect(rootInteraction.getState().cells).toEqual([getCellMeta(mockCellA)]);
  });

  test('should call merge cells', () => {
    rootInteraction.mergeCells();
    expect(mergeCell).toHaveBeenCalled();
  });

  test('should call cancel mergedCell', () => {
    let mergedCell: MergedCell;

    rootInteraction.unmergeCell(mergedCell!);
    expect(unmergeCell).toHaveBeenCalled();
  });

  test('should call hideColumns', async () => {
    const hideColumnsSpy = jest
      .spyOn(rootInteraction, 'hideColumns')
      .mockImplementation(() => Promise.resolve());

    await rootInteraction.hideColumns(['field1']);
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
    }, 100) as unknown as number;

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
    }, 100) as unknown as number;

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
      expect(mockSpreadSheetInstance.container.render).toHaveBeenCalled();
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
      expect(mockSpreadSheetInstance.container.render).not.toHaveBeenCalled();
    });

    test('should draw container when active cells is empty and enable force update', () => {
      rootInteraction.changeState({
        cells: [],
        stateName: InteractionStateName.SELECTED,
        force: true,
      });
      expect(mockSpreadSheetInstance.container.render).toHaveBeenCalled();
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

    test('should set selected status after highlight nodes', () => {
      const belongsCell = createMockCellInfo('test-A').mockCell;

      const mockNodeA = new Node({
        id: 'test',
        field: 'test',
        value: '1',
        belongsCell,
      });

      const mockNodeB = new Node({
        id: 'test',
        field: 'test',
        value: '1',
        belongsCell,
      });

      rootInteraction.highlightNodes([mockNodeA, mockNodeB]);

      [mockNodeA, mockNodeB].forEach((node) => {
        expect(node.belongsCell?.updateByState).toHaveBeenCalledWith(
          InteractionStateName.SELECTED,
          belongsCell,
        );
      });
    });

    test.each`
      stateName                           | handler
      ${InteractionStateName.SELECTED}    | ${'isSelectedState'}
      ${InteractionStateName.HOVER}       | ${'isHoverState'}
      ${InteractionStateName.HOVER_FOCUS} | ${'isHoverFocusState'}
    `('should get correctly %s state', ({ stateName, handler }) => {
      rootInteraction.changeState({
        cells: [getCellMeta(mockCell)],
        stateName,
      });
      // @ts-ignore
      expect(rootInteraction[handler]()).toBeTruthy();
      rootInteraction.resetState();
      // @ts-ignore
      expect(rootInteraction[handler]()).toBeFalsy();
    });

    test('should get current cell status is equal', () => {
      rootInteraction.changeState({ stateName: InteractionStateName.SELECTED });

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

    test('should get selected cell status', () => {
      const mockCellA = createMockCellInfo('cellA');

      expect(rootInteraction.isSelectedCell(mockCell)).toBeTruthy();
      expect(rootInteraction.isSelectedCell(mockCellA.mockCell)).toBeFalsy();
    });

    test('should get active cell status', () => {
      const mockCellA = createMockCellInfo('cellA');

      expect(rootInteraction.isActiveCell(mockCell)).toBeTruthy();
      expect(rootInteraction.isActiveCell(mockCellA.mockCell)).toBeFalsy();
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
        rootInteraction.hasIntercepts([
          InterceptType.DATA_CELL_BRUSH_SELECTION,
        ]),
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
      const timer = setTimeout(() => jest.fn(), 200) as unknown as number;

      rootInteraction.setHoverTimer(timer);

      expect(rootInteraction.getHoverTimer()).toEqual(timer);
    });

    test('should clear hover timer', async () => {
      let flag = false;
      const timer = setTimeout(() => {
        flag = true;
      }, 200) as unknown as number;

      rootInteraction.setHoverTimer(timer);
      rootInteraction.clearHoverTimer();

      await sleep(300);

      expect(flag).toBeFalsy();
    });
  });

  test('should get correctly default interaction size', () => {
    expect(defaultInteractionSize).toEqual(13);
  });

  test('should register default interaction', () => {
    rootInteraction = new RootInteraction(mockSpreadSheetInstance);
    expect(rootInteraction.interactions.size).toEqual(defaultInteractionSize);
    Object.keys(InteractionName).forEach((key) => {
      expect(
        rootInteraction.interactions.has(get(InteractionName, key)),
      ).toBeTruthy();
    });
  });

  test.each`
    key                                          | expected
    ${InteractionName.CORNER_CELL_CLICK}         | ${CornerCellClick}
    ${InteractionName.DATA_CELL_CLICK}           | ${DataCellClick}
    ${InteractionName.ROW_COLUMN_CLICK}          | ${RowColumnClick}
    ${InteractionName.ROW_TEXT_CLICK}            | ${RowTextClick}
    ${InteractionName.MERGED_CELLS_CLICK}        | ${MergedCellClick}
    ${InteractionName.HOVER}                     | ${HoverEvent}
    ${InteractionName.DATA_CELL_BRUSH_SELECTION} | ${DataCellBrushSelection}
    ${InteractionName.COL_CELL_BRUSH_SELECTION}  | ${ColCellBrushSelection}
    ${InteractionName.ROW_CELL_BRUSH_SELECTION}  | ${RowCellBrushSelection}
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

    mockSpreadSheetInstance.options.interaction!.customInteractions = [
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
    ${`resize`}           | ${InteractionName.COL_ROW_RESIZE}            | ${RowColumnResize}
    ${`multiSelection`}   | ${InteractionName.DATA_CELL_MULTI_SELECTION} | ${DataCellMultiSelection}
    ${`rangeSelection`}   | ${InteractionName.RANGE_SELECTION}           | ${RangeSelection}
    ${`selectedCellMove`} | ${InteractionName.SELECTED_CELL_MOVE}        | ${SelectedCellMove}
  `(
    'should disable interaction by options $option',
    ({ option, name, expected }) => {
      mockSpreadSheetInstance.options = {
        interaction: {
          [option]: false,
          brushSelection: true,
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

  test('should disable interaction by options brushSelection', () => {
    mockSpreadSheetInstance.options = {
      // brushSelection contains data, row and col brush selection
      interaction: {
        brushSelection: false,
      },
    } as unknown as S2Options;

    rootInteraction = new RootInteraction(mockSpreadSheetInstance);

    expect(rootInteraction.interactions.size).toEqual(
      defaultInteractionSize - 3,
    );
    expect(
      rootInteraction.interactions.has(
        InteractionName.DATA_CELL_BRUSH_SELECTION,
      ),
    ).toBeFalsy();
    expect(
      rootInteraction.interactions.has(
        InteractionName.COL_CELL_BRUSH_SELECTION,
      ),
    ).toBeFalsy();
    expect(
      rootInteraction.interactions.has(
        InteractionName.ROW_CELL_BRUSH_SELECTION,
      ),
    ).toBeFalsy();
    [...rootInteraction.interactions.values()].forEach((interaction) => {
      expect(interaction).not.toBeInstanceOf(DataCellBrushSelection);
      expect(interaction).not.toBeInstanceOf(ColCellBrushSelection);
      expect(interaction).not.toBeInstanceOf(RowCellBrushSelection);
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('should reset interaction when visibilitychange', () => {
    const resetSpyList = [...rootInteraction.interactions.values()].map(
      (interaction) => {
        return jest
          .spyOn(interaction, 'reset')
          .mockImplementationOnce(() => {});
      },
    );

    window.dispatchEvent(new Event('visibilitychange'));

    resetSpyList.forEach((resetSpy) => {
      expect(resetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
