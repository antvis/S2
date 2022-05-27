/* eslint-disable no-console */
import { message, Space, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { find } from 'lodash';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SpreadSheet,
  S2WheelEvent,
  TableSheet,
} from '@antv/s2';
import { getContainer, getMockData, sleep } from '../util/helpers';
import { Switcher } from '@/components/switcher';
import { SwitcherFields } from '@/components/switcher/interface';
import { SheetComponent } from '@/components';
import '@antv/s2/esm/style.css';

let s2: TableSheet;

const data = getMockData('../data/tableau-supermarket.csv');

const getSpreadSheet =
  (ref: React.MutableRefObject<SpreadSheet>) =>
  (dom: string | HTMLElement, dataCfg: S2DataConfig, options: S2Options) => {
    s2 = new TableSheet(dom, dataCfg, options);
    ref.current = s2;
    return s2;
  };

const canConvertToNumber = (sortKey: string) =>
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

function MainLayout({ callback }) {
  const [showPagination, setShowPagination] = React.useState(false);
  const [hiddenColumnsOperator, setHiddenColumnsOperator] =
    React.useState(true);
  const [hiddenColumnFields, setHiddenColumnFields] = React.useState<string[]>([
    'order_date',
  ]);
  const newLineText = `1
  2`;

  const dataCfg: S2DataConfig = {
    fields: {
      columns,
    },
    meta,
    data: data.map((e) => ({ ...e, express_type: newLineText })),
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
  } as unknown as S2DataConfig;

  const options: S2Options = {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    placeholder: '',
    style: {
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
    pagination: showPagination && {
      pageSize: 50,
      current: 1,
    },
    interaction: {
      enableCopy: true,
      hoverHighlight: false,
      linkFields: ['order_id', 'customer_name'],
      hiddenColumnFields,
    },
    frozenRowCount: 2,
    frozenColCount: 1,
    frozenTrailingColCount: 1,
    frozenTrailingRowCount: 1,
    tooltip: {
      showTooltip: true,
      operation: {
        hiddenColumns: hiddenColumnsOperator,
      },
    },
  };

  const s2Ref = React.useRef<SpreadSheet>(null);

  const logData = (...d: unknown[]) => {
    console.log(...d);
  };

  useEffect(() => {
    s2Ref.current.on(S2Event.GLOBAL_COPIED, logData);
    s2Ref.current.on(S2Event.GLOBAL_LINK_FIELD_JUMP, ({ key, record }) => {
      message.info(`key: ${key}, name: ${JSON.stringify(record)}`);
    });
    s2Ref.current.on(S2Event.LAYOUT_COLS_EXPANDED, logData);
    s2Ref.current.on(S2Event.LAYOUT_COLS_HIDDEN, logData);
    s2Ref.current.on(S2Event.GLOBAL_KEYBOARD_DOWN, (e) => {
      if (e.key === 'a' && e.metaKey) {
        e.preventDefault();
        s2Ref.current.interaction.selectAll();
      }
    });

    s2Ref.current.on(S2Event.GLOBAL_SELECTED, logData);
    return () => {
      s2Ref.current.off(S2Event.GLOBAL_COPIED);
      s2Ref.current.off(S2Event.GLOBAL_LINK_FIELD_JUMP);
      s2Ref.current.off(S2Event.LAYOUT_COLS_EXPANDED);
      s2Ref.current.off(S2Event.LAYOUT_COLS_HIDDEN);
    };
  }, []);

  const switcherFields: SwitcherFields = {
    columns: {
      selectable: true,
      items: columns.map((field) => {
        return {
          id: field,
          displayName: find(meta, { field })?.name,
          checked: true,
        };
      }),
    },
  };
  useEffect(() => {
    callback({
      setShowPagination,
    });
  }, [callback]);

  return (
    <Space direction="vertical">
      <Space>
        <Switcher
          {...switcherFields}
          onSubmit={(result) => {
            console.log('result: ', result);
            const { hideItems } = result.columns;
            setHiddenColumnFields(hideItems.map((i) => i.id));
          }}
        />
        <Switch
          checkedChildren="开启隐藏列"
          unCheckedChildren="关闭隐藏列"
          defaultChecked={options.tooltip.operation.hiddenColumns}
          onChange={setHiddenColumnsOperator}
        />
        <Switch
          checkedChildren="分页"
          unCheckedChildren="不分页"
          checked={showPagination}
          onChange={setShowPagination}
        />
      </Space>

      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        sheetType={'table'}
        spreadsheet={getSpreadSheet(s2Ref)}
        onDataCellDoubleClick={logData}
        onContextMenu={logData}
      />
    </Space>
  );
}

describe('table sheet normal spec', () => {
  let cbs;
  act(() => {
    ReactDOM.render(
      <MainLayout
        callback={(params) => {
          cbs = params;
        }}
      />,
      getContainer(),
    );
  });

  test('getCellRange', async () => {
    expect(s2.facet.getCellRange()).toStrictEqual({
      start: 0,
      end: 999,
    });

    act(() => {
      cbs.setShowPagination(true);
    });

    // wait for debounce render
    await sleep(1000);

    expect(s2.facet.getCellRange()).toStrictEqual({
      start: 0,
      end: 49,
    });

    act(() => {
      cbs.setShowPagination(false);
      s2.facet.onWheel({
        deltaX: 0,
        deltaY: 0,
        layerX: 0,
        layerY: 0,
      } as S2WheelEvent);
    });
  });
});
