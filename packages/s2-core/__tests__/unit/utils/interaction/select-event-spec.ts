import {
  isMultiSelectionKey,
  getRowCellForSelectedCell,
} from 'src/utils/interaction/select-event';
import { InteractionKeyboardKey } from 'src/common/constant';
import { SpreadSheet } from 'src';
import { TableRowCell } from 'src/cell';
import { ViewMeta } from 'src/common';

jest.mock('src/cell', () => {
  return {
    // eslint-disable-next-line object-shorthand
    TableRowCell: function () {
      this.getMeta = () => {
        return {
          id: '5-序号',
        };
      };
    },
  };
});

describe('Select Event Utils Tests', () => {
  describe('isMultiSelection test', () => {
    test('should return true for ctrl and meta key', () => {
      expect(
        isMultiSelectionKey({
          key: InteractionKeyboardKey.META,
        } as KeyboardEvent),
      ).toBe(true);

      expect(
        isMultiSelectionKey({
          key: InteractionKeyboardKey.CONTROL,
        } as KeyboardEvent),
      ).toBe(true);
    });
  });

  describe('getRowCellForSelectedCell test', () => {
    test('should return correct value for getRowCellForSelectedCell', () => {
      const cell = new TableRowCell(
        {} as unknown as ViewMeta,
        {} as unknown as SpreadSheet,
      );
      expect(
        getRowCellForSelectedCell(
          { colId: 'city', rowIndex: 5 } as unknown as ViewMeta,
          {
            options: {
              showSeriesNumber: true,
            },
            interaction: {
              getAllCells: () => {
                return [cell];
              },
            },
            facet: {
              layoutResult: {
                colLeafNodes: [
                  {
                    id: '序号',
                  },
                ],
              },
            },
            isTableMode: () => {
              return true;
            },
          } as unknown as SpreadSheet,
        ).map((item) => item.getMeta().id),
      ).toStrictEqual(['5-序号']);
    });
  });
});
