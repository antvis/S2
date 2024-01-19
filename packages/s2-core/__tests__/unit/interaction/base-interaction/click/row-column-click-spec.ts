import { omit } from 'lodash';
import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import type { GEvent } from '@/index';
import { RowColumnClick } from '@/interaction/base-interaction/click';
import type {
  HiddenColumnsInfo,
  S2CellType,
  S2Options,
  ViewMeta,
} from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '@/common/constant';
import type { Node } from '@/facet/layout/node';
import { CustomRect } from '@/engine';

jest.mock('@/interaction/event-controller');

describe('Interaction Row & Column Cell Click Tests', () => {
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
    s2.facet.getHeaderCells = () => [mockCell] as unknown as S2CellType[];
    rowColumnClick = new RowColumnClick(s2 as unknown as SpreadSheet);
    s2.isHierarchyTreeType = () => false;
    s2.dataCfg = {
      fields: {
        columns: [mockField],
      },
      data: [],
    };
    s2.facet.getCellChildrenNodes = () => [];
    s2.facet.getInitColLeafNodes = () => initColumnNodes as Node[];
    s2.facet.getColNodes = () => initColumnNodes as Node[];
    s2.facet.getColLeafNodes = () => initColumnNodes as Node[];
    s2.options = {
      interaction: {
        hiddenColumnFields: ['a'],
      },
      tooltip: {
        enable: true,
        operation: {
          hiddenColumns: false,
        },
      },
    } as S2Options;
    s2.setOptions = jest.fn();
    s2.isTableMode = jest.fn(() => true);
  });

  afterEach(() => {
    s2.off(S2Event.ROW_CELL_CLICK);
    s2.off(S2Event.COL_CELL_CLICK);
  });

  test('should bind events', () => {
    expect(rowColumnClick.bindEvents).toBeDefined();
  });

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should add click intercept when %s keydown',
    (key) => {
      s2.emit(S2Event.GLOBAL_KEYBOARD_DOWN, {
        key,
      } as KeyboardEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeTruthy();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should remove click intercept when %s keyup',
    (key) => {
      s2.interaction.addIntercepts([InterceptType.CLICK]);
      s2.emit(S2Event.GLOBAL_KEYBOARD_UP, {
        key,
      } as KeyboardEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeFalsy();
    },
  );

  test.each([InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL])(
    'should remove click intercept when %s released',
    () => {
      Object.defineProperty(rowColumnClick, 'isMultiSelection', {
        value: true,
      });
      s2.interaction.addIntercepts([InterceptType.CLICK]);
      s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {} as MouseEvent);

      expect(s2.interaction.hasIntercepts([InterceptType.CLICK])).toBeFalsy();
    },
  );

  // https://github.com/antvis/S2/issues/1243
  test.each([S2Event.ROW_CELL_CLICK, S2Event.COL_CELL_CLICK])(
    'should selected cell when %s cell clicked',
    (event) => {
      const selected = jest.fn();

      s2.on(S2Event.GLOBAL_SELECTED, selected);

      const isSelectedCellSpy = jest
        .spyOn(s2.interaction, 'isSelectedCell')
        .mockImplementation(() => false);

      s2.emit(event, {
        stopPropagation() {},
      } as unknown as GEvent);

      expect(s2.interaction.getState()).toEqual({
        cells: [mockCellMeta],
        nodes: [mockCellViewMeta],
        stateName: InteractionStateName.SELECTED,
      });
      expect(s2.showTooltipWithInfo).toHaveBeenCalled();
      expect(selected).toHaveBeenCalled();
      expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeTrue();

      isSelectedCellSpy.mockRestore();
    },
  );

  test.each([S2Event.ROW_CELL_CLICK, S2Event.COL_CELL_CLICK])(
    'should unselected current cell when toggle %s clicked',
    (event) => {
      const mockCellA = createMockCellInfo('cellA');
      const getInteractedCellsSpy = jest
        .spyOn(s2.interaction, 'getInteractedCells')
        .mockImplementation(() => [mockCellA.mockCell]);

      const selected = jest.fn();

      s2.on(S2Event.GLOBAL_SELECTED, selected);

      // 选中
      s2.emit(event, {
        stopPropagation() {},
      } as unknown as GEvent);
      expect(selected).toHaveBeenCalledWith([mockCell]);

      // 取消选中
      s2.emit(event, {
        stopPropagation() {},
      } as unknown as GEvent);

      expect(s2.interaction.getState().cells).toEqual([]);
      expect(s2.showTooltipWithInfo).toHaveBeenCalled();
      expect(selected).toHaveBeenCalled();
      expect(s2.interaction.hasIntercepts([InterceptType.HOVER])).toBeFalse();

      getInteractedCellsSpy.mockRestore();
    },
  );

  test('should emit link field jump event when row cell clicked and not show tooltip', () => {
    const linkFieldJump = jest.fn();

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);

    const selectHeaderCellSpy = jest
      .spyOn(s2.interaction, 'selectHeaderCell')
      .mockImplementationOnce(() => undefined);

    const mockCellData = {
      valueField: 'valueField',
      data: { a: 1 },
      getHeadLeafChild() {
        return this;
      },
    };

    s2.emit(S2Event.ROW_CELL_CLICK, {
      stopPropagation() {},
      target: new CustomRect(
        { style: { x: 1, y: 1, width: 1, height: 1 } },
        {
          cellData: mockCellData,
          isLinkFieldText: true,
        },
      ),
    } as unknown as GEvent);

    expect(linkFieldJump).toHaveBeenCalledTimes(1);
    expect(s2.showTooltipWithInfo).not.toHaveBeenCalled();
    expect(s2.showTooltip).not.toHaveBeenCalled();
    expect(selectHeaderCellSpy).not.toHaveBeenCalled();
  });

  test.each([S2Event.ROW_CELL_CLICK, S2Event.COL_CELL_CLICK])(
    'should emit cell selected event when %s clicked',
    (event) => {
      const selected = jest.fn();

      s2.on(S2Event.GLOBAL_SELECTED, selected);

      s2.emit(event, {
        stopPropagation() {},
      } as unknown as GEvent);
      expect(selected).toHaveBeenCalledWith([mockCell]);
    },
  );

  test.each([
    {
      event: S2Event.ROW_CELL_CLICK,
      enableMultiSelection: false,
      result: false,
    },
    {
      event: S2Event.COL_CELL_CLICK,
      enableMultiSelection: false,
      result: false,
    },
    {
      event: S2Event.ROW_CELL_CLICK,
      enableMultiSelection: true,
      result: true,
    },
    {
      event: S2Event.COL_CELL_CLICK,
      enableMultiSelection: true,
      result: true,
    },
  ])(
    'should emit cell selected event when %s clicked with multi selection',
    ({ event, enableMultiSelection, result }) => {
      s2.options.interaction!.multiSelection = enableMultiSelection;

      const selectHeaderCellSpy = jest
        .spyOn(s2.interaction, 'selectHeaderCell')
        .mockImplementation(() => true);

      Object.defineProperty(rowColumnClick, 'isMultiSelection', {
        value: true,
        writable: true,
      });

      s2.emit(event, {
        stopPropagation() {},
      } as unknown as GEvent);

      expect(selectHeaderCellSpy).toHaveBeenCalledWith({
        cell: expect.anything(),
        isMultiSelection: result,
      });
    },
  );

  test('should expand columns correctly', () => {
    const columnsExpand = jest.fn();

    s2.on(S2Event.COL_CELL_EXPANDED, columnsExpand);

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

    s2.emit(S2Event.COL_CELL_EXPANDED, mockNode as Node);

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

  test('should hidden columns correctly', async () => {
    const resetSpy = jest
      .spyOn(s2.interaction, 'reset')
      .mockImplementationOnce(() => {});

    const columnsHidden = jest.fn();

    s2.on(S2Event.COL_CELL_HIDDEN, columnsHidden);

    // trigger hidden icon click
    await rowColumnClick.hideSelectedColumns();

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
    expect(resetSpy).toHaveBeenCalledTimes(1);
    // rerender table
    expect(s2.render).toHaveBeenCalledTimes(1);

    resetSpy.mockRestore();
  });
});
