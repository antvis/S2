<script setup lang="ts">
import type { S2DataConfig, S2Options } from '@antv/s2';
import { ref } from 'vue';
import { SheetComponent } from '../../src';
import mockDataset from '../../__tests__/data/mock-dataset.json';

const { data, totalData, meta } = mockDataset;

const tableSheetSingleColumns = [
  'province',
  'city',
  'type',
  'sub_type',
  'number',
];

const dataCfg = ref<S2DataConfig>({
  data,
  totalData,
  meta: [
    { field: 'number', name: '数值', formatter: (v) => `${v}-@` },
    ...meta,
  ],
  fields: {
    columns: tableSheetSingleColumns,
  },
});

const options = ref<S2Options>({
  width: 600,
  height: 480,
  tooltip: {
    enable: false,
  },
});
</script>

<template>
  <div>
    <h3>编辑表 (Editable Sheet)</h3>
    <p>支持单元格编辑和拖拽复制的明细表</p>
    <SheetComponent
      sheetType="editable"
      :dataCfg="dataCfg"
      :options="options"
    />
  </div>
</template>
