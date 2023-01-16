/* eslint-disable no-console */
import {
  DeviceType,
  S2Event,
  SpreadSheet,
  TableSheet,
  type S2DataConfig,
  type S2MountContainer,
  type S2Options,
} from '@antv/s2';
import { Button, Space } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer, getMockData } from '../util/helpers';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '@/components';

import 'antd/dist/antd.min.css';
const data = getMockData('../data/tableau-supermarket.csv');

let spreadSheet: SpreadSheet;

const onMounted =
  (ref: React.MutableRefObject<SpreadSheet | undefined>) =>
  (
    dom: S2MountContainer,
    dataCfg: S2DataConfig,
    options: SheetComponentsProps['options'],
  ) => {
    const s2 = new TableSheet(dom, dataCfg, options as S2Options);
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

  const options: SheetComponentOptions = {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    device: DeviceType.PC,
    interaction: {
      enableCopy: true,
    },
    style: {
      dataCell: {
        height: 32,
      },
    },
    frozen: {
      rowCount: 2,
      colCount: 1,
      trailingColCount: 1,
      trailingRowCount: 1,
    },
    tooltip: {
      showTooltip: true,
      operation: {},
    },
  };

  const s2Ref = React.useRef<SpreadSheet | undefined>(undefined);

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
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        sheetType={'table'}
        spreadsheet={onMounted(s2Ref)}
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

  test('falsy/nullish data should not be filtered with irrelevant filter params', () => {
    spreadSheet.on(S2Event.RANGE_FILTERED, (data) => {
      expect(data.length).toStrictEqual(468);
    });

    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'express_type',
      filteredValues: ['消费者'],
    });
  });
});
