import { merge, clone } from 'lodash';
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
import { Switch } from 'antd';
import { CustomTooltip } from './custom/custom-tooltip';

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const mockDataCfg = {
  fields: {
    rows: ['area', 'province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['cost', 'price'],
  },
  meta: [
    {
      field: 'price',
      name: '价格',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'area',
      name: '区域',
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'cost',
      name: '成本',
    },
  ],
  data: [
    {
      area: '东北',
      province: '吉林',
      city: '白山',
      type: '办公用品',
      sub_type: '纸张',
      cost: '2',
      price: '8',
    },
    {
      area: '东北',
      province: '吉林',
      city: '白山',
      type: '办公用品',
      sub_type: '笔',
      cost: '3',
      price: '9',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '抚顺',
      type: '办公用品',
      sub_type: '纸张',
      cost: '2',
      price: '9',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '抚顺',
      type: '办公用品',
      sub_type: '笔',
      cost: '5',
      price: '12',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '抚顺',
      type: '家具产品',
      sub_type: '办公装饰品',
      cost: '3',
      price: '4',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '抚顺',
      type: '家具产品',
      sub_type: '餐桌',
      cost: '5',
      price: '1',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '朝阳',
      type: '家具产品',
      sub_type: '办公装饰品',
      cost: '32',
      price: '4',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '朝阳',
      type: '办公用品',
      sub_type: '纸张',
      cost: '52',
      price: '4',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '朝阳',
      type: '办公用品',
      sub_type: '笔',
      cost: '52',
      price: '4',
    },
    {
      area: '东北',
      province: '辽宁',
      city: '朝阳',
      type: '家具产品',
      sub_type: '餐桌',
      cost: '5',
      price: '2',
    },
    {
      area: '东北',
      province: '吉林',
      city: '白山',
      type: '家具产品',
      sub_type: '办公装饰品',
      cost: '4',
      price: '4',
    },
    {
      area: '东北',
      province: '吉林',
      city: '白山',
      type: '家具产品',
      sub_type: '餐桌',
      cost: '8',
      price: '14',
    },
    {
      area: '东北',
      province: '吉林',
      city: '丹东',
      type: '家具产品',
      sub_type: '办公装饰品',
      cost: '6',
      price: '2',
    },
    {
      area: '东北',
      province: '吉林',
      city: '丹东',
      type: '家具产品',
      sub_type: '餐桌',
      cost: '14',
      price: '9',
    },
    {
      area: '东北',
      province: '吉林',
      city: '丹东',
      type: '办公用品',
      sub_type: '纸张',
      cost: '6',
      price: '1',
    },
    {
      area: '东北',
      province: '吉林',
      city: '丹东',
      type: '办公用品',
      sub_type: '笔',
      cost: '64',
      price: '1',
    },
    {
      area: '东南',
      province: '浙江',
      city: '杭州',
      type: '办公用品',
      sub_type: '纸张',
      cost: '6',
      price: '5',
    },
    {
      area: '东南',
      province: '浙江',
      city: '杭州',
      type: '办公用品',
      sub_type: '笔',
      cost: '64',
      price: '52',
    },
    {
      area: '东南',
      province: '浙江',
      city: '舟山',
      type: '办公用品',
      sub_type: '纸张',
      cost: '6',
      price: '5',
    },
    {
      area: '东南',
      province: '浙江',
      city: '舟山',
      type: '办公用品',
      sub_type: '笔',
      cost: '-',
      price: '5',
    },
    {
      area: '东南',
      province: '浙江',
      city: '杭州',
      type: '家具产品',
      sub_type: '办公装饰品',
      cost: '2',
      price: '3',
    },
    {
      area: '东南',
      province: '浙江',
      city: '杭州',
      type: '家具产品',
      sub_type: '餐桌',
      cost: '32',
      price: '3',
    },
    {
      area: '东南',
      province: '浙江',
      city: '舟山',
      type: '家具产品',
      sub_type: '办公装饰品',
      cost: '42',
      price: '13',
    },
    {
      area: '东南',
      province: '浙江',
      city: '舟山',
      type: '家具产品',
      sub_type: '餐桌',
      cost: '2',
      price: '34',
    },
  ],
  sortParams: [
    { sortFieldId: 'type', sortMethod: 'DESC' },
    { sortFieldId: 'sub_type', sortMethod: 'ASC' },
    { sortFieldId: 'area', sortBy: ['东南', '东北'] },
    {
      sortFieldId: 'sub_type',
      sortMethod: 'ASC',
      sortByField: 'cost',
      query: {
        area: '东北',
        province: '辽宁',
        city: '抚顺',
      },
    },
    {
      sortFieldId: 'city',
      sortMethod: 'DESC',
      sortByField: 'price',
      query: {
        type: '家具产品',
        sub_type: '餐桌',
      },
    },
  ],
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
        dataCfg={mockDataCfg}
        options={getOptions()}
        theme={getTheme()}
      />,
      getContainer(),
    );
  });
});
