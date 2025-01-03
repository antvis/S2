import { ORIGIN_FIELD, type S2Options } from '@/common';
import { PivotSheet } from '@/sheet-type';
import { map } from 'lodash';
import { getContainer } from 'tests/util/helpers';
import { CellData, S2DataConfig } from '../../src';
import type { PivotFacet } from '../../src/facet';
import { dataCfg, s2Options } from '../data/total-group-data';

describe('Total Group Dimension Test', () => {
  let container: HTMLDivElement;

  let s2: PivotSheet;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    // s2?.destroy();
  });

  test(`should get correct layout with row total group dimension 'type'`, async () => {
    s2 = new PivotSheet(container, dataCfg, s2Options as S2Options);
    await s2.render();

    const facet = s2.facet as PivotFacet;
    const { rowLeafNodes } = facet.getLayoutResult();

    expect(map(rowLeafNodes, 'id')).toEqual([
      'root[&]总计[&]家具',
      'root[&]总计[&]办公用品',
      'root[&]浙江省[&]小计[&]家具',
      'root[&]浙江省[&]小计[&]办公用品',
      'root[&]浙江省[&]杭州市[&]家具',
      'root[&]浙江省[&]杭州市[&]办公用品',
      'root[&]浙江省[&]舟山市[&]家具',
      'root[&]浙江省[&]舟山市[&]办公用品',
      'root[&]四川省[&]小计[&]家具',
      'root[&]四川省[&]小计[&]办公用品',
      'root[&]四川省[&]成都市[&]家具',
      'root[&]四川省[&]成都市[&]办公用品',
      'root[&]四川省[&]绵阳市[&]家具',
      'root[&]四川省[&]绵阳市[&]办公用品',
    ]);

    expect((facet.getCellMeta(0, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      type: '家具',
      price: 2000,
    });
    expect((facet.getCellMeta(1, 1)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      type: '办公用品',
      cost: 1900,
    });
  });

  test(`should get correct layout with row total group dimension 'city'`, async () => {
    const newS2Options: S2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        row: {
          ...s2Options.totals!.row!,
          grandTotalsGroupDimensions: ['city'],
        },
      },
    };

    s2 = new PivotSheet(container, dataCfg, newS2Options);
    await s2.render();

    const facet = s2.facet;
    const { rowLeafNodes } = facet.getLayoutResult();

    expect(map(rowLeafNodes, 'id')).toEqual([
      'root[&]总计[&]杭州市',
      'root[&]总计[&]舟山市',
      'root[&]总计[&]成都市',
      'root[&]总计[&]绵阳市',
      'root[&]浙江省[&]小计[&]家具',
      'root[&]浙江省[&]小计[&]办公用品',
      'root[&]浙江省[&]杭州市[&]家具',
      'root[&]浙江省[&]杭州市[&]办公用品',
      'root[&]浙江省[&]舟山市[&]家具',
      'root[&]浙江省[&]舟山市[&]办公用品',
      'root[&]四川省[&]小计[&]家具',
      'root[&]四川省[&]小计[&]办公用品',
      'root[&]四川省[&]成都市[&]家具',
      'root[&]四川省[&]成都市[&]办公用品',
      'root[&]四川省[&]绵阳市[&]家具',
      'root[&]四川省[&]绵阳市[&]办公用品',
    ]);

    expect((facet.getCellMeta(0, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '杭州市',
      price: 300,
    });

    expect((facet.getCellMeta(1, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '舟山市',
      price: 800,
    });

    expect((facet.getCellMeta(2, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '成都市',
      price: 1200,
    });

    expect((facet.getCellMeta(3, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '绵阳市',
      price: 1600,
    });
  });

  test(`should get correct layout with row sub group dimension 'type'`, async () => {
    const newS2Options: S2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        row: {
          ...s2Options.totals!.row,
          // 总计分组下，city 城市维度会出现分组
          grandTotalsGroupDimensions: ['city'],
          subTotalsGroupDimensions: ['type'],
        },
      },
    };

    const newDataCfg: S2DataConfig = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province', 'city', 'type'],
        columns: ['sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options);
    await s2.render();

    const facet = s2.facet;
    const { rowLeafNodes } = facet.getLayoutResult();

    expect(rowLeafNodes[4].id).toEqual('root[&]浙江省[&]小计[&]家具');
    expect(rowLeafNodes[5].id).toEqual('root[&]浙江省[&]小计[&]办公用品');

    expect((facet.getCellMeta(4, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      province: '浙江省',
      price: 600,
      type: '家具',
    });

    expect((facet.getCellMeta(5, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      province: '浙江省',
      type: '办公用品',
      price: 500,
    });
  });

  test(`should get correct layout with col total group dimension 'type'`, async () => {
    const newS2Options: S2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        col: {
          ...s2Options.totals!.col,
          grandTotalsGroupDimensions: ['type'],
        },
      },
    };

    const newDataCfg: S2DataConfig = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province'],
        columns: ['city', 'type', 'sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options);
    await s2.render();

    const facet = s2.facet;

    expect((facet.getCellMeta(0, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      type: '家具',
      price: 2000,
    });

    expect((facet.getCellMeta(0, 2)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      type: '办公用品',
      price: 1900,
    });
  });

  test(`should get correct layout with col total group dimension 'sub_type'`, async () => {
    const newS2Options: S2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        col: {
          ...s2Options.totals!.col,
          grandTotalsGroupDimensions: ['sub_type'],
        },
      },
    };

    const newDataCfg: S2DataConfig = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province'],
        columns: ['city', 'type', 'sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options);
    await s2.render();

    const facet = s2.facet;

    expect((facet.getCellMeta(0, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      sub_type: '桌子',
      price: 1000,
    });

    expect((facet.getCellMeta(0, 2)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      sub_type: '沙发',
      price: 1000,
    });

    expect((facet.getCellMeta(0, 4)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      sub_type: '笔',
      price: 1000,
    });

    expect((facet.getCellMeta(0, 6)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      sub_type: '纸张',
      price: 900,
    });
  });

  test(`should get correct layout with col sub total group dimension 'sub_type'`, async () => {
    const newS2Options: S2Options = {
      ...s2Options,
      totals: {
        ...s2Options.totals,
        col: {
          ...s2Options.totals!.col,
          grandTotalsGroupDimensions: [],
          subTotalsDimensions: ['city'],
          subTotalsGroupDimensions: ['sub_type'],
        },
      },
    };

    const newDataCfg: S2DataConfig = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: ['province'],
        columns: ['city', 'type', 'sub_type'],
        values: ['price', 'cost'],
      },
    };

    s2 = new PivotSheet(container, newDataCfg, newS2Options);
    await s2.render();

    const facet = s2.facet;

    expect((facet.getCellMeta(0, 2)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '杭州市',
      sub_type: '桌子',
      price: 100,
    });

    expect((facet.getCellMeta(0, 4)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '杭州市',
      sub_type: '沙发',
      price: 100,
    });

    expect((facet.getCellMeta(0, 6)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      city: '杭州市',
      sub_type: '笔',
      price: 100,
    });
  });

  test(`should get correct layout with giving total data`, async () => {
    const newDataCfg = {
      ...dataCfg,
      data: dataCfg.data.concat([
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
      ]),
    };

    s2 = new PivotSheet(container, newDataCfg, s2Options as S2Options);
    await s2.render();

    const facet = s2.facet;

    expect((facet.getCellMeta(0, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      type: '家具',
      price: 6666,
      cost: 6666,
    });

    expect((facet.getCellMeta(1, 0)!.data as CellData)[ORIGIN_FIELD]).toEqual({
      type: '办公用品',
      price: 9999,
      cost: 9999,
    });
  });

  // https://github.com/antvis/S2/issues/2661
  test.each([
    { grandTotalsGroupDimensions: [] },
    { grandTotalsGroupDimensions: ['city'] },
  ])(
    'should render correctly group totals layout if data is empty by %o',
    async (config) => {
      s2 = new PivotSheet(container, dataCfg, {
        totals: {
          col: {
            ...config,
            showGrandTotals: true,
            showSubTotals: true,
            reverseGrandTotalsLayout: true,
            reverseSubTotalsLayout: true,
          },
        },
      });

      s2.setDataCfg({
        fields: {
          rows: ['type'],
          columns: ['province', 'city'],
          values: ['price', 'cost'],
        },
        data: [],
      });
      await s2.render();

      const { colNodes, colsHierarchy } = s2.facet.getLayoutResult();

      expect(colsHierarchy.height).toEqual(90);
      expect(colNodes).toHaveLength(7);
      expect(colNodes.find((node) => node.value === '总计')).toBeTruthy();
      expect(colNodes.find((node) => node.value === '小计')).toBeFalsy();
    },
  );
});
