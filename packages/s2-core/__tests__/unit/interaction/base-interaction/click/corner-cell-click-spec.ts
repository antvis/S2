import {
  createFakeSpreadSheet,
  createMockCellInfo,
  sleep,
} from 'tests/util/helpers';
import {
  CornerNodeType,
  InteractionStateName,
  type Node,
} from '../../../../../src';
import { InterceptType, S2Event } from '@/common/constant';
import type { HierarchyType, S2Options } from '@/common/interface';
import type { GEvent } from '@/index';
import { CornerCellClick } from '@/interaction';
import type { SpreadSheet } from '@/sheet-type';

jest.mock('@/interaction/event-controller');

describe('Interaction Corner Cell Click Tests', () => {
  let s2: SpreadSheet;
  const mockCellInfo = createMockCellInfo('testId', {
    cornerType: CornerNodeType.Row,
  });
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
    s2.facet.getRowNodes = () => [mockCellInfo.mockCell.getMeta() as Node];
    s2.facet.getRowNodesByField = () => [
      mockCellInfo.mockCell.getMeta() as Node,
    ];
    cornerCellClick = new CornerCellClick(s2);
  });

  test('should bind events', () => {
    expect(cornerCellClick.bindEvents).toBeDefined();
  });

  test.each(['grid', 'tree'] as HierarchyType[])(
    'should select current column cells when row corner cell click by %s mode',
    async (hierarchyType) => {
      s2.setOptions({ hierarchyType });
      await s2.render();

      const selected = jest.fn();

      s2.on(S2Event.GLOBAL_SELECTED, selected);

      s2.emit(S2Event.CORNER_CELL_CLICK, {} as unknown as GEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTruthy();
      expect(s2.showTooltipWithInfo).toHaveBeenCalledWith(
        expect.anything(),
        [],
        {
          data: { summaries: [{ name: '', selectedData: [], value: null }] },
        },
      );
      expect(s2.interaction.getState()).toEqual({
        cells: [
          {
            colIndex: -1,
            rowIndex: -1,
            id: mockCellInfo.mockCellMeta['id'],
          },
        ],
        stateName: InteractionStateName.SELECTED,
      });
      expect(selected).toHaveBeenCalled();
    },
  );

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
