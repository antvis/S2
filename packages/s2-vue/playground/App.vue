<script setup lang="ts">
/* eslint-disable no-console */
import {
  DEFAULT_FROZEN_COUNTS,
  DEFAULT_STYLE,
  customMerge,
  getDefaultSeriesNumberText,
  safeJsonParse,
  type Node,
  type S2DataConfig,
  type SheetType,
  type ThemeCfg,
} from '@antv/s2';
import '@antv/s2/src/styles/theme/dark.css';
import { cloneDeep, isEmpty } from 'lodash';
import { computed, ref, shallowRef, watch } from 'vue';
// Adjust import if needed
import { SheetComponent } from '../src';
import {
  PivotSheetFrozenOptions,
  TableSheetFrozenOptions,
  defaultOptions,
  headerActionIcons,
  pivotSheetDataCfg,
  pivotSheetDataCfgForCompactMode,
  s2ConditionsOptions,
  s2ThemeConfig,
  tableSheetDataCfg,
  tableSheetMultipleColumns,
  tableSheetSingleColumns,
} from './config';

// Import playground components
import BigDataSheetDemo from './components/BigDataSheet.vue';
import ChartSheetDemo from './components/ChartSheet.vue';
import CustomGridDemo from './components/CustomGrid.vue';
import CustomTreeDemo from './components/CustomTree.vue';
import EditableSheetDemo from './components/EditableSheet.vue';
import GridAnalysisSheetDemo from './components/GridAnalysisSheet.vue';
import PivotChartSheetDemo from './components/PivotChartSheet.vue';
import PluginsSheetDemo from './components/PluginsSheet.vue';
import ResizeConfig from './components/ResizeConfig.vue';
import StrategySheetDemo from './components/StrategySheet.vue';

type TableSheetColumnType = 'single' | 'multiple';

// ================== State ==================
const activeTab = ref(localStorage.getItem('debugTabKey') || 'basic');
const render = ref(true);
const sheetType = ref<SheetType>(
  (localStorage.getItem('debugSheetType') as SheetType) || 'pivot',
);
const showPagination = ref(false);
const showTotals = ref(false);
const themeCfg = ref<ThemeCfg>(s2ThemeConfig);
const options = ref(cloneDeep(defaultOptions));
const dataCfg = ref<Partial<S2DataConfig>>(
  cloneDeep(
    sheetType.value === 'pivot' ? pivotSheetDataCfg : tableSheetDataCfg,
  ),
);
// columnOptions removed.
const tableSheetColumnType = ref<TableSheetColumnType>(
  (localStorage.getItem('debugTableSheetColumnType') as TableSheetColumnType) ||
    'single',
);
const activeCollapseKeys = ref(
  safeJsonParse(localStorage.getItem('debugCollapseKey')!) || [
    'filter',
    'resize',
  ],
);

// Resizing
const s2Ref = shallowRef();
const scrollTimer = ref<number>();

// ================== Helpers ==================
const updateOptions = (newOptions: any) => {
  options.value = customMerge(options.value, newOptions);
};

const updateDataCfg = (newDataCfg: Partial<S2DataConfig>) => {
  const currentDataCfg =
    sheetType.value === 'pivot' ? pivotSheetDataCfg : tableSheetDataCfg;

  dataCfg.value = customMerge(cloneDeep(currentDataCfg), newDataCfg);
};

// ================== Event Handlers ==================

const onSheetTypeChange = (e: any) => {
  const selectedSheetType = e.target.value;

  sheetType.value = selectedSheetType;

  switch (selectedSheetType) {
    case 'table':
      dataCfg.value = cloneDeep(tableSheetDataCfg);
      updateOptions(defaultOptions);
      break;
    default:
      dataCfg.value = cloneDeep(pivotSheetDataCfg);
      updateOptions(defaultOptions);
      break;
  }
};

const onLayoutWidthTypeChange = (e: any) => {
  updateOptions({
    style: {
      layoutWidthType: e.target.value,
    },
  });
};

const onTableColumnTypeChange = (e: any) => {
  tableSheetColumnType.value = e.target.value;
};

const onToggleRender = (checked: boolean) => {
  render.value = checked;
};

const onThemeChange = (e: any) => {
  themeCfg.value = {
    name: e.target.value,
  };
};

const logHandler =
  (name: string, callback?: (...args: any[]) => void) =>
  (...args: any[]) => {
    if (s2Ref.value?.instance?.options?.debug) {
      console.log(name, ...args);
    }

    callback?.(...args);
  };

const onSheetMounted = (instance: any) => {
  s2Ref.value = instance;
  logHandler('onMounted')(instance);
};

const onSheetDestroy = logHandler('onDestroy', () => {
  clearInterval(scrollTimer.value!);
});

// ================== Effects ==================

watch(
  [sheetType, tableSheetColumnType],
  () => {
    if (sheetType.value !== 'table') {
      return;
    }

    dataCfg.value = customMerge(cloneDeep(tableSheetDataCfg), {
      fields: {
        columns:
          tableSheetColumnType.value === 'single'
            ? tableSheetSingleColumns
            : tableSheetMultipleColumns,
      },
    });
  },
  {
    immediate: true,
  },
);

watch(
  () => options.value?.style?.layoutWidthType,
  (val) => {
    if (val === 'compact') {
      updateOptions({
        style: {
          dataCell: {
            width: 200,
          },
        },
      });
      dataCfg.value = pivotSheetDataCfgForCompactMode;
    } else {
      updateOptions({
        style: DEFAULT_STYLE,
      });
      dataCfg.value = pivotSheetDataCfg;
    }
  },
);

watch(activeTab, (val) => {
  localStorage.setItem('debugTabKey', val);
});

watch(activeCollapseKeys, (val) => {
  localStorage.setItem('debugCollapseKey', JSON.stringify(val));
});

// ================== Computed Options ==================

const mergedOptions = computed(() => {
  return customMerge(
    {
      pagination: showPagination.value && {
        current: 1,
        pageSize: 4,
      },
      tooltip: {
        // Simple tooltip configuration for Vue, complex JSX tooltips not directly supported essentially different
        content: null,
      },
      totals: showTotals.value && {
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
      customSVGIcons: !options.value.showDefaultHeaderActionIcon && [
        {
          name: 'Filter',
          src: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
        },
        {
          name: 'FilterAsc',
          src: 'https://gw.alipayobjects.com/zos/antfincdn/UxDm6TCYP3/filter%26sort_asc%2Bfilter.svg',
        },
      ],
      headerActionIcons: !options.value.showDefaultHeaderActionIcon && [
        {
          icons: ['Filter'],
          belongsCell: 'colCell',
          displayCondition: (node: Node) =>
            node.id !== 'root[&]家具[&]桌子[&]number',
          onClick: () => {
            console.log('Filter colCell click');
          },
        },
        {
          icons: ['SortDown'],
          belongsCell: 'colCell',
          displayCondition: (node: Node) =>
            node.id === 'root[&]家具[&]桌子[&]number',
          onClick: () => {
            console.log('SortDown colCell click');
          },
        },
        {
          icons: ['FilterAsc'],
          belongsCell: 'cornerCell',
          onClick: () => {
            console.log('FilterAsc cornerCell click');
          },
        },
        {
          icons: ['SortDown', 'Filter'],
          belongsCell: 'rowCell',
          onClick: () => {
            console.log('SortDown & Filter rowCell click');
          },
        },
      ],
    },
    options.value,
  );
});

// Set Theme/Option helpers
const setOptions = (cb: any) => {
  options.value = cb(options.value);
};
const setThemeCfg = (cb: any) => {
  themeCfg.value = cb(themeCfg.value);
};
</script>

<template>
  <div class="playground">
    <a-tabs v-model:activeKey="activeTab" type="card" destroy-inactive-tab-pane>
      <a-tab-pane key="basic" tab="基础表">
        <a-collapse v-model:activeKey="activeCollapseKeys">
          <a-collapse-panel key="filter" header="筛选器">
            <a-space style="margin-bottom: 20px; flex-wrap: wrap">
              <a-tooltip title="表格类型">
                <a-radio-group
                  v-model:value="sheetType"
                  @change="onSheetTypeChange"
                >
                  <a-radio-button value="pivot">透视表</a-radio-button>
                  <a-radio-button value="table">明细表</a-radio-button>
                </a-radio-group>
              </a-tooltip>

              <a-tooltip v-if="sheetType === 'table'" title="明细表多级表头">
                <a-radio-group
                  v-model:value="tableSheetColumnType"
                  @change="onTableColumnTypeChange"
                >
                  <a-radio-button value="single">单列头</a-radio-button>
                  <a-radio-button value="multiple">多列头</a-radio-button>
                </a-radio-group>
              </a-tooltip>

              <a-tooltip title="布局类型">
                <a-radio-group
                  :value="options?.style?.layoutWidthType"
                  @change="onLayoutWidthTypeChange"
                >
                  <a-radio-button value="adaptive">行列等宽</a-radio-button>
                  <a-radio-button value="colAdaptive">列等宽</a-radio-button>
                  <a-radio-button value="compact">紧凑</a-radio-button>
                </a-radio-group>
              </a-tooltip>

              <a-button
                danger
                @click="
                  () => {
                    s2Ref?.instance?.destroy();
                    s2Ref?.instance?.render();
                  }
                "
              >
                卸载组件 (s2.destroy)
              </a-button>
            </a-space>

            <a-space class="filter-container">
              <a-switch
                checked-children="渲染组件"
                un-checked-children="卸载组件"
                :checked="render"
                @change="onToggleRender"
              />
              <a-switch
                checked-children="调试模式开"
                un-checked-children="调试模式关"
                :checked="mergedOptions.debug"
                @change="(checked) => updateOptions({ debug: checked })"
              />
              <a-switch
                checked-children="树形"
                un-checked-children="平铺"
                :checked="mergedOptions.hierarchyType === 'tree'"
                @change="
                  (checked) =>
                    updateOptions({ hierarchyType: checked ? 'tree' : 'grid' })
                "
                :disabled="sheetType === 'table'"
              />
              <a-switch
                checked-children="数值挂列头"
                un-checked-children="数值挂行头"
                :checked="dataCfg.fields?.valueInCols"
                @change="
                  (checked) =>
                    updateDataCfg({ fields: { valueInCols: checked } })
                "
                :disabled="sheetType === 'table'"
              />
              <a-switch
                checked-children="隐藏数值"
                un-checked-children="显示数值"
                :checked="mergedOptions.style?.colCell?.hideValue"
                @change="
                  (checked) =>
                    updateOptions({
                      style: { colCell: { hideValue: checked } },
                    })
                "
                :disabled="sheetType === 'table'"
              />
              <a-switch
                checked-children="显示行小计/总计"
                un-checked-children="隐藏行小计/总计"
                :checked="mergedOptions.totals?.row?.showSubTotals"
                @change="
                  (checked) =>
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
                    })
                "
                :disabled="sheetType === 'table'"
              />
              <a-switch
                checked-children="显示列小计/总计"
                un-checked-children="隐藏列小计/总计"
                :checked="mergedOptions.totals?.col?.showSubTotals"
                @change="
                  (checked) =>
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
                    })
                "
                :disabled="sheetType === 'table'"
              />
              <a-tooltip title="透视表有效">
                <a-switch
                  checked-children="冻结行头区域开"
                  un-checked-children="冻结行头区域关"
                  :checked="!!mergedOptions.frozen?.rowHeader"
                  @change="
                    (checked) =>
                      updateOptions({ frozen: { rowHeader: checked } })
                  "
                  :disabled="sheetType === 'table'"
                />
              </a-tooltip>

              <a-switch
                checked-children="冻结行头开"
                un-checked-children="冻结行头关"
                :checked="!!mergedOptions.frozen?.trailingRowCount"
                @change="
                  (checked) => {
                    if (checked) {
                      updateOptions({ frozen: PivotSheetFrozenOptions });
                    } else {
                      updateOptions({ frozen: { ...DEFAULT_FROZEN_COUNTS } });
                    }
                  }
                "
              />
              <a-switch
                checked-children="冻结列头开"
                un-checked-children="冻结列头关"
                :checked="!!mergedOptions.frozen?.trailingColCount"
                @change="
                  (checked) => {
                    if (checked) {
                      updateOptions({ frozen: TableSheetFrozenOptions });
                    } else {
                      updateOptions({ frozen: { ...DEFAULT_FROZEN_COUNTS } });
                    }
                  }
                "
              />
              <a-switch
                checked-children="显示序号"
                un-checked-children="不显示序号"
                :checked="mergedOptions.seriesNumber?.enable"
                @change="
                  (checked) =>
                    updateOptions({ seriesNumber: { enable: checked } })
                "
              />
              <a-switch
                checked-children="自定义序号文本"
                un-checked-children="默认序号文本"
                :checked="mergedOptions.seriesNumber?.text === '自定义序号文本'"
                @change="
                  (checked) =>
                    updateOptions({
                      seriesNumber: {
                        text: checked
                          ? '自定义序号文本'
                          : getDefaultSeriesNumberText(),
                      },
                    })
                "
                :disabled="!mergedOptions.seriesNumber?.enable"
              />
              <a-switch
                checked-children="分页"
                un-checked-children="不分页"
                :checked="showPagination"
                @change="(checked) => (showPagination = checked)"
              />
              <a-switch
                checked-children="汇总"
                un-checked-children="无汇总"
                :checked="showTotals"
                @change="(checked) => (showTotals = checked)"
              />
              <a-switch
                checked-children="默认 headerActionIcons"
                un-checked-children="自定义 headerActionIcons"
                :checked="mergedOptions.showDefaultHeaderActionIcon"
                @change="
                  (checked) =>
                    updateOptions({
                      showDefaultHeaderActionIcon: checked,
                      headerActionIcons: checked ? [] : headerActionIcons,
                    })
                "
              />
              <a-switch
                checked-children="打开链接跳转"
                un-checked-children="无链接跳转"
                :checked="!isEmpty(mergedOptions.interaction?.linkFields)"
                @change="
                  (checked) =>
                    updateOptions({
                      interaction: {
                        linkFields: checked ? ['province', 'city'] : [],
                      },
                    })
                "
              />
              <a-tooltip title="将列头高度设为0">
                <a-switch
                  checked-children="隐藏列头和对应角头"
                  un-checked-children="显示列头和对应角头"
                  :checked="mergedOptions.style?.colCell?.height === 0"
                  @change="
                    (checked) =>
                      updateOptions({
                        style: {
                          colCell: {
                            height: checked
                              ? 0
                              : defaultOptions?.style?.colCell?.height ??
                                DEFAULT_STYLE.colCell?.height,
                          },
                        },
                      })
                  "
                />
              </a-tooltip>
              <a-tooltip title="改变 dataConfig 配置">
                <a-switch
                  checked-children="隐藏列头但保留角头"
                  un-checked-children="显示列头"
                  :checked="isEmpty(dataCfg.fields?.columns)"
                  @change="
                    (checked) => {
                      dataCfg.fields.columns = checked
                        ? []
                        : pivotSheetDataCfg.fields.columns;
                    }
                  "
                />
              </a-tooltip>
              <a-switch
                checked-children="字段标记开"
                un-checked-children="字段标记关"
                :checked="!isEmpty(mergedOptions.conditions)"
                @change="
                  (checked) =>
                    updateOptions({
                      conditions: checked ? s2ConditionsOptions : null,
                    })
                "
              />
            </a-space>

            <a-space class="filter-container">
              <span class="label">
                主题配置
                <a-divider type="vertical" />
              </span>
              <a-tooltip :title="`当前主题名: ${themeCfg.name}`">
                <a-radio-group
                  v-model:value="themeCfg.name"
                  @change="onThemeChange"
                >
                  <a-radio-button value="default">默认</a-radio-button>
                  <a-radio-button value="gray">简约灰</a-radio-button>
                  <a-radio-button value="colorful">多彩蓝</a-radio-button>
                  <a-radio-button value="dark">暗黑</a-radio-button>
                </a-radio-group>
              </a-tooltip>
            </a-space>
          </a-collapse-panel>
          <a-collapse-panel key="resize" header="热区配置">
            <ResizeConfig
              :options="mergedOptions"
              :setOptions="setOptions"
              :setThemeCfg="setThemeCfg"
            />
          </a-collapse-panel>
        </a-collapse>

        <SheetComponent
          v-if="render"
          ref="s2Ref"
          :sheetType="sheetType"
          :dataCfg="dataCfg"
          :options="mergedOptions"
          :themeCfg="themeCfg"
          :loadData="false"
          @mounted="onSheetMounted"
          @destroy="onSheetDestroy"
        />
      </a-tab-pane>

      <a-tab-pane key="customTree" tab="自定义目录树">
        <CustomTreeDemo />
      </a-tab-pane>
      <a-tab-pane key="customGrid" tab="自定义行列头">
        <CustomGridDemo />
      </a-tab-pane>
      <a-tab-pane key="strategy" tab="趋势分析表">
        <StrategySheetDemo />
      </a-tab-pane>
      <a-tab-pane key="gridAnalysis" tab="网格分析表">
        <GridAnalysisSheetDemo />
      </a-tab-pane>
      <a-tab-pane key="editable" tab="编辑表">
        <EditableSheetDemo />
      </a-tab-pane>
      <a-tab-pane key="plugins" tab="AntV/G 插件系统">
        <PluginsSheetDemo />
      </a-tab-pane>
      <a-tab-pane key="pivotChart" tab="透视组合图">
        <PivotChartSheetDemo />
      </a-tab-pane>
      <a-tab-pane key="chart" tab="绘制 G2 图表">
        <ChartSheetDemo />
      </a-tab-pane>
      <a-tab-pane key="bigData" tab="100万数据">
        <BigDataSheetDemo />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="less">
.playground {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
  }

  // button {
  //   margin-right: 8px;
  //   margin-bottom: 8px;
  //   padding: 4px 12px;
  //   cursor: pointer;
  // }

  // label {
  //   margin-right: 16px;
  // }

  .filter-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 5px;

    & > * {
      margin-right: 8px;
    }
  }

  .ant-collapse {
    margin-bottom: 20px;
  }
}
</style>
