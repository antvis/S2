import {
  getHiddenColumnNodes,
  getHiddenColumnDisplaySiblingNode,
  getHiddenColumnsThunkGroup,
} from '@/utils/hide-columns';

describe('hide-columns test', () => {
  let sheet;
  beforeEach(() => {
    sheet = {
      getInitColumnNodes() {
        return [
          { field: '1', colIndex: 1 },
          { field: '2', colIndex: 2 },
          { field: '3', colIndex: 3 },
          { field: '4', colIndex: 4 },
          { field: '5', colIndex: 5 },
        ];
      },
    } as any;
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
});
