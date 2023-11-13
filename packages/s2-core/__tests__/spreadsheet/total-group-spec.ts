import { getContainer } from 'tests/util/helpers';
import { s2Options, dataCfg } from '../data/total-group-data';
import { PivotSheet } from '@/sheet-type';
import { EXTRA_FIELD, VALUE_FIELD, type S2Options } from '@/common';

describe('Total Group Dimension Test', () => {
  let container: HTMLDivElement;

  let s2: PivotSheet;
  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    s2?.destroy();
  });

  test(`should get correct layout with row total group dimension 'type'`, () => {
    s2 = new PivotSheet(container, dataCfg, s2Options as S2Options);
    s2.render();

    const { rowLeafNodes, getCellMeta } = s2.facet.layoutResult;
    expect(rowLeafNodes[0].id).toEqual('root[&]总计[&]家具');
    expect(rowLeafNodes[1].id).toEqual('root[&]总计[&]办公用品');

    expect(getCellMeta(0, 0).data).toEqual({
      type: '家具',
      price: 2000,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 2000,
    });
    expect(getCellMeta(1, 1).data).toEqual({
      type: '办公用品',
      cost: 1900,
      [EXTRA_FIELD]: 'cost',
      [VALUE_FIELD]: 1900,
    });
  });

  test(`should get correct layout with row total group dimension 'city'`, () => {
    const newS2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        row: {
          ...s2Options.totals.row,
          totalsGroupDimensions: ['city'],
        },
      },
    };
    s2 = new PivotSheet(container, dataCfg, newS2Options as S2Options);
    s2.render();

    const { rowLeafNodes, getCellMeta } = s2.facet.layoutResult;
    expect(rowLeafNodes[0].id).toEqual('root[&]总计[&]杭州市');
    expect(rowLeafNodes[1].id).toEqual('root[&]总计[&]舟山市');
    expect(rowLeafNodes[2].id).toEqual('root[&]总计[&]成都市');
    expect(rowLeafNodes[3].id).toEqual('root[&]总计[&]绵阳市');

    expect(getCellMeta(0, 0).data).toEqual({
      city: '杭州市',
      price: 300,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 300,
    });

    expect(getCellMeta(1, 0).data).toEqual({
      city: '舟山市',
      price: 800,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 800,
    });

    expect(getCellMeta(2, 0).data).toEqual({
      city: '成都市',
      price: 1200,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 1200,
    });

    expect(getCellMeta(3, 0).data).toEqual({
      city: '绵阳市',
      price: 1600,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 1600,
    });
  });

  test(`should get correct layout with row sub group dimension 'type'`, () => {
    const newS2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        row: {
          ...s2Options.totals.row,
          // 总计分组下，city 城市维度会出现分组
          totalsGroupDimensions: ['city'],
          subTotalsGroupDimensions: ['type'],
        },
      },
    };

    const newDataCfg = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province', 'city', 'type'],
        columns: ['sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options as S2Options);
    s2.render();

    const { rowLeafNodes, getCellMeta } = s2.facet.layoutResult;
    expect(rowLeafNodes[4].id).toEqual('root[&]浙江省[&]小计[&]家具');
    expect(rowLeafNodes[5].id).toEqual('root[&]浙江省[&]小计[&]办公用品');

    expect(getCellMeta(4, 0).data).toEqual({
      province: '浙江省',
      price: 600,
      type: '家具',
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 600,
    });

    expect(getCellMeta(5, 0).data).toEqual({
      province: '浙江省',
      type: '办公用品',
      price: 500,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 500,
    });
  });

  test(`should get correct layout with col total group dimension 'type'`, () => {
    const newS2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        col: {
          ...s2Options.totals.col,
          totalsGroupDimensions: ['type'],
        },
      },
    };

    const newDataCfg = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province'],
        columns: ['city', 'type', 'sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options as S2Options);
    s2.render();

    const { getCellMeta } = s2.facet.layoutResult;

    expect(getCellMeta(0, 0).data).toEqual({
      type: '家具',
      price: 2000,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 2000,
    });

    expect(getCellMeta(0, 2).data).toEqual({
      type: '办公用品',
      price: 1900,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 1900,
    });
  });

  test(`should get correct layout with col total group dimension 'sub_type'`, () => {
    const newS2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        col: {
          ...s2Options.totals.col,
          totalsGroupDimensions: ['sub_type'],
        },
      },
    };

    const newDataCfg = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province'],
        columns: ['city', 'type', 'sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options as S2Options);
    s2.render();

    const { getCellMeta } = s2.facet.layoutResult;

    expect(getCellMeta(0, 0).data).toEqual({
      sub_type: '桌子',
      price: 1000,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 1000,
    });

    expect(getCellMeta(0, 2).data).toEqual({
      sub_type: '沙发',
      price: 1000,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 1000,
    });

    expect(getCellMeta(0, 4).data).toEqual({
      sub_type: '笔',
      price: 1000,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 1000,
    });

    expect(getCellMeta(0, 6).data).toEqual({
      sub_type: '纸张',
      price: 900,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 900,
    });
  });

  test(`should get correct layout with col sub total group dimension 'sub_type'`, () => {
    const newS2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        col: {
          ...s2Options.totals.col,
          totalsGroupDimensions: [],
          subTotalsDimensions: ['city'],
          subTotalsGroupDimensions: ['sub_type'],
        },
      },
    };

    const newDataCfg = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province'],
        columns: ['city', 'type', 'sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options as S2Options);
    s2.render();

    const { getCellMeta } = s2.facet.layoutResult;

    expect(getCellMeta(0, 2).data).toEqual({
      city: '杭州市',
      sub_type: '桌子',
      price: 100,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 100,
    });

    expect(getCellMeta(0, 4).data).toEqual({
      city: '杭州市',
      sub_type: '沙发',
      price: 100,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 100,
    });

    expect(getCellMeta(0, 6).data).toEqual({
      city: '杭州市',
      sub_type: '笔',
      price: 100,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 100,
    });
  });

  test(`should get correct layout with giving total data`, () => {
    const newDataCfg = {
      ...dataCfg,
      totalData: [
        {
          type: '家具',
          price: 6666,
          cost: 6666,
        },
        {
          type: '办公用品',
          price: 9999,
          cost: 9999,
        },
      ],
    };

    s2 = new PivotSheet(container, newDataCfg, s2Options as S2Options);
    s2.render();

    const { getCellMeta } = s2.facet.layoutResult;

    expect(getCellMeta(0, 0).data).toEqual({
      type: '家具',
      price: 6666,
      cost: 6666,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 6666,
    });

    expect(getCellMeta(1, 0).data).toEqual({
      type: '办公用品',
      price: 9999,
      cost: 9999,
      [EXTRA_FIELD]: 'price',
      [VALUE_FIELD]: 9999,
    });
  });
});
