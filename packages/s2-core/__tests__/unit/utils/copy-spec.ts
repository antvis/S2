import { TableSheet } from 'src/sheet-type';
import { assembleDataCfg, assembleOptions } from '../../util/sheet-entry';
import { getContainer } from '../../util/helpers';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { getSelectedData } from '@/utils/export/copy';
import { getCellMeta } from '@/utils/interaction/select-event';

describe('List Table Core Data Process', () => {
  const s2 = new TableSheet(
    getContainer(),
    assembleDataCfg({
      meta: [],
      fields: {
        columns: ['province', 'city', 'type', 'sub_type', 'number'],
      },
    }),
    assembleOptions({
      showSeriesNumber: true,
    }),
  );
  s2.render();

  it('should copy no data', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getSelectedData(s2)).toEqual('');
  });

  it('should copy normal data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2)).toEqual('浙江省\t\n');
  });

  it('should copy col data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toBe(33);
  });

  it('should copy row data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2).split('\t').length).toBe(5);
  });

  it('should copy all data', () => {
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toBe(33);
    expect(getSelectedData(s2).split('\n')[1].split('\t').length).toBe(6);
  });
});
