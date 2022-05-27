/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Button, Space } from 'antd';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SpreadSheet,
  TableSheet,
} from '@antv/s2';
import { getContainer, getMockData } from '../util/helpers';
import { SheetComponent } from '@/components';

import 'antd/dist/antd.min.css';
const data = getMockData('../data/tableau-supermarket.csv');

let spreadSheet: SpreadSheet;

const getSpreadSheet =
  (ref: React.MutableRefObject<SpreadSheet>) =>
  (dom: string | HTMLElement, dataCfg: S2DataConfig, options: S2Options) => {
    const s2 = new TableSheet(dom, dataCfg, options);
    ref.current = s2;
    spreadSheet = s2;

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
    interaction: {
      enableCopy: true,
    },
    style: {
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
      operation: {
        filter: true,
      },
    },
  } as S2Options;

  const s2Ref = React.useRef<SpreadSheet>(null);

  return (
    <Space direction="vertical">
      <Button
        onClick={() => {
          s2Ref.current.emit(S2Event.RANGE_FILTER, {
            filterKey: 'customer_type',
            filteredValues: ['消费者'],
          });
        }}
      >
        Filter
      </Button>

      <Button
        onClick={() => {
          s2Ref.current.emit(S2Event.RANGE_FILTER, {
            filterKey: 'customer_type',
            filteredValues: [],
          });
        }}
      >
        Reset
      </Button>
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
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });

  test('filter customer_type values', () => {
    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'customer_type',
      filteredValues: ['消费者'],
    });

    expect(spreadSheet.facet.getCellRange()).toStrictEqual({
      end: 467,
      start: 0,
    });
  });

  test('reset filter params on customer_type', () => {
    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'customer_type',
      filteredValues: ['消费者'],
    });

    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'customer_type',
      filteredValues: [],
    });

    expect(spreadSheet.facet.getCellRange()).toStrictEqual({
      end: 999,
      start: 0,
    });
  });

  test('filtered event fired with new data', () => {
    spreadSheet.on(S2Event.RANGE_FILTERED, (data) => {
      expect(data.length).toStrictEqual(468);
    });

    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'customer_type',
      filteredValues: ['消费者'],
    });
  });
});
