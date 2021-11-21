import { getMockData } from '../../../s2-react/__tests__/util/helpers';
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
] as const;

const meta = [
  {
    field: 'count',
    name: '销售个数',
  },
  {
    field: 'profit',
    name: '利润',
    formatter: (v) => `${v}元`,
  },
];

const dataCfg: S2DataConfig = {
  fields: {
    columns,
  },
  meta,
  data,
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
} as unknown as S2DataConfig;

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

const container = document.createElement('div');
document.body.appendChild(container);

const s2 = new TableSheet(container, dataCfg, options);

s2.render();

describe('tablesheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });
});
