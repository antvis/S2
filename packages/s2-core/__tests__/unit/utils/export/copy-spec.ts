import { assembleDataCfg, assembleOptions } from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import { data as originalData } from 'tests/data/mock-dataset.json';
import { TableSheet, PivotSheet } from '@/sheet-type';

import {
  CellTypes,
  InteractionStateName,
  SortMethodType,
} from '@/common/constant/interaction';
import { convertString, getSelectedData } from '@/utils/export/copy';
import { getCellMeta } from '@/utils/interaction/select-event';
import { S2Event } from '@/common/constant';

describe('List Table Core Data Process', () => {
  let s2: TableSheet;
  beforeEach(() => {
    s2 = new TableSheet(
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
  });

  afterEach(() => {
    s2.destroy();
  });

  it('should copy no data', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getSelectedData(s2)).toEqual(undefined);
  });

  it('should copy normal data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2)).toEqual('浙江省');
  });

  it('should copy col data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toBe(32);
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
    expect(getSelectedData(s2).split('\n').length).toBe(32);
    expect(getSelectedData(s2).split('\n')[1].split('\t').length).toBe(5);
  });

  it('should copy format data', () => {
    const ss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => v + '元' }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
          copyWithFormat: true,
        },
        showSeriesNumber: true,
      }),
    );
    ss.render();
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];
    ss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(ss)).toEqual('浙江省元');
  });

  it('should copy correct data with data filtered', () => {
    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'province',
      filteredValues: ['浙江省'],
    });

    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getSelectedData(s2);
    expect(data).toBe('2330\t四川省\t乐山市\t家具\t桌子');

    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toEqual(16);
    // clear filter condition
    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'province',
      filteredValues: [],
    });
  });

  it('should copy correct data with data sorted', () => {
    s2.emit(S2Event.RANGE_SORT, [
      {
        sortFieldId: 'number',
        sortMethod: 'DESC' as SortMethodType,
      },
    ]);

    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getSelectedData(s2);
    expect(data).toBe('7789\t浙江省\t杭州市\t家具\t桌子');
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toEqual(32);
  });

  it('should copy correct data with \n data', () => {
    const newLineText = `1
    2`;
    const sss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => v + '元' }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
        data: originalData.map((e) => ({ ...e, city: newLineText })),
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
        },
        showSeriesNumber: true,
      }),
    );
    sss.render();

    const cell = sss.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[20];

    sss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getSelectedData(sss);
    expect(data).toBe(convertString(newLineText));
  });
});

describe('Pivot Table Core Data Process', () => {
  const s2 = new PivotSheet(
    getContainer(),
    assembleDataCfg({
      meta: [],
      fields: {
        columns: ['type', 'sub_type'],
        rows: ['province', 'city'],
        values: ['number'],
      },
    }),
    assembleOptions({
      hierarchyType: 'grid',
      interaction: {
        enableCopy: true,
      },
    }),
  );
  s2.render();

  it('should copy no data in grid mode', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getSelectedData(s2)).toEqual(undefined);
  });

  it('should copy normal data in grid mode', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2)).toEqual(`${originalData[0].number}`);
  });

  it('should copy col data in grid mode', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toBe(8);
  });

  it('should copy row data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['type', 'sub_type'],
          rows: ['province', 'city'],
          values: ['number'],
        },
      }),
      assembleOptions({
        hierarchyType: 'grid',
        interaction: {
          enableCopy: true,
        },
      }),
    );
    ss.render();
    const cell = ss.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)
      .pop();

    ss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(ss).split('\t').length).toBe(4);
  });

  it('should copy all data in grid mode', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)[3];
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toBe(8);
    expect(getSelectedData(s2).split('\n')[1].split('\t').length).toBe(4);
  });

  it('should copy format data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter: (v) => v + '元' }],
        fields: {
          columns: ['type', 'sub_type'],
          rows: ['province', 'city'],
          values: ['number'],
        },
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
          copyWithFormat: true,
        },
        showSeriesNumber: false,
      }),
    );
    ss.render();
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];
    ss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(ss)).toEqual(`${originalData[0].number}元`);
  });

  it('should copy correct data with data sorted in grid mode', () => {
    const node = s2.getColumnNodes().find((node) => node.isLeaf);
    s2.groupSortByMethod('ASC' as SortMethodType, node);
    s2.setDataCfg(s2.dataCfg);
    s2.render();
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)
      .find((e) => e.getMeta().isLeaf);

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getSelectedData(s2);
    expect(data).toBe('2367\t632\t1304\t1354');
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toEqual(8);
  });

  it('should copy correct data with \n data in grid mode', () => {
    const newLineText = `1
    2`;
    const sss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter: (v) => v + '\n元' }],
        fields: {
          columns: ['type', 'sub_type'],
          rows: ['province', 'city'],
          values: ['number'],
        },
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
          copyWithFormat: true,
        },
        showSeriesNumber: false,
      }),
    );
    sss.render();

    const cell = sss.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    sss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getSelectedData(sss);
    expect(data).toBe(convertString(`7789\n元`));
  });
});
