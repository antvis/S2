<script setup lang="ts">
/* eslint-disable no-console */
import { ref } from 'vue';
import {
  customMerge,
  isUpDataValue,
  type S2DataConfig,
  type S2Options,
} from '@antv/s2';
import { get, isNil } from 'lodash';
import { SheetComponent } from '../../src';
import {
  StrategySheetDataConfig,
  StrategyOptions,
} from '../../__tests__/data/strategy-data';

const showConditions = ref(true);
const isSingleColumn = ref(false);

const dataCfg = ref<S2DataConfig>(StrategySheetDataConfig);

const updateDataCfg = (singleColumn: boolean) => {
  isSingleColumn.value = singleColumn;
  dataCfg.value = customMerge(StrategySheetDataConfig, {
    fields: {
      columns: StrategySheetDataConfig.fields.columns?.slice(
        0,
        singleColumn ? 1 : 2,
      ),
    },
  });
};

const conditions: S2Options['conditions'] = {
  text: [
    {
      mapping: (value, cellInfo) => {
        const { colIndex } = cellInfo;
        const isNilValue = isNil(value) || value === '';

        if (get(cellInfo, 'meta.rowIndex') === 1) {
          return {
            fontWeight: 800,
            fontSize: 20,
          };
        }

        if (colIndex === 0 || isNilValue) {
          return {
            fill: '#000',
            fontSize: 16,
            opacity: 0.7,
          };
        }

        return {
          fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          fontSize: 16,
          opacity: 0.7,
        };
      },
    },
  ],
  icon: [
    {
      position: 'left',
      mapping(value, cellInfo) {
        const { colIndex } = cellInfo;

        if (colIndex === 0) {
          return null;
        }

        return isUpDataValue(value)
          ? { icon: 'CellUp', fill: '#FF4D4F', size: 12 }
          : { icon: 'CellDown', fill: '#29A294', size: 12 };
      },
    },
  ],
};

const getOptions = () => ({
  ...StrategyOptions,
  conditions: showConditions.value ? conditions : null,
});
</script>

<template>
  <div>
    <h3>趋势分析表 (Strategy Sheet)</h3>
    <p>用于展示趋势分析数据，支持多指标和条件格式</p>
    <div style="margin-bottom: 10px; display: flex; gap: 8px">
      <button @click="showConditions = !showConditions">
        {{ showConditions ? '关闭字段标记' : '开启字段标记' }}
      </button>
      <button @click="updateDataCfg(!isSingleColumn)">
        {{ isSingleColumn ? '切换为多列头' : '切换为单列头' }}
      </button>
    </div>
    <SheetComponent
      sheetType="strategy"
      :dataCfg="dataCfg"
      :options="getOptions()"
      :adaptive="true"
    />
  </div>
</template>
