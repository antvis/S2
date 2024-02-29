import { map } from 'lodash';
import { data as originalData, totalData } from 'tests/data/mock-dataset.json';
import {
  TOTALS_OPTIONS,
  assembleDataCfg,
  assembleOptions,
  waitForRender,
} from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import type { S2CellType, S2DataConfig } from '../../../../src/common';
import { customRowGridSimpleFields } from '../../../data/custom-grid-simple-fields';
import { CustomGridData } from '../../../data/data-custom-grid';
import { TableSeriesNumberCell } from '@/cell';
import { NewLine, NewTab, S2Event } from '@/common/constant';
import {
  InteractionStateName,
  SortMethodType,
} from '@/common/constant/interaction';
import type { Meta } from '@/common/interface';
import { Aggregation } from '@/common/interface';
import { PivotSheet, SpreadSheet, TableSheet } from '@/sheet-type';
import { getSelectedData } from '@/utils/export/copy';
import { CopyMIMEType } from '@/common/interface/export';
import { convertString } from '@/utils/export/method';
import { getCellMeta } from '@/utils/interaction/select-event';

const newLineTest = `### 问题摘要 ${NewLine}- **会话地址**：`;

const testData = originalData.map((item, i) => {
  if (i === 0) {
    return { ...item, sub_type: newLineTest };
  }

  return { ...item };
});

const getCopyPlainContent = (sheet: SpreadSheet): string => {
  const data = getSelectedData(sheet);

  return data[0].content;
};

const customRowDataCfg: S2DataConfig = {
  data: CustomGridData,
  meta: [
    {
      field: 'type',
      name: '类型',
    },
    {
      field: 'sub_type',
      name: '子类型',
    },
    {
      field: 'a-1',
      name: '层级1',
    },
    {
      field: 'a-2',
      name: '层级2',
    },
  ],
  fields: customRowGridSimpleFields,
};

describe('List Table Core Data Process', () => {
  let s2: TableSheet;

  beforeEach(async () => {
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
        seriesNumber: {
          enable: true,
        },
        interaction: {
          selectedCellHighlight: {
            currentRow: true,
          },
        },
      }),
    );

    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  it('should copy no data', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual('');
  });

  it('should copy normal data', () => {
    const cell = s2.facet
      .getDataCells()
      .find((cell) => cell.getMeta().valueField === 'province')!;

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual('浙江省');
  });

  it('should copy col data', () => {
    const cell = s2.facet.getColCells()[3];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2).split(NewLine).length).toBe(32);
  });

  it('should copy row data', () => {
    const cell = s2.facet.getSeriesNumberCells()[3];

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

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
    expect(getCopyPlainContent(s2).split(NewLine).length).toBe(33);
    expect(getCopyPlainContent(s2).split(NewLine)[2]).toMatchInlineSnapshot(
      `"2	浙江省	绍兴市	家具	桌子	2367"`,
    );
  });

  it('should copy all data with header in table mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
          withFormat: true,
        },
      },
      seriesNumber: {
        enable: false,
      },
    });

    await s2.render();

    s2.interaction.changeState({
      cells: s2.facet.getDataCells().map((cell) => getCellMeta(cell)),
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy correctly data with header in table mode if contain repeat column', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
          withFormat: true,
        },
      },
      seriesNumber: {
        enable: false,
      },
    });
    s2.setDataCfg({
      meta: [
        { field: 'province', name: '城市' },
        { field: 'city', name: '城市' },
        { field: 'type', name: '城市' },
        { field: 'sub_type', name: '城市' },
        { field: 'number', name: '城市' },
      ],
    });

    await s2.render();

    s2.interaction.changeState({
      cells: s2.facet.getDataCells().map((cell) => getCellMeta(cell)),
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy series number data', async () => {
    s2.setOptions({
      seriesNumber: {
        enable: true,
      },
    });

    await s2.render();

    s2.interaction.changeState({
      cells: s2.facet.getDataCells().map((cell) => getCellMeta(cell)),
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy province data with header in table mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
        },
      },
      seriesNumber: {
        enable: false,
      },
    });
    await s2.render();

    const cell = s2.facet
      .getDataCells()
      .find((cell) => cell.getMeta().valueField === 'province')!;

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual('province\r\n浙江省');
  });

  it('should copy format data', async () => {
    const sheet = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'province', formatter: (v) => `${v}元` }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        interaction: {
          copy: { enable: true, withFormat: true },
        },
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await sheet.render();
    const cell = s2.facet
      .getDataCells()
      .find((cell) => cell.getMeta().valueField === 'province')!;

    sheet.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(sheet)).toEqual('浙江省元');
  });

  // https://github.com/antvis/S2/issues/1770
  it('should copy format data with row header selected', async () => {
    s2.setDataCfg({
      meta: [{ field: 'province', formatter: (v) => `${v}_formatted` }],
      fields: {
        columns: ['province', 'city', 'type', 'sub_type', 'number'],
      },
    });

    s2.setOptions({
      interaction: {
        copy: { enable: true, withFormat: true },
      },
      seriesNumber: {
        enable: false,
      },
    });

    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    s2.interaction.changeState({
      cells: [getCellMeta(dataCell)],
      stateName: InteractionStateName.SELECTED,
    });

    const data = getCopyPlainContent(s2);

    expect(data).toEqual('浙江省_formatted');
  });

  // https://github.com/antvis/S2/issues/1770
  it('should copy format data with col header selected', async () => {
    const sheet = new TableSheet(
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
          copy: { enable: true, withFormat: true },
        },
      }),
    );

    await sheet.render();

    const cell = sheet.facet.getColCells()[1];

    sheet.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    const data = getCopyPlainContent(sheet);

    expect(data.split('_formatted').length).toEqual(33);
  });

  it('should copy correct data when selected diagonal cells', async () => {
    await s2.render();

    const cells = s2.facet.getDataCells();

    s2.interaction.changeState({
      cells: [getCellMeta(cells[21]), getCellMeta(cells[48])],
      stateName: InteractionStateName.SELECTED,
    });

    const dataContent = getCopyPlainContent(s2);

    expect(dataContent).toMatchSnapshot();
  });

  it('should copy correct data with data filtered', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: false,
        },
      },
    });
    await s2.render();

    await waitForRender(s2, () => {
      s2.emit(S2Event.RANGE_FILTER, {
        filterKey: 'province',
        filteredValues: ['浙江省'],
      });
    });

    const cell = s2.facet.getSeriesNumberCells()[3];

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

  it('should copy correct data with data sorted', async () => {
    await waitForRender(s2, () => {
      s2.emit(S2Event.RANGE_SORT, [
        {
          sortFieldId: 'number',
          sortMethod: 'DESC' as SortMethodType,
        },
      ]);
    });

    const cell = s2.facet.getSeriesNumberCells()[1];

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

  it('should copy correct data with "\n" data', async () => {
    const newLineText = `1
    2`;
    const sheet = new TableSheet(
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
          copy: { enable: true },
        },
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await sheet.render();

    const cell = sheet.facet
      .getDataCells()
      .filter((cell) => !(cell instanceof TableSeriesNumberCell))[20];

    sheet.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sheet);

    expect(data).toBe(convertString(newLineText));
  });

  it('should not transform double quotes to single quotes when newline char is in data', async () => {
    const newLineText = `"1
    2"`;
    const sheet = new TableSheet(
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
          copy: { enable: true },
        },
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await sheet.render();

    const cell = sheet.facet.getDataCells()[40];

    sheet.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sheet);

    expect(data).toBe(convertString(newLineText));
  });

  it('should copy row data when select data row cell', async () => {
    s2.setOptions({
      seriesNumber: {
        enable: false,
      },
      interaction: {
        selectedCellHighlight: {
          currentRow: true,
        },
      },
    });

    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    s2.interaction.changeState({
      cells: [getCellMeta(dataCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual('浙江省');
    expect(getCopyPlainContent(s2).split(NewTab).length).toBe(1);
  });

  it('should support custom copy matrix transformer', async () => {
    s2.setOptions({
      seriesNumber: {
        enable: false,
      },
      interaction: {
        copy: {
          customTransformer: () => {
            return {
              [CopyMIMEType.PLAIN]: () => {
                return { type: CopyMIMEType.PLAIN, content: 'custom data' };
              },
            };
          },
        },
      },
    });

    await s2.render();
    const cell = s2.facet.getDataCells()[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`"custom data"`);
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

  function getDataCfg(meta: Meta[] = [], valueInCols = true) {
    return assembleDataCfg({
      meta,
      fields: {
        columns: ['type', 'sub_type'],
        rows: ['province', 'city'],
        values: ['number'],
        valueInCols,
      },
    });
  }

  function getOptions() {
    return assembleOptions({
      hierarchyType: 'grid',
      interaction: {
        copy: { enable: true },
      },
      totals: TOTALS_OPTIONS,
    });
  }

  let s2: PivotSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), getDataCfg(), getOptions());
    await s2.render();
  });

  it('should copy no data in grid mode', () => {
    s2.interaction.changeState({
      cells: [],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toEqual('');
  });

  it('should copy normal data in grid mode', () => {
    const allDataCells = s2.facet.getDataCells();

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

  it('should copy format data when valueInCols is false in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: { enable: true, withFormat: true },
      },
    });

    const meta = [
      { field: 'number', formatter: (v: string) => `${v}元` },
    ] as Meta[];

    s2.setDataCfg(getDataCfg(meta, false));

    await s2.render();

    const allDataCells = s2.facet.getDataCells();

    const hangzhouDeskCell = allDataCells[0];
    const zhejiangCityDeskSubTotalCell = allDataCells[4];

    // 普通数据节点
    s2.interaction.changeState({
      cells: [getCellMeta(hangzhouDeskCell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2)).toEqual(`${originalData[0].number}元`);

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
      }元`,
    );
  });

  it('should copy format total data in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: { enable: true, withHeader: true, withFormat: true },
      },
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
          calcGrandTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['type'],
          calcGrandTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
        },
      },
    });

    const meta = [
      { field: 'number', formatter: (v: string) => `${v}元` },
    ] as Meta[];

    s2.setDataCfg(getDataCfg(meta, false));

    await s2.render();
    const allDataCells = s2.facet.getDataCells();

    s2.interaction.changeState({
      cells: map(allDataCells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });

    const copyContent = getCopyPlainContent(s2);

    // 主要查看行列小计总计对应的值都格式化成功了
    expect(copyContent).toMatchSnapshot();
  });

  it('should copy col data in grid mode', () => {
    const cell = s2.facet.getColCells()[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(s2).split('\n').length).toBe(COL_COUNT);
  });

  it('should copy row data in grid mode', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      getDataCfg(),
      assembleOptions({
        hierarchyType: 'grid',
        interaction: {
          copy: { enable: true },
        },
      }),
    );

    await sheet.render();
    const cell = sheet.facet.getRowCells().pop();

    sheet.interaction.changeState({
      cells: [getCellMeta(cell!)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(sheet).split(NewTab).length).toBe(4);
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

  it('should copy format data in grid mode', async () => {
    const sheet = new PivotSheet(
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
          copy: { enable: true, withFormat: true },
        },
        seriesNumber: {
          enable: false,
        },
      }),
    );

    await sheet.render();
    const cell = s2.facet.getDataCells()[0];

    sheet.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    expect(getCopyPlainContent(sheet)).toEqual(`${originalData[0].number}元`);
  });

  it('should copy normal data with header in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
        },
      },
    });
    await s2.render();

    const allDataCells = s2.facet.getDataCells();

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

  it('should copy normal data with format header in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: { enable: true, withHeader: true, withFormat: true },
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

    await s2.render();

    const allDataCells = s2.facet.getDataCells();

    const hangzhouDeskCell = allDataCells[0];
    const zhejiangCityDeskSubTotalCell = allDataCells[4];

    // 普通数据节点
    s2.interaction.changeState({
      cells: [getCellMeta(hangzhouDeskCell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchSnapshot();

    // 小计节点
    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangCityDeskSubTotalCell)],
      stateName: InteractionStateName.SELECTED,
    });

    // 这里的小计格式化有误，但与复制无关，后续格式化修复后，这里的单测可能会错误，是正常的
    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  // 看图更清晰 https://gw.alipayobjects.com/zos/antfincdn/zK68PhcnX/d852ffb8-603a-43e5-b841-dbf3c7577638.png
  it('should copy col data with header in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
        },
      },
    });
    await s2.render();

    const cell = s2.facet.getColCells()[0];

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
  it('should copy row data with header in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
        },
      },
    });
    await s2.render();

    const allRowCells = s2.facet.getRowCells();

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

  it('should copy row data with format header in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          enable: true,
          withHeader: true,
          withFormat: true,
        },
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

    await s2.render();

    const allColCells = s2.facet.getColCells();

    const zhejiangColCell = allColCells[0];

    s2.interaction.changeState({
      cells: [getCellMeta(zhejiangColCell)],
      stateName: InteractionStateName.SELECTED,
    });

    const copyContent = getCopyPlainContent(s2);

    expect(copyContent).toMatchSnapshot();
  });

  it('should copy all data with header in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: true,
        },
      },
    });
    await s2.render();

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

  it('should copy correct data with data sorted in grid mode', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          withHeader: false,
        },
      },
    });
    const node = s2.facet.getColLeafNodes()[0];

    s2.groupSortByMethod('ASC' as SortMethodType, node);
    s2.setDataCfg(s2.dataCfg);
    await s2.render();

    const cell = s2.facet.getRowCells().find((e) => e.getMeta().isLeaf)!;

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

  it('should copy correct data with \n data in grid mode', async () => {
    const sheet = new PivotSheet(
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
          copy: { enable: true, withFormat: true },
        },
        seriesNumber: {
          enable: false,
        },
      }),
    );

    await sheet.render();

    const cell = sheet.facet.getDataCells()[0];

    sheet.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sheet);

    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with - string in header', async () => {
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
          copy: { enable: true, withFormat: true },
        },
        seriesNumber: {
          enable: false,
        },
      }),
    );

    await s2New.render();
    const cell = s2New.facet.getDataCells()[0];

    s2New.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2New);

    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with - string in header name', async () => {
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
          copy: { enable: true, withFormat: true },
        },
        seriesNumber: {
          enable: false,
        },
      }),
    );

    await s2New.render();
    const cell = s2New.facet.getDataCells()[0];

    s2New.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(s2New);

    expect(data).toBe(convertString(`7789\n元`));
  });

  it('should get correct data with hideMeasureColumn is true', async () => {
    const sheet = new PivotSheet(getContainer(), getDataCfg(), getOptions());

    sheet.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
    });
    await sheet.render();
    const cells = sheet.facet.getDataCells();

    sheet.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sheet);

    expect(data).toMatchSnapshot();
  });

  // https://github.com/antvis/S2/issues/1955
  it('should get correct data with hideMeasureColumn、show seriesNumber and withHeader are all true', async () => {
    const sheet = new PivotSheet(getContainer(), getDataCfg(), getOptions());

    sheet.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
      interaction: {
        copy: { enable: true, withHeader: true },
      },
      seriesNumber: {
        enable: true,
      },
    });
    await sheet.render();
    const cells = sheet.facet.getDataCells();

    sheet.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });
    const data = getCopyPlainContent(sheet);

    expect(data).toMatchSnapshot();
  });

  it('should support custom copy matrix transformer', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          customTransformer: () => {
            return {
              [CopyMIMEType.PLAIN]: () => {
                return { type: CopyMIMEType.PLAIN, content: 'custom data' };
              },
            };
          },
        },
      },
    });

    await s2.render();
    const cell = s2.facet.getDataCells()[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchInlineSnapshot(`"custom data"`);
  });
});

describe('Tree Table Core Data Process', () => {
  let s2: PivotSheet;

  function setSelectedVisibleCell() {
    const cell = s2.facet.getDataCells();

    s2.interaction.changeState({
      cells: map(cell, getCellMeta),
      stateName: InteractionStateName.SELECTED,
    });
  }

  beforeEach(async () => {
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
          copy: { enable: true },
        },
        totals: TOTALS_OPTIONS,
      }),
    );
    await s2.render();
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

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy col data in grid tree', () => {
    const cell = s2.facet.getColCells()[0];

    s2.interaction.changeState({
      cells: [getCellMeta(cell)],
      stateName: InteractionStateName.SELECTED,
    });

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy row data in grid tree', () => {
    const cell = s2.facet.getRowCells()[0];

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

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy all data in tree mode with format', async () => {
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
        copy: {
          enable: true,
          withFormat: true,
        },
      },
    });
    await s2.render();

    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy normal data with header in tree mode', async () => {
    s2.setOptions({
      interaction: {
        copy: { enable: true, withHeader: true },
      },
    });
    await s2.render();

    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy format data with header in tree mode', async () => {
    s2.setDataCfg({
      meta: [{ field: 'number', name: '数量', formatter: (v) => `${v}元` }],
    } as S2DataConfig);

    s2.setOptions({
      interaction: {
        copy: { enable: true, withHeader: true },
      },
    });
    await s2.render();

    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  it('should copy normal data with header for custom field name', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          enable: true,
          withHeader: true,
        },
      },
    });
    s2.setDataCfg({
      meta: [
        {
          field: 'number',
          name: '数量',
        },
      ],
    });
    await s2.render();

    setSelectedVisibleCell();

    expect(getSelectedData(s2)).toMatchSnapshot();
  });

  it('should copy normal data with header for custom field formatter if enable withFormat', async () => {
    s2.setOptions({
      interaction: {
        copy: {
          enable: true,
          withHeader: true,
          withFormat: true,
        },
      },
    });
    s2.setDataCfg({
      meta: [
        {
          field: 'number',
          name: '数量',
          formatter: (value) => `${value}-@`,
        },
      ],
    });
    await s2.render();

    setSelectedVisibleCell();

    expect(getSelectedData(s2)).toMatchSnapshot();
  });

  it('should copy all data in tree mode for custom row cell', async () => {
    s2.setDataCfg(customRowDataCfg);
    s2.setOptions({
      interaction: {
        copy: {
          enable: true,
          withHeader: true,
          withFormat: true,
        },
      },
    });
    await s2.render();

    setSelectedVisibleCell();

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });
});

describe('Pivot Table getBrushHeaderCopyable', () => {
  let s2: SpreadSheet;

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
      copy: { enable: true },
      brushSelection: true,
    },
  });

  const selectCells = (cells: S2CellType[], instance: SpreadSheet = s2) => {
    instance.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(cells);
      },
    });
  };

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), dataCfg, options);
    await s2.render();
  });

  test('should copy all row data in grid mode', () => {
    const cells = s2.facet.getRowCells();

    selectCells(cells);

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  test('should copy all row data in tree mode', async () => {
    s2.setOptions({ hierarchyType: 'tree' });
    await s2.render(false);

    const cells = s2.facet.getRowCells();

    selectCells(cells);

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  test('should copy all row data in grid mode with formatter', async () => {
    s2.setDataCfg({
      fields: {
        valueInCols: false,
      },
      meta: [
        {
          field: 'number',
          name: '数值',
        },
      ],
    });
    await s2.render();

    const cells = s2.facet.getRowCells();

    selectCells(cells);

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  test('should copy all original row data in grid mode if contains text ellipses', async () => {
    s2.setOptions({
      style: {
        rowCell: {
          // 展示省略号
          width: 10,
        },
      },
    });
    await s2.render(false);
    const cells = s2.facet.getRowCells();

    selectCells(cells);

    expect(getSelectedData(s2)).toMatchSnapshot();
  });

  test('should copy all original row data in tree mode if contains text ellipses', async () => {
    s2.setOptions({
      hierarchyType: 'tree',
      style: {
        rowCell: {
          // 展示省略号
          width: 10,
        },
      },
    });

    await s2.render(false);
    const cells = s2.facet.getRowCells();

    selectCells(cells);

    expect(getSelectedData(s2)).toMatchSnapshot();
  });

  test('should copy all col data in grid mode', () => {
    const cells = s2.facet.getColCells();

    selectCells(cells);

    // 列头高度
    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  test('should copy all col data in grid mode with formatter', async () => {
    s2.setDataCfg({
      meta: [
        {
          field: 'number',
          name: '数值',
        },
      ],
    });
    await s2.render();

    const cells = s2.facet.getColCells();

    selectCells(cells);

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });

  test('should copy all col data in grid mode for custom field meta', async () => {
    s2.setDataCfg({
      meta: [
        {
          field: 'number',
          name: '数量',
        },
      ],
    });

    await s2.render();

    const cells = s2.facet.getColCells();

    selectCells(cells);

    expect(getSelectedData(s2)).toMatchSnapshot();
  });

  test('should copy selection row data in grid mode', async () => {
    const sheet = new PivotSheet(
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

    await sheet.render();

    const cells = sheet.facet.getRowCells().filter((rowCell) => {
      const meta = rowCell.getMeta();

      return (meta.level === 2 || meta.level === 3) && meta.y < 180;
    });

    sheet.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(sheet.facet.getRowCells());
      },
    });

    expect(getCopyPlainContent(sheet)).toMatchSnapshot();

    // 圈选行头前两列 中 y < 180 的区域
    const cells2 = sheet.facet.getRowCells().filter((rowCell) => {
      const meta = rowCell.getMeta();

      return (meta.level === 0 || meta.level === 1) && meta.y < 180;
    });

    sheet.interaction.changeState({
      cells: map(cells2, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(sheet.facet.getRowCells());
      },
    });

    expect(getCopyPlainContent(sheet)).toMatchSnapshot();
  });

  test('should copy selection col data in grid mode', async () => {
    const sheet = new PivotSheet(
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

    await sheet.render();

    const cells = sheet.facet.getColCells().filter((c) => {
      const meta = c.getMeta();

      return (meta.level === 3 || meta.level === 4) && meta.x < 480;
    });

    sheet.interaction.changeState({
      cells: map(cells, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(sheet.facet.getColCells());
      },
    });

    expect(getCopyPlainContent(sheet)).toMatchSnapshot();

    const cells2 = sheet.facet.getColCells().filter((c) => {
      const meta = c.getMeta();

      return (meta.level === 0 || meta.level === 1) && meta.x < 480;
    });

    sheet.interaction.changeState({
      cells: map(cells2, getCellMeta),
      stateName: InteractionStateName.SELECTED,
      onUpdateCells: (root) => {
        root.updateCells(sheet.facet.getColCells());
      },
    });

    expect(getCopyPlainContent(sheet)).toMatchSnapshot();
  });

  test('should copy row total data in grid mode', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      dataCfg,
      assembleOptions({
        hierarchyType: 'grid',
        interaction: {
          copy: { enable: true },
          brushSelection: true,
        },
        totals: TOTALS_OPTIONS,
      }),
    );

    await sheet.render();

    const cells = sheet.facet.getRowCells();

    selectCells(cells, sheet);

    expect(getCopyPlainContent(sheet)).toMatchSnapshot();
  });

  test('should copy col total data in grid mode', async () => {
    const sheet = new PivotSheet(
      getContainer(),
      dataCfg,
      assembleOptions({
        hierarchyType: 'grid',
        interaction: {
          copy: { enable: true },
          brushSelection: true,
        },
        totals: TOTALS_OPTIONS,
      }),
    );

    await sheet.render();

    const cells = sheet.facet.getColCells();

    selectCells(cells, sheet);

    const copyableList = getSelectedData(sheet);

    expect(copyableList).toMatchSnapshot();
  });

  it('should copy all row data in tree mode for custom row cell', async () => {
    s2.setDataCfg(customRowDataCfg);
    s2.setOptions({
      hierarchyType: 'tree',
      interaction: {
        copy: {
          enable: true,
          withHeader: true,
          withFormat: true,
        },
      },
    });
    await s2.render();

    const cells = s2.facet.getRowCells();

    selectCells(cells);

    expect(getCopyPlainContent(s2)).toMatchSnapshot();
  });
});
