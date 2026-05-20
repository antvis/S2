<script setup lang="ts">
/* eslint-disable no-console */
import { ref, computed } from 'vue';
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

const onColumnTypeChange = (checked: boolean) => {
  isSingleColumn.value = checked;
  dataCfg.value = customMerge(StrategySheetDataConfig, {
    fields: {
      columns: StrategySheetDataConfig.fields.columns?.slice(
        0,
        checked ? 1 : 2,
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
          return { fontWeight: 800, fontSize: 20 };
        }

        if (colIndex === 0 || isNilValue) {
          return { fill: '#000', fontSize: 16, opacity: 0.7 };
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

const options = computed(() => ({
  ...StrategyOptions,
  conditions: showConditions.value ? conditions : null,
}));
</script>

<template>
  <div>
    <a-space
      style="display: flex; justify-content: flex-end; margin-bottom: 8px"
    >
      <a-switch
        checked-children="开启字段标记"
        un-checked-children="关闭字段标记"
        v-model:checked="showConditions"
      />
      <a-switch
        checked-children="单列头"
        un-checked-children="多列头"
        :checked="isSingleColumn"
        @change="onColumnTypeChange"
      />
    </a-space>
    <SheetComponent
      sheetType="strategy"
      :dataCfg="dataCfg"
      :options="options"
      adaptive
    />
  </div>
</template>
