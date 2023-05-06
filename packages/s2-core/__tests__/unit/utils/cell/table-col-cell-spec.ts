import type { Node } from '@/facet/layout/node';
import type { SpreadSheet } from '@/sheet-type';
import { getOccupiedWidthForTableCol } from '@/utils/cell/table-col-cell';

describe('Table col cell util test', () => {
  test('should return right occupied width for table col', () => {
    const mockSS = {
      store: new Map(),
      options: {
        showDefaultHeaderActionIcon: true,
      },
    };

    const mockNode = {
      field: 'city',
    } as unknown as Node;

    mockSS.store.set('hiddenColumnsDetail', [
      {
        displaySiblingNode: {
          prev: {
            field: 'city',
          },
        },
      },
    ]);
    expect(
      getOccupiedWidthForTableCol(mockSS as unknown as SpreadSheet, mockNode, {
        cell: {
          padding: {
            left: 10,
            right: 10,
          },
        },
        icon: {
          size: 15,
          margin: {
            left: 10,
            right: 10,
          },
        },
      }),
    ).toBe(81);
  });

  test('should return right occupied width for table col with actionIcons', () => {
    const mockSS = {
      store: new Map(),
      options: {
        showDefaultHeaderActionIcon: false,
        headerActionIcons: [
          {
            icons: ['foo', 'bar'],
            belongsCell: 'colCell',
          },
        ],
      },
    };

    const mockNode = {
      field: 'city',
    } as unknown as Node;

    mockSS.store.set('hiddenColumnsDetail', [
      {
        displaySiblingNode: {
          prev: {
            field: 'city',
          },
        },
      },
    ]);
    expect(
      getOccupiedWidthForTableCol(mockSS as unknown as SpreadSheet, mockNode, {
        cell: {
          padding: {
            left: 10,
            right: 10,
          },
        },
        icon: {
          size: 15,
          margin: {
            left: 10,
            right: 10,
          },
        },
      }),
    ).toBe(106);
  });
});
