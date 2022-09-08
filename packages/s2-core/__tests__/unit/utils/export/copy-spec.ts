import { assembleDataCfg, assembleOptions, TOTALS_OPTIONS } from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import { data as originalData, totalData } from 'tests/data/mock-dataset.json';
import { map } from 'lodash';
import { TableSheet, PivotSheet } from '@/sheet-type';

import {
  CellTypes,
  InteractionStateName,
  SortMethodType,
} from '@/common/constant/interaction';
import {
  convertString,
  CopyMIMEType,
  getCopyData,
  getSelectedData,
} from '@/utils/export/copy';
import { getCellMeta } from '@/utils/interaction/select-event';
import { CopyType, S2Event } from '@/common/constant';

const newLineTest = `"### 问题摘要
- **会话地址**："`;

const testData = originalData.map((item, i) => {
  if (i === 0) {
    return { ...item, sub_type: newLineTest };
  }
  return { ...item };
});

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
    s2.destroy();
  });

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
    expect(getSelectedData(s2).split('\n').length).toBe(33);
    expect(getSelectedData(s2).split('\n')[2].split('\t').length).toBe(5);
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
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2)).toEqual('province\r\n浙江省');
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
      .filter(({ cellType }) => cellType === CellTypes.ROW_CELL)[1];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getSelectedData(s2);
    expect(data).toBe('7234\t浙江省\t宁波市\t家具\t沙发');
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toEqual(33);
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
  // 7 = 4(维度节点) + 2(小计) + 1(总计)
  const ROW_COUNT = 7;
  // 11 = 8(维度节点) + 2(小计) + 1(总计)
  const COL_COUNT = 11;
  // 3 = ['type', 'sub_type', 'number'].length 行头高度
  const COL_HEADER_HEIGHT = 3;
  // 2 = ['province', 'city'].length 列头宽度
  const ROW_HEADER_WIDTH = 2;

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
      totals: TOTALS_OPTIONS,
    }),
  );
  s2.render();

  it('should copy no data in grid mode', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getSelectedData(s2)).toEqual('');
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
    expect(getSelectedData(s2)).toEqual(`${originalData[0].number}`);

    // 小计节点
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2)).toEqual(
      `${
        totalData.find(
          (data) => data.province === '浙江省' && data.sub_type === '桌子',
        ).number
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
    expect(getSelectedData(s2).split('\n').length).toBe(COL_COUNT);
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
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toBe(COL_COUNT);
    expect(getSelectedData(s2).split('\n')[1].split('\t').length).toBe(
      ROW_COUNT,
    );
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

    expect(getSelectedData(s2)).toEqual(
      `\t\t家具\r\n\t\t桌子\r\n\t\tnumber\r\n浙江省\t杭州市\t7789`,
    );

    // 小计节点
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getSelectedData(s2)).toEqual(
      `\t\t家具\r\n\t\t桌子\r\n\t\tnumber\r\n浙江省\t小计\t18375`,
    );
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
    expect(getSelectedData(s2).split('\n')).toHaveLength(
      COL_COUNT + COL_HEADER_HEIGHT,
    );
    // 复制的数据宽度 = 行头宽度 + 数据宽度
    expect(getSelectedData(s2).split('\n')[0].split('\t')).toHaveLength(5);
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

    expect(getSelectedData(s2).split('\n')).toHaveLength(4);
    expect(getSelectedData(s2).split('\n')[0].split('\t')).toHaveLength(9);

    // 选择某几行，province 维度
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getSelectedData(s2).split('\n')).toHaveLength(8);
    expect(getSelectedData(s2).split('\n')[0].split('\t')).toHaveLength(9);
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

    expect(getSelectedData(s2).split('\n').length).toBe(
      COL_COUNT + COL_HEADER_HEIGHT,
    );
    expect(getSelectedData(s2).split('\n')[1].split('\t').length).toBe(
      ROW_COUNT + ROW_HEADER_WIDTH,
    );
  });

  it('should copy correct data with data sorted in grid mode', () => {
    s2.setOptions({
      interaction: {
        copyWithHeader: false,
      },
    });
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
    expect(data).toBe('2367\t632\t2999\t1304\t1354\t2658\t5657');
    s2.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
    expect(getSelectedData(s2).split('\n').length).toEqual(COL_COUNT);
  });

  it('should copy correct data with \n data in grid mode', () => {
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

  it('should get correct data with - string in header', () => {
    const s2New = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter: (v) => v + '\n元' }],
        fields: {
          columns: ['type', 'sub_type'],
          rows: ['province', 'city'],
          values: ['number'],
        },
        data: originalData.map((item) => {
          return {
            ...item,
            province: item.province + '-1',
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
    const data = getSelectedData(s2New);
    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with - string in header name', () => {
    const s2New = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          { field: 'number', name: 'number-3', formatter: (v) => v + '\n元' },
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
    const data = getSelectedData(s2New);
    expect(data).toBe(convertString(`7789\n元`));
  });
});

describe('List Table getCopyData', () => {
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
    const cell = s2.interaction
      .getAllCells()
      .filter(({ cellType }) => cellType === CellTypes.DATA_CELL)[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
  });

  it('should get correct data in CopyType.ALL', () => {
    const data = getCopyData(s2, CopyType.ALL);
    expect(data.split('\n').length).toBe(33);
    expect(data.split('\n')[2].split('\t').length).toBe(5);
  });

  it('should get correct data in CopyType.COL', () => {
    const data = getCopyData(s2, CopyType.COL);
    expect(data.split('\n').length).toBe(32);
    expect(data.split('\n')[2].split('\t').length).toBe(1);
  });

  it('should get correct data in CopyType.ROW', () => {
    const data = getCopyData(s2, CopyType.ROW);
    expect(data.split('\n').length).toBe(2);
    expect(data.split('\t').length).toBe(5);
  });

  it('should copy in multiple format', () => {
    const data = getCopyData(s2, CopyType.ROW, [
      CopyMIMEType.PLAIN,
      CopyMIMEType.HTML,
    ]) as string[];
    expect(data.length).toBe(2);
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
    // 行头高度
    expect(getSelectedData(s2).split('\n').length).toBe(8);
    // 行头第一个 值
    expect(getSelectedData(s2).split('\n')[0].split('\t')[0]).toEqual('浙江省');
    // 行头最后一个 值
    expect(getSelectedData(s2).split('\n')[7].split('\t')[1]).toEqual('乐山市');
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
    expect(getSelectedData(s2).split('\n').length).toBe(3);
    // 列头第一个 值
    expect(getSelectedData(s2).split('\n')[0].split('\t')[0]).toEqual('家具');
    // 列头最后一个 值
    expect(getSelectedData(s2).split('\n')[2].split('\t')[3]).toEqual('number');
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

    // ["家具	桌子
    //     ", "家具	沙发
    //     ", "办公用品	笔
    //     ", "办公用品	纸张
    //     ", "家具	桌子
    //     ", "家具	沙发"]
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

    expect(getSelectedData(ss).split('\n').length).toBe(6);
    expect(getSelectedData(ss).split('\n')[5].split('\t')[1]).toEqual('沙发');

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

    expect(getSelectedData(ss).split('\n').length).toBe(2);
    expect(getSelectedData(ss).split('\n')[1].split('\t')[1]).toEqual('绍兴市');
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

    // ["桌子	沙发	笔	纸张	桌子",
    // "number	number	number	number	number"]
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
    expect(getSelectedData(ss).split('\n').length).toBe(2);
    expect(getSelectedData(ss).split('\n')[1].split('\t').length).toBe(5);
    expect(getSelectedData(ss).split('\n')[0].split('\t')[3]).toEqual('纸张');

    // ["浙江省	杭州市
    //     ", "浙江省	绍兴市"]
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
    expect(getSelectedData(ss).split('\n').length).toBe(2);
    expect(getSelectedData(ss).split('\n')[1].split('\t')[1]).toBe('绍兴市');
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

    expect(getSelectedData(ss).split('\n').length).toBe(11);
    expect(getSelectedData(ss).split('\n')[9].split('\t')[1]).toContain('小计');
    expect(getSelectedData(ss).split('\n')[10].split('\t')[1]).toEqual('总计');
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

    expect(getSelectedData(ss).split('\n').length).toBe(3);
    expect(getSelectedData(ss).split('\n')[1].split('\t')[2]).toEqual('小计');
    expect(getSelectedData(ss).split('\n')[2].split('\t')[2]).toEqual('小计');
  });
});
