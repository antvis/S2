import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { Switch, Button, Layout } from 'antd';
const { Header, Sider, Content } = Layout;
import { forEach, merge, random } from 'lodash';
import {
  S2DataConfig,
  S2Options,
  DataType,
  HeaderActionIconProps,
} from '@antv/s2';
import { data as originData, meta } from '../data/mock-dataset.json';
import { getContainer } from '../util/helpers';
import { SheetComponent, PartDrillDown, PartDrillDownInfo } from '@/components';

const fieldMap = {
  channel: ['物美', '华联'],
  sex: ['男', '女'],
};

const getDataCfg = () => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['number'],
      valueInCols: true,
    },
    meta,
    data: originData,
    sortParams: [],
  };
};
const ColTooltip = <div>colTooltip</div>;
const getOptions = () => {
  return {
    debug: true,
    width: 600,
    height: 500,
    hierarchyType: 'tree',
    hierarchyCollapse: false,
    showSeriesNumber: false,
    frozenRowHeader: false,
    showDefaultHeaderActionIcon: false,
    totals: {
      row: {
        showGrandTotals: false,
        reverseLayout: false,
      },
    },
    headerActionIcons: [
      {
        iconNames: ['SortDownSelected'],
        belongsCell: 'colCell',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            element: ColTooltip,
          });
        },
      },
    ],
    style: {
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
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

const drillData = {
  drillConfig: {
    dataSet: [
      {
        name: '销售渠道',
        value: 'channel',
        type: 'text',
      },
      {
        name: '客户性别',
        value: 'sex',
        type: 'text',
      },
    ],
  },
  // drillItemsNum: 1,
  fetchData: (meta, drillFields) =>
    new Promise<PartDrillDownInfo>((resolve) => {
      // 弹窗 -> 选择 -> 请求数据

      const dataSet = meta.spreadsheet.dataSet;

      const field = drillFields[0];
      const rowDatas = dataSet.getMultiData(meta.query, true, true);
      const drillDownData: DataType[] = [];
      forEach(rowDatas, (data: DataType) => {
        const { city, number, province, sub_type: subType, type } = data;
        const number0 = random(50, number);
        const number1 = number - number0;
        const dataItem0 = {
          city,
          number: number0,
          province,
          sub_type: subType,
          type,
          [field]: fieldMap[field][0],
        };
        drillDownData.push(dataItem0);
        const dataItem1 = {
          city,
          number: number1,
          province,
          sub_type: subType,
          type,
          [field]: fieldMap[field][1],
        };

        drillDownData.push(dataItem1);
      });

      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    }),
} as PartDrillDown;
function MainLayout(props) {
  const [options, setOptions] = useState<S2Options>(props.options);
  const [dataCfg, setDataCfg] = useState<S2DataConfig>(props.dataCfg);

  const [partDrillDown, setPartDrillDown] = useState<PartDrillDown>(drillData);
  const onHierarchyChange = (checked) => {
    setOptions(
      merge({}, options, {
        hierarchyType: checked ? 'tree' : 'grid',
      }),
    );
    setDataCfg(
      merge({}, dataCfg, {
        fields: {
          valueInCols: checked,
        },
      }),
    );
  };

  const onTotalChange = (checked) => {
    setOptions(
      merge({}, options, {
        totals: {
          row: {
            showGrandTotals: checked,
            reverseLayout: checked,
          },
        },
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
            <Switch
              checkedChildren="总计"
              unCheckedChildren="无总计"
              defaultChecked={true}
              onChange={onTotalChange}
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
            ①下钻支持同一层级下钻不同维度，可按如下简单体验效果
            <div>点击任意行头节点选择下钻维度</div>
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
  test('handleDrillDown', () => {
    expect(1).toBe(1);
  });
});
