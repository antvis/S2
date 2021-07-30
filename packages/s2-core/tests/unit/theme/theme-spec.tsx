import { merge } from 'lodash';
import { act } from 'react-dom/test-utils';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  ThemeName,
} from '../../../src';
import { getContainer } from '../../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch, Checkbox, Space, Radio } from 'antd';
import { CustomTooltip } from '../../spreadsheet/custom/custom-tooltip';
import * as dataCfg from '../../data/demo-value-record.json';

import 'antd/dist/antd.min.css';

interface MainLayoutProps {
  dataCfg: S2DataConfig;
  options: S2Options;
}

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getDataCfg = () => {
  return dataCfg;
};

const getOptions = () => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'grid',
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
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'compact',
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
    tooltip: {
      showTooltip: true,
    },
    initTooltip: (spreadsheet) => {
      return new CustomTooltip(spreadsheet);
    },
  };
};

const getTheme = () => {
  return {};
};

function MainLayout(props: MainLayoutProps) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const [valueInCols, setValueInCols] = React.useState(true);
  const [freezeRowHeader, setFreezeRowHeader] = React.useState(
    props.options.freezeRowHeader,
  );
  const [themeName, setThemeName] = React.useState<ThemeName>('default');

  const onRowCellClick = (value) => {
    console.log(value);
  };
  const onColCellClick = (value) => {
    console.log(value);
  };
  const onDataCellClick = (value) => {
    console.log(value);
  };

  const onCheckChanged = (checked) => {
    setValueInCols(checked);
    setDataCfg(
      merge({}, dataCfg, {
        fields: {
          valueInCols: checked,
        },
      }),
    );
  };

  const onCheckChanged1 = (checked) => {
    setOptions(
      merge({}, options, {
        hierarchyType: checked ? 'tree' : 'grid',
      }),
    );
  };

  const onCheckChanged2 = (e) => {
    setOptions(
      merge({}, options, {
        freezeRowHeader: e.target.checked,
      }),
    );
    setFreezeRowHeader(e.target.checked);
  };

  const onRadioChange = (e) => {
    setThemeName(e.target.value);
  };

  return (
    <div>
      <div style={{ display: 'inline-block', marginBottom: '16px' }}>
        <Space>
          <Switch
            checkedChildren="挂列头"
            unCheckedChildren="挂行头"
            defaultChecked={valueInCols}
            onChange={onCheckChanged}
          />
          <Switch
            checkedChildren="树形"
            unCheckedChildren="平铺"
            defaultChecked={false}
            onChange={onCheckChanged1}
          />
          <Checkbox onChange={onCheckChanged2} defaultChecked={freezeRowHeader}>
            冻结行头
          </Checkbox>
          <Radio.Group onChange={onRadioChange} defaultValue="default">
            <Radio.Button value="default">简约风</Radio.Button>
            <Radio.Button value="blue">多彩风</Radio.Button>
          </Radio.Group>
        </Space>
      </div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        themeCfg={{ name: themeName }}
        spreadsheet={getSpreadSheet}
        onRowCellClick={onRowCellClick}
        onColCellClick={onColCellClick}
        onDataCellClick={onDataCellClick}
      />
    </div>
  );
}

describe('spreadsheet normal spec', () => {
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
