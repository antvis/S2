import {
  createFakeSpreadSheet,
  createMockCellInfo,
  sleep,
} from 'tests/util/helpers';
import { Event as GEvent } from '@antv/g-canvas';
import { S2Options } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
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
    } as S2Options;
    s2.isTableMode = jest.fn(() => true);
    s2.interaction.reset = jest.fn();
    cornerCellClick = new CornerCellClick(s2);
  });

  test('should bind events', () => {
    expect(cornerCellClick.bindEvents).toBeDefined();
  });

  test('should reset interaction and add hover intercepts after corner cell click', () => {
    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
    expect(s2.interaction.reset).toHaveBeenCalled();
  });

  test('should remove hover intercepts after corner cell click if tooltip is hidden', async () => {
    s2.tooltip.visible = false;
    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    await sleep(500);
    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalsy();
  });

  test('should not remove hover intercepts after corner cell click when display tooltip', async () => {
    s2.tooltip.visible = true;
    s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

    await sleep(500);
    expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
  });
});
