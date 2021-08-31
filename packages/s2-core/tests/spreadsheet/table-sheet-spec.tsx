/* eslint-disable no-console */
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SheetComponent,
  SortMethodType,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { CustomTooltip } from './custom/custom-tooltip';
import { useEffect } from 'react';

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
    enbleCopy: true,
    style: {
      colCfg: {
        colWidthType: 'compact',
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
    tooltip: {
      showTooltip: true,
      renderTooltip: (spreadsheet) => {
        return new CustomTooltip(spreadsheet);
      },
    },
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const s2Ref = React.useRef<SpreadSheet>(null);

  const onClickFilter = () => {
    const list = ['2015/1/5', '2015/1/18', '2015/1/21', '2015/1/21'];
    s2Ref.current.emit(S2Event.RANGE_FILTER, 'order_date', list);
  };

  const onClickFilterReset = () => {
    const list = data.map((e) => e.order_date);
    s2Ref.current.emit(S2Event.RANGE_FILTER, 'order_date', list);
  };

  useEffect(() => {
    const logData = (data) => {
      console.log(data);
    };
    // sort string-type number
    s2Ref.current
      .on(S2Event.GLOBAL_COPIED, logData)
      .on(S2Event.RANGE_SORTING, (info) => {
        const canConvertToNumber = data.every((item) => {
          const v = item[info.sortKey];
          return typeof v === 'string' && !Number.isNaN(Number(v));
        });

        if (canConvertToNumber) {
          info.compareFunc = (obj) => Number(obj[info.sortKey]);
        }
      })
      .on(S2Event.RANGE_SORTED, (data) => {
        console.log('data,', data);
      })
      .on(S2Event.RANGE_FILTERING, (filterList, allList) => {
        console.log('filterList, allList', filterList, allList);
      })
      .on(S2Event.RANGE_FILTERED, (allList, data) => {
        console.log('allList, data', allList, data);
      });
    return () => {
      s2Ref.current
        .off(S2Event.GLOBAL_COPIED, logData)
        .off(S2Event.RANGE_SORTING)
        .off(S2Event.RANGE_SORTED)
        .off(S2Event.RANGE_FILTERING)
        .off(S2Event.RANGE_FILTERED);
    };
  }, []);

  return (
    <div>
      <div onClick={onClickFilter}>filter order_date</div>
      <div onClick={onClickFilterReset}>filter reset</div>
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
