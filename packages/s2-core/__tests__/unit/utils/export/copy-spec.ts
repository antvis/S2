import type { Meta, S2DataConfig } from '@antv/s2';
import { assembleDataCfg, assembleOptions, TOTALS_OPTIONS } from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import { data as originalData, totalData } from 'tests/data/mock-dataset.json';
import { map } from 'lodash';
import { TableDataCell } from '@antv/s2';
import { TableSheet, PivotSheet } from '@/sheet-type';
import {
  CellTypes,
  InteractionStateName,
  SortMethodType,
} from '@/common/constant/interaction';
import { getSelectedData } from '@/utils/export/copy';
import { convertString } from '@/utils/export/method';
import { getCellMeta } from '@/utils/interaction/select-event';
import { S2Event, NewLine, NewTab } from '@/common/constant';
import { TableSeriesCell } from '@/cell';

const newLineTest = `### 问题摘要 ${NewLine}- **会话地址**：`;

const testData = originalData.map((item, i) => {
  if (i === 0) {
    return { ...item, sub_type: newLineTest };
  }

  return { ...item };
});

const getCopyPlainContent = (sheet: TableSheet | PivotSheet): string => {
  const data = getSelectedData(sheet);

  return data[0].content;
};

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
        data: testData,
      }),
      assembleOptions({
        showSeriesNumber: true,
      }),
    );
    s2.render();
  });

  afterEach(() => {
    // s2.destroy();
  });

  it('should copy no data', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual('');
  });

  it('should copy normal data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(
        (cell) =>
          cell.cellType === CellTypes.DATA_CELL &&
          !(cell instanceof TableSeriesCell),
      )[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual('浙江省');
  });

  it('should copy col data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2).split(NewLine).length).toBe(32);
  });

  it('should copy row data', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter((cell) => cell instanceof TableSeriesCell)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(
      `"1	浙江省	舟山市	家具	桌子	4342"`,
    );
    expect(getCopyPlainContent(s2).split(NewTab).length).toBe(6);
  });

  it('should copy all data', () => {
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });

    expect(getCopyPlainContent(s2).split(NewLine).length).toBe(33);
    expect(getCopyPlainContent(s2).split(NewLine)[2]).toMatchInlineSnapshot(
      `"2	浙江省	绍兴市	家具	桌子	2367"`,
    );
  });

  it('should copy normal data with header in table mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
      },
    });
    s2.render();

    const cell = s2.interaction
      .getAllCells()
      .filter(
        (cell) =>
          cell.cellType === CellTypes.DATA_CELL &&
          !(cell instanceof TableSeriesCell),
      )[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual('province\r\n浙江省');
  });

  it('should copy format data', () => {
    const ss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => `${v}元` }],
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
      .filter(
        (cell) =>
          cell.cellType === CellTypes.DATA_CELL &&
          !(cell instanceof TableSeriesCell),
      )[0];

    ss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(ss)).toEqual('浙江省元');
  });

  // https://github.com/antvis/S2/issues/1770
  it('should copy format data with row header selected', () => {
    const ss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => `${v}_formatted` }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
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

    const cell = ss.interaction
      .getAllCells()
      .filter((cell) => cell instanceof TableDataCell)[0];

    ss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    const data = getCopyPlainContent(ss);

    expect(data).toBe('浙江省_formatted');
  });

  // https://github.com/antvis/S2/issues/1770
  it('should copy format data with col header selected', () => {
    const ss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'city', formatter: (v) => `${v}_formatted` }],
        data: originalData,
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
          copyWithFormat: true,
        },
      }),
    );

    ss.render();

    const cell = ss.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[1];

    ss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    const data = getCopyPlainContent(ss);

    expect(data.split('_formatted').length).toEqual(33);
  });

  it('should copy correct data when selected diagonal cells', () => {
    s2.render();

    const cells = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    s2.interaction.changeState({
      cells: [getCellMeta(cells[21]), getCellMeta(cells[48])],
      stateName: InteractionStateName.SELECTED,
    });

    const dataContent = getCopyPlainContent(s2);

    expect(dataContent).toMatchInlineSnapshot(`
      "浙江省	
      	
      	
      	
      	
      	
      	
      	
      	宁波市"
    `);
  });

  it('should copy correct data with data filtered', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: false,
      },
    });
    s2.render();

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'province',
      filteredValues: ['浙江省'],
    });

    const cell = s2.interaction
      .getAllCells()
      .filter((cell) => cell instanceof TableSeriesCell)[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2);

    expect(data).toMatchInlineSnapshot(`"1	四川省	乐山市	家具	桌子	2330"`);

    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getCopyPlainContent(s2).split('\n').length).toEqual(16);
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
      .filter((cell) => cell instanceof TableSeriesCell)[1];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2);

    expect(data).toBe('1	浙江省	宁波市	家具	沙发	7234');
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getCopyPlainContent(s2).split('\n').length).toEqual(33);
  });

  it('should copy correct data with \n data', () => {
    const newLineText = `1
    2`;
    const sss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => `${v}元` }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
        data: originalData.map((e) => {
          return { ...e, city: newLineText };
        }),
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
      .filter(
        (cell) =>
          cell.cellType === CellTypes.DATA_CELL &&
          !(cell instanceof TableSeriesCell),
      )[20];

    sss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sss);

    expect(data).toBe(convertString(newLineText));
  });

  it('should not transform double quotes to single quotes when newline char is in data', () => {
    const newLineText = `"1
    2"`;
    const sss = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => `${v}元` }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
        data: originalData.map((e) => {
          return { ...e, city: newLineText };
        }),
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
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[40];

    sss.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sss);

    expect(data).toBe(convertString(newLineText));
  });

  it('should copy row data when select data row cell', () => {
    s2.setOptions({
      interaction: {
        selectedCellHighlight: {
          currentRow: true,
        },
      },
    });

    s2.render();

    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "1	浙江省	杭州市	家具	### 问题摘要 
      - **会话地址**：	7789"
    `);
    expect(getCopyPlainContent(s2).split(NewTab).length).toBe(6);
  });
});

describe('Pivot Table Core Data Process', () => {
  // 7 = 4(维度节点) + 2(小计) + 1(总计)
  const ROW_COUNT = 7;
  // 11 = 8(维度节点) + 2(小计) + 1(总计)
  const COL_COUNT = 11;
  // 3 = ['type', 'sub_type', 'number'].length 行头高度
  const COL_HEADER_HEIGHT = 3;
  // 2 = ['province', 'city'].length 列头宽度
  const ROW_HEADER_WIDTH = 2;

  function getDataCfg(meta: Meta[] = []) {
    return assembleDataCfg({
      meta,
      fields: {
        columns: ['type', 'sub_type'],
        rows: ['province', 'city'],
        values: ['number'],
      },
    });
  }

  function getOptions() {
    return assembleOptions({
      hierarchyType: 'grid',
      interaction: {
        enableCopy: true,
      },
      totals: TOTALS_OPTIONS,
    });
  }

  let s2: PivotSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), getDataCfg(), getOptions());
    s2.render();
  });

  it('should copy no data in grid mode', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual('');
  });

  it('should copy normal data in grid mode', () => {
    const allDataCells = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    const hangzhouDeskCell = allDataCells[0];
    const zhejiangCityDeskSubTotalCell = allDataCells[4];

    // 普通数据节点
    s2.interaction.changeState({
      cells: [getCellMeta(hangzhouDeskCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual(`${originalData[0].number}`);

    // 小计节点
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual(
      `${
        totalData.find(
          (data) => data.province === '浙江省' && data.sub_type === '桌子',
        )!.number
      }`,
    );
  });

  it('should copy col data in grid mode', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2).split('\n').length).toBe(COL_COUNT);
  });

  it('should copy row data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      getDataCfg(),
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
      cells: [getCellMeta(cell!)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(ss).split(NewTab).length).toBe(4);
  });

  it('should copy all data in grid mode', () => {
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getCopyPlainContent(s2).split('\n').length).toBe(COL_COUNT);
    expect(getCopyPlainContent(s2).split('\n')[1].split(NewTab).length).toBe(
      ROW_COUNT,
    );
  });

  it('should copy format data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter: (v) => `${v}元` }],
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
    expect(getCopyPlainContent(ss)).toEqual(`${originalData[0].number}元`);
  });

  it('should copy normal data with header in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
      },
    });
    s2.render();

    const allDataCells = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    const hangzhouDeskCell = allDataCells[0];
    const zhejiangCityDeskSubTotalCell = allDataCells[4];

    // 普通数据节点
    s2.interaction.changeState({
      cells: [getCellMeta(hangzhouDeskCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual(
      `\t\t家具\r\n\t\t桌子\r\n\t\tnumber\r\n浙江省\t杭州市\t7789`,
    );

    // 小计节点
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual(
      `\t\t家具\r\n\t\t桌子\r\n\t\tnumber\r\n浙江省\t小计\t18375`,
    );
  });

  it('should copy normal data with format header in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
        copyWithFormat: true,
        enableCopy: true,
      },
    });

    const meta = [
      { field: 'number', formatter: (v: string) => `${v}元` },
      { field: 'province', formatter: (v: string) => `${v}-省` },
      { field: 'city', formatter: (v: string) => `${v}-市` },
      { field: 'type', formatter: (v: string) => `${v}-类` },
      { field: 'sub_type', formatter: (v: string) => `${v}-子类` },
    ] as Meta[];

    s2.setDataCfg(getDataCfg(meta));

    s2.render();

    const allDataCells = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    const hangzhouDeskCell = allDataCells[0];
    const zhejiangCityDeskSubTotalCell = allDataCells[4];

    // 普通数据节点
    s2.interaction.changeState({
      cells: [getCellMeta(hangzhouDeskCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "		家具-类
      		桌子-子类
      		number
      浙江省-省	杭州市-市	7789元"
    `);

    // 小计节点
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });

    // 这里的小计格式化有误，但与复制无关，后续格式化修复后，这里的单测可能会错误，是正常的
    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "		家具-类
      		桌子-子类
      		number
      浙江省-省	小计-市	18375元"
    `);
  });

  // 看图更清晰 https://gw.alipayobjects.com/zos/antfincdn/zK68PhcnX/d852ffb8-603a-43e5-b841-dbf3c7577638.png
  it('should copy col data with header in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
      },
    });
    s2.render();

    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    // 复制的数据高度 = 列头高度 + 数据高度
    expect(getCopyPlainContent(s2).split('\n')).toHaveLength(
      COL_COUNT + COL_HEADER_HEIGHT,
    );
    // 复制的数据宽度 = 行头宽度 + 数据宽度
    expect(getCopyPlainContent(s2).split('\n')[0].split(NewTab)).toHaveLength(
      5,
    );
  });

  // https://gw.alipayobjects.com/zos/antfincdn/q3mBlV9Ii/1d68499a-b529-4594-93ce-8b04f8b4c4bc.png
  it('should copy row data with header in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
      },
    });
    s2.render();

    const allRowCells = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL);

    const hangzhouDeskCell = allRowCells[1];
    const zhejiangCityDeskSubTotalCell = allRowCells[0];

    // 选择某一行, city 维度下
    s2.interaction.changeState({
      cells: [getCellMeta(hangzhouDeskCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2).split('\n')).toHaveLength(4);
    expect(getCopyPlainContent(s2).split('\n')[0].split(NewTab)).toHaveLength(
      9,
    );

    // 选择某几行，province 维度
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2).split('\n')).toHaveLength(8);
    expect(getCopyPlainContent(s2).split('\n')[0].split(NewTab)).toHaveLength(
      9,
    );
  });

  it('should copy row data with format header in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
        copyWithFormat: true,
      },
    });
    s2.setDataCfg({
      meta: [
        {
          field: 'province',
          formatter: (value) => `${value}-province`,
        },
        {
          field: 'sub_type',
          formatter: (value) => `${value}-sub_type`,
        },
      ],
      fields: {
        valueInCols: true,
        columns: ['province', 'city'],
        rows: ['type', 'sub_type'],
        values: ['number'],
      },
    } as S2DataConfig);
    s2.render();

    const allColCells = s2.interaction.getAllColHeaderCells();

    const zhejiangColCell = allColCells[0];

    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangColCell)],
      stateName: InteractionStateName.SELECTED,
    });

    const copyContent = getCopyPlainContent(s2);

    expect(copyContent).toMatchInlineSnapshot(`
      "		浙江省-province	浙江省-province	浙江省-province	浙江省-province
      		杭州市	绍兴市	宁波市	舟山市
      		number	number	number	number
      家具	桌子-sub_type	7789	2367	3877	4342
      家具	沙发-sub_type	5343	632	7234	834
      办公用品	笔-sub_type	945	1304	1145	1432
      办公用品	纸张-sub_type	1343	1354	1523	1634
      总计		15420	5657	13779	8242"
    `);
  });

  it('should copy all data with header in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
      },
    });
    s2.render();

    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });

    expect(getCopyPlainContent(s2).split('\n').length).toBe(
      COL_COUNT + COL_HEADER_HEIGHT,
    );
    expect(getCopyPlainContent(s2).split('\n')[1].split(NewTab).length).toBe(
      ROW_COUNT + ROW_HEADER_WIDTH,
    );
  });

  it('should copy correct data with data sorted in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: false,
      },
    });
    const node = s2.getColumnNodes().find((node) => node.isLeaf)!;

    s2.groupSortByMethod('ASC' as SortMethodType, node);
    s2.setDataCfg(s2.dataCfg);
    s2.render();

    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)
      .find((e) => e.getMeta().isLeaf)!;

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2);

    expect(data).toBe('2367\t632\t2999\t1304\t1354\t2658\t5657');
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getCopyPlainContent(s2).split('\n').length).toEqual(COL_COUNT);
  });

  it('should copy correct data with \n data in grid mode', () => {
    const sss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter: (v) => `${v}\n元` }],
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
    const data = getCopyPlainContent(sss);

    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with - string in header', () => {
    const s2New = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter: (v) => `${v}\n元` }],
        fields: {
          columns: ['type', 'sub_type'],
          rows: ['province', 'city'],
          values: ['number'],
        },
        data: originalData.map((item) => {
          return {
            ...item,
            province: `${item.province}-1`,
          };
        }),
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
          copyWithFormat: true,
        },
        showSeriesNumber: false,
      }),
    );

    s2New.render();
    const cell = s2New.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2New.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2New);

    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with - string in header name', () => {
    const s2New = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          { field: 'number', name: 'number-3', formatter: (v) => `${v}\n元` },
        ],
        fields: {
          columns: ['number', 'type', 'sub_type'],
        },
        data: originalData,
      }),
      assembleOptions({
        interaction: {
          enableCopy: true,
          copyWithFormat: true,
        },
        showSeriesNumber: false,
      }),
    );

    s2New.render();
    const cell = s2New.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2New.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2New);

    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with hideMeasureColumn is true', () => {
    const ss = new PivotSheet(getContainer(), getDataCfg(), getOptions());

    ss.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
    });
    ss.render();
    const cells = ss.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    ss.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(ss);

    expect(data).toMatchInlineSnapshot(`
      "7789	5343	13132	945	1343
      2367	632	2999	1304	1354
      3877	7234	11111	1145	1523
      4342	834	5176	1432	1634
      18375	14043	32418	4826	5854
      1723	2451	4174	2335	4004
      1822	2244	4066	245	3077
      1943	2333	4276	2457	3551
      2330	2445	4775	2458	352
      7818	9473	17291	7495	10984
      26193	23516	49709	12321	16838"
    `);
  });

  // https://github.com/antvis/S2/issues/1955
  it('should get correct data with hideMeasureColumn、showSeriesNumber and copyWithHeader are all true', () => {
    const ss = new PivotSheet(getContainer(), getDataCfg(), getOptions());

    ss.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
      interaction: {
        enableCopy: true,
        copyWithHeader: true,
      },
      showSeriesNumber: true,
    });
    ss.render();
    const cells = ss.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    ss.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(ss);

    expect(data).toMatchInlineSnapshot(`
      "		家具	家具	家具	办公用品
      		桌子	沙发	小计	笔
      浙江省	杭州市	7789	5343	13132	945
      浙江省	绍兴市	2367	632	2999	1304
      浙江省	宁波市	3877	7234	11111	1145
      浙江省	舟山市	4342	834	5176	1432
      浙江省	小计	18375	14043	32418	4826
      四川省	成都市	1723	2451	4174	2335
      四川省	绵阳市	1822	2244	4066	245
      四川省	南充市	1943	2333	4276	2457
      四川省	乐山市	2330	2445	4775	2458
      四川省	小计	7818	9473	17291	7495
      总计		26193	23516	49709	12321"
    `);
  });
});

describe('Tree Table Core Data Process', () => {
  let s2: PivotSheet;

  function setSelectedVisibleCell() {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL);

    s2.interaction.changeState({
      cells: map(cell, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });
  }

  beforeEach(() => {
    s2 = new PivotSheet(
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
        hierarchyType: 'tree',
        interaction: {
          enableCopy: true,
        },
        totals: TOTALS_OPTIONS,
      }),
    );
    s2.render();
  });

  it('should copy no data in tree mode', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2);

    expect(data).toBe('');
  });

  it('should copy normal data in tree mode', () => {
    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "18375	14043	32418	4826	5854
      7789	5343	13132	945	1343
      2367	632	2999	1304	1354
      3877	7234	11111	1145	1523
      4342	834	5176	1432	1634
      7818	9473	17291	7495	10984
      1723	2451	4174	2335	4004
      1822	2244	4066	245	3077
      1943	2333	4276	2457	3551
      2330	2445	4775	2458	352
      26193	23516	49709	12321	16838"
    `);
  });

  it('should copy col data in grid tree', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.COL_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "18375	14043	32418
      7789	5343	13132
      2367	632	2999
      3877	7234	11111
      4342	834	5176
      7818	9473	17291
      1723	2451	4174
      1822	2244	4066
      1943	2333	4276
      2330	2445	4775
      26193	23516	49709"
    `);
  });

  it('should copy row data in grid tree', () => {
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(
      `"18375	14043	32418	4826	5854	10680	43098"`,
    );
  });

  it('should copy all data in tree mode', () => {
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "18375	14043	32418	4826	5854	10680	43098
      7789	5343	13132	945	1343	2288	15420
      2367	632	2999	1304	1354	2658	5657
      3877	7234	11111	1145	1523	2668	13779
      4342	834	5176	1432	1634	3066	8242
      7818	9473	17291	7495	10984	18479	35770
      1723	2451	4174	2335	4004	6339	10513
      1822	2244	4066	245	3077	3322	7388
      1943	2333	4276	2457	3551	6008	10284
      2330	2445	4775	2458	352	2810	7585
      26193	23516	49709	12321	16838	29159	78868"
    `);
  });

  it('should copy all data in tree mode with format', () => {
    s2.setDataCfg({
      meta: [{ field: 'number', formatter: (v) => `${v}元` }],
      fields: {
        columns: ['type', 'sub_type'],
        rows: ['province', 'city'],
        values: ['number'],
      },
    } as S2DataConfig);
    s2.setOptions({
      interaction: {
        copyWithFormat: true,
      },
    });
    s2.render();

    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "18375元	14043元	32418	4826元	5854元
      7789元	5343元	13132	945元	1343元
      2367元	632元	2999	1304元	1354元
      3877元	7234元	11111	1145元	1523元
      4342元	834元	5176	1432元	1634元
      7818元	9473元	17291	7495元	10984元
      1723元	2451元	4174	2335元	4004元
      1822元	2244元	4066	245元	3077元
      1943元	2333元	4276	2457元	3551元
      2330元	2445元	4775	2458元	352元
      26193元	23516元	49709	12321元	16838元"
    `);
  });

  it('should copy normal data with header in tree mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: true,
        enableCopy: true,
      },
    });
    s2.render();

    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "		家具	家具	家具	办公用品	办公用品
      		桌子	沙发	小计	笔	纸张
      		number	number		number	number
      浙江省		18375	14043	32418	4826	5854
      浙江省	杭州市	7789	5343	13132	945	1343
      浙江省	绍兴市	2367	632	2999	1304	1354
      浙江省	宁波市	3877	7234	11111	1145	1523
      浙江省	舟山市	4342	834	5176	1432	1634
      四川省		7818	9473	17291	7495	10984
      四川省	成都市	1723	2451	4174	2335	4004
      四川省	绵阳市	1822	2244	4066	245	3077
      四川省	南充市	1943	2333	4276	2457	3551
      四川省	乐山市	2330	2445	4775	2458	352
      总计		26193	23516	49709	12321	16838"
    `);
  });
});

describe('Pivot Table getBrushHeaderCopyable', () => {
  const dataCfg = assembleDataCfg({
    meta: [],
    fields: {
      columns: ['type', 'sub_type'],
      rows: ['province', 'city'],
      values: ['number'],
    },
  });
  const options = assembleOptions({
    hierarchyType: 'grid',
    interaction: {
      enableCopy: true,
      brushSelection: true,
    },
  });

  const s2 = new PivotSheet(getContainer(), dataCfg, options);

  beforeEach(() => {
    s2.render();
  });

  test('should copy all row data in grid mode', () => {
    const cells = s2.interaction.getAllRowHeaderCells();

    s2.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllRowHeaderCells());
      },
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "浙江省	杭州市
      浙江省	绍兴市
      浙江省	宁波市
      浙江省	舟山市
      四川省	成都市
      四川省	绵阳市
      四川省	南充市
      四川省	乐山市"
    `);
  });

  test('should copy all col data in grid mode', () => {
    const cells = s2.interaction.getAllColHeaderCells();

    s2.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllColHeaderCells());
      },
    });
    // 列头高度

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`
      "家具	家具	办公用品	办公用品
      桌子	沙发	笔	纸张
      number	number	number	number"
    `);
  });

  test('should copy selection row data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: [],
          rows: ['province', 'city', 'type', 'sub_type'],
          values: ['number'],
        },
      }),
      options,
    );

    ss.render();

    const cells = ss.interaction.getAllRowHeaderCells().filter((c) => {
      const meta = c.getMeta();

      return (meta.level === 2 || meta.level === 3) && meta.y < 180;
    });

    ss.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllRowHeaderCells());
      },
    });

    expect(getCopyPlainContent(ss)).toMatchInlineSnapshot(`
      "家具	桌子
      家具	沙发
      办公用品	笔
      办公用品	纸张
      家具	桌子
      家具	沙发"
    `);

    // 圈选行头前两列 中 y < 180 的区域
    const cells2 = ss.interaction.getAllRowHeaderCells().filter((c) => {
      const meta = c.getMeta();

      return (meta.level === 0 || meta.level === 1) && meta.y < 180;
    });

    ss.interaction.changeState({
      cells: map(cells2, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllRowHeaderCells());
      },
    });

    expect(getCopyPlainContent(ss)).toMatchInlineSnapshot(`
      "浙江省	杭州市
      浙江省	绍兴市"
    `);
  });

  test('should copy selection col data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type'],
          rows: [],
          values: ['number'],
        },
      }),
      options,
    );

    ss.render();

    const cells = ss.interaction.getAllColHeaderCells().filter((c) => {
      const meta = c.getMeta();

      return (meta.level === 3 || meta.level === 4) && meta.x < 480;
    });

    ss.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllColHeaderCells());
      },
    });

    expect(getCopyPlainContent(ss)).toMatchInlineSnapshot(`
      "桌子	沙发	笔	纸张	桌子
      number	number	number	number	number"
    `);

    const cells2 = ss.interaction.getAllColHeaderCells().filter((c) => {
      const meta = c.getMeta();

      return (meta.level === 0 || meta.level === 1) && meta.x < 480;
    });

    ss.interaction.changeState({
      cells: map(cells2, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllColHeaderCells());
      },
    });
    expect(getCopyPlainContent(ss)).toMatchInlineSnapshot(`
      "浙江省	浙江省
      杭州市	绍兴市"
    `);
  });

  test('should copy row total data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      dataCfg,
      assembleOptions({
        hierarchyType: 'grid',
        interaction: {
          enableCopy: true,
          brushSelection: true,
        },
        totals: TOTALS_OPTIONS,
      }),
    );

    ss.render();

    const cells = ss.interaction.getAllRowHeaderCells();

    ss.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllRowHeaderCells());
      },
    });

    expect(getCopyPlainContent(ss)).toMatchInlineSnapshot(`
      "浙江省	杭州市
      浙江省	绍兴市
      浙江省	宁波市
      浙江省	舟山市
      浙江省	小计
      四川省	成都市
      四川省	绵阳市
      四川省	南充市
      四川省	乐山市
      四川省	小计
      总计	总计"
    `);
  });

  test('should copy col total data in grid mode', () => {
    const ss = new PivotSheet(
      getContainer(),
      dataCfg,
      assembleOptions({
        hierarchyType: 'grid',
        interaction: {
          enableCopy: true,
          brushSelection: true,
        },
        totals: TOTALS_OPTIONS,
      }),
    );

    ss.render();

    const cells = ss.interaction.getAllColHeaderCells();

    ss.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(root.getAllColHeaderCells());
      },
    });

    const copyableList = getSelectedData(ss);

    expect(copyableList[0].content).toMatchInlineSnapshot(`
      "家具	家具	家具	办公用品	办公用品
      桌子	沙发	小计	笔	纸张
      number	number	小计	number	number"
    `);

    expect(copyableList[1].content).toMatchInlineSnapshot(
      `"<meta charset=\\"utf-8\\"><table><tbody><tr><td>家具</td><td>家具</td><td>家具</td><td>办公用品</td><td>办公用品</td></tr><tr><td>桌子</td><td>沙发</td><td>小计</td><td>笔</td><td>纸张</td></tr><tr><td>number</td><td>number</td><td>小计</td><td>number</td><td>number</td></tr></tbody></table>"`,
    );
  });
});
