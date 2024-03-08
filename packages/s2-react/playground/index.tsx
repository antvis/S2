/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import {
  DEFAULT_STYLE,
  Node,
  SpreadSheet,
  customMerge,
  generatePalette,
  getDefaultSeriesNumberText,
  getLang,
  getPalette,
  type CustomHeaderFields,
  type HeaderActionIconProps,
  type InteractionCellHighlightOptions,
  type InteractionOptions,
  type S2DataConfig,
  type TargetCellInfo,
  type ThemeCfg,
  type TooltipAutoAdjustBoundary,
} from '@antv/s2';
import type { Adaptive, SheetType } from '@antv/s2-shared';
import corePkg from '@antv/s2/package.json';
import { useUpdateEffect } from 'ahooks';
import {
  version as AntdVersion,
  Button,
  Collapse,
  DatePicker,
  Divider,
  Input,
  Popover,
  Radio,
  Select,
  Slider,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
  type RadioChangeEvent,
} from 'antd';
import { debounce, isEmpty } from 'lodash';
import React from 'react';
import { ChromePicker } from 'react-color';
import { createRoot } from 'react-dom/client';
import reactPkg from '../package.json';
import type { SheetComponentOptions } from '../src';
import { SheetComponent } from '../src';
import { ConfigProvider } from '../src/components/config-provider';
import { ChartSheet } from './components/ChartSheet';
import { CustomGrid } from './components/CustomGrid';
import { CustomTree } from './components/CustomTree';
import { EditableSheet } from './components/EditableSheet';
import { GridAnalysisSheet } from './components/GridAnalysisSheet';
import { LinkGroup } from './components/LinkGroup';
import { PluginsSheet } from './components/Plugins';
import { ResizeConfig } from './components/ResizeConfig';
import { StrategySheet } from './components/StrategySheet';
import {
  TableSheetFrozenOptions,
  defaultOptions,
  pivotSheetDataCfg,
  pivotSheetDataCfgForCompactMode,
  pivotSheetMultiLineTextDataCfg,
  s2ConditionsOptions,
  s2Options,
  s2ThemeConfig,
  sliderOptions,
  tableSheetDataCfg,
  tableSheetMultipleColumns,
  tableSheetSingleColumns,
} from './config';
import { PlaygroundContext } from './context/playground.context';
import { partDrillDown } from './drill-down';
import './index.less';

type TableSheetColumnType = 'single' | 'multiple';

const onSheetMounted = (s2: SpreadSheet) => {
  console.log('onSheetMounted: ', s2);
  // @ts-ignore
  window.s2 = s2;
  // @ts-ignore
  window.__g_instances__ = [s2.container];
};

const CustomTooltip = () => (
  <div>
    自定义 Tooltip <div>1</div>
    <div style={{ width: 1000, height: 2000 }}>我很宽很长</div>
    <DatePicker.RangePicker getPopupContainer={(node) => node.parentElement!} />
  </div>
);

const CustomColTooltip = () => <div>custom colTooltip</div>;

const ActionIconTooltip = ({ name }: { name: React.ReactNode }) => (
  <div>{name} Tooltip</div>
);

function MainLayout() {
  //  ================== State ========================
  const [render, setRender] = React.useState(true);
  const [sheetType, setSheetType] = React.useState<SheetType>(
    (localStorage.getItem('debugSheetType') as SheetType) || 'pivot',
  );
  const [showPagination, setShowPagination] = React.useState(false);
  const [showTotals, setShowTotals] = React.useState(false);
  const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>(s2ThemeConfig);
  const [themeColor, setThemeColor] = React.useState<string>('#FFF');
  const [showCustomTooltip, setShowCustomTooltip] = React.useState(false);
  const [adaptive, setAdaptive] = React.useState<Adaptive>(false);
  const [options, setOptions] =
    React.useState<Partial<SheetComponentOptions>>(defaultOptions);
  const [dataCfg, setDataCfg] = React.useState<Partial<S2DataConfig>>(
    sheetType === 'pivot' ? pivotSheetDataCfg : tableSheetDataCfg,
  );
  const [columnOptions, setColumnOptions] = React.useState<CustomHeaderFields>(
    [],
  );
  const [tableSheetColumnType, setTableSheetColumnType] =
    React.useState<TableSheetColumnType>(
      (localStorage.getItem(
        'debugTableSheetColumnType',
      ) as TableSheetColumnType) || 'single',
    );

  //  ================== Refs ========================
  const s2Ref = React.useRef<SpreadSheet | null>(null);
  const scrollTimer = React.useRef<number>();

  //  ================== Callback ========================
  const updateOptions = (newOptions: Partial<SheetComponentOptions>) => {
    setOptions(customMerge(options, newOptions));
  };

  const updateDataCfg = (newDataCfg: Partial<S2DataConfig>) => {
    const currentDataCfg =
      sheetType === 'pivot' ? pivotSheetDataCfg : tableSheetDataCfg;

    setDataCfg(customMerge(currentDataCfg, newDataCfg));
  };

  const onAutoAdjustBoundaryChange = (value: TooltipAutoAdjustBoundary) => {
    updateOptions({
      tooltip: {
        autoAdjustBoundary: value || null,
      },
    });
  };

  const onOverscrollBehaviorChange = (
    overscrollBehavior: InteractionOptions['overscrollBehavior'],
  ) => {
    updateOptions({
      interaction: {
        overscrollBehavior,
      },
    });
  };

  const onLayoutWidthTypeChange = (e: RadioChangeEvent) => {
    updateOptions({
      style: {
        layoutWidthType: e.target.value,
      },
    });
  };

  const onTableColumnTypeChange = (e: RadioChangeEvent) => {
    setTableSheetColumnType(e.target.value);
  };

  const onSizeChange = (type: 'width' | 'height') =>
    debounce((e) => {
      updateOptions({
        [type]: Number(e.target.value),
      });
    }, 300);

  const onScrollSpeedRatioChange =
    (type: 'horizontal' | 'vertical') => (value: number) => {
      updateOptions({
        interaction: {
          scrollSpeedRatio: {
            [type]: value,
          },
        },
      });
    };

  const onToggleRender = () => {
    setRender(!render);
  };

  const onThemeChange = (e: RadioChangeEvent) => {
    setThemeCfg({
      name: e.target.value,
    });
  };

  const onSheetTypeChange = (e: RadioChangeEvent) => {
    setSheetType(e.target.value);
  };

  const logHandler =
    (name: string, callback?: (...args: any[]) => void) =>
    (...args: any[]) => {
      if (s2Ref.current?.options?.debug) {
        console.log(name, ...args);
      }

      callback?.(...args);
    };

  const onColCellClick = (cellInfo: TargetCellInfo) => {
    logHandler('onColCellClick')(cellInfo);

    if (showCustomTooltip) {
      const { event } = cellInfo;

      s2Ref.current?.showTooltip({
        position: { x: event.clientX, y: event.clientY },
        content: <CustomColTooltip />,
      });
    }
  };

  const getColumnOptions = React.useCallback(
    (type: SheetType) => {
      if (type === 'table') {
        return dataCfg.fields?.columns || [];
      }

      return (
        s2Ref.current?.facet.getInitColLeafNodes().map(({ id }) => id) || []
      );
    },
    [dataCfg.fields?.columns],
  );

  //  ================== Hooks ========================

  useUpdateEffect(() => {
    switch (sheetType) {
      case 'table':
        setDataCfg(tableSheetDataCfg);
        updateOptions(defaultOptions);
        break;
      default:
        setDataCfg(pivotSheetDataCfg);
        updateOptions(defaultOptions);
        break;
    }
    setColumnOptions(getColumnOptions(sheetType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetType, getColumnOptions]);

  React.useEffect(() => {
    console.log('env:', process.env);

    if (sheetType !== 'table') {
      return;
    }

    setDataCfg(
      customMerge(tableSheetDataCfg, {
        fields: {
          columns:
            tableSheetColumnType === 'single'
              ? tableSheetSingleColumns
              : tableSheetMultipleColumns,
        },
      }),
    );
  }, [sheetType, tableSheetColumnType]);

  const onSheetDestroy = logHandler('onDestroy', () => {
    clearInterval(scrollTimer.current!);
  });

  useUpdateEffect(() => {
    switch (options!.style!.layoutWidthType) {
      case 'compact':
        updateOptions({
          style: {
            dataCell: {
              width: 200,
            },
          },
        });
        setDataCfg(pivotSheetDataCfgForCompactMode);
        break;

      default:
        updateOptions({
          style: DEFAULT_STYLE,
        });
        setDataCfg(pivotSheetDataCfg);
    }
  }, [options.style!.layoutWidthType]);

  //  ================== Config ========================

  const mergedOptions: SheetComponentOptions = customMerge(
    {
      pagination: showPagination && {
        pageSize: 10,
        current: 1,
      },
      tooltip: {
        content: showCustomTooltip ? <CustomTooltip /> : null,
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
      customSVGIcons: !options.showDefaultHeaderActionIcon && [
        {
          name: 'Filter',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
        },
        {
          name: 'FilterAsc',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/UxDm6TCYP3/filter%26sort_asc%2Bfilter.svg',
        },
      ],
      headerActionIcons: !options.showDefaultHeaderActionIcon && [
        {
          icons: ['Filter'],
          belongsCell: 'colCell',
          displayCondition: (node: Node) =>
            node.id !== 'root[&]家具[&]桌子[&]number',
          onClick: ({ event }: HeaderActionIconProps) => {
            s2Ref.current?.showTooltip({
              position: { x: event!.clientX, y: event!.clientY },
              content: <ActionIconTooltip name="Filter colCell" />,
            });
          },
        },
        {
          icons: ['SortDown'],
          belongsCell: 'colCell',
          displayCondition: (node: Node) =>
            node.id === 'root[&]家具[&]桌子[&]number',
          onClick: ({ event }: HeaderActionIconProps) => {
            s2Ref.current?.showTooltip({
              position: { x: event!.clientX, y: event!.clientY },
              content: <ActionIconTooltip name="SortDown colCell" />,
            });
          },
        },
        {
          icons: ['FilterAsc'],
          belongsCell: 'cornerCell',
          onClick: ({ event }: HeaderActionIconProps) => {
            s2Ref.current?.showTooltip({
              position: { x: event!.clientX, y: event!.clientY },
              content: <ActionIconTooltip name="FilterAsc cornerCell" />,
            });
          },
        },
        {
          icons: ['SortDown', 'Filter'],
          belongsCell: 'rowCell',
          onClick: ({ event }: HeaderActionIconProps) => {
            s2Ref.current?.showTooltip({
              position: { x: event!.clientX, y: event!.clientY },
              content: <ActionIconTooltip name="SortDown & Filter rowCell" />,
            });
          },
        },
      ],
    },
    options,
  );

  return (
    <ConfigProvider themeName={themeCfg?.name}>
      <PlaygroundContext.Provider
        value={{
          ref: s2Ref,
          onMounted: onSheetMounted,
          onDestroy: onSheetDestroy,
          themeCfg,
          setThemeCfg,
          logHandler,
        }}
      >
        <div className="playground">
          <LinkGroup />
          <Tabs
            defaultActiveKey={localStorage.getItem('debugTabKey') || 'basic'}
            type="card"
            destroyInactiveTabPane
            items={[
              {
                key: 'basic',
                label: '基础表',
                children: (
                  <>
                    <Collapse
                      defaultActiveKey={['filter', 'resize']}
                      items={[
                        {
                          key: 'filter',
                          label: '筛选器',
                          children: (
                            <>
                              <Space>
                                <Tooltip title="表格类型">
                                  <Radio.Group
                                    onChange={onSheetTypeChange}
                                    defaultValue={sheetType}
                                  >
                                    <Radio.Button value="pivot">
                                      透视表
                                    </Radio.Button>
                                    <Radio.Button value="table">
                                      明细表
                                    </Radio.Button>
                                  </Radio.Group>
                                </Tooltip>
                                {sheetType === 'table' && (
                                  <Tooltip title="明细表多级表头">
                                    <Radio.Group
                                      onChange={onTableColumnTypeChange}
                                      defaultValue={tableSheetColumnType}
                                    >
                                      <Radio.Button value="single">
                                        单列头
                                      </Radio.Button>
                                      <Radio.Button value="multiple">
                                        多列头
                                      </Radio.Button>
                                    </Radio.Group>
                                  </Tooltip>
                                )}
                                <Tooltip title="布局类型">
                                  <Radio.Group
                                    onChange={onLayoutWidthTypeChange}
                                    defaultValue={
                                      options?.style?.layoutWidthType
                                    }
                                  >
                                    <Radio.Button value="adaptive">
                                      行列等宽
                                    </Radio.Button>
                                    <Radio.Button value="colAdaptive">
                                      列等宽
                                    </Radio.Button>
                                    <Radio.Button value="compact">
                                      紧凑
                                    </Radio.Button>
                                  </Radio.Group>
                                </Tooltip>
                                <Button
                                  danger
                                  onClick={() => {
                                    s2Ref.current?.destroy();
                                    s2Ref.current?.render();
                                  }}
                                >
                                  卸载组件 (s2.destroy)
                                </Button>
                              </Space>
                              <Space className="filter-container">
                                <Switch
                                  checkedChildren="渲染组件"
                                  unCheckedChildren="卸载组件"
                                  defaultChecked={render}
                                  onChange={onToggleRender}
                                />
                                <Switch
                                  checkedChildren="调试模式开"
                                  unCheckedChildren="调试模式关"
                                  defaultChecked={mergedOptions.debug}
                                  onChange={(checked) => {
                                    updateOptions({ debug: checked });
                                  }}
                                />
                                <Switch
                                  checkedChildren="树形"
                                  unCheckedChildren="平铺"
                                  checked={
                                    mergedOptions.hierarchyType === 'tree'
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      hierarchyType: checked ? 'tree' : 'grid',
                                    });
                                  }}
                                  disabled={sheetType === 'table'}
                                />
                                <Switch
                                  checkedChildren="数值挂列头"
                                  unCheckedChildren="数值挂行头"
                                  defaultChecked={dataCfg.fields?.valueInCols}
                                  onChange={(checked) => {
                                    updateDataCfg({
                                      fields: {
                                        valueInCols: checked,
                                      },
                                    });
                                  }}
                                  disabled={sheetType === 'table'}
                                />
                                <Switch
                                  checkedChildren="隐藏数值"
                                  unCheckedChildren="显示数值"
                                  defaultChecked={
                                    mergedOptions.style?.colCell?.hideValue
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      style: {
                                        colCell: {
                                          hideValue: checked,
                                        },
                                      },
                                    });
                                  }}
                                  disabled={sheetType === 'table'}
                                />
                                <Switch
                                  checkedChildren="显示行小计/总计"
                                  unCheckedChildren="隐藏行小计/总计"
                                  defaultChecked={
                                    mergedOptions.totals?.row
                                      ?.showSubTotals as boolean
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      totals: {
                                        row: {
                                          showGrandTotals: checked,
                                          showSubTotals: checked,
                                          reverseGrandTotalsLayout: true,
                                          reverseSubTotalsLayout: true,
                                          subTotalsDimensions: ['province'],
                                        },
                                      },
                                    });
                                  }}
                                  disabled={sheetType === 'table'}
                                />
                                <Switch
                                  checkedChildren="显示列小计/总计"
                                  unCheckedChildren="隐藏列小计/总计"
                                  defaultChecked={
                                    mergedOptions.totals?.col
                                      ?.showSubTotals as boolean
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      totals: {
                                        col: {
                                          showGrandTotals: checked,
                                          showSubTotals: checked,
                                          reverseGrandTotalsLayout: true,
                                          reverseSubTotalsLayout: true,
                                          subTotalsDimensions: ['type'],
                                        },
                                      },
                                    });
                                  }}
                                  disabled={sheetType === 'table'}
                                />
                                <Tooltip title="使用场景: 1. 开启总计, 且置于顶部, 2. 树状模式（关闭序号）">
                                  <Switch
                                    checkedChildren="冻结首行开"
                                    unCheckedChildren="冻结首行关"
                                    defaultChecked={
                                      mergedOptions.frozen?.firstRow
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        frozen: {
                                          firstRow: checked,
                                        },
                                      });
                                    }}
                                    disabled={
                                      sheetType === 'table' ||
                                      (mergedOptions.hierarchyType === 'grid' &&
                                        (!mergedOptions?.totals?.row
                                          ?.showGrandTotals ||
                                          !mergedOptions?.totals?.row
                                            ?.reverseGrandTotalsLayout))
                                    }
                                  />
                                </Tooltip>
                                <Tooltip title="透视表有效">
                                  <Switch
                                    checkedChildren="冻结行头开"
                                    unCheckedChildren="冻结行头关"
                                    defaultChecked={
                                      !!mergedOptions.frozen?.rowHeader
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        frozen: {
                                          rowHeader: checked,
                                        },
                                      });
                                    }}
                                    disabled={sheetType === 'table'}
                                  />
                                </Tooltip>
                                <Tooltip title="明细表有效">
                                  <Switch
                                    checkedChildren="冻结列头开"
                                    unCheckedChildren="冻结列头关"
                                    defaultChecked={
                                      !!mergedOptions.frozen?.trailingColCount
                                    }
                                    onChange={(checked) => {
                                      if (checked) {
                                        updateOptions({
                                          frozen: TableSheetFrozenOptions,
                                        });
                                      } else {
                                        updateOptions({
                                          frozen: {
                                            rowCount: 0,
                                            colCount: 0,
                                            trailingColCount: 0,
                                            trailingRowCount: 0,
                                          },
                                        });
                                      }
                                    }}
                                    disabled={sheetType === 'pivot'}
                                  />
                                </Tooltip>
                                <Switch
                                  checkedChildren="显示序号"
                                  unCheckedChildren="不显示序号"
                                  checked={mergedOptions.seriesNumber?.enable}
                                  onChange={(checked) => {
                                    updateOptions({
                                      seriesNumber: {
                                        enable: checked,
                                      },
                                    });
                                  }}
                                />
                                <Switch
                                  checkedChildren="自定义序号文本"
                                  unCheckedChildren="默认序号文本"
                                  checked={
                                    mergedOptions.seriesNumber?.text ===
                                    '自定义序号文本'
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      seriesNumber: {
                                        text: checked
                                          ? '自定义序号文本'
                                          : getDefaultSeriesNumberText(),
                                      },
                                    });
                                  }}
                                  disabled={!mergedOptions.seriesNumber?.enable}
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
                                  checkedChildren="默认 headerActionIcons"
                                  unCheckedChildren="自定义 headerActionIcons"
                                  checked={
                                    mergedOptions.showDefaultHeaderActionIcon
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      showDefaultHeaderActionIcon: checked,
                                    });
                                  }}
                                />
                                <Switch
                                  checkedChildren="打开链接跳转"
                                  unCheckedChildren="无链接跳转"
                                  checked={
                                    !isEmpty(
                                      mergedOptions.interaction?.linkFields,
                                    )
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        linkFields: checked
                                          ? ['province', 'city']
                                          : [],
                                      },
                                    });
                                  }}
                                />
                                <Tooltip title="将列头高度设为0">
                                  <Switch
                                    checkedChildren="隐藏列头和对应角头"
                                    unCheckedChildren="显示列头和对应角头"
                                    checked={
                                      mergedOptions.style?.colCell?.height === 0
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        style: {
                                          colCell: {
                                            height: checked
                                              ? 0
                                              : s2Options?.style?.colCell
                                                  ?.height ??
                                                DEFAULT_STYLE.colCell?.height,
                                          },
                                        },
                                      });
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip title="改变 dataConfig 配置">
                                  <Switch
                                    checkedChildren="隐藏列头但保留角头"
                                    unCheckedChildren="显示列头"
                                    checked={isEmpty(dataCfg.fields?.columns)}
                                    onChange={(checked) => {
                                      setDataCfg(
                                        customMerge(dataCfg, {
                                          fields: {
                                            columns: checked
                                              ? []
                                              : pivotSheetDataCfg.fields
                                                  .columns,
                                          },
                                        }),
                                      );
                                    }}
                                  />
                                </Tooltip>
                                <Switch
                                  checkedChildren="字段标记开"
                                  unCheckedChildren="字段标记关"
                                  checked={!isEmpty(mergedOptions.conditions)}
                                  onChange={(checked) => {
                                    updateOptions({
                                      conditions: checked
                                        ? s2ConditionsOptions
                                        : null,
                                    });
                                  }}
                                />
                              </Space>
                              <Space className="filter-container">
                                <span className="label">
                                  主题配置
                                  <Divider type="vertical" />
                                </span>
                                <Tooltip title={`当前主题名: ${themeCfg.name}`}>
                                  <Radio.Group
                                    onChange={onThemeChange}
                                    defaultValue="default"
                                    value={themeCfg.name}
                                  >
                                    <Radio.Button value="default">
                                      默认
                                    </Radio.Button>
                                    <Radio.Button value="gray">
                                      简约灰
                                    </Radio.Button>
                                    <Radio.Button value="colorful">
                                      多彩蓝
                                    </Radio.Button>
                                    <Radio.Button value="dark">
                                      暗黑
                                    </Radio.Button>
                                  </Radio.Group>
                                </Tooltip>
                                <Popover
                                  placement="bottomRight"
                                  content={
                                    <>
                                      <ChromePicker
                                        color={themeColor}
                                        onChangeComplete={(color) => {
                                          setThemeColor(color.hex);
                                          const palette = getPalette(
                                            themeCfg.name,
                                          );
                                          const newPalette = generatePalette({
                                            ...palette,
                                            brandColor: color.hex,
                                          });

                                          setThemeCfg({
                                            name: themeCfg.name,
                                            palette: newPalette,
                                          });
                                        }}
                                      />
                                    </>
                                  }
                                >
                                  <Button>主题色调整</Button>
                                </Popover>
                              </Space>
                              <Space className="filter-container">
                                <span className="label">
                                  Tooltip 配置
                                  <Divider type="vertical" />
                                </span>
                                <Switch
                                  checkedChildren="开启Tooltip"
                                  unCheckedChildren="关闭Tooltip"
                                  checked={mergedOptions.tooltip?.enable}
                                  onChange={(checked) => {
                                    updateOptions({
                                      tooltip: {
                                        enable: checked,
                                      },
                                    });
                                  }}
                                />
                                <Switch
                                  checkedChildren="自定义Tooltip"
                                  unCheckedChildren="默认Tooltip"
                                  checked={showCustomTooltip}
                                  onChange={setShowCustomTooltip}
                                />
                                <Tooltip title="操作项菜单类型, 透传 https://ant-design.antgroup.com/components/menu-cn#api">
                                  <Switch
                                    checkedChildren="操作项-水平展示"
                                    unCheckedChildren="操作项-垂直展示"
                                    onChange={(checked) => {
                                      updateOptions({
                                        tooltip: {
                                          operation: {
                                            menu: {
                                              mode: checked
                                                ? 'horizontal'
                                                : 'vertical',
                                            },
                                          },
                                        },
                                      });
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip title="tooltip 自动调整: 显示的tooltip超过指定区域时自动调整, 使其不遮挡">
                                  <Select
                                    defaultValue={
                                      mergedOptions.tooltip?.autoAdjustBoundary
                                    }
                                    onChange={onAutoAdjustBoundaryChange}
                                    style={{ width: 230 }}
                                    size="small"
                                    allowClear
                                  >
                                    <Select.Option value="container">
                                      container (表格区域)
                                    </Select.Option>
                                    <Select.Option value="body">
                                      body (浏览器可视区域)
                                    </Select.Option>
                                    <Select.Option value="">关闭</Select.Option>
                                  </Select>
                                </Tooltip>
                              </Space>
                              <Space className="filter-container">
                                <span className="label">
                                  宽高配置
                                  <Divider type="vertical" />
                                </span>
                                <Switch
                                  checkedChildren="容器宽高自适应开"
                                  unCheckedChildren="容器宽高自适应关"
                                  defaultChecked={Boolean(adaptive)}
                                  onChange={setAdaptive}
                                />
                                <Input
                                  style={{ width: 150 }}
                                  onChange={onSizeChange('width')}
                                  defaultValue={mergedOptions.width}
                                  suffix="px"
                                  prefix="宽度"
                                  size="small"
                                />
                                <Input
                                  style={{ width: 150 }}
                                  onChange={onSizeChange('height')}
                                  defaultValue={mergedOptions.height}
                                  suffix="px"
                                  prefix="高度"
                                  size="small"
                                />
                                <Button
                                  size="small"
                                  onClick={() => {
                                    s2Ref.current?.changeSheetSize(400, 400);
                                    s2Ref.current?.render(false);
                                  }}
                                >
                                  改变表格大小 (s2.changeSheetSize)
                                </Button>
                              </Space>
                              <Space className="filter-container">
                                <span className="label">
                                  滚动
                                  <Divider type="vertical" />
                                </span>
                                <Popover
                                  placement="bottomRight"
                                  content={
                                    <>
                                      <div style={{ width: '600px' }}>
                                        水平滚动速率 ：
                                        <Slider
                                          {...sliderOptions}
                                          defaultValue={
                                            mergedOptions.interaction!
                                              .scrollSpeedRatio!.horizontal
                                          }
                                          onChange={onScrollSpeedRatioChange(
                                            'horizontal',
                                          )}
                                        />
                                        垂直滚动速率 ：
                                        <Slider
                                          {...sliderOptions}
                                          defaultValue={
                                            mergedOptions.interaction!
                                              .scrollSpeedRatio!.vertical
                                          }
                                          onChange={onScrollSpeedRatioChange(
                                            'vertical',
                                          )}
                                        />
                                      </div>
                                    </>
                                  }
                                >
                                  <Button size="small">滚动速率调整</Button>
                                </Popover>
                                <Tooltip title="滚动链控制(overscrollBehavior): https://developer.mozilla.org/zh-CN/docs/Web/CSS/overscroll-behavior">
                                  <Select
                                    defaultValue={
                                      mergedOptions.interaction!
                                        .overscrollBehavior
                                    }
                                    onChange={onOverscrollBehaviorChange}
                                    style={{ width: 150 }}
                                    size="small"
                                    allowClear
                                  >
                                    <Select.Option value="auto">
                                      auto
                                    </Select.Option>
                                    <Select.Option value="contain">
                                      contain
                                    </Select.Option>
                                    <Select.Option value="none">
                                      none
                                    </Select.Option>
                                  </Select>
                                </Tooltip>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    const rowNode = s2Ref.current?.facet
                                      .getRowNodes()
                                      .find(
                                        ({ id }) =>
                                          id === 'root[&]四川省[&]成都市',
                                      );

                                    clearInterval(scrollTimer.current!);
                                    s2Ref.current?.updateScrollOffset({
                                      offsetY: {
                                        value: rowNode?.y,
                                        animate: true,
                                      },
                                    });
                                  }}
                                >
                                  滚动至 [成都市]
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    clearInterval(scrollTimer.current!);
                                    s2Ref.current?.updateScrollOffset({
                                      offsetY: {
                                        value: 0,
                                        animate: true,
                                      },
                                    });
                                  }}
                                >
                                  滚动到顶部
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    clearInterval(scrollTimer.current);
                                    s2Ref.current?.updateScrollOffset({
                                      rowHeaderOffsetX: {
                                        value: 100,
                                        animate: true,
                                      },
                                    });
                                  }}
                                >
                                  滚动行头
                                </Button>
                                <Button
                                  size="small"
                                  danger
                                  onClick={() => {
                                    if (
                                      scrollTimer.current ||
                                      !s2Ref.current?.facet.vScrollBar
                                    ) {
                                      clearInterval(scrollTimer.current!);

                                      return;
                                    }

                                    scrollTimer.current = setInterval(() => {
                                      const { scrollY } =
                                        s2Ref.current?.facet.getScrollOffset()!;

                                      if (
                                        s2Ref.current?.facet.isScrollToBottom(
                                          scrollY,
                                        )
                                      ) {
                                        console.log('滚动到底部');
                                        s2Ref.current.updateScrollOffset({
                                          offsetY: {
                                            value: 0,
                                            animate: false,
                                          },
                                        });

                                        return;
                                      }

                                      s2Ref.current!.updateScrollOffset({
                                        offsetY: {
                                          value: scrollY + 50,
                                          animate: true,
                                        },
                                      });
                                    }, 500) as unknown as number;
                                  }}
                                >
                                  {scrollTimer.current
                                    ? '停止滚动'
                                    : '循环滚动'}
                                </Button>
                              </Space>
                              <Space className="filter-container">
                                <span className="label">
                                  折叠 / 展开
                                  <Divider type="vertical" />
                                </span>
                                <Tooltip title="树状模式生效 (平铺模式 TODO)">
                                  <Switch
                                    checkedChildren="收起所有"
                                    unCheckedChildren="展开所有"
                                    disabled={
                                      mergedOptions.hierarchyType !== 'tree'
                                    }
                                    checked={
                                      mergedOptions.style?.rowCell?.collapseAll!
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        style: {
                                          rowCell: {
                                            collapseAll: checked,
                                            collapseFields: null,
                                            expandDepth: null,
                                          },
                                        },
                                      });
                                    }}
                                  />
                                </Tooltip>
                                <Switch
                                  checkedChildren="折叠浙江省"
                                  unCheckedChildren="展开浙江省"
                                  disabled={
                                    mergedOptions.hierarchyType !== 'tree'
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      style: {
                                        rowCell: {
                                          collapseAll: null,
                                          expandDepth: null,
                                          collapseFields: {
                                            'root[&]浙江省': checked,
                                          },
                                        },
                                      },
                                    });
                                  }}
                                />
                                <Tooltip
                                  title={
                                    <p>透视表树状模式默认行头展开层级配置</p>
                                  }
                                >
                                  <Select
                                    style={{ width: 180 }}
                                    defaultValue={
                                      mergedOptions?.style?.rowCell?.expandDepth
                                    }
                                    placeholder="默认行头展开层级"
                                    size="small"
                                    allowClear
                                    onChange={(level) => {
                                      updateOptions({
                                        style: {
                                          rowCell: {
                                            collapseAll: false,
                                            expandDepth: level,
                                            collapseFields: null,
                                          },
                                        },
                                      });
                                    }}
                                  >
                                    {pivotSheetDataCfg.fields.rows?.map(
                                      (_, i) => (
                                        <Select.Option value={i} key={i}>
                                          第 {i + 1} 级
                                        </Select.Option>
                                      ),
                                    )}
                                  </Select>
                                </Tooltip>
                              </Space>
                              <Space className="filter-container">
                                <span className="label">
                                  复制
                                  <Divider type="vertical" />
                                </span>
                                <Tooltip title="单选/多选/刷选单元格后, 使用 Ctrl/Cmd + C 复制">
                                  <Switch
                                    checkedChildren="允许复制"
                                    unCheckedChildren="禁用复制"
                                    checked={
                                      mergedOptions.interaction?.copy?.enable
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        interaction: {
                                          copy: {
                                            enable: checked,
                                          },
                                        },
                                      });
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip title="复制包含其对应行列头的数据">
                                  <Switch
                                    checkedChildren="复制包含其对应行列头的数据"
                                    unCheckedChildren="复制不包含其对应行列头的数据"
                                    checked={
                                      mergedOptions.interaction?.copy
                                        ?.withHeader
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        interaction: {
                                          copy: {
                                            withHeader: checked,
                                          },
                                        },
                                      });
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip title="对应 s2DataConfig.meta">
                                  <Switch
                                    checkedChildren="复制带格式后的数据"
                                    unCheckedChildren="复制未格式化的数据"
                                    checked={
                                      mergedOptions.interaction?.copy
                                        ?.withFormat
                                    }
                                    onChange={(checked) => {
                                      updateOptions({
                                        interaction: {
                                          copy: {
                                            withFormat: checked,
                                          },
                                        },
                                      });
                                    }}
                                  />
                                </Tooltip>
                              </Space>
                            </>
                          ),
                        },
                        {
                          key: 'interaction',
                          label: '交互配置',
                          children: (
                            <Space>
                              <Tooltip title="选中单元格后高亮联动, selectedCellHighlight 为 boolean 值时代表全开或全关">
                                <Select
                                  style={{ width: 260 }}
                                  placeholder="单元格选中高亮"
                                  allowClear
                                  mode="multiple"
                                  onChange={(type) => {
                                    let selectedCellHighlight:
                                      | boolean
                                      | InteractionCellHighlightOptions = false;

                                    selectedCellHighlight = {
                                      rowHeader: false,
                                      colHeader: false,
                                      currentCol: false,
                                      currentRow: false,
                                    };
                                    type.forEach((i: number) => {
                                      // @ts-ignore
                                      selectedCellHighlight[i] = true;
                                    });

                                    updateOptions({
                                      interaction: {
                                        selectedCellHighlight,
                                      },
                                    });
                                  }}
                                >
                                  <Select.Option value="rowHeader">
                                    rowHeader: 高亮所在行头
                                  </Select.Option>
                                  <Select.Option value="colHeader">
                                    colHeader: 高亮所在列头
                                  </Select.Option>
                                  <Select.Option value="currentRow">
                                    currentRow: 高亮所在行
                                  </Select.Option>
                                  <Select.Option value="currentCol">
                                    currentCol: 高亮所在列
                                  </Select.Option>
                                </Select>
                              </Tooltip>
                              <Tooltip title="高亮选中单元格">
                                <Switch
                                  checkedChildren="选中聚光灯开"
                                  unCheckedChildren="选中聚光灯关"
                                  checked={
                                    mergedOptions?.interaction
                                      ?.selectedCellsSpotlight
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        selectedCellsSpotlight: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="悬停后高亮当前行列单元格 (含序号)">
                                <Switch
                                  checkedChildren="hover 十字器开"
                                  unCheckedChildren="hover 十字器关"
                                  checked={Boolean(
                                    mergedOptions?.interaction?.hoverHighlight,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        hoverHighlight: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="选中后高亮当前行列单元格 (含序号)">
                                <Switch
                                  checkedChildren="选中后高亮当前行列单元格开"
                                  unCheckedChildren="选中后高亮当前行列单元格关"
                                  checked={Boolean(
                                    mergedOptions?.interaction
                                      ?.selectedCellHighlight,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        selectedCellHighlight: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="在数值单元格悬停 800ms,显示 tooltip">
                                <Switch
                                  checkedChildren="hover 聚焦开"
                                  unCheckedChildren="hover 聚焦关"
                                  checked={
                                    mergedOptions?.interaction
                                      ?.hoverFocus as boolean
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        hoverFocus: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="开启后,可通过键盘方向键移动单元格, 如果有滚动条则自动滚动">
                                <Switch
                                  checkedChildren="键盘方向键移动选中单元格开"
                                  unCheckedChildren="键盘方向键移动选中单元关"
                                  checked={Boolean(
                                    mergedOptions?.interaction
                                      ?.selectedCellMove,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        selectedCellMove: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="行头, 列头, 数值区域可单独配置">
                                <Switch
                                  checkedChildren="刷选开启"
                                  unCheckedChildren="刷选关闭"
                                  checked={Boolean(
                                    mergedOptions?.interaction?.brushSelection,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        brushSelection: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="按住 Ctrl/Command + click">
                                <Switch
                                  checkedChildren="多选开启"
                                  unCheckedChildren="多选关闭"
                                  checked={Boolean(
                                    mergedOptions?.interaction?.multiSelection,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        multiSelection: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="区间快捷多选 Shift + click">
                                <Switch
                                  checkedChildren="区间快捷多选开启"
                                  unCheckedChildren="区间快捷多选关闭"
                                  checked={Boolean(
                                    mergedOptions?.interaction?.rangeSelection,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        rangeSelection: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="滚动后手动触发一次 hover, 触发单元格高亮效果">
                                <Switch
                                  checkedChildren="表格滚动后触发 hover 开启"
                                  unCheckedChildren="表格滚动后触发 hover 关闭"
                                  checked={Boolean(
                                    mergedOptions?.interaction
                                      ?.hoverAfterScroll,
                                  )}
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        hoverAfterScroll: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="开启后,点击空白处,按下ESC键, 取消高亮, 清空选中单元格, 等交互样式">
                                <Switch
                                  checkedChildren="自动重置交互样式开"
                                  unCheckedChildren="自动重置交互样式关"
                                  defaultChecked={
                                    mergedOptions?.interaction
                                      ?.autoResetSheetStyle
                                  }
                                  onChange={(checked) => {
                                    updateOptions({
                                      interaction: {
                                        autoResetSheetStyle: checked,
                                      },
                                    });
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                title={
                                  <>
                                    <p>默认隐藏列 </p>
                                    <p>明细表: 列头指定 field: number</p>
                                    <p>
                                      透视表: 列头指定id:
                                      root[&]家具[&]沙发[&]number
                                    </p>
                                  </>
                                }
                              >
                                <Select
                                  style={{ width: 300 }}
                                  defaultValue={
                                    mergedOptions?.interaction
                                      ?.hiddenColumnFields
                                  }
                                  mode="multiple"
                                  placeholder="默认隐藏列"
                                  onChange={(fields) => {
                                    updateOptions({
                                      interaction: {
                                        hiddenColumnFields: fields,
                                      },
                                    });
                                  }}
                                >
                                  {columnOptions.map((column) => (
                                    <Select.Option
                                      value={column}
                                      key={column as string}
                                    >
                                      {column as string}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Tooltip>
                            </Space>
                          ),
                        },
                        {
                          key: 'resize',
                          label: '宽高调整热区配置',
                          children: (
                            <ResizeConfig
                              options={mergedOptions}
                              setOptions={setOptions}
                              setThemeCfg={setThemeCfg}
                              onMaxLinesChange={(maxLines) => {
                                setDataCfg(
                                  maxLines > 1
                                    ? pivotSheetMultiLineTextDataCfg
                                    : pivotSheetDataCfg,
                                );
                              }}
                            />
                          ),
                        },
                      ]}
                    />
                    {render && (
                      <React.StrictMode>
                        <SheetComponent
                          dataCfg={dataCfg as S2DataConfig}
                          options={mergedOptions}
                          sheetType={sheetType}
                          adaptive={adaptive}
                          ref={s2Ref}
                          themeCfg={themeCfg}
                          partDrillDown={partDrillDown}
                          showPagination={showPagination}
                          header={{
                            title: (
                              <a href="https://github.com/antvis/S2">
                                {reactPkg.name} playground
                              </a>
                            ),
                            description: (
                              <Space>
                                <span>
                                  {reactPkg.name}: <Tag>{reactPkg.version}</Tag>
                                </span>
                                <span>
                                  {corePkg.name}: <Tag>{corePkg.version}</Tag>
                                </span>
                                <span>
                                  antd: <Tag>{AntdVersion}</Tag>
                                </span>
                                <span>
                                  react: <Tag>{React.version}</Tag>
                                </span>
                                <span>
                                  lang: <Tag>{getLang()}</Tag>
                                </span>
                              </Space>
                            ),
                            switcher: { open: true },
                            export: { open: true },
                            advancedSort: {
                              open: true,
                            },
                          }}
                          onAfterRender={logHandler('onAfterRender')}
                          onRangeSort={logHandler('onRangeSort')}
                          onRangeSorted={logHandler('onRangeSorted')}
                          onMounted={(s2) => {
                            onSheetMounted(s2);
                            setColumnOptions(getColumnOptions(sheetType));
                          }}
                          onDestroy={onSheetDestroy}
                          onColCellClick={onColCellClick}
                          onRowCellClick={logHandler('onRowCellClick')}
                          onCornerCellClick={logHandler(
                            'onCornerCellClick',
                            (cellInfo) => {
                              if (!showCustomTooltip) {
                                return;
                              }

                              s2Ref.current?.showTooltip({
                                position: {
                                  x: cellInfo.event.clientX,
                                  y: cellInfo.event.clientY,
                                },
                                content: 'click',
                              });
                            },
                          )}
                          onDataCellClick={logHandler('onDataCellClick')}
                          onLayoutResize={logHandler('onLayoutResize')}
                          onCopied={logHandler('onCopied')}
                          onColCellHidden={logHandler('onColCellHidden')}
                          onColCellExpanded={logHandler('onColCellExpanded')}
                          onSelected={logHandler('onSelected')}
                          onScroll={logHandler('onScroll')}
                          onRowCellScroll={logHandler('onRowCellScroll')}
                          onLinkFieldJump={logHandler('onLinkFieldJump', () => {
                            window.open(
                              'https://s2.antv.antgroup.com/zh/docs/manual/advanced/interaction/link-jump#%E6%A0%87%E8%AE%B0%E9%93%BE%E6%8E%A5%E5%AD%97%E6%AE%B5',
                            );
                          })}
                          onDataCellBrushSelection={logHandler(
                            'onDataCellBrushSelection',
                          )}
                          onColCellBrushSelection={logHandler(
                            'onColCellBrushSelection',
                          )}
                          onRowCellBrushSelection={logHandler(
                            'onRowCellBrushSelection',
                          )}
                          onRowCellCollapsed={logHandler('onRowCellCollapsed')}
                          onRowCellAllCollapsed={logHandler(
                            'onRowCellAllCollapsed',
                          )}
                        />
                      </React.StrictMode>
                    )}
                  </>
                ),
              },
              {
                key: 'customTree',
                label: '自定义目录树',
                children: <CustomTree />,
              },
              {
                key: 'customGrid',
                label: '自定义行列头',
                children: <CustomGrid />,
              },
              {
                key: 'strategy',
                label: '趋势分析表',
                children: (
                  <StrategySheet
                    onRowCellClick={logHandler('onRowCellClick')}
                  />
                ),
              },
              {
                key: 'gridAnalysis',
                label: '网格分析表',
                children: <GridAnalysisSheet />,
              },
              {
                key: 'editable',
                label: '编辑表',
                children: (
                  <EditableSheet
                    onDataCellEditEnd={logHandler('onDataCellEditEnd')}
                  />
                ),
              },
              {
                key: 'plugins',
                label: 'G 5.0 插件系统',
                children: <PluginsSheet />,
              },
              {
                key: 'chart',
                label: '绘制 G2 图表',
                children: <ChartSheet />,
              },
            ]}
          />
        </div>
      </PlaygroundContext.Provider>
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')!).render(<MainLayout />);
