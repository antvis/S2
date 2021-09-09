import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'antd';
import { act } from 'react-dom/test-utils';
import { S2DataConfig, TOTAL_VALUE } from '../../src';
import SORT_DATA from '../data/data-sort.json';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';

const dataCfg: Partial<S2DataConfig> = {
  data: SORT_DATA.originData,
  meta: SORT_DATA.meta,
  totalData: SORT_DATA.totalData,
  sortParams: [
    // use sortMethod to sort
    // { sortFieldId: 'type', sortMethod: 'DESC' },
    // { sortFieldId: 'sub_type', sortMethod: 'ASC' },
    // { sortFieldId: 'area', sortMethod: 'DESC' },
    // { sortFieldId: 'province', sortMethod: 'DESC' },
    // { sortFieldId: 'city', sortMethod: 'ASC' },
    // { sortFieldId: '$$extra$$', sortMethod: 'DESC' },

    // use sortBy to sort
    // { sortFieldId: 'type', sortBy: ['家具产品', '办公用品'] },
    // lack some data
    // { sortFieldId: 'sub_type', sortBy: ['办公装饰品', '笔'] },
    // not in same province
    // { sortFieldId: 'province', sortBy: ['辽宁', '吉林', '广东'] },
    // {
    //   sortFieldId: 'city',
    //   sortBy: ['汕头', '广州', '朝阳', '抚顺', '白山', '丹东'],
    // },
    // { sortFieldId: 'area', sortBy: ['中南', '东北'] },
    // { sortFieldId: '$$extra$$', sortBy: ['cost', 'price'] },
    // { sortFieldId: 'type', sortBy: ['家具产品', '办公用品'] },
    // {
    //   sortFieldId: 'sub_type',
    //   sortBy: ['办公装饰品', '餐桌'],
    //   query: { type: '家具产品' },
    // },
    // {
    //   sortFieldId: 'sub_type',
    //   sortBy: ['笔', '纸张'],
    //   query: { type: '办公用品' },
    // },
    // { sortFieldId: 'area', sortBy: ['中南', '东北'] },
    // {
    //   sortFieldId: 'province',
    //   sortBy: ['辽宁', '吉林'],
    //   query: { area: '东北' },
    // },
    // {
    //   sortFieldId: 'city',
    //   sortBy: ['朝阳', '抚顺'],
    //   query: {
    //     area: '东北',
    //     province: '辽宁',
    //   },
    // },
    // { sortFieldId: '$$extra$$', sortBy: ['cost', 'price'] },

    // use sortByMeasure to sort
    // {
    //   sortFieldId: 'sub_type',
    //   sortMethod: 'DESC',
    //   sortByMeasure: 'cost',
    //   query: {
    //     area: '东北',
    //     province: '辽宁',
    //     city: '抚顺',
    //     $$extra$$: 'cost',
    //   },
    // },
    // {
    //   sortFieldId: 'city',
    //   sortMethod: 'DESC',
    //   sortByMeasure: 'price',
    //   query: {
    //     type: '家具产品',
    //     sub_type: '餐桌',
    //   },
    // {
    //   sortFieldId: 'city',
    //   sortMethod: 'ASC',
    //   sortByMeasure: 'price',
    //   query: {
    //     type: '办公用品',
    //     sub_type: '笔',
    //     $$extra$$: 'price',
    //     area: '中南',
    //     province: '广东',
    //   },
    // },
    // {
    //   sortFieldId: 'sub_type',
    //   sortMethod: 'DESC',
    //   sortByMeasure: 'price',
    //   query: {
    //     type: '办公用品',
    //     $$extra$$: 'price',
    //     area: '东北',
    //     province: '吉林',
    //     city: '白山',
    //   },
    // },

    // use sortByMeasure（TOTAL_VALUE） to sort
    {
      sortFieldId: 'type',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'price',
      },
    },
    {
      sortFieldId: 'sub_type',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
        area: '东北',
        province: '吉林',
      },
    },
    {
      sortFieldId: 'area',
      sortMethod: 'ASC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'price',
      },
    },
    {
      sortFieldId: 'province',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
      },
    },
    {
      sortFieldId: 'city',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
      },
    },
    {
      sortFieldId: 'city',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
        type: '办公用品',
      },
    },
  ],
};

function MainLayout() {
  const [isTotals, setIsTotals] = useState(false);
  const [mergedOptions, setMergedOptions] = useState({});

  const onTotalsChange = (checked) => {
    setIsTotals(checked);
    setMergedOptions({
      totals: {
        row: {
          showGrandTotals: checked,
          showSubTotals: checked,
          reverseLayout: checked,
          reverseSubLayout: checked,
          subTotalsDimensions: ['area', 'province'],
        },
        col: {
          showGrandTotals: checked,
          showSubTotals: checked,
          reverseLayout: checked,
          reverseSubLayout: checked,
          subTotalsDimensions: ['type'],
        },
      },
    });
  };

  return (
    <SheetEntry
      dataCfg={dataCfg}
      options={mergedOptions}
      header={
        <Switch
          checkedChildren="关闭总计/小计"
          unCheckedChildren="打开总计/小计"
          checked={isTotals}
          onChange={onTotalsChange}
        />
      }
    />
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});
