/* eslint-disable no-console */
import {
<<<<<<< HEAD
  DeviceType,
  S2Event,
  SpreadSheet,
  TableSheet,
  type S2DataConfig,
  type S2MountContainer,
=======
  S2Event,
  SpreadSheet,
  type S2DataConfig,
>>>>>>> origin/master
  type S2Options,
} from '@antv/s2';
import { Button, Space } from 'antd';
import React from 'react';
<<<<<<< HEAD
import { act } from 'react-dom/test-utils';
import { getMockData, renderComponent, sleep } from '../util/helpers';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '@/components';

=======
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer, getMockData, sleep } from '../util/helpers';
import { SheetComponent } from '@/components';

import 'antd/dist/antd.min.css';

>>>>>>> origin/master
const data = getMockData('../data/tableau-supermarket.csv');

let s2: SpreadSheet;

<<<<<<< HEAD
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
=======
const columns: string[] = [
>>>>>>> origin/master
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

  const options: SheetComponentOptions = {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    device: DeviceType.PC,
    interaction: {
      enableCopy: true,
      linkFields: ['order_id', 'customer_name'],
    },
    style: {
      dataCell: {
        height: 32,
      },
    },
<<<<<<< HEAD
    frozen: {
      rowCount: 2,
      colCount: 1,
      trailingColCount: 1,
      trailingRowCount: 1,
    },
    tooltip: {
      enable: true,
      operation: {},
=======
    frozenRowCount: 2,
    frozenColCount: 1,
    frozenTrailingColCount: 1,
    frozenTrailingRowCount: 1,
    tooltip: {
      showTooltip: true,
>>>>>>> origin/master
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
<<<<<<< HEAD
  renderComponent(<MainLayout />);

  test('filter customer_type values', async () => {
    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'customer_type',
      filteredValues: ['消费者'],
    });

    await sleep(50);

    expect(spreadSheet.facet.getCellRange()).toStrictEqual({
      end: 467,
=======
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
>>>>>>> origin/master
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
<<<<<<< HEAD
    spreadSheet.emit(S2Event.RANGE_FILTER, {
      filterKey: 'customer_type',
      filteredValues: ['消费者'],
=======
    await sleep(1000);

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [filteredValue],
>>>>>>> origin/master
    });

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [],
    });

<<<<<<< HEAD
    await sleep(50);

    expect(spreadSheet.facet.getCellRange()).toStrictEqual({
=======
    expect(s2.facet.getCellRange()).toStrictEqual({
>>>>>>> origin/master
      end: 999,
      start: 0,
    });
    expect(s2.dataSet.getDisplayDataSet()).toHaveLength(1000);
  });

  test('filtered event fired with new data', async () => {
<<<<<<< HEAD
    let dataLength = 0;

    spreadSheet.on(S2Event.RANGE_FILTERED, (data) => {
      dataLength = data.length;
=======
    await sleep(1000);

    s2.on(S2Event.RANGE_FILTERED, (data) => {
      expect(data.length).toStrictEqual(466);
      expect(s2.dataSet.getDisplayDataSet()).toHaveLength(466);
      expect(
        s2.dataSet
          .getDisplayDataSet()
          .some((item) => item.customer_type === filteredValue),
      ).toBeFalsy();
>>>>>>> origin/master
    });

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey,
      filteredValues: [filteredValue],
    });

    await sleep(50);

    expect(dataLength).toStrictEqual(468);
  });

  test('falsy/nullish data should not be filtered with irrelevant filter params', async () => {
<<<<<<< HEAD
    let dataLength = 0;

    spreadSheet.on(S2Event.RANGE_FILTERED, (data) => {
      dataLength = data.length;
    });

    act(() => {
      spreadSheet.emit(S2Event.RANGE_FILTER, {
        filterKey: 'express_type',
        filteredValues: ['消费者'],
      });
=======
    await sleep(1000);

    s2.on(S2Event.RANGE_FILTERED, (data) => {
      expect(data.length).toStrictEqual(1000);
      expect(s2.dataSet.getDisplayDataSet()).toHaveLength(1000);
    });

    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'express_type',
      filteredValues: ['消费者'],
>>>>>>> origin/master
    });

    await sleep(50);

    expect(dataLength).toStrictEqual(468);
  });
});
