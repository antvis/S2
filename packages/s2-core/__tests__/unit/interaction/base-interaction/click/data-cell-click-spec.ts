import {
  createFakeSpreadSheet,
  createMockCellInfo,
  sleep,
} from 'tests/util/helpers';
<<<<<<< HEAD
import type { GEvent } from '@/index';
=======
import type { Event as GEvent } from '@antv/g-canvas';
import type { InteractionCellHighlight, S2Options } from '@/common/interface';
>>>>>>> origin/master
import type { SpreadSheet } from '@/sheet-type';
import {
  HOVER_FOCUS_DURATION,
  InteractionName,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '@/common/constant';
import { CustomRect } from '@/engine';

jest.mock('@/interaction/event-controller');

describe('Interaction Data Cell Click Tests', () => {
  let s2: SpreadSheet;
  const mockCellInfo = createMockCellInfo('testId');

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCellInfo.mockCell as any;
    s2.options = {
      tooltip: {
        operation: {
          menu: {
            items: [],
          },
        },
      },
      interaction: {
        hoverHighlight: true,
      },
    };
    s2.isTableMode = jest.fn(() => true);
  });

  test('should bind events', () => {
    expect(
      s2.interaction.interactions.get(InteractionName.DATA_CELL_CLICK)!
        .bindEvents,
    ).toBeDefined();
  });

  test('should trigger data cell click', () => {
    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellInfo.mockCellMeta],
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: expect.any(Function),
    });
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should stay selected when firing double click', async () => {
    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    await sleep(100);

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellInfo.mockCellMeta],
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: expect.any(Function),
    });
  });

  test('should emit cell selected event when cell clicked', () => {
    const selected = jest.fn();

    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(selected).toHaveBeenCalledWith([mockCellInfo.mockCell]);
  });

  // https://github.com/antvis/S2/issues/2447
  test('should emit cell selected event when cell unselected', () => {
    jest
      .spyOn(s2.interaction, 'isSelectedCell')
      .mockImplementationOnce(() => true);

    const selected = jest.fn();
    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
      originalEvent: {
        detail: 1,
      },
    } as unknown as GEvent);

    expect(selected).toHaveBeenCalledWith([]);
  });

  test('should emit link field jump event when link field text click and not show tooltip', () => {
    const linkFieldJump = jest.fn();

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);

    const mockCellData = {
      valueField: 'valueField',
      data: { a: 1 },
    };

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
      target: new CustomRect(
        {
          style: {
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
        },
        {
          cellData: mockCellData,
          isLinkFieldText: true,
        },
      ),
    } as unknown as GEvent);

    expect(linkFieldJump).toHaveBeenCalledWith({
      field: mockCellData.valueField,
      cellData: mockCellData,
      record: mockCellData.data,
    });
    expect(s2.showTooltipWithInfo).not.toHaveBeenCalled();
    expect(s2.showTooltip).not.toHaveBeenCalled();
    expect(s2.interaction.getActiveCells()).toEqual([]);
  });

  test('should clear hover timer when data cell toggle click', async () => {
    const showTooltipWithInfoSpy = jest
      .spyOn(s2, 'showTooltipWithInfo')
      .mockImplementation(() => {});

    const event = {
      stopPropagation() {},
    } as unknown as GEvent;

    // trigger hover
    s2.emit(S2Event.DATA_CELL_HOVER, event);

    // select
    s2.emit(S2Event.DATA_CELL_CLICK, event);
    // unselect
    s2.emit(S2Event.DATA_CELL_CLICK, event);

    // wait hover focus time trigger
    await sleep(HOVER_FOCUS_DURATION + 500);

    expect(s2.interaction.isHoverFocusState()).toBeFalsy();

    // only call show tooltip once for cell clicked
    expect(showTooltipWithInfoSpy).toHaveReturnedTimes(1);
  });

  test('should always clear hover timer if have click intercept when data cell clicked', async () => {
    const clearHoverTimerSpy = jest
      .spyOn(s2.interaction, 'clearHoverTimer')
      .mockImplementationOnce(() => {});

    const event = {
      stopPropagation() {},
    } as unknown as GEvent;

    s2.interaction.addIntercepts([InterceptType.CLICK]);
    s2.emit(S2Event.DATA_CELL_CLICK, event);

    s2.interaction.removeIntercepts([InterceptType.CLICK]);
    s2.emit(S2Event.DATA_CELL_CLICK, event);

    // wait hover focus time trigger
    await sleep(HOVER_FOCUS_DURATION + 500);

    expect(s2.interaction.isHoverFocusState()).toBeFalsy();
    expect(clearHoverTimerSpy).toHaveBeenCalledTimes(2);
  });
<<<<<<< HEAD
=======

  test('should highlight the column header cell and row header cell when data cell clicked', () => {
    const headerCellId0 = 'header-0';
    const headerCellId1 = 'header-1';
    const columnNode: Array<Partial<Node>> = [
      {
        belongsCell: {
          getMeta: () => ({
            id: headerCellId0,
            colIndex: -1,
            rowIndex: -1,
          }),
        } as any,
        id: headerCellId0,
      },
      {
        belongsCell: {
          getMeta: () => ({
            id: headerCellId1,
            colIndex: -1,
            rowIndex: -1,
          }),
        } as any,
        id: headerCellId1,
      },
    ];
    s2.getColumnNodes = jest.fn(() => columnNode) as any;
    s2.getRowNodes = jest.fn(() => []);

    const firstDataCellInfo = createMockCellInfo(
      `${headerCellId0}[&]first-data-cell`,
    );
    s2.getCell = () => firstDataCellInfo.mockCell as any;

    s2.setOptions({
      interaction: {
        selectedCellHighlight: {
          colHeader: true,
          rowHeader: true,
        } as InteractionCellHighlight,
      },
    });

    const mockHeaderCellInfo = createMockCellInfo(headerCellId0, {
      colIndex: columnNode[0].belongsCell.getMeta().colIndex,
      rowIndex: columnNode[0].belongsCell.getMeta().rowIndex,
    });

    s2.interaction.updateCells = jest.fn();
    s2.interaction.getAllColHeaderCells = jest.fn();
    s2.interaction.getAllRowHeaderCells = jest.fn();

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);

    expect(s2.interaction.getState()).toEqual({
      cells: [firstDataCellInfo.mockCellMeta],
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: expect.any(Function),
    });
    expect(s2.interaction.updateCells).toHaveBeenCalled();
    expect(s2.interaction.getAllColHeaderCells).toHaveBeenCalled();
    expect(s2.interaction.getAllRowHeaderCells).toHaveBeenCalled();
  });
>>>>>>> origin/master
});
