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
    cost: 99099,
    number: 99099,
    city: '杭州市',
    type: '家具',
    sub_type: '桌子',
  },
  {
    cost: 99099,
    number: 99099,
    province: '浙江省',
    city: '杭州市',
    sub_type: '桌子',
  },
  {
    cost: 99099,
    number: 99099,
    province: '浙江省',
    city: '杭州市',
    type: '家具',
  },
  {
    cost: 99099,
    number: 99099,
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
const meta = [
  {
    field: 'number',
    name: '数量',
    description: '数量说明。。',
  },
  {
    field: 'province',
    name: '省份',
    description: '省份说明。。',
  },
  {
    field: 'city',
    name: '城市',
    description: '城市说明。。',
  },
  {
    field: 'type',
    name: '类别',
    description: '类别说明。。',
  },
  {
    field: 'sub_type',
    name: '子类别',
    description: '子类别说明。。',
  },
  {
    field: 'cost',
    name: '价格',
    description: 'Value2',
  },
];
describe('Pivot Table Core Data Process', () => {
  const s2 = new PivotSheet(
    getContainer(),
    assembleDataCfg({
      data: myData,
      meta,
      fields: {
        rows: ['province', 'city', 'type', 'sub_type'],
        columns: [],
        values: ['number', 'cost'],
        // valueInCols: false,
      },
      totalData: [],
    }),
    assembleOptions({
      // hierarchyType: 'tree',
      debug: false,
      width: 1024,
      height: 2600,
      interaction: {
        brushSelection: { row: true },
        enableCopy: true,
      },
      totals: {
        row: {
          totalsDimensionsGroup: ['type'],
          subTotalsDimensionsGroup: ['sub_type'],
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
        // col: {
        //   subTotalsDimensionsGroup: ['city'],
        //   totalsDimensionsGroup: ['sub_type'],
        //   calcTotals: {
        //     aggregation: Aggregation.SUM,
        //   },
        //   calcSubTotals: {
        //     aggregation: Aggregation.SUM,
        //   },
        //   showGrandTotals: true,
        //   showSubTotals: true,
        //   reverseLayout: true,
        //   reverseSubLayout: true,
        //   subTotalsDimensions: ['province'],
        // },
      },
    }),
  );
  s2.render();
});
