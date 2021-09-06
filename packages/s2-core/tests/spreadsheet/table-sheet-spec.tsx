/* eslint-disable no-console */
import { message } from 'antd';
import 'antd/dist/antd.min.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';

const data = getMockData('../data/tableau-supermarket.csv');

const getSpreadSheet =
  (ref) =>
  (dom: string | HTMLElement, dataCfg: S2DataConfig, options: S2Options) => {
    const s2 = new SpreadSheet(dom, dataCfg, options);
    ref.current = s2;
    return s2;
  };

const getDataCfg = () => {
  return {
    fields: {
      columns: [
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
      ],
    },
    meta: [
      {
        field: 'count',
        name: '销售个数',
        formatter: (v) => v,
      },
      {
        field: 'profit',
        name: '利润',
        formatter: (v) => v,
      },
    ],
    data,
    sortParams: [
      {
        sortFieldId: 'area',
        sortMethod: 'ASC',
      },
      {
        sortFieldId: 'province',
        sortMethod: 'DESC',
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
    },
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const s2Ref = React.useRef<SpreadSheet>(null);

  useEffect(() => {
    const logData = (data) => {
      console.log(data);
    };
    // sort string-type number
    s2Ref.current.on(S2Event.GLOBAL_COPIED, logData);
    s2Ref.current.on(S2Event.RANGE_SORTING, (info) => {
      const canConvertToNumber = data.every((item) => {
        const v = item[info.sortKey];
        return typeof v === 'string' && !Number.isNaN(Number(v));
      });

      if (canConvertToNumber) {
        info.compareFunc = (obj) => Number(obj[info.sortKey]);
      }
    });
    s2Ref.current.on(S2Event.RANGE_SORTED, logData);

    s2Ref.current.on(S2Event.ROW_CELL_TEXT_CLICK, ({ key, record }) => {
      message.info(`key: ${key}, name: ${JSON.stringify(record)}`);
    });
    return () => {
      s2Ref.current.off(S2Event.GLOBAL_COPIED, logData);
      s2Ref.current.off(S2Event.RANGE_SORTING);
      s2Ref.current.off(S2Event.RANGE_SORTED);
      s2Ref.current.off(S2Event.ROW_CELL_TEXT_CLICK);
    };
  }, []);

  return (
    <div>
      <div style={{ display: 'inline-block' }}></div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet(s2Ref)}
      />
    </div>
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
