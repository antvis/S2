/* eslint-disable no-console */
import { message, Space, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { find } from 'lodash';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer, getMockData } from '../util/helpers';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SheetComponent,
  SpreadSheet,
  TableSheet,
} from '@/index';

const data = getMockData('../data/tableau-supermarket.csv');

const getSpreadSheet =
  (ref: React.MutableRefObject<SpreadSheet>) =>
  (dom: string | HTMLElement, dataCfg: S2DataConfig, options: S2Options) => {
    const s2 = new TableSheet(dom, dataCfg, options);
    ref.current = s2;
    return s2;
  };

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
  },
];

function MainLayout() {
  const dataCfg: S2DataConfig = {
    fields: {
      columns,
    },
    meta,
    data,
  } as unknown as S2DataConfig;

  const options: S2Options = {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    enableCopy: true,
    style: {
      colCfg: {
        colWidthType: 'compact',
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },

    frozenRowCount: 2,
    frozenColCount: 1,
    frozenTrailingColCount: 1,
    frozenTrailingRowCount: 1,
    linkFieldIds: ['order_id', 'customer_name'],
    tooltip: {
      showTooltip: true,
      operations: {
        filter: true,
      },
    },
  } as S2Options;

  const s2Ref = React.useRef<SpreadSheet>(null);

  useEffect(() => {
    const logData = (...data: unknown[]) => {
      console.log(...data);
    };
    s2Ref.current.on(S2Event.GLOBAL_COPIED, logData);
    s2Ref.current.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, logData);
    s2Ref.current.on(S2Event.LAYOUT_TABLE_COL_HIDE, logData);
    return () => {
      s2Ref.current.off(S2Event.GLOBAL_COPIED);
      s2Ref.current.off(S2Event.LAYOUT_TABLE_COL_EXPANDED);
      s2Ref.current.off(S2Event.LAYOUT_TABLE_COL_HIDE);
    };
  }, []);

  return (
    <Space direction="vertical">
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        sheetType={'table'}
        spreadsheet={getSpreadSheet(s2Ref)}
      />
    </Space>
  );
}

describe('table sheet filter spec', () => {
  test('placeholder', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});
