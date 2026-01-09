<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options, HierarchyType } from '@antv/s2';
import { SheetComponent } from '../../src';

const customType = ref<'row' | 'col'>('row');
const hierarchyType = ref<HierarchyType>('grid');
const showSeriesNumber = ref(false);

const baseData = [
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

const customRowGridDataCfg: S2DataConfig = {
  data: baseData,
  meta: [
    { field: 'a-1', name: '层级1' },
    { field: 'a-1-1', name: '层级2' },
    { field: 'measure-1', name: '指标值' },
  ],
  fields: {
    rows: [
      {
        field: 'a-1',
        title: '层级1',
        children: [{ field: 'a-1-1', title: '层级2' }],
      },
    ] as any,
    columns: ['type', 'sub_type'],
    values: ['measure-1'],
    valueInCols: true,
  },
};

const customColGridDataCfg: S2DataConfig = {
  data: baseData,
  meta: [
    { field: 'a-1', name: '指标1' },
    { field: 'a-1-1', name: '层级2' },
    { field: 'measure-1', name: '指标值' },
  ],
  fields: {
    rows: ['type', 'sub_type'],
    columns: [
      {
        field: 'a-1',
        title: '指标组',
        children: [{ field: 'a-1-1', title: '指标' }],
      },
    ] as any,
    values: ['measure-1'],
    valueInCols: true,
  },
};

const dataCfg = ref<S2DataConfig>(customRowGridDataCfg);

const options = ref<S2Options>({
  width: 1000,
  height: 480,
  hierarchyType: 'grid',
  cornerText: '自定义角头标题',
});

const toggleCustomType = (type: 'row' | 'col') => {
  customType.value = type;
  dataCfg.value = type === 'row' ? customRowGridDataCfg : customColGridDataCfg;
};
</script>

<template>
  <div>
    <h3>自定义行列头 (Custom Grid)</h3>
    <p>平铺模式-自定义行头/列头</p>
    <div style="margin-bottom: 10px; display: flex; gap: 10px">
      <button
        :style="{ fontWeight: customType === 'row' ? 'bold' : 'normal' }"
        @click="toggleCustomType('row')"
      >
        自定义行头
      </button>
      <button
        :style="{ fontWeight: customType === 'col' ? 'bold' : 'normal' }"
        @click="toggleCustomType('col')"
      >
        自定义列头
      </button>
      <button
        @click="hierarchyType = hierarchyType === 'tree' ? 'grid' : 'tree'"
      >
        {{ hierarchyType === 'tree' ? '平铺模式' : '树状模式' }}
      </button>
      <button @click="showSeriesNumber = !showSeriesNumber">
        {{ showSeriesNumber ? '隐藏序号' : '显示序号' }}
      </button>
    </div>
    <SheetComponent
      sheetType="pivot"
      :dataCfg="dataCfg"
      :options="{
        ...options,
        hierarchyType,
        seriesNumber: { enable: showSeriesNumber },
      }"
      :adaptive="true"
    />
  </div>
</template>
