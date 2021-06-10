import { merge, clone, omit } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  auto,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch, Checkbox } from 'antd';
import { CustomTooltip } from '../spreadsheet/custom/custom-tooltip';

let data = getMockData('../tests/data/tableau-supermarket.csv');

data = data.map((row) => {
  row['profit-tongbi'] = 0.2233;
  row['profit-huanbi'] = -0.4411;
  row['count-tongbi'] = 0.1234;
  row['count-huanbi'] = -0.4321;
  return row;
});

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
      // rows has value
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit', 'count'],
      valueInCols: true,
      // derivedValues: [
      //   {
      //     valueField: 'profit',
      //     derivedValueField: ['profit-tongbi', 'profit-huanbi'],
      //     displayDerivedValueField: ['profit-tongbi'],
      //   },
      //   {
      //     valueField: 'count',
      //     derivedValueField: ['count-tongbi', 'count-huanbi'],
      //     displayDerivedValueField: ['count-tongbi'],
      //   },
      // ],
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
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'grid',
    hierarchyCollapse: false,
    showSeriesNumber: true,
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

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const [valueInCols, setValueInCols] = React.useState(true);
  const [derivedValueMul, setDerivedValueMul] = React.useState(false);
  const [showPagination, setShowPagination] = React.useState(false);
  const [freezeRowHeader, setFreezeRowHeader] = React.useState(
    props.options.freezeRowHeader,
  );

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

  const onCheckChanged3 = (checked) => {
    setShowPagination(checked);
    if (checked) {
      setOptions(
        merge({}, options, {
          pagination: {
            pageSize: 20,
            current: 1,
          },
        }),
      );
    } else {
      setOptions(omit(options, ['pagination']));
    }
  };

  const onCheckChanged4 = (e) => {
    setOptions(
      merge({}, options, {
        freezeRowHeader: e.target.checked,
      }),
    );
    setFreezeRowHeader(e.target.checked);
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
          style={{ marginRight: 10 }}
          defaultChecked={derivedValueMul}
          onChange={onCheckChanged2}
        />
        <Switch
          checkedChildren="分页"
          unCheckedChildren="不分页"
          style={{ marginLeft: 10 }}
          defaultChecked={showPagination}
          onChange={onCheckChanged3}
        />

        <Checkbox onChange={onCheckChanged4} defaultChecked={freezeRowHeader}>
          冻结行头
        </Checkbox>
      </div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        theme={props.theme}
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
      <MainLayout
        dataCfg={getDataCfg()}
        options={getOptions()}
        theme={getTheme()}
      />,
      getContainer(),
    );
  });
});
