import { Checkbox, Space, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { clone, merge, omit } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  auto,
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';
import { CustomTooltip } from './custom/custom-tooltip';

let data = getMockData('../data/tableau-supermarket.csv');

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
    },
    meta: [
      {
        field: 'count',
        name: '销售个数',
      },
      {
        field: 'profit',
        name: '利润',
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
      renderTooltip: (spreadsheet) => {
        return new CustomTooltip(spreadsheet);
      },
    },
    showTrend: true,
    selectedCellsSpotlight: true,
    hoverHighlight: true,
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState<S2Options>(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const [valueInCols, setValueInCols] = React.useState(true);
  const [derivedValueMul, setDerivedValueMul] = React.useState(false);
  const [showPagination, setShowPagination] = React.useState(false);
  const [freezeRowHeader, setFreezeRowHeader] = React.useState(
    props.options.freezeRowHeader,
  );

  const updateOptions = (updatedOptions: Partial<S2Options>) => {
    setOptions(merge({}, options, updatedOptions));
  };

  const onCheckChanged = (checked: boolean) => {
    setValueInCols(checked);
    updateOptions({ valueInCols: checked });
  };

  const onCheckChanged1 = (checked: boolean) => {
    updateOptions({ hierarchyType: checked ? 'tree' : 'grid' });
  };

  const onCheckChanged2 = (checked: boolean) => {
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
      setOptions(omit(options, ['pagination']) as S2Options);
    }
  };

  const onCheckChanged3 = (e: CheckboxChangeEvent) => {
    updateOptions({ freezeRowHeader: e.target.checked });
    setFreezeRowHeader(e.target.checked);
  };

  return (
    <div>
      <Space size="middle" style={{ marginBottom: 20 }}>
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
        />
        <Switch
          checkedChildren="分页"
          unCheckedChildren="不分页"
          defaultChecked={showPagination}
          onChange={onCheckChanged2}
        />
        <Switch
          checkedChildren="选中聚光灯开"
          unCheckedChildren="选中聚光灯关"
          defaultChecked={options.selectedCellsSpotlight}
          onChange={(checked) => {
            updateOptions({ selectedCellsSpotlight: checked });
          }}
        />
        <Switch
          checkedChildren="hover十字器开"
          unCheckedChildren="hover十字器关"
          defaultChecked={options.hoverHighlight}
          onChange={(checked) => {
            updateOptions({ hoverHighlight: checked });
          }}
        />
        <Checkbox onChange={onCheckChanged3} defaultChecked={freezeRowHeader}>
          冻结行头
        </Checkbox>
      </Space>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options as S2Options}
        spreadsheet={getSpreadSheet}
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
