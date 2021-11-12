import { SpreadSheet } from 'src/sheet-type';
import { getOccupiedWidthForTableCol } from 'src/utils/cell/table-col-cell';

describe('Table col cell util test', () => {
  test('should return right occupied width for table col', () => {
    const mockSS = {
      store: new Map(),
    };

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
      getOccupiedWidthForTableCol(mockSS as unknown as SpreadSheet, 'city', {
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
    ).toBe(72.5);
  });
});
