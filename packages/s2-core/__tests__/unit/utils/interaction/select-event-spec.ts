import { TableSeriesNumberCell } from '../../../../src/cell';
import {
  isMultiSelectionKey,
  getRowCellForSelectedCell,
} from '@/utils/interaction/select-event';
import { InteractionKeyboardKey } from '@/common/constant';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import type { ViewMeta } from '@/common';

jest.mock('@/cell', () => {
  return {
    // eslint-disable-next-line object-shorthand
    TableSeriesNumberCell: function () {
      // @ts-ignore
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
      const cell = new TableSeriesNumberCell(
        {} as unknown as ViewMeta,
        {} as unknown as SpreadSheet,
      );

      expect(
        getRowCellForSelectedCell(
          { colId: 'city', rowIndex: 5 } as unknown as ViewMeta,
          {
            options: {
              seriesNumber: {
                enable: true,
              },
            },
            interaction: {
              getAllCells: () => [cell],
            },
            facet: {
              getColLeafNodes: () => [
                {
                  id: '序号',
                },
              ],
              getCellById: () => cell,
            },
            isTableMode: () => true,
          } as unknown as SpreadSheet,
        ).map((item) => item.getMeta().id),
      ).toStrictEqual(['5-序号']);
    });
  });
});
