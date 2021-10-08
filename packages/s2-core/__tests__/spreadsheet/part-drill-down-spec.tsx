import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { Switch, Button, Layout } from 'antd';
const { Header, Sider, Content } = Layout;
import { merge } from 'lodash';
import { originData, drillData } from '../data/data-drill-down';
import { getContainer } from '../util/helpers';
import { auto, PartDrillDown, S2Options, SheetComponent } from '@/index';

const getDataCfg = () => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
      values: ['price'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'price',
        name: '总价',
        formatter: (v) => auto(v),
      },
    ],
    data: originData,
    sortParams: [],
  };
};

const getOptions = () => {
  return {
    debug: true,
    width: 600,
    height: 500,
    hierarchyType: 'tree',
    hierarchyCollapse: false,
    showSeriesNumber: false,
    freezeRowHeader: false,
    style: {
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'adaptive',
        hideMeasureColumn: false,
      },
      cellCfg: {
        height: 32,
      },
      rowCfg: {},
      device: 'pc',
    },
    tooltip: {
      showTooltip: true,
    },
  } as S2Options;
};

function MainLayout(props) {
  const [options, setOptions] = useState<S2Options>(props.options);

  const [partDrillDown, setPartDrillDown] = useState<PartDrillDown>(drillData);
  const onHierarchyChange = (checked) => {
    setOptions(
      merge({}, options, {
        hierarchyType: checked ? 'tree' : 'grid',
      }),
    );
  };

  const clearAllDrillDown = () => {
    setPartDrillDown(
      merge({}, partDrillDown, {
        clearDrillDown: {
          rowId: '',
        },
      }),
    );
  };

  return (
    <div>
      <Layout>
        <Layout>
          <Header style={{ backgroundColor: '#ffffffff' }}>
            <Switch
              checkedChildren="树形"
              unCheckedChildren="平铺"
              defaultChecked={true}
              onChange={onHierarchyChange}
              style={{ marginRight: 10 }}
            />
            <Button
              type={'primary'}
              style={{ marginRight: 10 }}
              onClick={clearAllDrillDown}
            >
              清空全部下钻
            </Button>
          </Header>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <SheetComponent
              dataCfg={props.dataCfg}
              options={options}
              isLoading={false}
              partDrillDown={partDrillDown}
              adaptive={false}
            />
          </Content>
        </Layout>
        <Sider theme={'light'}>
          <div>
            ① 下钻支持同一层级下钻不同维度，可按如下简单体验效果
            <div>点击[辽宁省-达州市] 选择下钻维度「县城」</div>
            <div>点击[辽宁省-达州市-县城1] 选择下钻维度「村」</div>
            <div>点击[四川省-眉山市] 选择下钻维度「县城」</div>
            <div>点击[四川省-成都] 选择下钻维度 「县城」</div>
            <div>点击[四川省-成都] 选择下钻维度「村」</div>
          </div>
          <div>② 可清空下钻(部分或者全部)</div>
          <div>③ 可切换行头布局方式(grid-tree)</div>
        </Sider>
      </Layout>
    </div>
  );
}

describe('part drill down', () => {
  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
  test('HandleDrillDown', () => {
    expect(1).toBe(1);
  });
});
