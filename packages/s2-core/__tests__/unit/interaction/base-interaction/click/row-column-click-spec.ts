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

  const mockField = 'fieldA';
  const defaultHiddenField = '4';
  const mockCellViewMeta: Partial<ViewMeta> = {
    id: '1',
    colIndex: 0,
    rowIndex: 0,
    type: undefined,
    x: 1,
    field: mockField,
    update() {},
  };
  const mockCellMeta = omit(mockCellViewMeta, ['update', 'x', 'field']);
  const mockCell = {
    ...mockCellViewMeta,
    getMeta: () => mockCellViewMeta,
  };

  const initColumnNodes: Partial<Node>[] = [
    { field: mockField, colIndex: 1 },
    { field: '2', colIndex: 2 },
    { field: '3', colIndex: 3 },
    { field: defaultHiddenField, colIndex: 4 },
    { field: '5', colIndex: 5 },
  ];

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
    s2.getCell = () => mockCell as any;
    s2.interaction.getActiveCells = () => [mockCell] as unknown as S2CellType[];
    s2.interaction.getRowColActiveCells = () =>
      [mockCell] as unknown as S2CellType[];
    s2.interaction.reset = jest.fn();
    rowColumnClick = new RowColumnClick(s2 as unknown as SpreadSheet);
    s2.isHierarchyTreeType = () => false;
    s2.dataCfg = {
      fields: {
        columns: [mockField],
      },
      data: [],
    };
    s2.getInitColumnLeafNodes = () => initColumnNodes as Node[];
    s2.getColumnNodes = () => initColumnNodes as Node[];
    s2.getColumnLeafNodes = () => initColumnNodes as Node[];
    s2.options = {
      interaction: {
        hiddenColumnFields: ['a'],
      },
      tooltip: {
        showTooltip: true,
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

  test('should expand columns correctly', () => {
    const columnsExpand = jest.fn();
    s2.on(S2Event.LAYOUT_COLS_EXPANDED, columnsExpand);

    const mockNode: Partial<Node> = {
      field: 'a',
    };

    const defaultColumnsDetail: HiddenColumnsInfo[] = [
      {
        displaySiblingNode: { prev: null, next: mockNode as Node },
        hideColumnNodes: [mockNode] as Node[],
      },
    ];
    s2.store.set('hiddenColumnsDetail', defaultColumnsDetail);

    s2.emit(S2Event.LAYOUT_COLS_EXPANDED, mockNode as Node);

    // emit hook
    expect(columnsExpand).toHaveBeenCalled();
    // omit current expand node
    expect(s2.store.get('hiddenColumnsDetail')).toEqual([]);
    // reset interaction
    expect(s2.interaction.getState()).toEqual({
      cells: [],
      force: false,
    });
    // update options
    expect(s2.setOptions).toHaveBeenCalledWith({
      interaction: {
        hiddenColumnFields: [],
      },
    });
    // rerender
    expect(s2.render).toHaveBeenCalled();
  });

  test('should hidden columns correctly', () => {
    const columnsHidden = jest.fn();
    s2.on(S2Event.LAYOUT_COLS_HIDDEN, columnsHidden);

    // trigger hidden icon click
    rowColumnClick.hideSelectedColumns();

    // emit event
    expect(columnsHidden).toHaveBeenCalledWith(
      // current hidden column infos
      {
        displaySiblingNode: { prev: null, next: { colIndex: 2, field: '2' } },
        hideColumnNodes: [{ colIndex: 1, field: mockField }],
      },
      // hidden columns detail
      [
        {
          displaySiblingNode: { prev: null, next: { colIndex: 2, field: '2' } },
          hideColumnNodes: [{ colIndex: 1, field: mockField }],
        },
      ],
    );
    // reset interaction
    expect(s2.interaction.reset).toHaveBeenCalledTimes(1);
    // rerender table
    expect(s2.render).toHaveBeenCalledTimes(1);
  });
});
