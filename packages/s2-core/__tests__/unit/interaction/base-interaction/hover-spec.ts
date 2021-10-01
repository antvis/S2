import { Canvas, Event as GEvent } from '@antv/g-canvas';
import EE from '@antv/event-emitter';
import { omit } from 'lodash';
import { sleep } from './../../../util/helpers';
import { S2Options, ViewMeta } from '@/common/interface';
import { Store } from '@/common/store';
import { HoverEvent } from '@/interaction/base-interaction/hover';
import { SpreadSheet } from '@/sheet-type';
import { RootInteraction } from '@/interaction/root';
import { InteractionStateName, S2Event } from '@/common/constant';

jest.mock('@/interaction/event-controller');

class FakeSpreadSheet extends EE {}

describe('Interaction Hover Tests', () => {
  let hoverEvent: HoverEvent;
  let s2: SpreadSheet;
  let interaction: RootInteraction;
  const mockCell: Partial<ViewMeta> = {
    id: '1',
    colIndex: 0,
    rowIndex: 0,
    type: undefined,
  };
  const mockCellMeta = omit(mockCell, 'update');
  const mockCellUpdate = jest.fn();

  beforeEach(() => {
    s2 = new FakeSpreadSheet() as unknown as SpreadSheet;
    s2.getCell = () =>
      ({
        update: mockCellUpdate,
        getMeta: () => mockCell,
      } as any);
    s2.store = new Store();
    interaction = new RootInteraction(s2 as unknown as SpreadSheet);
    hoverEvent = new HoverEvent(s2 as unknown as SpreadSheet, interaction);
    s2.interaction = interaction;
    s2.container = {
      draw: jest.fn(),
    } as unknown as Canvas;
    s2.options = {
      hoverHighlight: true,
    } as S2Options;
    s2.hideTooltip = jest.fn();
    s2.showTooltipWithInfo = jest.fn();
    s2.isTableMode = jest.fn(() => true);
  });

  afterEach(() => {
    mockCellUpdate.mockReset();
  });

  afterAll(() => {
    mockCellUpdate.mockRestore();
  });

  test('should bind events', () => {
    expect(hoverEvent.bindEvents).toBeDefined();
  });

  test('should trigger data cell hover', async () => {
    s2.emit(S2Event.DATA_CELL_HOVER, { target: {} } as GEvent);
    expect(interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });

    await sleep(1000);

    expect(interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER_FOCUS,
    });
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should trigger row cell hover', async () => {
    s2.emit(S2Event.ROW_CELL_HOVER, { target: {} } as GEvent);
    expect(interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });
    expect(mockCellUpdate).toHaveBeenCalled();
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should trigger col cell hover', async () => {
    s2.emit(S2Event.COL_CELL_HOVER, { target: {} } as GEvent);
    expect(interaction.getState()).toEqual({
      cells: [mockCellMeta],
      stateName: InteractionStateName.HOVER,
    });
    expect(mockCellUpdate).toHaveBeenCalled();
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });
});
