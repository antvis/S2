import { RootInteraction } from '@/interaction/root';
import { Node } from '@/facet/layout/node';
import {
  getHiddenColumnNodes,
  getHiddenColumnDisplaySiblingNode,
  getHiddenColumnsThunkGroup,
  isLastColumnAfterHidden,
  hideColumns,
  hideColumnsByThunkGroup,
} from '@/utils/hide-columns';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { S2Event } from '@/common/constant';

describe('hide-columns test', () => {
  let sheet: SpreadSheet;
  let mockSpreadSheetInstance: PivotSheet;
  const initColumnNodes: Partial<Node>[] = [
    { field: '1', colIndex: 1 },
    { field: '2', colIndex: 2 },
    { field: '3', colIndex: 3 },
    { field: '4', colIndex: 4 },
    { field: '5', colIndex: 5 },
  ];
  beforeEach(() => {
    sheet = {
      getInitColumnNodes: () => initColumnNodes,
      getColumnNodes: () => initColumnNodes,
    } as PivotSheet;

    mockSpreadSheetInstance = new PivotSheet(
      document.createElement('div'),
      {
        fields: {
          rows: [],
          columns: initColumnNodes.map(({ field }) => field),
          values: [],
        },
        data: [],
      },
      null,
    );
    mockSpreadSheetInstance.getInitColumnNodes = () =>
      initColumnNodes as Node[];
    mockSpreadSheetInstance.render = jest.fn();
    mockSpreadSheetInstance.interaction = {
      reset: jest.fn(),
    } as unknown as RootInteraction;
  });

  test('should return empty list when there is not init columns', () => {
    sheet.getInitColumnNodes = function fn() {
      return [];
    };
    expect(getHiddenColumnNodes(sheet, ['1', '2', '3'])).toEqual([]);
  });

  test('should return hidden column list', () => {
    expect(getHiddenColumnNodes(sheet, ['1', '2', '3'])).toEqual([
      { field: '1', colIndex: 1 },
      { field: '2', colIndex: 2 },
      { field: '3', colIndex: 3 },
    ]);
  });

  test('should get next sibling node when hidden node is not at the last', () => {
    // hide single column
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['3'])).toEqual({
      prev: {
        field: '2',
        colIndex: 2,
      },
      next: {
        field: '4',
        colIndex: 4,
      },
    });

    // hide a continuous column list
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['3', '4'])).toEqual({
      prev: {
        field: '2',
        colIndex: 2,
      },
      next: {
        field: '5',
        colIndex: 5,
      },
    });
  });

  test('should get pre sibling node when hidden node is at the last', () => {
    // hide single column
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['5'])).toEqual({
      prev: {
        field: '4',
        colIndex: 4,
      },
      next: null,
    });

    expect(getHiddenColumnDisplaySiblingNode(sheet, ['1'])).toEqual({
      prev: null,
      next: {
        field: '2',
        colIndex: 2,
      },
    });

    // hide a continuous column list
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['3', '4', '5'])).toEqual({
      prev: {
        field: '2',
        colIndex: 2,
      },
      next: null,
    });
  });

  test('should group continuous hidden list', () => {
    //  no  hidden columns
    expect(getHiddenColumnsThunkGroup(['1', '2', '3', '4', '5'], [])).toEqual(
      [],
    );
    //  no continuous hidden columns
    expect(
      getHiddenColumnsThunkGroup(['1', '2', '3', '4', '5'], ['1', '3', '5']),
    ).toEqual([['1'], ['3'], ['5']]);

    //  have continuous hidden columns
    expect(
      getHiddenColumnsThunkGroup(
        ['1', '2', '3', '4', '5'],
        ['1', '2', '3', '5'],
      ),
    ).toEqual([['1', '2', '3'], ['5']]);
  });

  test.each(initColumnNodes)(
    'should calculate is last column correct if field is %o',
    ({ field }) => {
      expect(isLastColumnAfterHidden(sheet, field)).toBeFalsy();
    },
  );

  test('should get correct last column when default last column has been hidden', () => {
    // hidden last column
    sheet.getInitColumnNodes = () => initColumnNodes.slice(0, -1) as Node[];
    expect(isLastColumnAfterHidden(sheet, '5')).toBeTruthy();
    expect(isLastColumnAfterHidden(sheet, '4')).toBeFalsy();
  });

  test('should skip update if hidden column fields not change', () => {
    hideColumns(mockSpreadSheetInstance, []);
    expect(mockSpreadSheetInstance.render).not.toHaveBeenCalled();
  });

  test('should hidden columns correct', () => {
    hideColumns(mockSpreadSheetInstance, ['3']);

    // update options
    expect(
      mockSpreadSheetInstance.options.interaction.hiddenColumnFields,
    ).toEqual(['3']);
    // save hidden meta
    expect(mockSpreadSheetInstance.store.get('hiddenColumnsDetail')).toEqual([
      {
        displaySiblingNode: {
          prev: { field: '2', colIndex: 2 },
          next: { field: '4', colIndex: 4 },
        },
        hideColumnNodes: [{ field: '3', colIndex: 3 }],
      },
    ]);
    // reset interaction
    expect(mockSpreadSheetInstance.interaction.reset).toHaveBeenCalledTimes(1);
    // render
    expect(mockSpreadSheetInstance.render).toHaveBeenCalledTimes(1);
  });

  test('should get prev sibling node if hidden last column', () => {
    hideColumns(mockSpreadSheetInstance, ['5']);

    expect(mockSpreadSheetInstance.store.get('hiddenColumnsDetail')).toEqual([
      {
        displaySiblingNode: { next: null, prev: { field: '4', colIndex: 4 } },
        hideColumnNodes: [{ field: '5', colIndex: 5 }],
      },
    ]);
  });

  test('should hide columns correctly', () => {
    const columnsHidden = jest.fn();
    mockSpreadSheetInstance.on(S2Event.LAYOUT_TABLE_COL_HIDDEN, columnsHidden);

    hideColumns(mockSpreadSheetInstance, ['5']);

    // emit event
    expect(columnsHidden).toHaveBeenCalledWith(
      // current hidden column infos
      {
        displaySiblingNode: { next: null, prev: { colIndex: 4, field: '4' } },
        hideColumnNodes: [{ colIndex: 5, field: '5' }],
      },
      // hidden columns detail
      [
        {
          displaySiblingNode: { next: null, prev: { colIndex: 4, field: '4' } },
          hideColumnNodes: [{ colIndex: 5, field: '5' }],
        },
      ],
    );
    // update options
    expect(
      mockSpreadSheetInstance.options.interaction.hiddenColumnFields,
    ).toEqual(['5']);
    // reset interaction
    expect(mockSpreadSheetInstance.interaction.reset).toHaveBeenCalledTimes(1);
    // rerender table
    expect(mockSpreadSheetInstance.render).toHaveBeenCalledTimes(1);
  });

  test('should hidden multiple columns', () => {
    hideColumns(mockSpreadSheetInstance, ['2', '3']);

    expect(mockSpreadSheetInstance.store.get('hiddenColumnsDetail')).toEqual([
      {
        displaySiblingNode: {
          prev: { field: '1', colIndex: 1 },
          next: { field: '4', colIndex: 4 },
        },
        hideColumnNodes: [
          { field: '2', colIndex: 2 },
          { field: '3', colIndex: 3 },
        ],
      },
    ]);
  });

  test('should hidden group columns', () => {
    hideColumnsByThunkGroup(mockSpreadSheetInstance, ['1', '3']);

    expect(mockSpreadSheetInstance.store.get('hiddenColumnsDetail')).toEqual([
      {
        displaySiblingNode: {
          prev: null,
          next: { field: '2', colIndex: 2 },
        },
        hideColumnNodes: [{ field: '1', colIndex: 1 }],
      },
      {
        displaySiblingNode: {
          prev: { field: '2', colIndex: 2 },
          next: { field: '4', colIndex: 4 },
        },
        hideColumnNodes: [{ field: '3', colIndex: 3 }],
      },
    ]);
  });

  test('should skip hidden group columns if hidden column fields not change', () => {
    hideColumnsByThunkGroup(mockSpreadSheetInstance, []);

    expect(mockSpreadSheetInstance.render).not.toHaveBeenCalled();
  });
});
