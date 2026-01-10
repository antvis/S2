<script setup lang="ts">
import { ref } from 'vue';
import type { S2Options } from '@antv/s2';
import { ChartDataCell } from '@antv/s2/extends';
import { SheetComponent } from '../../src';
import { ChartDataConfig } from '../../__tests__/data/data-g2-chart';

const options = ref<S2Options>({
  height: 900,
  style: {
    rowCell: { width: 100 },
    dataCell: { width: 400, height: 400 },
  },
  tooltip: { enable: true },
  dataCell: (viewMeta, spreadsheet) => new ChartDataCell(viewMeta, spreadsheet),
  showDefaultHeaderActionIcon: false,
  interaction: {
    copy: { enable: true, withFormat: true },
    brushSelection: {
      rowCell: true,
      colCell: true,
      dataCell: false,
    },
    selectedCellMove: true,
    selectedCellHighlight: true,
    selectedCellsSpotlight: true,
    hoverFocus: true,
    hoverHighlight: false,
    multiSelection: true,
    overscrollBehavior: 'none',
  },
});
</script>

<template>
  <div>
    <h3>图表表格 (Chart Sheet)</h3>
    <p>在单元格中渲染 G2 图表</p>
    <SheetComponent
      sheetType="chart"
      :dataCfg="ChartDataConfig"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
