/* eslint-disable no-console */
import { Checkbox, message, Space, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { find, merge } from 'lodash';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer, getMockData } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '@/index';
import { Switcher } from '@/components/switcher';
import { SwitcherItem } from '@/components/switcher/interface';

const data = getMockData('../data/tableau-supermarket.csv');

const getSpreadSheet =
  (ref) =>
  (dom: string | HTMLElement, dataCfg: S2DataConfig, options: S2Options) => {
    const s2 = new SpreadSheet(dom, dataCfg, options);
    ref.current = s2;
    return s2;
  };

const canConvertToNumber = (sortKey) =>
  data.every((item) => {
    const v = item[sortKey];
    return typeof v === 'string' && !Number.isNaN(Number(v));
  });

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
  },
];

const getDataCfg = () => {
  return {
    fields: {
      columns,
    },
    meta,
    data,
    sortParams: [
      {
        sortFieldId: 'count',
        sortBy: (obj) =>
          canConvertToNumber('count') ? Number(obj.count) : obj.count,
        sortMethod: 'DESC',
      },
      {
        sortFieldId: 'profit',
        sortBy: (obj) =>
          canConvertToNumber('profit') ? Number(obj.profit) : obj.profit,
        sortMethod: 'ASC',
      },
    ],
  };
};

const getOptions = (): S2Options => {
  return {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    mode: 'table',
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
      operation: {
        hiddenColumns: true,
      },
    },
    // hiddenColumnFields: ['order_date'],
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState<S2Options>(props.options);
  const [dataCfg, setDataCfg] = React.useState<S2DataConfig>(props.dataCfg);
  const s2Ref = React.useRef<SpreadSheet>(null);

  useEffect(() => {
    const logData = (...data: unknown[]) => {
      console.log(...data);
    };
    s2Ref.current.on(S2Event.GLOBAL_COPIED, logData);
    s2Ref.current.on(S2Event.ROW_CELL_TEXT_CLICK, ({ key, record }) => {
      message.info(`key: ${key}, name: ${JSON.stringify(record)}`);
    });
    s2Ref.current.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, logData);
    s2Ref.current.on(S2Event.LAYOUT_TABLE_COL_HIDE, logData);
    return () => {
      s2Ref.current.off(S2Event.GLOBAL_COPIED);
      s2Ref.current.off(S2Event.ROW_CELL_TEXT_CLICK);
      s2Ref.current.off(S2Event.LAYOUT_TABLE_COL_EXPANDED);
      s2Ref.current.off(S2Event.LAYOUT_TABLE_COL_HIDE);
    };
  }, []);

  const switcherValues: SwitcherItem[] = columns.map((field) => {
    return {
      id: field,
      displayName: find(meta, { field })?.name,
      checked: true,
    };
  });

  return (
    <Space direction="vertical">
      <Switcher
        values={switcherValues}
        onSubmit={(result) => {
          // eslint-disable-next-line no-console
          console.log('result: ', result);
          const { hiddenValues: hiddenColumnFields } = result;
          setOptions({
            ...props.options,
            hiddenColumnFields,
          });
        }}
      />
      <Switch
        checkedChildren="开启隐藏列"
        unCheckedChildren="关闭隐藏列"
        defaultChecked={options.tooltip.operation.hiddenColumns}
        onChange={(value) => {
          console.log('value: ', value);
          setOptions(
            merge({}, props.options, {
              tooltip: {
                operation: {
                  hiddenColumns: value,
                },
              },
            }),
          );
        }}
      />
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet(s2Ref)}
      />
    </Space>
  );
}

describe('table sheet normal spec', () => {
  test('placeholder', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
