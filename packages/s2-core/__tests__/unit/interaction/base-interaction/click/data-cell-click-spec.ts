import {
  createFakeSpreadSheet,
  createMockCellInfo,
  sleep,
} from 'tests/util/helpers';
import type { GEvent } from '@/index';
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
          menus: [],
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
});
