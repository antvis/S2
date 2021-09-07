import { merge } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch } from 'antd';
import { getContainer, getMockData } from '../util/helpers';
import { SheetComponent } from '../../src';
import { CustomHover } from './custom/custom-interaction';

const data = getMockData('../data/tableau-supermarket.csv');

const getDataCfg = () => {
  return {
    fields: {
      // rows has value
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit'],
    },
    meta: [
      {
        field: 'sale_amt',
        name: '销售额',
      },
      {
        field: 'count',
        name: '销售个数',
      },
      {
        field: 'discount',
        name: '折扣',
      },
      {
        field: 'profit',
        name: '利润',
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

const getOptions = () => {
  return {
    width: 1000,
    height: 600,
    hierarchyType: 'grid',
    hierarchyCollapse: false,
    showSeriesNumber: true,
    freezeRowHeader: true,
    mode: 'pivot',
    valueInCols: true,
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
    customInteractions: [
      {
        key: 'spreadsheet:custom-hover',
        interaction: CustomHover,
      },
    ],
    tooltip: {
      showTooltip: true,
    },
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);

  const onCheckChanged = (checked) => {
    setOptions(
      merge({}, options, {
        hierarchyType: checked ? 'tree' : 'grid',
      }),
    );
  };
  return (
    <div>
      <div style={{ display: 'inline-block' }}>
        <Switch
          checkedChildren="树形"
          unCheckedChildren="平铺"
          defaultChecked={false}
          onChange={onCheckChanged}
        />
      </div>
      <SheetComponent dataCfg={dataCfg} adaptive={false} options={options} />
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
