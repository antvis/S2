import { merge, clone, omit } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../../src';
import { getContainer } from '../../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch } from 'antd';
import { CustomTooltip } from '../../spreadsheet/custom/custom-tooltip';
import * as dataCfg from '../../data/demo-value-record.json';

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
    width: 400,
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

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const [valueInCols, setValueInCols] = React.useState(true);
  const [derivedValueMul, setDerivedValueMul] = React.useState(false);
  const [showPagination, setShowPagination] = React.useState(false);
  const [sheetType, setSheetType] = React.useState(true);

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

  const onCheckChanged4 = (checked) => {
    setOptions(
      merge({}, options, {
        spreadsheetType: checked,
      }),
    );
    setSheetType(checked);
  };

  return (
    <div>
      <div style={{ display: 'inline-block', marginBottom: '16px' }}>
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
          style={{ marginRight: 10 }}
          defaultChecked={showPagination}
          onChange={onCheckChanged3}
        />
        {/* <Switch
          checkedChildren="交叉表"
          unCheckedChildren="明细表"
          style={{ marginRight: 10 }}
          defaultChecked={true}
          onChange={onCheckChanged4}
        /> */}
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
