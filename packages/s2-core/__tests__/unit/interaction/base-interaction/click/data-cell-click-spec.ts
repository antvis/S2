import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import { Event as GEvent } from '@antv/g-canvas';
import { DataCellClick } from '@/interaction/base-interaction/click';
import { S2Options } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { InteractionStateName, S2Event } from '@/common/constant';

jest.mock('@/interaction/event-controller');

describe('Interaction Data Cell Click Tests', () => {
  let dataCellClick: DataCellClick;
  let s2: SpreadSheet;
  const mockCellInfo = createMockCellInfo('testId');

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCellInfo as any;
    dataCellClick = new DataCellClick(s2 as unknown as SpreadSheet);
    s2.options = {
      tooltip: {
        operation: {
          trend: false,
        },
      },
    } as S2Options;
    s2.isTableMode = jest.fn(() => true);
  });

  test('should bind events', () => {
    expect(dataCellClick.bindEvents).toBeDefined();
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

  test('should emit cell selected event when cell clicked', () => {
    const selected = jest.fn();
    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);
    expect(selected).toHaveBeenCalledWith([mockCellInfo.mockCell]);
  });

  test('should emit link field jump event when link field text click', () => {
    const linkFieldJump = jest.fn();
    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);

    const mockCellData = {
      valueField: 'valueField',
      data: { a: 1 },
    };
    s2.emit(S2Event.DATA_CELL_CLICK, {
      stopPropagation() {},
      target: {
        attrs: {
          appendInfo: {
            cellData: mockCellData,
            isRowHeaderText: true,
          },
        },
      },
    } as unknown as GEvent);

    expect(linkFieldJump).toHaveBeenCalledWith({
      key: mockCellData.valueField,
      record: mockCellData.data,
    });
  });
});
