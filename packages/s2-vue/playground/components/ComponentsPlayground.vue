<script setup lang="ts">
/* eslint-disable no-console */
import {
  type SpreadSheet,
  type ThemeCfg,
  type ThemeName,
  type S2Options,
} from '@antv/s2';
import { Button, Space, Popover } from 'ant-design-vue';
import { ref, shallowRef, computed } from 'vue';
import {
  SheetComponent,
  ThemePanel,
  TextAlignPanel,
  FrozenPanel,
  Switcher,
  AdvancedSort,
  DrillDown,
  StrategyExport,
} from '../../src';
import type {
  ThemePanelOptions,
  TextAlignPanelOptions,
  FrozenPanelOptions,
} from '../../src';
import { pivotSheetDataCfg, defaultOptions } from '../config';

const s2Ref = shallowRef<SpreadSheet>();
const themeCfg = ref<ThemeCfg>({
  name: 'default',
});
const options = ref<S2Options>({
  ...defaultOptions,
  width: 800,
  height: 600,
});

const onSheetMounted = (instance: SpreadSheet) => {
  s2Ref.value = instance;
  console.log('onMounted:', instance);
};

const onThemeChange = (panelOptions: ThemePanelOptions, theme: any) => {
  themeCfg.value = {
    name: panelOptions.themeType as ThemeName,
    theme,
  };
  if (s2Ref.value) {
    s2Ref.value.setOptions({
      hierarchyType: panelOptions.hierarchyType,
    });
    s2Ref.value.render(false);
  }

  console.log('ThemePanel onChange:', panelOptions, theme);
};

const onThemeReset = (
  panelOptions: ThemePanelOptions,
  prevOptions: ThemePanelOptions,
  theme: any,
) => {
  console.log('ThemePanel onReset:', panelOptions, prevOptions, theme);
};

const onTextAlignChange = (panelOptions: TextAlignPanelOptions, theme: any) => {
  themeCfg.value = {
    ...themeCfg.value,
    theme,
  };
  if (s2Ref.value) {
    s2Ref.value.render(false);
  }

  console.log('TextAlignPanel onChange:', panelOptions, theme);
};

const onTextAlignReset = (
  panelOptions: TextAlignPanelOptions,
  prevOptions: TextAlignPanelOptions,
  theme: any,
) => {
  console.log('TextAlignPanel onReset:', panelOptions, prevOptions, theme);
};

const onFrozenChange = (panelOptions: FrozenPanelOptions) => {
  const [rowCount = 0, trailingRowCount = 0] = panelOptions.frozenRow;
  const [colCount = 0, trailingColCount = 0] = panelOptions.frozenCol;

  if (s2Ref.value) {
    s2Ref.value.setOptions({
      frozen: {
        rowHeader: panelOptions.frozenRowHeader,
        rowCount,
        colCount,
        trailingRowCount,
        trailingColCount,
      },
    });
    s2Ref.value.render(false);
  }

  console.log('FrozenPanel onChange:', panelOptions);
};

const onFrozenReset = (
  panelOptions: FrozenPanelOptions,
  prevOptions: FrozenPanelOptions,
) => {
  console.log('FrozenPanel onReset:', panelOptions, prevOptions);
};

const toSwitcherItems = (fields: any[] = []) => {
  return fields.map((f) => {
    return typeof f === 'string' ? { id: f } : { id: f.field, ...f };
  });
};

// Switcher Logic
const switcherFields = ref({
  rows: pivotSheetDataCfg.fields.rows,
  columns: pivotSheetDataCfg.fields.columns,
  values: pivotSheetDataCfg.fields.values,
});

const dataCfg = computed(() => {
  return {
    ...pivotSheetDataCfg,
    fields: {
      ...pivotSheetDataCfg.fields,
      ...switcherFields.value,
    },
  };
});

const onSwitcherSubmit = ({ rows, columns, values }: any) => {
  console.log('Switcher onSubmit:', rows, columns, values);
  switcherFields.value = {
    rows: rows.items.map((i: any) => i.id),
    columns: columns.items.map((i: any) => i.id),
    values: values.items.map((i: any) => i.id),
  };
  if (s2Ref.value) {
    s2Ref.value.render(false);
  }
};

// Advanced Sort Logic
const onSortConfirm = (ruleValues: any[], sortParams: any[]) => {
  console.log('AdvancedSort onConfirm:', ruleValues, sortParams);
  if (s2Ref.value) {
    s2Ref.value.setDataCfg({
      ...s2Ref.value.dataCfg,
      sortParams,
    });
    s2Ref.value.render(false);
  }
};

// Drill Down Logic
const drillFields = ref<string[]>([]);
</script>

<template>
  <div class="components-playground">
    <Space direction="horizontal" class="config-panels">
      <ThemePanel
        title="主题配置"
        :disableCustomPrimaryColorPicker="false"
        :defaultCollapsed="false"
        @change="onThemeChange"
        @reset="onThemeReset"
      />
      <TextAlignPanel
        title="文字对齐"
        :defaultCollapsed="false"
        @change="onTextAlignChange"
        @reset="onTextAlignReset"
      />
      <FrozenPanel
        title="冻结行列头"
        :defaultCollapsed="false"
        :inputNumberProps="{
          size: 'small',
          step: 1,
        }"
        :defaultOptions="{
          frozenRow: [1, 2],
        }"
        @change="onFrozenChange"
        @reset="onFrozenReset"
      />
      <Switcher
        title="行列切换"
        :rows="{ items: toSwitcherItems(dataCfg.fields.rows) }"
        :columns="{ items: toSwitcherItems(dataCfg.fields.columns) }"
        :values="{ items: toSwitcherItems(dataCfg.fields.values) }"
        @submit="onSwitcherSubmit"
      />
      <AdvancedSort
        v-if="s2Ref"
        :sheetInstance="s2Ref"
        @sort-confirm="onSortConfirm"
      />
      <Popover trigger="click" placement="bottomLeft">
        <template #content>
          <DrillDown
            :dataSet="[
              { name: '地区', value: 'area', type: 'location' },
              { name: '城市', value: 'city', type: 'location' },
              { name: '日期', value: 'date', type: 'date' },
            ]"
            v-model:drillFields="drillFields"
          />
        </template>
        <Button>下钻</Button>
      </Popover>
      <StrategyExport v-if="s2Ref" :sheetInstance="s2Ref" />
    </Space>
    <SheetComponent
      :dataCfg="dataCfg"
      :options="options"
      :themeCfg="themeCfg"
      sheetType="pivot"
      @mounted="onSheetMounted"
      adaptive
    />
  </div>
</template>

<style lang="less" scoped>
.components-playground {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .config-panels {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}
</style>
