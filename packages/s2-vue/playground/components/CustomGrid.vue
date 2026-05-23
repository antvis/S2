<script setup lang="ts">
import { ref } from 'vue';
import {
  Aggregation,
  customMerge,
  type S2DataConfig,
  type S2Options,
  type ThemeCfg,
} from '@antv/s2';
import { SheetComponent } from '../../src';
import ResizeConfig from './ResizeConfig.vue';

const CustomGridData = [
  {
    'a-1': 'A',
    'a-1-1': 'A-1',
    'measure-1': 1000,
    type: '家具',
    sub_type: '桌子',
  },
  {
    'a-1': 'A',
    'a-1-1': 'A-2',
    'measure-1': 2000,
    type: '家具',
    sub_type: '沙发',
  },
  {
    'a-1': 'B',
    'a-1-1': 'B-1',
    'measure-1': 1500,
    type: '办公用品',
    sub_type: '笔',
  },
  {
    'a-1': 'B',
    'a-1-1': 'B-2',
    'measure-1': 2500,
    type: '办公用品',
    sub_type: '纸张',
  },
];

const customRowGridFields = {
  rows: [
    {
      field: 'a-1',
      title: '层级1',
      children: [{ field: 'a-1-1', title: '层级2' }],
    },
  ],
  columns: ['type', 'sub_type'],
  values: ['measure-1'],
  valueInCols: true,
};

const customColGridFields = {
  rows: ['type', 'sub_type'],
  columns: [
    {
      field: 'a-1',
      title: '指标组',
      children: [{ field: 'a-1-1', title: '指标' }],
    },
  ],
  values: ['measure-1'],
  valueInCols: true,
};

const pivotSheetCustomRowGridDataCfg: S2DataConfig = {
  data: CustomGridData,
  meta: [
    { field: 'a-1', name: '层级1' },
    { field: 'a-1-1', name: '层级2' },
    { field: 'measure-1', name: '层级3' },
    { field: 'measure-1', formatter: (value) => `#-${value}` },
  ],
  fields: customRowGridFields,
};

const pivotSheetCustomColGridDataCfg: S2DataConfig = {
  data: CustomGridData,
  meta: [
    { field: 'a-1', name: '指标1', formatter: (value) => `#-${value}` },
    { field: 'a-1-1', name: '层级2' },
    { field: 'measure-1', formatter: (value) => `#-${value}` },
  ],
  fields: customColGridFields,
};

const customRowGridOptions: S2Options = {
  width: 1000,
  height: 480,
  hierarchyType: 'grid',
  cornerText: '自定义角头标题',
};

const customType = ref<'row' | 'col'>('row');
const sheetType = ref<'pivot' | 'table'>('pivot');

const options = ref<S2Options>({
  ...customRowGridOptions,
  hierarchyType: 'grid',
  interaction: {
    overscrollBehavior: 'none',
  },
});

const themeCfg = ref<ThemeCfg>({ name: 'default' });

const dataCfg = ref<S2DataConfig>(pivotSheetCustomRowGridDataCfg);

const toggleCustomType = (e: any) => {
  const type = e.target.value;

  customType.value = type;
  sheetType.value = 'pivot';
  dataCfg.value =
    type === 'row'
      ? pivotSheetCustomRowGridDataCfg
      : pivotSheetCustomColGridDataCfg;
};

// Helpers for ResizeConfig
const setOptions = (cb: any) => {
  options.value = cb(options.value);
};

const setThemeCfg = (cb: any) => {
  themeCfg.value = cb(themeCfg.value);
};
</script>

<template>
  <div>
    <a-space style="margin-bottom: 20px">
      <a-radio-group :value="customType" @change="toggleCustomType">
        <a-radio-button value="row">自定义行头</a-radio-button>
        <a-radio-button value="col">自定义列头</a-radio-button>
      </a-radio-group>
      <a-switch
        checked-children="树状模式"
        un-checked-children="平铺模式"
        :checked="options.hierarchyType === 'tree'"
        :disabled="sheetType === 'table'"
        @change="
          (checked) => (options.hierarchyType = checked ? 'tree' : 'grid')
        "
      />
      <a-switch
        checked-children="序号开"
        un-checked-children="序号关"
        :checked="options.seriesNumber?.enable"
        @change="(checked) => (options.seriesNumber = { enable: checked })"
      />
      <a-switch
        checked-children="透视表"
        un-checked-children="明细表"
        :checked="sheetType === 'pivot'"
        :disabled="customType !== 'col'"
        @change="(checked) => (sheetType = checked ? 'pivot' : 'table')"
      />

      <a-switch
        checked-children="显示行小计/总计"
        un-checked-children="隐藏行小计/总计"
        :disabled="customType === 'row'"
        :checked="!!options.totals?.row?.showSubTotals"
        @change="
          (checked) => {
            options = customMerge(options, {
              totals: {
                row: {
                  showGrandTotals: checked,
                  showSubTotals: checked,
                  reverseGrandTotalsLayout: true,
                  reverseSubTotalsLayout: true,
                  subTotalsDimensions: ['type'],
                  calcGrandTotals: { aggregation: Aggregation.SUM },
                  calcSubTotals: { aggregation: Aggregation.SUM },
                },
              },
            });
          }
        "
      />
      <a-switch
        checked-children="显示列小计/总计"
        un-checked-children="隐藏列小计/总计"
        :disabled="customType === 'col'"
        :checked="!!options.totals?.col?.showSubTotals"
        @change="
          (checked) => {
            options = customMerge(options, {
              totals: {
                col: {
                  showGrandTotals: checked,
                  showSubTotals: checked,
                  reverseGrandTotalsLayout: true,
                  reverseSubTotalsLayout: true,
                  subTotalsDimensions: ['type'],
                  calcGrandTotals: { aggregation: Aggregation.SUM },
                  calcSubTotals: { aggregation: Aggregation.SUM },
                },
              },
            });
          }
        "
      />
    </a-space>

    <a-space style="margin-bottom: 20px; display: flex">
      <ResizeConfig
        :options="options"
        :setOptions="setOptions"
        :setThemeCfg="setThemeCfg"
      />
    </a-space>

    <SheetComponent
      :sheetType="sheetType"
      :dataCfg="dataCfg"
      :options="options"
      :themeCfg="themeCfg"
    />
  </div>
</template>
