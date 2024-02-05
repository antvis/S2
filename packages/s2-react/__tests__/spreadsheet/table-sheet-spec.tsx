/* eslint-disable no-console */

import '@/components/tooltip/index.less';
import {
  DeviceType,
  S2Event,
  SpreadSheet,
  TableSheet,
  type RawData,
  type S2DataConfig,
  type S2MountContainer,
  type S2Options,
} from '@antv/s2';
import { waitFor } from '@testing-library/react';
import { Space, Switch, message } from 'antd';
import { find } from 'lodash';
import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { getMockData, renderComponent } from '../util/helpers';
import {
  type SheetComponentsProps,
  type SheetComponentOptions,
  Switcher,
  SheetComponent,
} from '../../src';
import type { SwitcherFields } from '@/components/switcher/interface';

let s2: TableSheet;

const data = getMockData('../data/tableau-supermarket.csv');

const onMounted =
  (ref: React.MutableRefObject<SpreadSheet | null>) =>
  (
    dom: S2MountContainer,
    dataCfg: S2DataConfig,
    options: SheetComponentsProps['options'],
  ) => {
    s2 = new TableSheet(dom, dataCfg, options as S2Options);
    ref.current = s2;

    return s2;
  };

const canConvertToNumber = (sortKey: string) =>
  data.every((item: any) => {
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
    formatter: (v: number) => `${v}元`,
  },
];

type Props = {
  callback: (params: {
    setShowPagination: React.Dispatch<React.SetStateAction<boolean>>;
  }) => void;
};

function MainLayout({ callback }: Props) {
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
    data: data.map((e) => {
      return { ...e, express_type: newLineText };
    }),
    sortParams: [
      {
        sortFieldId: 'count',
        sortBy: (obj: RawData) =>
          canConvertToNumber('count') ? Number(obj['count']) : obj['count'],
        sortMethod: 'DESC',
      },
      {
        sortFieldId: 'profit',
        sortBy: (obj: RawData) =>
          canConvertToNumber('profit') ? Number(obj) : obj['profit'],
        sortMethod: 'ASC',
      },
    ],
  } as unknown as S2DataConfig;

  const options: SheetComponentOptions = {
    width: 800,
    height: 600,
    device: DeviceType.PC,
    seriesNumber: {
      enable: true,
    },
    placeholder: '',
    style: {
      dataCell: {
        height: 32,
      },
    },
    pagination: showPagination
      ? {
          pageSize: 50,
          current: 1,
        }
      : undefined,
    interaction: {
      copy: { enable: true },
      hoverHighlight: false,
      linkFields: ['order_id', 'customer_name'],
      hiddenColumnFields,
    },
    frozen: {
      rowCount: 2,
      colCount: 1,
      trailingColCount: 1,
      trailingRowCount: 1,
    },
    tooltip: {
      enable: true,
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
    s2Ref.current!.on(S2Event.GLOBAL_COPIED, logData);
    s2Ref.current!.on(S2Event.GLOBAL_LINK_FIELD_JUMP, ({ field, record }) => {
      message.info(`key: ${field}, name: ${JSON.stringify(record)}`);
    });
    s2Ref.current!.on(S2Event.COL_CELL_EXPANDED, logData);
    s2Ref.current!.on(S2Event.COL_CELL_HIDDEN, logData);
    s2Ref.current!.on(S2Event.GLOBAL_KEYBOARD_DOWN, (e) => {
      if (e.key === 'a' && e.metaKey) {
        e.preventDefault();
        s2Ref.current!.interaction.selectAll();
      }
    });

    s2Ref.current!.on(S2Event.GLOBAL_SELECTED, logData);

    return () => {
      s2Ref.current!.off(S2Event.GLOBAL_COPIED);
      s2Ref.current!.off(S2Event.GLOBAL_LINK_FIELD_JUMP);
      s2Ref.current!.off(S2Event.COL_CELL_EXPANDED);
      s2Ref.current!.off(S2Event.COL_CELL_HIDDEN);
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
          defaultChecked={options.tooltip!.operation!.hiddenColumns}
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
        spreadsheet={onMounted(s2Ref)}
        onDataCellDoubleClick={logData}
        onContextMenu={logData}
      />
    </Space>
  );
}

describe('table sheet normal spec', () => {
  test('getCellRange', async () => {
    let setShowPagination: React.Dispatch<React.SetStateAction<boolean>>;

    const unmount = renderComponent(
      <MainLayout
        callback={(params) => {
          setShowPagination = params.setShowPagination;
        }}
      />,
    );

    await waitFor(() => {
      expect(s2.facet.getCellRange()).toStrictEqual({
        start: 0,
        end: 999,
      });
    });

    act(() => {
      setShowPagination(true);
    });

    await waitFor(() => {
      expect(s2.facet.getCellRange()).toStrictEqual({
        start: 0,
        end: 49,
      });
    });

    unmount();
  });
});
