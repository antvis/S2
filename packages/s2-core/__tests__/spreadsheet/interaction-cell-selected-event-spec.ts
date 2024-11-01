import { S2Event } from '@/common/constant';
import { type S2Options } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { createPivotSheet } from 'tests/util/helpers';
import { CellType } from '../../src';

const s2Options: S2Options = {
  width: 600,
  height: 400,
};

describe('Interaction Cell Selected Event Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = createPivotSheet(s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test.each`
    cellType                | event
    ${CellType.CORNER_CELL} | ${S2Event.CORNER_CELL_SELECTED}
    ${CellType.ROW_CELL}    | ${S2Event.ROW_CELL_SELECTED}
    ${CellType.COL_CELL}    | ${S2Event.COL_CELL_SELECTED}
    ${CellType.DATA_CELL}   | ${S2Event.DATA_CELL_SELECTED}
  `(
    'should get $cellType detail when $event is triggered',
    ({ cellType, event }) => {
      const fn = jest.fn();
      const onSelected = jest.fn();

      s2.on(event, fn);
      s2.on(S2Event.GLOBAL_SELECTED, onSelected);

      s2.interaction.emitSelectEvent({
        targetCell: {
          cellType,
        },
      });

      expect(onSelected).toHaveBeenCalledWith(expect.anything(), {
        targetCell: {
          cellType,
        },
      });
      expect(fn).toHaveBeenCalledWith(expect.anything(), {
        targetCell: {
          cellType,
        },
      });
    },
  );
});
