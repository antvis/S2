import { Radio, Space, Switch, RadioChangeEvent } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from 'tests/util/helpers';
import { SheetEntry, assembleDataCfg } from 'tests/util/sheet-entry';
import { CustomTooltip } from './custom/custom-tooltip';
import {
  HeaderActionIconProps,
  S2Options,
  SheetType,
  ThemeName,
  Node,
} from '@/index';

const tableDataFields = {
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
    valueInCols: true,
  },
};

function MainLayout() {
  const [dataCfg, setDataCfg] = React.useState(assembleDataCfg({}));
  const [render, setRender] = React.useState(true);
  const [sheetType, setSheetType] = React.useState<SheetType>('pivot');
  const [spotLight, setSpotLight] = React.useState(true);
  const [isPivotSheet, setIsPivotSheet] = React.useState(true);
  const [hoverHighlight, setHoverHighlight] = React.useState(true);
  const [showSeriesNumber, setShowSeriesNumber] = React.useState(false);
  const [showPagination, setShowPagination] = React.useState(false);
  const [showTotals, setShowTotals] = React.useState(false);
  const [showDefaultActionIcons, setShowDefaultActionIcons] =
    React.useState(true);
  const [themeName, setThemeName] = React.useState<ThemeName>('default');

  const CornerTooltip = <div>cornerTooltip</div>;

  const RowTooltip = <div>rowTooltip</div>;

  const ColTooltip = <div>colTooltip</div>;

  const onToggleRender = () => {
    setRender(!render);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setThemeName(e.target.value);
  };

  const mergedOptions: Partial<S2Options> = {
    pagination: showPagination && {
      pageSize: 10,
      current: 1,
    },
    tooltip: {
      renderTooltip: (spreadsheet) => {
        return new CustomTooltip(spreadsheet);
      },
      operation: {
        trend: true,
        hiddenColumns: true,
      },
      row: {
        showTooltip: false,
      },
    },
    totals: showTotals && {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        subTotalsDimensions: ['province'],
      },
      col: {
        showGrandTotals: true,
        showSubTotals: true,
        subTotalsDimensions: ['type'],
      },
    },
    showSeriesNumber: showSeriesNumber,
    selectedCellsSpotlight: spotLight,
    hoverHighlight: hoverHighlight,
    customSVGIcons: !showDefaultActionIcons && [
      {
        name: 'Filter',
        svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
      },
      {
        name: 'FilterAsc',
        svg: 'https://gw.alipayobjects.com/zos/antfincdn/UxDm6TCYP3/filter%26sort_asc%2Bfilter.svg',
      },
    ],
    showDefaultHeaderActionIcon: showDefaultActionIcons,
    headerActionIcons: !showDefaultActionIcons && [
      {
        iconNames: ['Filter'],
        belongsCell: 'colCell',
        displayCondition: (meta: Node) =>
          meta.id !== 'root[&]家具[&]桌子[&]price',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            element: ColTooltip,
          });
        },
      },
      {
        iconNames: ['SortDown'],
        belongsCell: 'colCell',
        displayCondition: (meta: Node) =>
          meta.id === 'root[&]家具[&]桌子[&]price',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            element: ColTooltip,
          });
        },
      },
      {
        iconNames: ['FilterAsc'],
        belongsCell: 'cornerCell',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            element: CornerTooltip,
          });
        },
      },
      {
        iconNames: ['SortDown', 'Filter'],
        belongsCell: 'rowCell',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            element: RowTooltip,
          });
        },
      },
    ],
  };

  const onSheetTypeChange = (checked: boolean) => {
    setIsPivotSheet(checked);
    // 透视表
    if (checked) {
      setSheetType('pivot');
      setDataCfg(assembleDataCfg({}));
    } else {
      setSheetType('table');
      setDataCfg(assembleDataCfg(tableDataFields));
    }
  };

  return (
    <div>
      <Space size="middle" style={{ marginBottom: 20 }}>
        <Switch
          checkedChildren="渲染组件"
          unCheckedChildren="卸载组件"
          defaultChecked={render}
          onChange={onToggleRender}
        />
      </Space>
      {render && (
        <SheetEntry
          dataCfg={dataCfg}
          options={mergedOptions}
          themeCfg={{ name: themeName }}
          sheetType={sheetType}
          header={
            <Space size="middle" style={{ marginBottom: 20 }}>
              <Radio.Group onChange={onRadioChange} defaultValue="default">
                <Radio.Button value="default">默认</Radio.Button>
                <Radio.Button value="simple">简约蓝</Radio.Button>
                <Radio.Button value="colorful">多彩蓝</Radio.Button>
              </Radio.Group>

              <Switch
                checkedChildren="显示序号"
                unCheckedChildren="不显示序号"
                checked={showSeriesNumber}
                onChange={setShowSeriesNumber}
              />
              <Switch
                checkedChildren="分页"
                unCheckedChildren="不分页"
                checked={showPagination}
                onChange={setShowPagination}
              />
              <Switch
                checkedChildren="汇总"
                unCheckedChildren="无汇总"
                checked={showTotals}
                onChange={setShowTotals}
              />
              <Switch
                checkedChildren="选中聚光灯开"
                unCheckedChildren="选中聚光灯关"
                checked={spotLight}
                onChange={setSpotLight}
              />
              <Switch
                checkedChildren="hover十字器开"
                unCheckedChildren="hover十字器关"
                checked={hoverHighlight}
                onChange={setHoverHighlight}
              />

              <Switch
                checkedChildren="默认actionIcons"
                unCheckedChildren="自定义actionIcons"
                checked={showDefaultActionIcons}
                onChange={setShowDefaultActionIcons}
              />
              <Switch
                checkedChildren="透视表"
                unCheckedChildren="明细表"
                checked={isPivotSheet}
                onChange={onSheetTypeChange}
              />
            </Space>
          }
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
    ReactDOM.render(<MainLayout />, getContainer());
  });
});
