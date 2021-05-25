import { merge, clone } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import { auto, SheetComponent } from '../../src';
import { getContainer, getMockData } from '../helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch } from 'antd';

let data = getMockData('../datasets/tableau-supermarket.csv');

data = data.map((row) => {
  row['profit-tongbi'] = 0.2233;
  row['profit-huanbi'] = -0.4411;
  row['count-tongbi'] = 0.1234;
  row['count-huanbi'] = -0.4321;
  return row;
});

const getDataCfg = () => {
  return {
    fields: {
      // rows has value
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit'],
      derivedValues: [
        {
          valueField: 'profit',
          derivedValueField: ['profit-tongbi', 'profit-huanbi'],
          displayDerivedValueField: ['profit-tongbi'],
        },
        {
          valueField: 'count',
          derivedValueField: ['count-tongbi', 'count-huanbi'],
          displayDerivedValueField: ['count-tongbi'],
        },
      ],
    },
    meta: [
      {
        field: 'profit-tongbi',
        name: '利润同比',
        formatter: (v) => (!v ? '' : `${auto(v) + '%'}`),
      },
      {
        field: 'profit-huanbi',
        name: '利润环比',
        formatter: (v) => (!v ? '' : `${auto(v) + '%'}`),
      },
      {
        field: 'count-tongbi',
        name: '个数同比',
        formatter: (v) => (!v ? '' : `${auto(v) + '%'}`),
      },
      {
        field: 'count-huanbi',
        name: '个数环比',
        formatter: (v) => (!v ? '' : `${auto(v) + '%'}`),
      },
      {
        field: 'sale_amt',
        name: '销售额',
        formatter: (v) => v,
      },
      {
        field: 'count',
        name: '销售个数',
        formatter: (v) => v,
      },
      {
        field: 'discount',
        name: '折扣',
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
    customHeaderCells: {
      cellLabels: ['办公用品[&]系固件[&]profit'],
      mode: 'omit',
    },
    tooltip: {
      showTooltip: true,
    },
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const [valueInCols, setValueInCols] = React.useState(true);
  const [derivedValueMul, setDerivedValueMul] = React.useState(false);

  const onCheckChanged = (checked) => {
    setValueInCols(checked);
    setOptions(
      merge({}, options, {
        valueInCols: checked,
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

  const onCheckChanged2 = (checked) => {
    setDerivedValueMul(checked);
    const next = merge({}, dataCfg, {
      fields: {
        derivedValues: dataCfg.fields.derivedValues.map((dv) => {
          const dvn = clone(dv);
          dvn.displayDerivedValueField = checked
            ? dv.derivedValueField
            : [dv.derivedValueField[0]];
          return dvn;
        }),
      },
    });
    setDataCfg(next);
  };
  return (
    <div>
      <div style={{ display: 'inline-block' }}>
        <Switch
          checkedChildren="挂列头"
          unCheckedChildren="挂行头"
          defaultChecked={valueInCols}
          onChange={onCheckChanged}
          style={{ marginRight: 10 }}
        />
        <Switch
          checkedChildren="树形"
          unCheckedChildren="平铺"
          defaultChecked={false}
          onChange={onCheckChanged1}
          style={{ marginRight: 10 }}
        />
        <Switch
          checkedChildren="多列"
          unCheckedChildren="单列"
          style={{ marginLeft: 10 }}
          defaultChecked={derivedValueMul}
          onChange={onCheckChanged2}
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
