/* eslint-disable no-console */
import {
  S2Event,
  SpreadSheet,
  type S2DataConfig,
  type S2Options,
} from '@antv/s2';
import { Button, Space } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer, getMockData, sleep } from '../util/helpers';
import { SheetComponent } from '@/components';

import 'antd/dist/antd.min.css';

const data = getMockData('../data/tableau-supermarket.csv');

let s2: SpreadSheet;

const columns: string[] = [
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
  },
];

function MainLayout() {
  const dataCfg: S2DataConfig = {
    fields: {
      columns,
    },
    meta,
    data,
  };

  const options: S2Options = {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    interaction: {
      enableCopy: true,
      linkFields: ['order_id', 'customer_name'],
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
    tooltip: {
      showTooltip: true,
    },
  };

  const s2Ref = React.useRef<SpreadSheet>(null);

  return (
    <Space direction="vertical">
      <Button
        onClick={() => {
          s2Ref.current?.emit(S2Event.RANGE_FILTER, {
            filterKey: 'customer_type',
            filteredValues: ['消费者'],
          });
        }}
      >
        Filter
      </Button>
      <Button
        onClick={() => {
          s2Ref.current?.emit(S2Event.RANGE_FILTER, {
            filterKey: 'customer_type',
            filteredValues: [],
          });
        }}
      >
        Reset
      </Button>
      <SheetComponent
        ref={s2Ref}
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        sheetType={'table'}
        onMounted={(spreadsheet) => {
          s2 = spreadsheet;
        }}
      />
    </Space>
  );
}

describe('table sheet filter spec', () => {
  let container: HTMLDivElement;
  const filterKey = 'customer_type';
  const filteredValue = '消费者';

  beforeEach(() => {
    container = getContainer();

    act(() => {
      ReactDOM.render(<MainLayout />, container);
    });
  });

  afterEach(() => {
    container?.remove();
  });

  test('filter customer_type values', async () => {
    await sleep(1000);

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [filteredValue],
    });

    expect(s2.facet.getCellRange()).toStrictEqual({
      end: 465,
      start: 0,
    });
    expect(s2.dataSet.getDisplayDataSet()).toHaveLength(466);
    expect(
      s2.dataSet
        .getDisplayDataSet()
        .some((item) => item.customer_type === filteredValue),
    ).toBeFalsy();
  });

  test('reset filter params on customer_type', async () => {
    await sleep(1000);

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [filteredValue],
    });

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [],
    });

    expect(s2.facet.getCellRange()).toStrictEqual({
      end: 999,
      start: 0,
    });
    expect(s2.dataSet.getDisplayDataSet()).toHaveLength(1000);
  });

  test('filtered event fired with new data', async () => {
    await sleep(1000);

    s2.on(S2Event.RANGE_FILTERED, (data) => {
      expect(data.length).toStrictEqual(466);
      expect(s2.dataSet.getDisplayDataSet()).toHaveLength(466);
      expect(
        s2.dataSet
          .getDisplayDataSet()
          .some((item) => item.customer_type === filteredValue),
      ).toBeFalsy();
    });

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [filteredValue],
    });
  });

  test('falsy/nullish data should not be filtered with irrelevant filter params', async () => {
    await sleep(1000);

    s2.on(S2Event.RANGE_FILTERED, (data) => {
      expect(data.length).toStrictEqual(1000);
      expect(s2.dataSet.getDisplayDataSet()).toHaveLength(1000);
    });

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'express_type',
      filteredValues: ['消费者'],
    });
  });
});
