/**
 * 透视表核心数据流程（保证基本数据正确）
 * */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Aggregation } from '@antv/s2';
import { assembleDataCfg, assembleOptions } from '../../util';
import { getContainer } from '../../util/helpers';
import { PivotSheet } from '@/sheet-type';

const myData = [
  {
    cost: 537,
    number: 7789,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '桌子',
  },
  {
    cost: 356,
    number: 3877,
    province: '浙江省',
    city: '宁波市',
    type: '家具',
    sub_type: '桌子',
  },
  {
    cost: 5734,
    number: 5343,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
    sub_type: '沙发',
  },
  {
    cost: 957,
    number: 7234,
    province: '浙江省',
    city: '宁波市',
    type: '家具',
    sub_type: '沙发',
  },
  {
    cost: 486,
    number: 945,
    province: '浙江省',
    city: '杭州市',
    type: '办公用品',
    sub_type: '笔',
  },
  {
    cost: 357,
    number: 1145,
    province: '浙江省',
    city: '宁波市',
    type: '办公用品',
    sub_type: '笔',
  },
  {
    cost: 513,
    number: 1343,
    province: '浙江省',
    city: '杭州市',
    type: '办公用品',
    sub_type: '纸张',
  },
  {
    cost: 234,
    number: 1523,
    province: '浙江省',
    city: '宁波市',
    type: '办公用品',
    sub_type: '纸张',
  },
  {
    cost: 456,
    number: 1822,
    province: '四川省',
    city: '绵阳市',
    type: '家具',
    sub_type: '桌子',
  },
  {
    cost: 2654,
    number: 1943,
    province: '四川省',
    city: '南充市',
    type: '家具',
    sub_type: '桌子',
  },
  {
    cost: 578,
    number: 2244,
    province: '四川省',
    city: '绵阳市',
    type: '家具',
    sub_type: '沙发',
  },
  {
    cost: 687,
    number: 2333,
    province: '四川省',
    city: '南充市',
    type: '家具',
    sub_type: '沙发',
  },
  {
    cost: 345,
    number: 245,
    province: '四川省',
    city: '绵阳市',
    type: '办公用品',
    sub_type: '笔',
  },
  {
    cost: 756,
    number: 2457,
    province: '四川省',
    city: '南充市',
    type: '办公用品',
    sub_type: '笔',
  },
  {
    cost: 243,
    number: 3077,
    province: '四川省',
    city: '绵阳市',
    type: '办公用品',
    sub_type: '纸张',
  },
  {
    cost: 123,
    number: 3551,
    province: '四川省',
    city: '南充市',
    type: '办公用品',
    sub_type: '纸张',
  },
];
describe('Pivot Table Core Data Process', () => {
  const s2 = new PivotSheet(
    getContainer(),
    assembleDataCfg({
      data: myData,
      fields: {
        rows: ['province', 'city', 'type'],
        columns: ['sub_type'],
        values: ['number', 'cost'],
        valueInCols: false,
        // customValueOrder: 2,
      },
      totalData: [],
    }),
    assembleOptions({
      // hierarchyType: 'tree',
      debug: false,
      width: 1024,
      height: 600,
      totals: {
        row: {
          subTotalsDimensionsGroup: ['type'],
          totalsDimensionsGroup: ['city'],
          calcTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          calcTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['province'],
        },
      },
    }),
  );
  s2.render();
});
