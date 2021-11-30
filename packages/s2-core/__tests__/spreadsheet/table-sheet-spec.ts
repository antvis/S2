import { getContainer, getMockData } from 'tests/util/helpers';
import { TableSheet, S2Options, S2DataConfig } from '@/index';

const data = getMockData(
  '../../../s2-react/__tests__/data/tableau-supermarket.csv',
);

const columns = [
  'order_id',
  'order_date',
  'ship_date',
  'express_type',
  'customer_name',
  'customer_type',
  'city',
  'province',
  'counter',
  'area',
  'type',
  'sub_type',
  'product_name',
  'sale_amt',
  'count',
  'discount',
  'profit',
];

const meta = [
  {
    field: 'count',
    name: '销售个数',
  },
  {
    field: 'profit',
    name: '利润',
    formatter: (v: number) => `${v}元`,
  },
];

const newLineText = `1\t\n2`;

const dataCfg: S2DataConfig = {
  fields: {
    columns,
  },
  meta,
  data: data.map((e) => ({ ...e, express_type: newLineText })),
  sortParams: [
    {
      sortFieldId: 'count',
      sortMethod: 'DESC',
    },
    {
      sortFieldId: 'profit',
      sortMethod: 'ASC',
    },
  ],
};

const options: S2Options = {
  width: 800,
  height: 600,
  showSeriesNumber: true,
  placeholder: '',
  style: {
    layoutWidthType: 'compact',
    cellCfg: {
      height: 32,
    },
    device: 'pc',
  },
  interaction: {
    enableCopy: true,
    hoverHighlight: false,
    linkFields: ['order_id', 'customer_name'],
  },
  frozenRowCount: 2,
  frozenColCount: 1,
  frozenTrailingColCount: 1,
  frozenTrailingRowCount: 1,
  showDefaultHeaderActionIcon: true,
};

describe('TableSheet normal spec', () => {
  test('demo', () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);
    s2.render();

    expect(1).toBe(1);
  });
});
