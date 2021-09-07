import { InputNumber, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { merge } from 'lodash';
import React, { useState } from 'react';
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

const intervalColor = 'red';
const bgColor = '#29A294';

let sheetInstance: SpreadSheet;
const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  sheetInstance = new SpreadSheet(dom, dataCfg, options);
  return sheetInstance;
};

const getDataCfg = () => {
  return {
    fields: {
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['price', 'cost'],
    },
    meta: [
      {
        field: 'cost',
        name: '成本',
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
    standardData: false,
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
      text: [
        {
          field: 'price',
          mapping() {
            return { fill: 'blue' };
          },
        },
      ],
      interval: [
        {
          field: 'price',
          mapping() {
            return {
              fill: intervalColor,
            };
          },
        },
      ],
      background: [
        {
          field: 'cost',
          mapping() {
            return { fill: bgColor };
          },
        },
      ],
      icon: [
        {
          field: 'cost',
          mapping() {
            return { fill: 'black', icon: 'CellUp' };
          },
        },
      ],
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
  const [options, setOptions] = useState(props.options);
  const [dataCfg, setDataCfg] = useState(props.dataCfg);

  const [mode, setMode] = useState('grid');
  const [valueInCols, setValueInCols] = useState(true);

  const [isCompare, setCompare] = useState(false);
  const [values, setValues] = useState({ min: 0, max: 1000 });

  const [enableBg, setEnableBg] = useState(false);
  const [bgThreshold, setBgThreshold] = useState(0);

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
                      fill: intervalColor,
                      isCompare: true,
                      minValue: values.min,
                      maxValue: values.max,
                    }
                  : { fill: intervalColor };
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
                  fill: intervalColor,
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
  const onBgChange = (checked) => {
    setEnableBg(checked);
    setOptions(
      merge({}, options, {
        conditions: {
          background: [
            {
              field: 'cost',
              mapping(value: number) {
                return checked && value >= bgThreshold && { fill: bgColor };
              },
            },
          ],
        },
      }),
    );
  };

  const onThresholdChange = (threshold: number) => {
    setBgThreshold(threshold);
    setOptions(
      merge({}, options, {
        conditions: {
          background: [
            {
              field: 'cost',
              mapping(value: number) {
                return (
                  value >= threshold && {
                    fill: bgColor,
                  }
                );
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
      <div style={{ display: 'block', marginBottom: 20 }}>
        开启颜色条自定义区间：
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
      <div style={{ display: 'block', marginBottom: 20 }}>
        开启背景色条自定义区间：
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked={enableBg}
          onChange={onBgChange}
          style={{ marginRight: 10 }}
        />
        阈值：{' '}
        <InputNumber
          disabled={!enableBg}
          value={bgThreshold}
          onChange={onThresholdChange}
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

  test('should get correct condition count', () => {
    expect(sheetInstance.options.conditions.text).toHaveLength(1);
    expect(sheetInstance.options.conditions.interval).toHaveLength(1);
    expect(sheetInstance.options.conditions.background).toHaveLength(1);
    expect(sheetInstance.options.conditions.icon).toHaveLength(1);
  });
});
