import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  auto,
  ID_SEPARATOR,
  PartDrillDown,
  S2DataConfig,
  S2Options,
  SheetComponent,
} from '@/index';
import { getContainer } from '../util/helpers';
import ReactDOM from 'react-dom';
import { PartDrillDownInfo } from '@/components';
import React, { useState } from 'react';
import { Switch, Button, Layout } from 'antd';
const { Header, Sider, Content } = Layout;
import { merge } from 'lodash';
import {
  drillDownData1,
  drillDownData2,
  // drillDownData3,
  drillDownData4,
  originData,
} from '../data/data-drill-down';

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
        name: '单价',
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
    height: 400,
    hierarchyType: 'tree',
    hierarchyCollapse: false,
    showSeriesNumber: false,
    freezeRowHeader: false,
    mode: 'pivot',
    style: {
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'adaptive',
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
  const [dataCfg, setDataCfg] = useState<S2DataConfig>(props.dataCfg);

  const drillData = {
    drillConfig: {
      dataSet: [
        {
          name: '县城',
          value: 'country',
          type: 'text',
        },
        {
          name: '村',
          value: 'village',
          type: 'text',
        },
      ],
    },
    customDisplayByRowName: {
      rowNames: [
        `辽宁省${ID_SEPARATOR}达州市`,
        `辽宁省${ID_SEPARATOR}达州市${ID_SEPARATOR}县城1`,
        `四川省${ID_SEPARATOR}眉山市`,
      ],
      mode: 'pick',
    },
    drillItemsNum: 2,
    fetchData: (meta, drillFields) =>
      new Promise<PartDrillDownInfo>((resolve) => {
        // 弹窗 -> 选择 -> 请求数据
        let drillDownData;
        let field;
        switch (meta.id) {
          case `root${ID_SEPARATOR}辽宁省${ID_SEPARATOR}达州市`:
            field = 'country';
            drillDownData = drillDownData1;
            break;
          case `root${ID_SEPARATOR}辽宁省${ID_SEPARATOR}达州市${ID_SEPARATOR}县城1`:
            field = 'village';
            drillDownData = drillDownData2;
            break;
          case `root${ID_SEPARATOR}四川省${ID_SEPARATOR}眉山市`:
            field = 'village';
            drillDownData = drillDownData4;
            break;
          // case `root${ID_SEPARATOR}四川省${ID_SEPARATOR}眉山市`:
          //   field = 'country';
          //   drillDownData = drillDownData3;
          //   break;
          default:
            break;
        }
        resolve({
          drillField: field,
          drillData: drillDownData,
        });
      }),
  } as PartDrillDown;

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
              dataCfg={dataCfg}
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
            <div>点击[辽宁省-达州市] 选择下钻维度「country」</div>
            <div>点击[辽宁省-达州市-县城1] 选择下钻维度「village」</div>
            <div>点击[四川省-眉山市] 选择下钻维度「village」</div>
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
  test('Part DrillDown', () => {
    expect(1).toBe(1);
  });
});
