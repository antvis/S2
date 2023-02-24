import {
  createFakeSpreadSheet,
  createMockCellInfo,
  sleep,
} from 'tests/util/helpers';
import type { Event as GEvent } from '@antv/g-canvas';
import { CellTypes, InteractionStateName, type Node } from '../../../../../src';
import type { S2Options } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';
import { InterceptType, S2Event } from '@/common/constant';
import { CornerCellClick } from '@/interaction';

jest.mock('@/interaction/event-controller');

describe('Interaction Corner Cell Click Tests', () => {
  let s2: SpreadSheet;
  const mockCellInfo = createMockCellInfo('testId');
  let cornerCellClick: CornerCellClick;

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCellInfo.mockCell as any;
    s2.options = {
      tooltip: {
        operation: {
          trend: false,
        },
      },
      interaction: {
        selectedCellsSpotlight: false,
      },
    } as S2Options;
    s2.isTableMode = jest.fn(() => true);
    s2.interaction.reset = jest.fn();
    s2.getRowNodes = () => [mockCellInfo.mockCell.getMeta() as Node];
    cornerCellClick = new CornerCellClick(s2);
  });

  test('should bind events', () => {
    expect(cornerCellClick.bindEvents).toBeDefined();
  });

  test('should select current column cells when row corner cell click', () => {
    const selected = jest.fn();
    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
    expect(s2.showTooltipWithInfo).toHaveBeenCalledWith(expect.anything(), [], {
      data: { summaries: [{ name: '', selectedData: [], value: null }] },
    });
    expect(s2.interaction.getState()).toEqual({
      cells: [
        {
          colIndex: -1,
          rowIndex: -1,
          type: CellTypes.ROW_CELL,
          id: mockCellInfo.mockCellMeta.id,
        },
      ],
      stateName: InteractionStateName.SELECTED,
    });
    expect(selected).toHaveBeenCalled();
  });

  test('should not select current column cells when column corner cell click', () => {
    s2.getCell = () => null;

    const selected = jest.fn();
    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();
    expect(s2.showTooltipWithInfo).not.toHaveBeenCalled();
    expect(s2.interaction.getCells()).toBeEmpty();
    expect(selected).not.toHaveBeenCalled();
  });

  test('should not remove hover intercepts after corner cell click when display tooltip', async () => {
    s2.tooltip.visible = true;
    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    await sleep(500);
    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
  });
});
