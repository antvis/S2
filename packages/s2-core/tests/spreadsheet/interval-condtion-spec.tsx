import { InputNumber, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { merge } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';

const data = getMockData('../data/company-sales-record-2.csv');
const color = 'red';

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getDataCfg = () => {
  return {
    fields: {
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['price'],
      extra: [
        {
          field: 'type',
          value: '办公用品',
          tips: '说明：这是办公用品的说明',
        },
      ],
    },
    meta: [
      {
        field: 'count',
        name: '销售个数',
      },
      {
        field: 'price',
        name: '价格',
      },
      {
        field: 'area',
        name: '地区',
      },
      {
        field: 'province',
        name: '省份',
      },
      {
        field: 'city',
        name: '城市',
      },
    ],
    data,
  };
};

const getOptions = (): S2Options => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'grid',
    hierarchyCollapse: false,
    showSeriesNumber: true,
    freezeRowHeader: false,
    mode: 'pivot',
    valueInCols: true,
    conditions: {
      text: [],
      interval: [
        {
          field: 'price',
          mapping() {
            return {
              fill: color,
            };
          },
        },
      ],
      background: [],
      icon: [],
    },
    style: {
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'compact',
      },
      rowCfg: {
        width: 200,
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
    tooltip: {
      showTooltip: true,
    },
    selectedCellsSpotlight: true,
    hoverHighlight: true,
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);

  const [mode, setMode] = React.useState('grid');
  const [valueInCols, setValueInCols] = React.useState(true);

  const [isCompare, setCompare] = React.useState(false);
  const [values, setValues] = React.useState({ min: 0, max: 1000 });

  const onValueInColsChange = (checked) => {
    setValueInCols(checked);

    setDataCfg(
      merge({}, dataCfg, {
        fields: {
          valueInCols: checked,
        },
      }),
    );
  };

  const onModeChange = (checked) => {
    setMode(checked ? 'tree' : 'grid');
    setOptions(
      merge({}, options, {
        hierarchyType: checked ? 'tree' : 'grid',
      }),
    );
  };

  const onCompareChange = (checked) => {
    setCompare(checked);
    setOptions(
      merge({}, options, {
        conditions: {
          interval: [
            {
              field: 'price',
              mapping() {
                return checked
                  ? {
                      fill: color,
                      isCompare: true,
                      minValue: values.min,
                      maxValue: values.max,
                    }
                  : { fill: color };
              },
            },
          ],
        },
      }),
    );
  };
  const onRangeChange = (updated: { min: number; max: number }) => {
    setOptions(
      merge({}, options, {
        conditions: {
          interval: [
            {
              field: 'price',
              mapping() {
                return {
                  fill: color,
                  isCompare: true,
                  minValue: updated.min,
                  maxValue: updated.max,
                };
              },
            },
          ],
        },
      }),
    );
  };

  return (
    <div>
      <div style={{ display: 'inline-block', marginBottom: 20 }}>
        <Switch
          checkedChildren="挂列头"
          unCheckedChildren="挂行头"
          defaultChecked={valueInCols}
          onChange={onValueInColsChange}
          style={{ marginRight: 10 }}
        />
        <Switch
          checkedChildren="树形"
          unCheckedChildren="平铺"
          checked={mode === 'tree'}
          onChange={onModeChange}
          style={{ marginRight: 10 }}
        />
      </div>
      <div style={{ display: 'inline-block', marginBottom: 20 }}>
        自定义区间：
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked={isCompare}
          onChange={onCompareChange}
          style={{ marginRight: 10 }}
        />
        最小值：{' '}
        <InputNumber
          disabled={!isCompare}
          value={values.min}
          onChange={(v) => {
            const updated = { ...values, min: v };
            setValues(updated);
            onRangeChange(updated);
          }}
        />
        最大值：{' '}
        <InputNumber
          disabled={!isCompare}
          value={values.max}
          onChange={(v) => {
            const updated = { ...values, max: v };
            setValues(updated);
            onRangeChange(updated);
          }}
        />
      </div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet}
      />
    </div>
  );
}

describe('spreadsheet multiple values cell spec', () => {
  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
