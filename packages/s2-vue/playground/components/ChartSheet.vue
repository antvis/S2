<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { ChartDataCell } from '@antv/s2/extends';
import { SheetComponent } from '../../src';

const dataCfg = ref<S2DataConfig>({
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['number'],
    valueInCols: true,
  },
  meta: [
    { field: 'number', name: '数量' },
    { field: 'province', name: '省份' },
    { field: 'city', name: '城市' },
    { field: 'type', name: '类别' },
  ],
  data: [
    {
      number: {
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
          ],
          encode: { x: 'genre', y: 'sold', color: 'genre' },
        },
      },
      province: '浙江省',
      city: '杭州市',
      type: '家具',
    },
    {
      number: {
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { genre: 'Sports', sold: 180 },
            { genre: 'Strategy', sold: 210 },
            { genre: 'Action', sold: 90 },
          ],
          encode: { x: 'genre', y: 'sold', color: 'genre' },
        },
      },
      province: '浙江省',
      city: '宁波市',
      type: '家具',
    },
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
    },
    {
      number: 1523,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
    },
  ],
});

const options = ref<S2Options>({
  width: 1200,
  height: 600,
  style: {
    rowCell: { width: 100 },
    dataCell: { width: 400, height: 300 },
  },
  tooltip: { enable: true },
  dataCell: (viewMeta, spreadsheet) => new ChartDataCell(viewMeta, spreadsheet),
  showDefaultHeaderActionIcon: false,
  interaction: {
    hoverFocus: false,
    brushSelection: { dataCell: false },
  },
});
</script>

<template>
  <div>
    <h3>图表表格 (Chart Sheet)</h3>
    <p>在单元格中渲染 G2 图表</p>
    <SheetComponent
      sheetType="chart"
      :dataCfg="dataCfg"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
