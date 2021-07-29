import { merge } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer } from '../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch, Radio } from 'antd';

import {
  multipleDataWithNormal,
  multipleDataWithBottom,
  multipleDataWithCombine,
} from '../data/multiple-values-cell-mock-data';

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getDataCfg = (): S2DataConfig => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['type'],
      values: ['price', 'count'],
      valueInCols: true,
      derivedValues: [
        {
          valueField: 'price',
          derivedValueField: ['rc', 'ac'],
        },
      ],
    },
    meta: [
      {
        field: 'rc',
        name: '同比',
        formatter: (v: string) => v,
      },
      {
        field: 'ac',
        name: '环比',
        formatter: (v: string) => v,
      },
      {
        field: 'price',
        name: '售价',
        formatter: (v: string) => v,
      },
      {
        field: 'count',
        name: '销售个数',
        formatter: (v: string) => v,
      },
    ],
    data: multipleDataWithNormal,
  };
};

const getOptions = (): S2Options => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'tree',
    hierarchyCollapse: false,
    showSeriesNumber: false,
    freezeRowHeader: false,
    mode: 'pivot',
    conditions: {
      text: [],
      interval: [],
      background: [],
      icon: [],
    },
    style: {
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'adaptive',
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
  } as S2Options;
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);

  const [mode, setMode] = React.useState('grid');
  const [valueInCols, setValueInCols] = React.useState(true);
  const [arrangement, setArrangement] = React.useState('normal');

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

  const onArrangementChange = (value: string) => {
    setArrangement(value);
    console.log('values', value);

    switch (value) {
      case 'normal':
        setDataCfg(
          merge({}, dataCfg, {
            fields: {
              data: multipleDataWithNormal,
            },
          }),
        );
        break;
      case 'bottom':
        setDataCfg(
          merge({}, dataCfg, {
            data: multipleDataWithBottom,
          }),
        );
        break;
      case 'combine':
        setDataCfg(
          merge({}, dataCfg, {
            data: multipleDataWithCombine,
          }),
        );
        break;

      default:
        break;
    }
  };
  console.log('datacfg', dataCfg);
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
        <Radio.Group
          onChange={(e) => onArrangementChange(e.target.value)}
          value={arrangement}
        >
          <Radio value={'normal'}>默认</Radio>
          <Radio value={'bottom'}>下方</Radio>
          <Radio value={'combine'}>合并</Radio>
          <Radio value={'separate'}>独立右侧</Radio>
        </Radio.Group>
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
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
