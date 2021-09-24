import { RootInteraction } from '@/interaction/root';
import { Node } from '@/facet/layout/node';
import {
  getHiddenColumnNodes,
  getHiddenColumnDisplaySiblingNode,
  getHiddenColumnsThunkGroup,
  isLastColumnAfterHidden,
  hideColumns,
} from '@/utils/hide-columns';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

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
      field: '4',
      colIndex: 4,
    });

    // hide a continuous column list
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['3', '4'])).toEqual({
      field: '5',
      colIndex: 5,
    });
  });

  test('should get pre sibling node when hidden node is at the last', () => {
    // hide single column
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['5'])).toEqual({
      field: '4',
      colIndex: 4,
    });

    // hide a continuous column list
    expect(getHiddenColumnDisplaySiblingNode(sheet, ['3', '4', '5'])).toEqual({
      field: '2',
      colIndex: 2,
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
    'should calculate is last column correct if field is $s',
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

  test('should skip update when hidden column fields not change', () => {
    hideColumns(mockSpreadSheetInstance, []);
    expect(mockSpreadSheetInstance.render).not.toHaveBeenCalled();
  });

  test('should hidden columns correct', () => {
    hideColumns(mockSpreadSheetInstance, ['3']);

    // update options
    expect(mockSpreadSheetInstance.options.hiddenColumnFields).toEqual(['3']);
    // save hidden meta
    expect(mockSpreadSheetInstance.store.get('hiddenColumnsDetail')).toEqual([
      {
        displaySiblingNode: { field: '4', colIndex: 4 },
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
        displaySiblingNode: { field: '4', colIndex: 4 },
        hideColumnNodes: [{ field: '5', colIndex: 5 }],
      },
    ]);
  });

  test('should hidden multiple columns', () => {
    hideColumns(mockSpreadSheetInstance, ['2', '3']);

    expect(mockSpreadSheetInstance.store.get('hiddenColumnsDetail')).toEqual([
      {
        displaySiblingNode: { field: '4', colIndex: 4 },
        hideColumnNodes: [
          { field: '2', colIndex: 2 },
          { field: '3', colIndex: 3 },
        ],
      },
    ]);
  });
});
