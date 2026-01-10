<script setup lang="ts">
import { ref } from 'vue';
import type { S2DataConfig, S2Options } from '@antv/s2';
import { LayoutWidthType, isUpDataValue } from '@antv/s2';
import { SheetComponent } from '../../src';
import { mockGridAnalysisDataCfg } from '../config';

const dataCfg = ref<S2DataConfig>(mockGridAnalysisDataCfg);

const options = ref<S2Options>({
  width: 1600,
  height: 600,
  interaction: {
    selectedCellsSpotlight: true,
  },
  style: {
    layoutWidthType: LayoutWidthType.ColAdaptive,
    rowCell: {
      width: 80,
      height: 100,
    },
    dataCell: {
      width: 400,
      height: 100,
      valuesCfg: {
        widthPercent: [40, 0.2, 0.2, 0.2],
      },
    },
  },
  conditions: {
    text: [
      {
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;

          if (+colIndex! <= 1) {
            return {
              fill: '#000',
            };
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
    <SheetComponent
      sheetType="gridAnalysis"
      :dataCfg="dataCfg"
      :options="options"
    />
  </div>
</template>
