<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { LayoutWidthType, isUpDataValue } from '@antv/s2';
import { SheetComponent } from '../../src';

const dataCfg = ref<S2DataConfig>({
  fields: {
    rows: ['level'],
    columns: ['group'],
    values: ['value'],
  },
  meta: [
    { field: 'group', name: '人群' },
    { field: 'level', name: '收入水平' },
  ],
  data: [
    {
      group: '青年',
      level: '高收入',
      value: {
        label: '青年高收入人群',
        values: [
          ['近30天信用卡支出（平均）', 40000, '+3%', '+520'],
          ['近30天信用卡分期（平均）', 50000, '+2%', '+500'],
          ['月初信用卡额度', 400000, '+3%', '+5000'],
        ],
      },
    },
    {
      group: '青年',
      level: '中收入',
      value: {
        label: '青年中收入人群',
        values: [
          ['近30天信用卡支出（平均）', 1000, '-3%', '-500'],
          ['近30天信用卡分期（平均）', 2000, '+23%', '+500'],
          ['月初信用卡额度', 3000, '+23%', '+500'],
        ],
      },
    },
    {
      group: '中年',
      level: '高收入',
      value: {
        label: '中年高收入人群',
        values: [
          ['近30天信用卡支出（平均）', 40000, '+23%', '+500'],
          ['近30天信用卡分期（平均）', 50000, '+23%', '+500'],
          ['月初信用卡额度', 400000, '+23%', '+500'],
        ],
      },
    },
    {
      group: '中年',
      level: '中收入',
      value: {
        label: '中年中收入人群',
        values: [
          ['近30天信用卡支出（平均）', 1000, '+23%', '+500'],
          ['近30天信用卡分期（平均）', 2000, '+23%', '+500'],
          ['月初信用卡额度', 3000, '+23%', '+500'],
        ],
      },
    },
  ],
});

const options = ref<S2Options>({
  width: 1200,
  height: 500,
  interaction: { selectedCellsSpotlight: true },
  style: {
    layoutWidthType: LayoutWidthType.ColAdaptive,
    rowCell: { width: 80, height: 100 },
    dataCell: {
      width: 400,
      height: 100,
      valuesCfg: { widthPercent: [40, 0.2, 0.2, 0.2] },
    },
  },
  conditions: {
    text: [
      {
        mapping: (value: string | number, cellInfo: { colIndex?: number }) => {
          const { colIndex } = cellInfo;

          if (+colIndex! <= 1) {
            return { fill: '#000' };
          }

          return {
            fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
});
</script>

<template>
  <div>
    <h3>网格分析表 (Grid Analysis Sheet)</h3>
    <p>多指标网格分析，支持条件格式</p>
    <SheetComponent
      sheetType="gridAnalysis"
      :dataCfg="dataCfg"
      :options="options"
      :adaptive="true"
    />
  </div>
</template>
