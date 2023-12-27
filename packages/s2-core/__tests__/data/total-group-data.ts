import { Aggregation, type S2DataConfig, type S2Options } from '@/common';

export const s2Options: S2Options = {
  width: 800,
  height: 600,
  // 配置行小计总计显示,且按维度分组（列小计总计同理）
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
      grandTotalsGroupDimensions: ['type'],
      subTotalsGroupDimensions: ['type'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      calcGrandTotals: {
        aggregation: Aggregation.SUM,
      },
      calcSubTotals: {
        aggregation: Aggregation.SUM,
      },
      grandTotalsGroupDimensions: ['sub_type'],
    },
  },
};

export const dataCfg: S2DataConfig = {
  fields: {
    rows: ['province', 'city', 'type'],
    columns: ['sub_type'],
    values: ['price', 'cost'],
  },
  meta: [
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '商品类别',
    },
    {
      field: 'sub_type',
      name: '商品子类别',
    },
    {
      field: 'price',
      name: '价格',
    },
    {
      field: 'cost',
      name: '成本',
    },
  ],
  data: [
    {
      price: 100,
      cost: 100,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      price: 100,
      cost: 100,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      price: 100,
      cost: 100,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '笔',
    },

    {
      price: 200,
      cost: 200,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '桌子',
    },

    {
      price: 200,
      cost: 200,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '沙发',
    },

    {
      price: 200,
      cost: 200,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },

    {
      price: 200,
      cost: 200,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      price: 300,
      cost: 300,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      price: 400,
      cost: 400,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '桌子',
    },

    {
      price: 300,
      cost: 300,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      price: 400,
      cost: 400,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '沙发',
    },

    {
      price: 300,
      cost: 300,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      price: 400,
      cost: 400,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '笔',
    },

    {
      price: 300,
      cost: 300,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      price: 400,
      cost: 400,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '纸张',
    },
  ],
  totalData: [],
};
