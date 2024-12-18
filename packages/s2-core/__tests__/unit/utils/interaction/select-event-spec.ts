import type { ViewMeta } from '@/common';
import { InteractionKeyboardKey } from '@/common/constant';
import type { SpreadSheet } from '@/sheet-type/spread-sheet';
import {
  getCellMeta,
  getColHeaderByCellId,
  getInteractionCells,
  getInteractionCellsBySelectedCells,
  getRangeIndex,
  getRowCellForSelectedCell,
  getRowHeaderByCellId,
  isMouseEventWithMeta,
  isMultiSelectionKey,
} from '@/utils/interaction/select-event';
import { createFakeSpreadSheet, createMockCellInfo } from 'tests/util/helpers';
import { TableSeriesNumberCell } from '../../../../src/cell';

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
      ).toBeTruthy();

      expect(
        isMultiSelectionKey({
          key: InteractionKeyboardKey.CONTROL,
        } as KeyboardEvent),
      ).toBeTruthy();
    });
  });

  describe('#isMouseEventWithMeta()', () => {
    test('should return true for ctrl and meta key', () => {
      expect(
        isMouseEventWithMeta({
          ctrlKey: InteractionKeyboardKey.CONTROL,
        } as KeyboardEvent),
      ).toBeTruthy();

      expect(
        isMouseEventWithMeta({
          metaKey: InteractionKeyboardKey.META,
        } as KeyboardEvent),
      ).toBeTruthy();
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

  test('#getCellMeta()', () => {
    const cell = createMockCellInfo('test-a').mockCell;

    expect(getCellMeta(cell)).toEqual({
      colIndex: 0,
      id: 'test-a',
      rowIndex: 0,
      rowQuery: undefined,
      type: undefined,
    });
  });

  test('#getRangeIndex()', () => {
    expect(
      getRangeIndex({ rowIndex: 0, colIndex: 0 }, { rowIndex: 2, colIndex: 2 }),
    ).toEqual({
      end: { colIndex: 2, rowIndex: 2 },
      start: { colIndex: 0, rowIndex: 0 },
    });
  });

  test('#getRowHeaderByCellId()', () => {
    const s2 = createFakeSpreadSheet({ width: 100, height: 100 });

    expect(getRowHeaderByCellId('a', s2)).toEqual([]);
  });

  test('#getColHeaderByCellId()', () => {
    const s2 = createFakeSpreadSheet({ width: 100, height: 100 });

    expect(getColHeaderByCellId('a', s2)).toEqual([]);
  });

  test('#getInteractionCells()', () => {
    const cell = createMockCellInfo('test-a').mockCell;
    const s2 = createFakeSpreadSheet({ width: 100, height: 100 });
    const meta = getCellMeta(cell);

    expect(getInteractionCells(meta, s2)).toEqual([meta]);
  });

  test('#getInteractionCellsBySelectedCells()', () => {
    const cell = createMockCellInfo('test-a').mockCell;
    const s2 = createFakeSpreadSheet({ width: 100, height: 100 });
    const meta = getCellMeta(cell);

    expect(getInteractionCellsBySelectedCells([meta], s2)).toEqual([meta]);
  });
});
