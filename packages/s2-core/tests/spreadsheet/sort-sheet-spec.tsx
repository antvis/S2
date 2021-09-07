import { merge } from 'lodash';
import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { Switch } from 'antd';
import { getContainer } from '../util/helpers';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  TOTAL_VALUE,
} from '../../src';
import { originData, totalData } from '../data/data-sort';
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
    valueInCols: true,
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
  data: originData,
  totalData,
  sortParams: [
    // use sortMethod to sort
    // { sortFieldId: 'type', sortMethod: 'DESC' },
    // { sortFieldId: 'sub_type', sortMethod: 'ASC' },
    // { sortFieldId: 'area', sortMethod: 'DESC' },
    // { sortFieldId: 'province', sortMethod: 'DESC' },
    // { sortFieldId: 'city', sortMethod: 'ASC' },
    // { sortFieldId: '$$extra$$', sortMethod: 'DESC' },

    // use sortBy to sort
    // { sortFieldId: 'type', sortBy: ['家具产品', '办公用品'] },
    // lack some data
    // { sortFieldId: 'sub_type', sortBy: ['办公装饰品', '笔'] },
    // not in same province
    // { sortFieldId: 'province', sortBy: ['辽宁', '吉林', '广东'] },
    // {
    //   sortFieldId: 'city',
    //   sortBy: ['汕头', '广州', '朝阳', '抚顺', '白山', '丹东'],
    // },
    // { sortFieldId: 'area', sortBy: ['中南', '东北'] },
    // { sortFieldId: '$$extra$$', sortBy: ['cost', 'price'] },
    // { sortFieldId: 'type', sortBy: ['家具产品', '办公用品'] },
    // {
    //   sortFieldId: 'sub_type',
    //   sortBy: ['办公装饰品', '餐桌'],
    //   query: { type: '家具产品' },
    // },
    // {
    //   sortFieldId: 'sub_type',
    //   sortBy: ['笔', '纸张'],
    //   query: { type: '办公用品' },
    // },
    // { sortFieldId: 'area', sortBy: ['中南', '东北'] },
    // {
    //   sortFieldId: 'province',
    //   sortBy: ['辽宁', '吉林'],
    //   query: { area: '东北' },
    // },
    // {
    //   sortFieldId: 'city',
    //   sortBy: ['朝阳', '抚顺'],
    //   query: {
    //     area: '东北',
    //     province: '辽宁',
    //   },
    // },
    // { sortFieldId: '$$extra$$', sortBy: ['cost', 'price'] },

    // use sortByMeasure to sort
    // {
    //   sortFieldId: 'sub_type',
    //   sortMethod: 'DESC',
    //   sortByMeasure: 'cost',
    //   query: {
    //     area: '东北',
    //     province: '辽宁',
    //     city: '抚顺',
    //     $$extra$$: 'cost',
    //   },
    // },
    // {
    //   sortFieldId: 'city',
    //   sortMethod: 'DESC',
    //   sortByMeasure: 'price',
    //   query: {
    //     type: '家具产品',
    //     sub_type: '餐桌',
    //   },
    // {
    //   sortFieldId: 'city',
    //   sortMethod: 'ASC',
    //   sortByMeasure: 'price',
    //   query: {
    //     type: '办公用品',
    //     sub_type: '笔',
    //     $$extra$$: 'price',
    //     area: '中南',
    //     province: '广东',
    //   },
    // },
    // {
    //   sortFieldId: 'sub_type',
    //   sortMethod: 'DESC',
    //   sortByMeasure: 'price',
    //   query: {
    //     type: '办公用品',
    //     $$extra$$: 'price',
    //     area: '东北',
    //     province: '吉林',
    //     city: '白山',
    //   },
    // },

    // use sortByMeasure（TOTAL_VALUE） to sort
    {
      sortFieldId: 'type',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'price',
      },
    },
    {
      sortFieldId: 'sub_type',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
        area: '东北',
        province: '吉林',
      },
    },
    {
      sortFieldId: 'area',
      sortMethod: 'ASC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'price',
      },
    },
    {
      sortFieldId: 'province',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
      },
    },
    {
      sortFieldId: 'city',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
      },
    },
    {
      sortFieldId: 'city',
      sortMethod: 'DESC',
      sortByMeasure: TOTAL_VALUE,
      query: {
        $$extra$$: 'cost',
        type: '办公用品',
      },
    },
  ],
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
        // width: 80,
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'compact',
      },
      cellCfg: {
        width: 80,
        height: 32,
      },
      device: 'pc',
    },
    tooltip: {
      showTooltip: false,
      renderTooltip: (spreadsheet) => {
        return new CustomTooltip(spreadsheet);
      },
    },
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['area', 'province'],
      },
      col: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['type'],
      },
    },
  };
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);
  const [valueInCols, setValueInCols] = React.useState(true);

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
      <MainLayout dataCfg={mockDataCfg} options={getOptions()} />,
      getContainer(),
    );
  });
});
