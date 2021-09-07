import { Checkbox, Space, Switch, Radio } from 'antd';
import 'antd/dist/antd.min.css';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { merge, omit } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer, getMockData } from '../util/helpers';
import { CustomTooltip } from './custom/custom-tooltip';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  ThemeName,
} from '@/index';

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

const getDataCfg = (): S2DataConfig => {
  return {
    fields: {
      // rows has value
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit', 'count'],
      valueInCols: true,
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
  };
};

const getOptions = (): S2Options => {
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
  const [dataCfg, setDataCfg] = React.useState<S2DataConfig>(props.dataCfg);
  const [render, setRender] = React.useState(true);
  const [showPagination, setShowPagination] = React.useState(false);
  const [themeName, setThemeName] = React.useState<ThemeName>('default');
  const [freezeRowHeader, setFreezeRowHeader] = React.useState(
    props.options.freezeRowHeader,
  );

  const updateOptions = (updatedOptions: Partial<S2Options>) => {
    setOptions(merge({}, options, updatedOptions));
  };

  const onValueInColsCheckChanged = (checked: boolean) => {
    setDataCfg(
      merge({}, dataCfg, {
        fields: {
          valueInCols: checked,
        },
      }),
    );
  };

  const onHierarchyTypeCheckChanged = (checked: boolean) => {
    updateOptions({ hierarchyType: checked ? 'tree' : 'grid' });
  };

  const onPaginationCheckChanged = (checked: boolean) => {
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

  const onFreezeRowHeaderCheckChanged = (e: CheckboxChangeEvent) => {
    updateOptions({ freezeRowHeader: e.target.checked });
    setFreezeRowHeader(e.target.checked);
  };

  const onToggleRender = () => {
    setRender(!render);
  };

  const onRadioChange = (e) => {
    setThemeName(e.target.value);
  };

  return (
    <div>
      <Space size="middle" style={{ marginBottom: 20 }}>
        <Radio.Group onChange={onRadioChange} defaultValue="default">
          <Radio.Button value="default">默认</Radio.Button>
          <Radio.Button value="simple">简约蓝</Radio.Button>
          <Radio.Button value="colorful">多彩蓝</Radio.Button>
        </Radio.Group>
        <Switch
          checkedChildren="数值置于列头"
          unCheckedChildren="数值置于行头"
          defaultChecked
          onChange={onValueInColsCheckChanged}
          style={{ marginRight: 10 }}
        />
        <Switch
          checkedChildren="树形"
          unCheckedChildren="平铺"
          defaultChecked={options.hierarchyType === 'grid'}
          onChange={onHierarchyTypeCheckChanged}
        />
        <Switch
          checkedChildren="分页"
          unCheckedChildren="不分页"
          defaultChecked={showPagination}
          onChange={onPaginationCheckChanged}
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
        <Switch
          checkedChildren="渲染组件"
          unCheckedChildren="卸载组件"
          defaultChecked={render}
          onChange={onToggleRender}
        />

        <Switch
          checkedChildren="tooltip打开"
          unCheckedChildren="tooltip关闭"
          defaultChecked={options.tooltip.showTooltip}
          onChange={(checked) => {
            updateOptions({
              tooltip: { ...options.tooltip, showTooltip: checked },
            });
          }}
        />

        <Checkbox
          onChange={onFreezeRowHeaderCheckChanged}
          defaultChecked={freezeRowHeader}
        >
          冻结行头
        </Checkbox>
      </Space>
      {render && (
        <SheetComponent
          dataCfg={dataCfg}
          adaptive={false}
          options={options as S2Options}
          spreadsheet={getSpreadSheet}
          themeCfg={{ name: themeName }}
        />
      )}
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
