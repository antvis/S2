import { Radio, Space, Switch, RadioChangeEvent } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  HeaderActionIconProps,
  S2Options,
  ThemeName,
  Node,
  S2DataConfig,
  TargetCellInfo,
  SpreadSheet,
} from '@antv/s2';
import { SheetEntry, assembleDataCfg } from './sheet-entry';
import { SheetType } from '@/components';
import './index.less';
import '@antv/s2/esm/style.css';

const tableDataFields: Partial<S2DataConfig> = {
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
  const [showCustomTooltip, setShowCustomTooltip] = React.useState(false);
  const s2Ref = React.useRef<SpreadSheet>();

  const CustomTooltip = () => <div>自定义 Tooltip</div>;

  const ColTooltip = <div>custom colTooltip</div>;

  const ActionIconTooltip = ({ name }) => <div>{name} Tooltip</div>;

  const onToggleRender = () => {
    setRender(!render);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setThemeName(e.target.value);
  };

  const mergedOptions: Partial<S2Options<React.ReactNode>> = {
    pagination: showPagination && {
      pageSize: 10,
      current: 1,
    },
    tooltip: {
      showTooltip: true,
      content: showCustomTooltip ? <CustomTooltip /> : null,
      operation: {
        sort: true,
        tableSort: true,
        trend: true,
        hiddenColumns: true,
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
    interaction: {
      selectedCellsSpotlight: spotLight,
      hoverHighlight,
    },
    showSeriesNumber,
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
          meta.id !== 'root[&]家具[&]桌子[&]number',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            content: <ActionIconTooltip name="Filter colCell" />,
          });
        },
      },
      {
        iconNames: ['SortDown'],
        belongsCell: 'colCell',
        displayCondition: (meta: Node) =>
          meta.id === 'root[&]家具[&]桌子[&]number',
        action: (props: HeaderActionIconProps) => {
          const { meta, event } = props;
          meta.spreadsheet.tooltip.show({
            position: { x: event.clientX, y: event.clientY },
            content: <ActionIconTooltip name="SortDown colCell" />,
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
            content: <ActionIconTooltip name="FilterAsc cornerCell" />,
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
            content: <ActionIconTooltip name="SortDown & Filter rowCell" />,
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

  const onColCellClick = ({ event }: TargetCellInfo) => {
    if (!showDefaultActionIcons) {
      s2Ref.current.showTooltip({
        position: { x: event.clientX, y: event.clientY },
        content: ColTooltip,
      });
    }
  };

  return (
    <div className="playground">
      <h1>@antv/s2-react playground</h1>
      <Switch
        checkedChildren="渲染组件"
        unCheckedChildren="卸载组件"
        defaultChecked={render}
        onChange={onToggleRender}
        style={{
          marginRight: 10,
        }}
      />
      {render && (
        <SheetEntry
          dataCfg={dataCfg}
          options={mergedOptions}
          themeCfg={{ name: themeName }}
          sheetType={sheetType}
          onColCellClick={onColCellClick}
          ref={s2Ref}
          header={
            <Space size="middle">
              <Radio.Group onChange={onRadioChange} defaultValue="default">
                <Radio.Button value="default">默认</Radio.Button>
                <Radio.Button value="gray">简约灰</Radio.Button>
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
                checkedChildren="默认Tooltip"
                unCheckedChildren="自定义Tooltip"
                checked={showCustomTooltip}
                onChange={setShowCustomTooltip}
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

ReactDOM.render(<MainLayout />, document.getElementById('root'));
