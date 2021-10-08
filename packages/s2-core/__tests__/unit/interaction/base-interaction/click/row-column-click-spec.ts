import { Event as GEvent } from '@antv/g-canvas';
import { omit } from 'lodash';
import { createFakeSpreadSheet } from 'tests/util/helpers';
import { RowColumnClick } from '@/interaction/base-interaction/click';
import {
  HiddenColumnsInfo,
  S2CellType,
  S2Options,
  ViewMeta,
} from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { InteractionStateName, S2Event } from '@/common/constant';
import { Node } from '@/facet/layout/node';

jest.mock('@/interaction/event-controller');

describe('Interaction Data Cell Click Tests', () => {
  let rowColumnClick: RowColumnClick;
  let s2: SpreadSheet;
  const mockCellViewMeta: Partial<ViewMeta> = {
    id: '1',
    colIndex: 0,
    rowIndex: 0,
    type: undefined,
    x: 1,
    update() {},
  };
  const mockCellMeta = omit(mockCellViewMeta, ['update', 'x']);
  const mockCell = {
    ...mockCellViewMeta,
    getMeta: () => mockCellViewMeta,
  };

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCell as any;
    s2.interaction.getActiveCells = () => [mockCell] as unknown as S2CellType[];
    s2.interaction.getRowColActiveCells = () =>
      [mockCell] as unknown as S2CellType[];
    rowColumnClick = new RowColumnClick(
      s2 as unknown as SpreadSheet,
      s2.interaction,
    );
    s2.isHierarchyTreeType = () => false;
    s2.options = {
      hiddenColumnFields: ['a'],
      tooltip: {
        operation: {
          hiddenColumns: false,
        },
      },
    } as S2Options;
    s2.setOptions = jest.fn();
    s2.isTableMode = jest.fn(() => true);
  });

  test('should bind events', () => {
    expect(rowColumnClick.bindEvents).toBeDefined();
  });

  test('should trigger data cell click', () => {
    s2.emit(S2Event.ROW_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);
    expect(s2.interaction.getState()).toEqual({
      cells: [mockCellMeta],
      nodes: [],
      stateName: InteractionStateName.SELECTED,
    });
    expect(s2.showTooltipWithInfo).toHaveBeenCalled();
  });

  test('should emit cell selected event when cell clicked', () => {
    const selected = jest.fn();
    s2.on(S2Event.GLOBAL_SELECTED, selected);

    s2.emit(S2Event.ROW_CELL_CLICK, {
      stopPropagation() {},
    } as unknown as GEvent);
    expect(selected).toHaveBeenCalledWith([mockCell]);
  });

  test('should expand columns', () => {
    const colExpand = jest.fn();
    s2.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, colExpand);

    const mockNode: Partial<Node> = {
      field: 'a',
    };

    const defaultColumnsDetail: HiddenColumnsInfo[] = [
      {
        displaySiblingNode: mockNode as Node,
        hideColumnNodes: [mockNode] as Node[],
      },
    ];
    s2.store.set('hiddenColumnsDetail', defaultColumnsDetail);

    s2.emit(S2Event.LAYOUT_TABLE_COL_EXPANDED, mockNode as Node);

    // emit hook
    expect(colExpand).toHaveBeenCalled();
    // omit current expand node
    expect(s2.store.get('hiddenColumnsDetail')).toEqual([]);
    // reset interaction
    expect(s2.interaction.getState()).toEqual({
      cells: [],
      force: false,
    });
    // update options
    expect(s2.setOptions).toHaveBeenCalledWith({
      hiddenColumnFields: [],
    });
    // rerender
    expect(s2.render).toHaveBeenCalled();
  });
});
