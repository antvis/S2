<script setup lang="ts">
import type { S2Options } from '@antv/s2';
import { ref } from 'vue';
import dataCfg from '../../__tests__/data/mock-dataset.json';
import { SheetComponent } from '../../src';

const options = ref<S2Options>({
  height: 900,
  interaction: {
    brushSelection: {
      rowCell: false,
      colCell: false,
      dataCell: false,
    },
    hoverFocus: false,
  },
  style: {},
});
</script>

<template>
  <div>
    <h3>透视组合图 (Pivot Chart Sheet)</h3>
    <p>透视表与图表结合的展示形式</p>
    <SheetComponent
      sheetType="pivotChart"
      :dataCfg="dataCfg"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
